-- ============================================================================
-- TAPELIX — Schéma Supabase Commun (Site Principal + Site Admin)
-- À exécuter dans l'éditeur SQL de votre projet Supabase commun
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Table principale des commandes
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  product_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  platforms JSONB NOT NULL DEFAULT '[]'::jsonb,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  wilaya TEXT NOT NULL DEFAULT '',
  delivery_method TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  total_price INTEGER NOT NULL DEFAULT 0 CHECK (total_price >= 0),
  files JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'EN ATTENTE' CHECK (status IN ('EN ATTENTE', 'TRAITÉE')),
  idempotency_key TEXT UNIQUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour tri rapide et recherche par numéro
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders (order_number);

-- 2. Trigger de mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION public.set_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_orders_updated_at();

-- 3. Sécurité RLS (Row Level Security)
-- Les clients publics (anon) ne peuvent PAS lire, modifier ou supprimer les commandes.
-- Le backend du site principal utilise SUPABASE_SERVICE_ROLE_KEY côté serveur uniquement.
-- L'espace Admin connecté via Supabase Auth (utilisateur authentifié) peut lire et mettre à jour.
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin authenticated read orders" ON public.orders;
CREATE POLICY "Admin authenticated read orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin authenticated update orders" ON public.orders;
CREATE POLICY "Admin authenticated update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (status IN ('EN ATTENTE', 'TRAITÉE'));

-- 4. Bucket privé Supabase Storage pour les photos et fichiers clients
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-files',
  'order-files',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Politique Storage : seuls les utilisateurs Admin authentifiés peuvent consulter/télécharger
DROP POLICY IF EXISTS "Admin authenticated read order-files" ON storage.objects;
CREATE POLICY "Admin authenticated read order-files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'order-files');

-- 5. Activer Supabase Realtime sur la table orders pour l'Admin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;
