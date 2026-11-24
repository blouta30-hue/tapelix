import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Minus, ShoppingBag, MessageCircle, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { SocialNetworkId, CartItem } from '../types';
import { InstagramIcon, TikTokIcon, FacebookIcon, WhatsAppIcon } from './SocialIcons';

export const CardConfiguratorModal: React.FC = () => {
  const {
    isCardConfiguratorOpen,
    closeCardConfigurator,
    configuratorPreselect,
    cardPricing,
    addToCart,
    generateWhatsAppUrl
  } = useCatalog();

  // Selected networks state (default to preselect or Instagram)
  const [selectedNetworks, setSelectedNetworks] = useState<SocialNetworkId[]>(['instagram']);

  // Handle inputs
  const [handles, setHandles] = useState<Partial<Record<SocialNetworkId, string>>>({
    instagram: '',
    tiktok: '',
    facebook: '',
    whatsapp: ''
  });

  // Model selection
  const models = [
    'Noir Mat & Liseré Lilas',
    'Noir Pur Ébène',
    'Violet Métallique TAPELIX',
    'Métal Brossé Prestige'
  ];
  const [selectedModel, setSelectedModel] = useState(models[0]);

  // Customization
  const customizations = [
    { label: 'Logo TAPELIX Standard', extraDA: 0 },
    { label: 'Nom / Pseudo gravé au dos', extraDA: 400 },
    { label: 'Logo d’entreprise personnalisé', extraDA: 800 }
  ];
  const [selectedCustom, setSelectedCustom] = useState(customizations[0]);

  // Engraved text or custom notes
  const [engravedText, setEngravedText] = useState('');

  // Quantity
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (configuratorPreselect) {
      setSelectedNetworks([configuratorPreselect]);
    } else {
      setSelectedNetworks(['instagram']);
    }
  }, [configuratorPreselect, isCardConfiguratorOpen]);

  if (!isCardConfiguratorOpen) return null;

  const toggleNetwork = (id: SocialNetworkId) => {
    setSelectedNetworks((prev) => {
      if (prev.includes(id)) {
        // Must keep at least 1 network
        if (prev.length <= 1) return prev;
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Base price based on number of networks
  const getBaseUnitPrice = () => {
    const count = selectedNetworks.length;
    if (count === 1) return cardPricing.oneNetwork;
    if (count === 2) return cardPricing.twoNetworks;
    if (count === 3) return cardPricing.threeNetworks;
    return cardPricing.fourNetworks;
  };

  const unitPriceDA = getBaseUnitPrice() + selectedCustom.extraDA;
  const totalPriceDA = unitPriceDA * quantity;

  // Dynamic Product Name (Requirement: "Carte NFC — Instagram + TikTok")
  const networkLabels = selectedNetworks.map((net) => {
    switch (net) {
      case 'instagram':
        return 'Instagram';
      case 'tiktok':
        return 'TikTok';
      case 'facebook':
        return 'Facebook';
      case 'whatsapp':
        return 'WhatsApp';
    }
  });

  const dynamicProductName = `Carte NFC — ${networkLabels.join(' + ')}`;

  const createCartItem = (): CartItem => {
    return {
      id: `custom-card-${Date.now()}`,
      productId: 'custom-card-builder',
      name: dynamicProductName,
      category: 'nfc-cards',
      priceDA: unitPriceDA,
      image: '/src/assets/images/tapelix_card_social_1793921692334.jpg',
      quantity,
      selectedOptions: {
        Modèle: selectedModel,
        Personnalisation: selectedCustom.label,
        Réseaux: networkLabels.join(' + ')
      },
      selectedNetworks,
      targetHandles: handles,
      customerNote: engravedText ? `Gravure : ${engravedText}` : undefined
    };
  };

  const handleAddToCart = () => {
    addToCart(createCartItem());
    closeCardConfigurator();
  };

  const handleOrderOnWhatsApp = () => {
    const item = createCartItem();
    const url = generateWhatsAppUrl([item]);
    window.open(url, '_blank', 'noopener,noreferrer');
    closeCardConfigurator();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0B12]/85 backdrop-blur-md transition-opacity"
        onClick={closeCardConfigurator}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-[#181324] border border-[#3D2E55] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#231A33] flex items-center justify-between bg-[#15101F]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#231A33] border border-[#3D2E55] flex items-center justify-center text-[#DFC9F8]">
              <Sparkles className="w-4 h-4 text-[#8F6BB6]" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#FAF7FC]">
                Configuration de votre Carte NFC
              </h3>
              <p className="text-[11px] text-[#C5B4DA]">
                Sélectionnez librement votre combinaison de réseaux sociaux
              </p>
            </div>
          </div>

          <button
            onClick={closeCardConfigurator}
            className="p-1.5 rounded-lg bg-[#181324] text-[#C5B4DA] hover:text-white border border-[#231A33] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* 1. Network Selector Checkbox/Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-[#FAF7FC] uppercase tracking-wider text-[11px]">
                1. Choisissez vos réseaux sociaux (Sélection libre) *
              </label>
              <span className="text-[11px] text-[#DFC9F8] font-semibold">
                {selectedNetworks.length} réseau{selectedNetworks.length > 1 ? 'x' : ''} sélectionné{selectedNetworks.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Instagram */}
              <button
                type="button"
                onClick={() => toggleNetwork('instagram')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  selectedNetworks.includes('instagram')
                    ? 'bg-[#8F6BB6]/20 border-[#8F6BB6] text-white shadow-sm'
                    : 'bg-[#15101F] border-[#231A33] text-[#C5B4DA] hover:border-[#3D2E55]'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#833ab4]/30 via-[#fd1d1d]/30 to-[#fcb045]/30 flex items-center justify-center text-[#DFC9F8]">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs">Instagram</span>
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                  {selectedNetworks.includes('instagram') && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              {/* TikTok */}
              <button
                type="button"
                onClick={() => toggleNetwork('tiktok')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  selectedNetworks.includes('tiktok')
                    ? 'bg-[#8F6BB6]/20 border-[#8F6BB6] text-white shadow-sm'
                    : 'bg-[#15101F] border-[#231A33] text-[#C5B4DA] hover:border-[#3D2E55]'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-white">
                  <TikTokIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs">TikTok</span>
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                  {selectedNetworks.includes('tiktok') && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => toggleNetwork('facebook')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  selectedNetworks.includes('facebook')
                    ? 'bg-[#8F6BB6]/20 border-[#8F6BB6] text-white shadow-sm'
                    : 'bg-[#15101F] border-[#231A33] text-[#C5B4DA] hover:border-[#3D2E55]'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#1877F2]/20 flex items-center justify-center text-[#1877F2]">
                  <FacebookIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs">Facebook</span>
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                  {selectedNetworks.includes('facebook') && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => toggleNetwork('whatsapp')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  selectedNetworks.includes('whatsapp')
                    ? 'bg-[#8F6BB6]/20 border-[#8F6BB6] text-white shadow-sm'
                    : 'bg-[#15101F] border-[#231A33] text-[#C5B4DA] hover:border-[#3D2E55]'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs">WhatsApp</span>
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                  {selectedNetworks.includes('whatsapp') && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

          {/* 2. Handles/Links input for selected networks */}
          <div className="p-3.5 rounded-xl bg-[#15101F] border border-[#231A33] space-y-2.5">
            <span className="font-semibold text-[#FAF7FC] block text-[11px]">
              2. Vos identifiants ou liens à programmer sur la carte (optionnel lors de la commande) :
            </span>

            {selectedNetworks.map((net) => (
              <div key={net} className="flex items-center gap-2">
                <span className="w-20 text-[11px] text-[#C5B4DA] capitalize shrink-0 font-medium">
                  {net} :
                </span>
                <input
                  type="text"
                  value={handles[net] || ''}
                  onChange={(e) => setHandles({ ...handles, [net]: e.target.value })}
                  placeholder={
                    net === 'instagram'
                      ? '@votre_pseudo ou lien de profil'
                      : net === 'tiktok'
                      ? '@votre_tiktok'
                      : net === 'whatsapp'
                      ? 'N° WhatsApp (ex: 0550...)'
                      : 'Lien de votre page Facebook'
                  }
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] focus:border-[#8F6BB6] text-[#FAF7FC] placeholder-[#C5B4DA]/40 outline-none text-xs"
                />
              </div>
            ))}
          </div>

          {/* 3. Model Selection */}
          <div>
            <label className="font-bold text-[#FAF7FC] uppercase tracking-wider text-[11px] block mb-2">
              3. Modèle disponible
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {models.map((mod) => (
                <button
                  key={mod}
                  type="button"
                  onClick={() => setSelectedModel(mod)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedModel === mod
                      ? 'bg-[#8F6BB6] text-white border-[#DFC9F8] font-bold'
                      : 'bg-[#15101F] text-[#C5B4DA] border-[#231A33] hover:border-[#3D2E55]'
                  }`}
                >
                  <span className="block text-[11px] leading-snug">{mod}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Customization */}
          <div>
            <label className="font-bold text-[#FAF7FC] uppercase tracking-wider text-[11px] block mb-2">
              4. Personnalisation du dos
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {customizations.map((cust) => (
                <button
                  key={cust.label}
                  type="button"
                  onClick={() => setSelectedCustom(cust)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedCustom.label === cust.label
                      ? 'bg-[#231A33] text-white border-[#8F6BB6] font-semibold'
                      : 'bg-[#15101F] text-[#C5B4DA] border-[#231A33] hover:border-[#3D2E55]'
                  }`}
                >
                  <span className="block text-[11px]">{cust.label}</span>
                  <span className="block text-[10px] text-[#DFC9F8] mt-0.5">
                    {cust.extraDA > 0 ? `+${cust.extraDA} DA` : 'Inclus'}
                  </span>
                </button>
              ))}
            </div>

            {selectedCustom.extraDA > 0 && (
              <input
                type="text"
                value={engravedText}
                onChange={(e) => setEngravedText(e.target.value)}
                placeholder="Texte exact ou nom à graver..."
                className="w-full mt-2 px-3 py-2 rounded-xl bg-[#0D0B12] border border-[#231A33] focus:border-[#8F6BB6] text-[#FAF7FC] outline-none text-xs"
              />
            )}
          </div>

          {/* 5. Quantity Stepper */}
          <div className="flex items-center justify-between pt-2 border-t border-[#231A33]">
            <div>
              <span className="font-bold text-[#FAF7FC] text-xs block">Quantité</span>
              <span className="text-[11px] text-[#C5B4DA]">Tarif unitaire : {unitPriceDA.toLocaleString('fr-DZ')} DA</span>
            </div>

            <div className="flex items-center gap-3 bg-[#15101F] border border-[#231A33] rounded-xl px-2.5 py-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 text-[#C5B4DA] hover:text-white cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-white min-w-[20px] text-center tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 text-[#C5B4DA] hover:text-white cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 6. Clear Order Summary (Section 5 Requirement) */}
          <div className="p-4 rounded-xl bg-[#15101F] border border-[#3D2E55] space-y-2">
            <span className="text-[11px] font-bold text-[#DFC9F8] uppercase tracking-wider block">
              Récapitulatif de votre commande :
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#C5B4DA]">Produit :</span>
              <strong className="text-[#FAF7FC]">{dynamicProductName}</strong>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#C5B4DA]">Réseaux sélectionnés :</span>
              <div className="flex items-center gap-1">
                {selectedNetworks.map((n) => (
                  <span key={n} className="px-1.5 py-0.5 rounded bg-[#231A33] text-[10px] text-[#FAF7FC] capitalize">
                    {n}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#C5B4DA]">Modèle :</span>
              <span className="text-[#FAF7FC]">{selectedModel}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#C5B4DA]">Quantité :</span>
              <span className="text-[#FAF7FC] font-bold">{quantity}</span>
            </div>
            <div className="pt-2 border-t border-[#231A33] flex items-center justify-between">
              <span className="text-xs font-bold text-[#FAF7FC]">Prix Total :</span>
              <span className="text-base font-bold text-[#DFC9F8] tabular-nums">
                {totalPriceDA.toLocaleString('fr-DZ')} DA
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Section 4 & 5 Requirement) */}
        <div className="p-4 sm:p-5 border-t border-[#231A33] bg-[#15101F] grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-3 px-4 rounded-xl bg-[#231A33] hover:bg-[#2e2344] text-[#FAF7FC] hover:text-white border border-[#3D2E55] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#C5B4DA]" />
            <span>Ajouter au panier</span>
          </button>

          <button
            type="button"
            onClick={handleOrderOnWhatsApp}
            className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Commander sur WhatsApp (0782308820)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
