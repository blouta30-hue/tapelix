import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import { google, sheets_v4 } from 'googleapis';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const OWNER_WHATSAPP_NUMBER = (process.env.WHATSAPP_OWNER_PHONE || '213782308820').replace(/\D/g, '');
const SHEET_TAB_NAME = 'COMMANDES';

const CANONICAL_COLUMNS = [
  { key: 'id', header: 'ID', aliases: ['id'] },
  { key: 'order_number', header: 'N° Commande', aliases: ['n° commande', 'numero commande', 'order_number', 'order number'] },
  { key: 'created_at', header: 'Date', aliases: ['date', 'created_at', 'date creation'] },
  { key: 'updated_at', header: 'Date MAJ', aliases: ['date maj', 'updated_at', 'date mise a jour'] },
  { key: 'customer_name', header: 'Client', aliases: ['client', 'customer_name', 'nom'] },
  { key: 'customer_phone', header: 'Téléphone', aliases: ['téléphone', 'telephone', 'customer_phone', 'phone'] },
  { key: 'product_type', header: 'Produit', aliases: ['produit', 'product_type', 'product'] },
  { key: 'category', header: 'Catégorie', aliases: ['catégorie', 'categorie', 'category'] },
  { key: 'quantity', header: 'Quantité', aliases: ['quantité', 'quantite', 'quantity'] },
  { key: 'total_price', header: 'Total (DA)', aliases: ['total (da)', 'total_price', 'total'] },
  { key: 'wilaya', header: 'Wilaya', aliases: ['wilaya'] },
  { key: 'delivery_method', header: 'Livraison', aliases: ['livraison', 'delivery_method', 'delivery'] },
  { key: 'social_links', header: 'Liens Sociaux', aliases: ['liens sociaux', 'social_links'] },
  { key: 'description', header: 'Notes / Description', aliases: ['notes / description', 'description', 'notes'] },
  { key: 'files', header: 'Photos / Fichiers', aliases: ['photos / fichiers', 'photos', 'files'] },
  { key: 'status', header: 'Statut', aliases: ['statut', 'status'] },
  { key: 'idempotency_key', header: 'Clé Idempotence', aliases: ['clé idempotence', 'cle idempotence', 'idempotency_key'] },
  { key: 'metadata', header: 'Métadonnées', aliases: ['métadonnées', 'metadonnees', 'metadata'] },
] as const;

type ColumnKey = (typeof CANONICAL_COLUMNS)[number]['key'];

interface SheetContext {
  sheets: sheets_v4.Sheets;
  spreadsheetId: string;
  sheetId: number;
  columnMap: Record<ColumnKey, number>;
  totalColumns: number;
}

// Verrous en mémoire pour éviter les doublons lors de clics simultanés
const inFlightIdempotency = new Map<string, Promise<{ status: number; body: any }>>();
// Verrou séquentiel pour éviter les conflits d'écriture concurrente sur les numéros TAP-XXXX
let orderWriteMutex: Promise<void> = Promise.resolve();

function withOrderWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = orderWriteMutex.then(fn, fn);
  orderWriteMutex = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function columnIndexToLetter(index: number): string {
  let letter = '';
  let n = index;
  while (n >= 0) {
    letter = String.fromCharCode((n % 26) + 65) + letter;
    n = Math.floor(n / 26) - 1;
  }
  return letter;
}

function sanitizeSheetCell(value: unknown): string | number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  const str = String(value ?? '');
  if (/^\+[\d\s\-()]{6,}$/.test(str.trim())) {
    return str.trim();
  }
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

function getMissingGoogleSheetsVars(): string[] {
  const missing: string[] = [];
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()) {
    missing.push('GOOGLE_SERVICE_ACCOUNT_JSON');
  }
  if (!process.env.GOOGLE_SHEET_ID?.trim()) {
    missing.push('GOOGLE_SHEET_ID');
  }
  return missing;
}

function getMissingWhatsAppVars(): string[] {
  const required = [
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_TEMPLATE_NAME',
    'WHATSAPP_LANGUAGE_CODE',
  ];
  return required.filter((key) => !process.env[key]?.trim());
}

function safeEqual(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const configuredKey = process.env.ADMIN_API_KEY?.trim();
  if (!configuredKey) {
    return res.status(503).json({
      success: false,
      error: 'Authentification Admin non configurée : le secret ADMIN_API_KEY est manquant côté serveur.',
    });
  }

  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const headerKey = typeof req.headers['x-admin-key'] === 'string' ? req.headers['x-admin-key'].trim() : '';
  const providedKey = bearerToken || headerKey;

  if (!providedKey || !safeEqual(providedKey, configuredKey)) {
    return res.status(401).json({
      success: false,
      error: 'Accès refusé : authentification Admin requise.',
    });
  }

  return next();
}

function parseServiceAccountCredentials(): Record<string, any> {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    throw new Error('Secret GOOGLE_SERVICE_ACCOUNT_JSON manquant côté serveur.');
  }

  let creds: Record<string, any>;
  try {
    creds = JSON.parse(raw);
  } catch {
    throw new Error('Secret GOOGLE_SERVICE_ACCOUNT_JSON invalide : JSON mal formé.');
  }

  if (!creds.client_email || !creds.private_key) {
    throw new Error('Secret GOOGLE_SERVICE_ACCOUNT_JSON incomplet (client_email ou private_key manquant).');
  }

  if (typeof creds.private_key === 'string') {
    creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  }

  return creds;
}

async function getGoogleSheetsClient(): Promise<{ sheets: sheets_v4.Sheets; spreadsheetId: string }> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID?.trim();
  if (!spreadsheetId) {
    throw new Error('Secret GOOGLE_SHEET_ID manquant côté serveur.');
  }

  const credentials = parseServiceAccountCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return { sheets, spreadsheetId };
}

async function ensureCommandesSheetContext(): Promise<SheetContext> {
  const { sheets, spreadsheetId } = await getGoogleSheetsClient();

  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties(sheetId,title)',
  });

  let targetSheet = meta.data.sheets?.find((s) => s.properties?.title === SHEET_TAB_NAME);
  let sheetId = targetSheet?.properties?.sheetId;

  if (sheetId === undefined || sheetId === null) {
    const addRes = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: SHEET_TAB_NAME } } }],
      },
    });
    sheetId = addRes.data.replies?.[0]?.addSheet?.properties?.sheetId;
    if (sheetId === undefined || sheetId === null) {
      throw new Error(`Impossible de créer ou localiser l'onglet "${SHEET_TAB_NAME}" dans Google Sheets.`);
    }
  }

  // Lire la ligne d'en-têtes existante
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_TAB_NAME}!1:1`,
  });

  const rawHeaders = (headerRes.data.values?.[0] || []).map((h) => String(h || '').trim());
  const hasAnyHeader = rawHeaders.some((h) => h.length > 0);

  if (!hasAnyHeader) {
    const initialHeaders = CANONICAL_COLUMNS.map((c) => c.header);
    const lastCol = columnIndexToLetter(initialHeaders.length - 1);
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_TAB_NAME}!A1:${lastCol}1`,
      valueInputOption: 'RAW',
      requestBody: { values: [initialHeaders] },
    });

    const columnMap = {} as Record<ColumnKey, number>;
    CANONICAL_COLUMNS.forEach((col, idx) => {
      columnMap[col.key] = idx;
    });

    return {
      sheets,
      spreadsheetId,
      sheetId,
      columnMap,
      totalColumns: initialHeaders.length,
    };
  }

  // Mapper les colonnes existantes et ajouter les colonnes manquantes en bout de ligne 1
  const normalizedHeaders = rawHeaders.map((h) => h.toLowerCase());
  const columnMap = {} as Record<ColumnKey, number>;
  const updatedHeaders = [...rawHeaders];
  let headersModified = false;

  for (const col of CANONICAL_COLUMNS) {
    let foundIdx = normalizedHeaders.findIndex((h) =>
      (col.aliases as readonly string[]).includes(h)
    );
    if (foundIdx === -1) {
      foundIdx = updatedHeaders.length;
      updatedHeaders.push(col.header);
      normalizedHeaders.push(col.header.toLowerCase());
      headersModified = true;
    }
    columnMap[col.key] = foundIdx;
  }

  if (headersModified) {
    const lastCol = columnIndexToLetter(updatedHeaders.length - 1);
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_TAB_NAME}!A1:${lastCol}1`,
      valueInputOption: 'RAW',
      requestBody: { values: [updatedHeaders] },
    });
  }

  return {
    sheets,
    spreadsheetId,
    sheetId,
    columnMap,
    totalColumns: updatedHeaders.length,
  };
}

function parseJsonSafe<T>(raw: string, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function mapSheetRowToOrder(row: string[], rowIndexZeroBased: number, columnMap: Record<ColumnKey, number>) {
  const cell = (key: ColumnKey): string => {
    const idx = columnMap[key];
    return idx !== undefined && row[idx] !== undefined ? String(row[idx]) : '';
  };

  const rawQty = Number(cell('quantity'));
  const rawTotal = Number(cell('total_price'));

  return {
    id: cell('id'),
    order_number: cell('order_number'),
    created_at: cell('created_at'),
    updated_at: cell('updated_at'),
    customer_name: cell('customer_name'),
    customer_phone: cell('customer_phone'),
    product_type: cell('product_type'),
    category: cell('category'),
    quantity: Number.isFinite(rawQty) && rawQty > 0 ? rawQty : 1,
    total_price: Number.isFinite(rawTotal) ? rawTotal : 0,
    wilaya: cell('wilaya'),
    delivery_method: cell('delivery_method'),
    social_links: parseJsonSafe<Record<string, string>>(cell('social_links'), {}),
    description: cell('description'),
    files: parseJsonSafe<Array<{ name: string; mimeType: string; size: number; note?: string }>>(cell('files'), []),
    files_note: cell('files'),
    status: cell('status') || 'EN ATTENTE',
    idempotency_key: cell('idempotency_key') || null,
    metadata: parseJsonSafe<Record<string, any>>(cell('metadata'), {}),
    sheet_row: rowIndexZeroBased + 1,
  };
}

async function readAllOrdersFromSheet(ctx: SheetContext) {
  const lastCol = columnIndexToLetter(ctx.totalColumns - 1);
  const res = await ctx.sheets.spreadsheets.values.get({
    spreadsheetId: ctx.spreadsheetId,
    range: `${SHEET_TAB_NAME}!A:${lastCol}`,
  });

  const rows = res.data.values || [];
  const orders: ReturnType<typeof mapSheetRowToOrder>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] || [];
    const hasContent = row.some((v) => String(v || '').trim().length > 0);
    if (!hasContent) continue;
    orders.push(mapSheetRowToOrder(row.map((v) => String(v ?? '')), i, ctx.columnMap));
  }

  return orders;
}

function generateUniqueOrderNumberFromExisting(existingOrders: Array<{ order_number: string }>): string {
  const used = new Set(existingOrders.map((o) => o.order_number));
  for (let attempt = 0; attempt < 30; attempt++) {
    const num = Math.floor(1000 + Math.random() * 9000);
    const candidate = `TAP-${num}`;
    if (!used.has(candidate)) {
      return candidate;
    }
  }
  const suffix = Date.now().toString().slice(-6);
  return `TAP-${suffix}`;
}

function normalizeStatusInput(input: string): 'EN ATTENTE' | 'EN COURS' | 'TRAITÉ' | null {
  const val = input.trim().toUpperCase();
  if (val === 'EN ATTENTE' || val === 'NEW') return 'EN ATTENTE';
  if (val === 'EN COURS' || val === 'PROCESSING') return 'EN COURS';
  if (val === 'TRAITÉ' || val === 'TRAITE' || val === 'TREATED') return 'TRAITÉ';
  return null;
}

function calculateServerPrice(productType: string, category: string, quantity: number, deliveryMethod: string) {
  const prodNorm = productType.toLowerCase();
  const catNorm = category.toLowerCase();
  const norm = `${catNorm} ${prodNorm}`;
  let unitPrice = 2000;

  if (prodNorm.includes('custom nfc stand')) {
    unitPrice = 5500;
  } else if (prodNorm.includes('nfc + qr code stand') || prodNorm.includes('qr code stand')) {
    unitPrice = 4800;
  } else if (prodNorm.includes('nfc table stand') || norm.includes('table') || norm.includes('stand')) {
    unitPrice = 4200;
  } else if (prodNorm.includes('menu interactif')) {
    unitPrice = 24000;
  } else if (prodNorm.includes('pack nfc + qr code menu')) {
    unitPrice = 15000;
  } else if (prodNorm.includes('formule qr code menu') || norm.includes('digital menu') || norm.includes('menu')) {
    unitPrice = 8500;
  } else if (prodNorm.includes('professional digital profile')) {
    unitPrice = 6900;
  } else if (prodNorm.includes('contact qr code pack')) {
    unitPrice = 2500;
  } else if (prodNorm.includes('digital business card') || norm.includes('digital card') || norm.includes('vcard')) {
    unitPrice = 3900;
  } else if (norm.includes('nfc') || norm.includes('carte')) {
    unitPrice = 2000;
  }

  const safeQty = Math.max(1, Math.min(1000, Math.floor(Number(quantity) || 1)));
  const delivNorm = deliveryMethod.trim().toLowerCase();
  const deliveryFee =
    delivNorm === 'desk' ||
    delivNorm === 'home' ||
    delivNorm.includes('domicile') ||
    delivNorm.includes('stop')
      ? 500
      : 0;
  const totalPrice = unitPrice * safeQty + deliveryFee;

  return { unitPrice, quantity: safeQty, deliveryFee, totalPrice };
}

async function sendWhatsAppNotification(_order: any): Promise<{
  sent: boolean;
  missing?: string[];
  messageId?: string;
  error?: string;
}> {
  const missing = getMissingWhatsAppVars();
  if (missing.length > 0) {
    return { sent: false, missing };
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN!.trim();
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID!.trim();
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME!.trim();
  const languageCode = process.env.WHATSAPP_LANGUAGE_CODE!.trim();

  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: OWNER_WHATSAPP_NUMBER,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
        },
      }),
    });

    const result: any = await response.json();
    if (!response.ok) {
      return { sent: false, error: result?.error?.message || `HTTP ${response.status}` };
    }

    const messageId = result?.messages?.[0]?.id;
    return { sent: true, messageId };
  } catch (err: any) {
    return { sent: false, error: err?.message || 'Erreur réseau WhatsApp' };
  }
}

async function startServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';
  const PORT: number = isProd ? Number(process.env.PORT) || 3000 : 3000;

  const extraAdminOrigins = (process.env.ADMIN_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const allowedOrigins = new Set(
    [
      'https://tapelix-adm.ai.studio',
      ...extraAdminOrigins,
      process.env.APP_URL?.trim(),
    ].filter(Boolean) as string[]
  );

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.has(origin) || !isProd)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, x-admin-key, x-idempotency-key'
    );
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 2 * 1024 * 1024, // 2 Mo max par fichier
      files: 5,
    },
    fileFilter: (_req, file, cb) => {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Type de fichier non autorisé: ${file.mimetype}. Seules les images (JPEG, PNG, WEBP, GIF) sont acceptées.`));
      }
    },
  });

  app.get('/api/health', (_req, res) => {
    const missingSheetsVars = getMissingGoogleSheetsVars();
    res.json({
      ok: true,
      mode: isProd ? 'production' : 'development',
      database: 'Google Sheets (Source unique)',
      sheetTab: SHEET_TAB_NAME,
      googleSheetsConfigured: missingSheetsVars.length === 0,
      missingGoogleSheetsVars: missingSheetsVars,
      adminAuthConfigured: Boolean(process.env.ADMIN_API_KEY?.trim()),
      photoStorageNote: 'v1: Les métadonnées des photos sont enregistrées sans stockage permanent de fichiers.',
    });
  });

  // ==========================================================================
  // POST /api/orders — Enregistrement permanent dans Google Sheets (COMMANDES)
  // ==========================================================================
  app.post('/api/orders', (req: Request, res: Response) => {
    upload.array('files', 5)(req, res, async (uploadErr: any) => {
      if (uploadErr) {
        return res.status(400).json({
          success: false,
          error: uploadErr.message || 'Erreur lors de la réception des photos (max 2 Mo par photo).',
        });
      }

      const body = req.body || {};
      const headerIdem =
        typeof req.headers['x-idempotency-key'] === 'string' ? req.headers['x-idempotency-key'].trim() : '';
      const explicitIdempotencyKey =
        headerIdem || (typeof body.idempotencyKey === 'string' ? body.idempotencyKey.trim() : '');

      const customerName = String(body.customer_name || body.clientName || '').trim();
      const customerPhone = String(body.customer_phone || body.clientPhone || '').trim();
      const productType = String(body.product_type || body.productName || 'Cartes NFC personnalisées').trim();
      const category = String(body.category || productType).trim();
      const wilaya = String(body.wilaya || '').trim();
      const deliveryMethod = String(body.delivery_method || body.deliveryMode || '').trim();
      const deskName = String(body.deskName || '').trim();
      const description = String(body.description || body.notes || '').trim();
      const quantityRaw = Number(body.quantity || 1);
      const rawFiles = (req.files as Express.Multer.File[]) || [];

      const fingerprintSource = JSON.stringify({
        customerName: customerName.toLowerCase(),
        customerPhone: customerPhone.replace(/\s+/g, ''),
        productType: productType.toLowerCase(),
        category: category.toLowerCase(),
        quantity: Math.max(1, Math.min(1000, Math.floor(quantityRaw || 1))),
        wilaya: wilaya.toLowerCase(),
        deliveryMethod: deliveryMethod.toLowerCase(),
        deskName: deskName.toLowerCase(),
        description,
        socialLinks: typeof body.social_links === 'string' ? body.social_links : JSON.stringify(body.social_links || {}),
        files: rawFiles.map((f) => `${f.originalname}:${f.size}`),
      });
      const autoFingerprint =
        'auto_' + crypto.createHash('sha256').update(fingerprintSource).digest('hex').slice(0, 20);
      const effectiveDedupeKey = explicitIdempotencyKey || autoFingerprint;

      if (inFlightIdempotency.has(effectiveDedupeKey)) {
        try {
          const inflightResult = await inFlightIdempotency.get(effectiveDedupeKey)!;
          if (inflightResult.status < 400) {
            return res.status(inflightResult.status).json(inflightResult.body);
          }
        } catch {
          // Poursuivre si la tentative précédente a échoué
        }
      }

      const processOrder = async (): Promise<{ status: number; body: any }> => {
        if (!customerName || !customerPhone) {
          return {
            status: 400,
            body: {
              success: false,
              error: 'Veuillez renseigner votre nom complet et votre numéro de téléphone.',
            },
          };
        }

        let platforms: string[] = [];
        try {
          platforms =
            typeof body.platforms === 'string'
              ? JSON.parse(body.platforms)
              : Array.isArray(body.platforms)
                ? body.platforms
                : [];
        } catch {
          platforms = [];
        }

        let socialLinks: Record<string, string> = {};
        try {
          socialLinks =
            typeof body.social_links === 'string'
              ? JSON.parse(body.social_links)
              : typeof body.social_links === 'object' && body.social_links !== null
                ? body.social_links
                : {};
        } catch {
          socialLinks = {};
        }

        let metadata: Record<string, any> = {};
        try {
          metadata =
            typeof body.metadata === 'string'
              ? JSON.parse(body.metadata)
              : typeof body.metadata === 'object' && body.metadata !== null
                ? body.metadata
                : {};
        } catch {
          metadata = {};
        }
        if (deskName) {
          metadata.desk_name = deskName;
        }

        // Photos v1 : pas de stockage externe, uniquement les métadonnées + mention explicite
        const fileMetadataList = rawFiles.map((file) => ({
          name: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          stored: false,
          note: 'Photo non conservée de manière permanente (v1 sans stockage externe)',
        }));

        const pricing = calculateServerPrice(productType, category, quantityRaw, deliveryMethod);

        return withOrderWriteLock(async () => {
          const ctx = await ensureCommandesSheetContext();
          const existingOrders = await readAllOrdersFromSheet(ctx);

          // Vérification anti-doublon dans Google Sheets (clé explicite ou empreinte récente < 3 min)
          const nowMs = Date.now();
          const existing = existingOrders.find((o) => {
            if (!o.idempotency_key) return false;
            if (explicitIdempotencyKey && o.idempotency_key === explicitIdempotencyKey) {
              return true;
            }
            if (!explicitIdempotencyKey && o.idempotency_key === autoFingerprint) {
              const createdMs = Date.parse(o.created_at || '');
              return Number.isFinite(createdMs) && nowMs - createdMs < 180_000;
            }
            return false;
          });

          if (existing) {
            return {
              status: 200,
              body: {
                success: true,
                duplicate: true,
                message: 'Commande déjà enregistrée dans Google Sheets.',
                order: {
                  id: existing.id,
                  order_number: existing.order_number,
                  status: existing.status,
                  total_price: existing.total_price,
                  created_at: existing.created_at,
                },
              },
            };
          }

          const orderId = 'ord_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex');
          const orderNumber = generateUniqueOrderNumberFromExisting(existingOrders);
          const nowIso = new Date().toISOString();

          const enrichedMetadata = {
            ...metadata,
            category,
            platforms,
            unit_price: pricing.unitPrice,
            delivery_fee: pricing.deliveryFee,
            photo_storage: 'none_v1',
          };

          const fullDescription = [
            description,
            deskName ? `Adresse / Bureau : ${deskName}` : '',
          ]
            .filter(Boolean)
            .join(' | ');

          const rowValues = new Array(ctx.totalColumns).fill('');
          const setCell = (key: ColumnKey, val: unknown) => {
            const idx = ctx.columnMap[key];
            if (idx !== undefined) {
              rowValues[idx] = sanitizeSheetCell(val);
            }
          };

          setCell('id', orderId);
          setCell('order_number', orderNumber);
          setCell('created_at', nowIso);
          setCell('updated_at', nowIso);
          setCell('customer_name', customerName);
          setCell('customer_phone', customerPhone);
          setCell('product_type', productType);
          setCell('category', category);
          setCell('quantity', pricing.quantity);
          setCell('total_price', pricing.totalPrice);
          setCell('wilaya', wilaya);
          setCell('delivery_method', deliveryMethod);
          setCell('social_links', JSON.stringify(socialLinks));
          setCell('description', fullDescription);
          setCell(
            'files',
            fileMetadataList.length > 0
              ? JSON.stringify(fileMetadataList)
              : 'Aucune photo'
          );
          setCell('status', 'EN ATTENTE');
          setCell('idempotency_key', effectiveDedupeKey);
          setCell('metadata', JSON.stringify(enrichedMetadata));

          const lastCol = columnIndexToLetter(ctx.totalColumns - 1);
          const appendRes = await ctx.sheets.spreadsheets.values.append({
            spreadsheetId: ctx.spreadsheetId,
            range: `${SHEET_TAB_NAME}!A:${lastCol}`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
              values: [rowValues],
            },
          });

          const updatedRows = appendRes.data.updates?.updatedRows || 0;
          if (appendRes.status !== 200 || updatedRows < 1) {
            throw new Error("Google Sheets n'a pas confirmé l'ajout de la nouvelle ligne.");
          }

          // Notification WhatsApp optionnelle (tolérante aux pannes)
          try {
            await sendWhatsAppNotification({
              id: orderId,
              order_number: orderNumber,
              customer_name: customerName,
              customer_phone: customerPhone,
              product_type: productType,
              quantity: pricing.quantity,
              wilaya,
              delivery_method: deliveryMethod,
              status: 'EN ATTENTE',
            });
          } catch (waErr) {
            console.error('[WhatsApp] Notification error (ignored):', waErr);
          }

          return {
            status: 201,
            body: {
              success: true,
              message: 'Commande enregistrée avec succès dans Google Sheets.',
              photoStorageNote:
                rawFiles.length > 0
                  ? 'Les photos jointes ne sont pas conservées de manière permanente dans cette première version.'
                  : undefined,
              order: {
                id: orderId,
                order_number: orderNumber,
                status: 'EN ATTENTE',
                total_price: pricing.totalPrice,
                created_at: nowIso,
              },
            },
          };
        });
      };

      const promise = processOrder();
      inFlightIdempotency.set(effectiveDedupeKey, promise);

      try {
        const result = await promise;
        return res.status(result.status).json(result.body);
      } catch (err: any) {
        console.error('[POST /api/orders] Erreur Google Sheets:', err);
        return res.status(500).json({
          success: false,
          error: err?.message || "Impossible d'enregistrer la commande dans Google Sheets.",
        });
      } finally {
        inFlightIdempotency.delete(effectiveDedupeKey);
      }
    });
  });

  // ==========================================================================
  // GET /api/orders — Lecture directe depuis Google Sheets (Admin protégé)
  // ==========================================================================
  app.get('/api/orders', requireAdminAuth, async (_req: Request, res: Response) => {
    try {
      const ctx = await ensureCommandesSheetContext();
      const orders = await readAllOrdersFromSheet(ctx);
      orders.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

      return res.json({
        success: true,
        source: 'google_sheets',
        sheetTab: SHEET_TAB_NAME,
        orders,
      });
    } catch (err: any) {
      console.error('[GET /api/orders] Erreur Google Sheets:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Erreur lors de la lecture des commandes dans Google Sheets.',
      });
    }
  });

  // ==========================================================================
  // PATCH /api/orders/:id — Mise à jour du statut dans Google Sheets
  // ==========================================================================
  app.patch('/api/orders/:id', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const normalizedStatus = normalizeStatusInput(String(req.body?.status || ''));

      if (!normalizedStatus) {
        return res.status(400).json({
          success: false,
          error: 'Statut invalide. Valeurs acceptées : "EN ATTENTE", "EN COURS", "TRAITÉ".',
        });
      }

      const updatedOrder = await withOrderWriteLock(async () => {
        const ctx = await ensureCommandesSheetContext();
        const orders = await readAllOrdersFromSheet(ctx);
        const cleanId = String(id || '').trim();
        const target = cleanId
          ? orders.find((o) => o.id === cleanId) || orders.find((o) => o.order_number === cleanId)
          : undefined;

        if (!target) {
          return null;
        }

        const nowIso = new Date().toISOString();
        const statusColLetter = columnIndexToLetter(ctx.columnMap.status);
        const updatedAtColLetter = columnIndexToLetter(ctx.columnMap.updated_at);

        await ctx.sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: ctx.spreadsheetId,
          requestBody: {
            valueInputOption: 'RAW',
            data: [
              {
                range: `${SHEET_TAB_NAME}!${statusColLetter}${target.sheet_row}`,
                values: [[normalizedStatus]],
              },
              {
                range: `${SHEET_TAB_NAME}!${updatedAtColLetter}${target.sheet_row}`,
                values: [[nowIso]],
              },
            ],
          },
        });

        return {
          ...target,
          status: normalizedStatus,
          updated_at: nowIso,
        };
      });

      if (!updatedOrder) {
        return res.status(404).json({ success: false, error: 'Commande introuvable dans Google Sheets.' });
      }

      return res.json({ success: true, order: updatedOrder });
    } catch (err: any) {
      console.error('[PATCH /api/orders/:id] Erreur Google Sheets:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Erreur lors de la mise à jour du statut dans Google Sheets.',
      });
    }
  });

  // ==========================================================================
  // DELETE /api/orders/:id — Suppression de ligne directe dans Google Sheets
  // ==========================================================================
  app.delete('/api/orders/:id', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deleted = await withOrderWriteLock(async () => {
        const ctx = await ensureCommandesSheetContext();
        const orders = await readAllOrdersFromSheet(ctx);
        const cleanId = String(id || '').trim();
        const target = cleanId
          ? orders.find((o) => o.id === cleanId) || orders.find((o) => o.order_number === cleanId)
          : undefined;

        if (!target || target.sheet_row <= 1) {
          return null;
        }

        const zeroBasedRowIndex = target.sheet_row - 1;
        await ctx.sheets.spreadsheets.batchUpdate({
          spreadsheetId: ctx.spreadsheetId,
          requestBody: {
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: ctx.sheetId,
                    dimension: 'ROWS',
                    startIndex: zeroBasedRowIndex,
                    endIndex: zeroBasedRowIndex + 1,
                  },
                },
              },
            ],
          },
        });

        return target;
      });

      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Commande introuvable dans Google Sheets.' });
      }

      return res.json({
        success: true,
        message: 'Commande supprimée avec succès de Google Sheets.',
        deletedId: deleted.id,
      });
    } catch (err: any) {
      console.error('[DELETE /api/orders/:id] Erreur Google Sheets:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Erreur lors de la suppression de la commande dans Google Sheets.',
      });
    }
  });

  // Gestionnaire d'erreur JSON pour les routes /api/*
  app.use('/api', (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = typeof err?.status === 'number' ? err.status : 500;
    return res.status(status).json({
      success: false,
      error: err?.message || 'Erreur interne du serveur API.',
    });
  });

  // Middleware Vite en dev, fichiers statiques en production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      const reqPath = req.path;
      if (reqPath.endsWith('.html') || reqPath === '/') {
        const filePath = path.resolve(__dirname, reqPath === '/' ? 'index.html' : reqPath.slice(1));
        if (filePath.startsWith(__dirname + path.sep) && fs.existsSync(filePath)) {
          let template = fs.readFileSync(filePath, 'utf-8');
          template = await vite.transformIndexHtml(req.originalUrl, template);
          return res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        }
      }
      next();
    });
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));

    app.get('*', (req, res) => {
      const cleanPath = req.path === '/' ? 'index.html' : req.path.replace(/^\/+/, '');
      const candidate = path.resolve(distDir, cleanPath);
      if (candidate.startsWith(distDir + path.sep) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return res.sendFile(candidate);
      }
      const htmlCandidate = path.resolve(distDir, `${cleanPath}.html`);
      if (htmlCandidate.startsWith(distDir + path.sep) && fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) {
        return res.sendFile(htmlCandidate);
      }
      return res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `TAPELIX Server running on http://0.0.0.0:${PORT} [${isProd ? 'production' : 'development'}] (Google Sheets Source Unique)`
    );
  });
}

startServer();
