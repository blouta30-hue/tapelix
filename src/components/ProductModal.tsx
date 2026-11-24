import React, { useState, useEffect } from 'react';
import { X, Check, ShoppingBag, MessageCircle, Minus, Plus, Smartphone } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { CartItem } from '../types';

export const ProductModal: React.FC = () => {
  const { selectedProduct, closeProductModal, addToCart, generateWhatsAppUrl } = useCatalog();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [customNote, setCustomNote] = useState('');

  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
      setCustomNote('');
      const initial: Record<string, string> = {};
      selectedProduct.options.forEach((opt) => {
        if (opt.choices.length > 0) {
          initial[opt.name] = opt.choices[0];
        }
      });
      setSelectedOptions(initial);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const totalDA = selectedProduct.priceDA * quantity;

  const handleOptionChange = (optionName: string, choice: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: choice }));
  };

  const createItem = (): CartItem => ({
    id: `${selectedProduct.id}-${Date.now()}`,
    productId: selectedProduct.id,
    name: selectedProduct.name,
    category: selectedProduct.category,
    priceDA: selectedProduct.priceDA,
    image: selectedProduct.image,
    quantity,
    selectedOptions,
    customerNote: customNote || undefined
  });

  const handleAddToCart = () => {
    addToCart(createItem());
    closeProductModal();
  };

  const handleDirectWhatsAppOrder = () => {
    const item = createItem();
    const url = generateWhatsAppUrl([item]);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#0D0B12]/85 backdrop-blur-md transition-opacity"
        onClick={closeProductModal}
      />

      <div className="relative w-full max-w-3xl bg-[#181324] border border-[#3D2E55] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* Close Button */}
        <button
          onClick={closeProductModal}
          className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-full bg-[#0D0B12]/80 hover:bg-[#0D0B12] text-[#C5B4DA] hover:text-white border border-[#231A33] cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Image */}
        <div className="md:w-1/2 bg-[#0D0B12] relative flex flex-col justify-between overflow-hidden">
          <div className="relative aspect-square md:aspect-auto md:h-full w-full">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {selectedProduct.badge && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0D0B12]/85 backdrop-blur-md border border-[#3D2E55] text-[10px] font-semibold text-[#DFC9F8]">
              {selectedProduct.badge}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="md:w-1/2 p-5 md:p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-[#DFC9F8] uppercase">
                  {selectedProduct.category.toUpperCase().replace('-', ' ')}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FAF7FC] mt-0.5">
                  {selectedProduct.name}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl font-bold text-white tabular-nums">
                  {selectedProduct.priceDA.toLocaleString('fr-DZ')} <span className="text-[10px] text-[#C5B4DA]">DA</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-[#C5B4DA] mt-2 leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="mt-3 p-3 rounded-xl bg-[#15101F] border border-[#231A33] flex items-start gap-2.5">
              <Smartphone className="w-4 h-4 text-[#8F6BB6] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-[#FAF7FC] block">
                  Fonctionnement
                </span>
                <p className="text-[11px] text-[#C5B4DA] leading-snug">
                  {selectedProduct.howItWorks}
                </p>
              </div>
            </div>

            {/* Options */}
            {selectedProduct.options && selectedProduct.options.length > 0 && (
              <div className="mt-4 space-y-3 pt-3 border-t border-[#231A33]">
                {selectedProduct.options.map((opt) => (
                  <div key={opt.name}>
                    <label className="text-[11px] font-semibold text-[#FAF7FC] block mb-1.5">
                      {opt.name}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {opt.choices.map((choice) => {
                        const isSelected = selectedOptions[opt.name] === choice;
                        return (
                          <button
                            key={choice}
                            type="button"
                            onClick={() => handleOptionChange(opt.name, choice)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#8F6BB6] text-white border border-[#DFC9F8]'
                                : 'bg-[#15101F] text-[#C5B4DA] border border-[#231A33] hover:border-[#3D2E55]'
                            }`}
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3">
              <label className="text-[11px] font-semibold text-[#FAF7FC] block mb-1">
                Remarque ou lien (optionnel)
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Ex : lien ou instruction..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-[#FAF7FC] text-xs outline-none"
              />
            </div>
          </div>

          {/* Bottom stepper & total */}
          <div className="pt-3 border-t border-[#231A33] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#FAF7FC]">Quantité</span>
              <div className="flex items-center gap-2.5 bg-[#0D0B12] border border-[#231A33] rounded-lg px-2 py-0.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-0.5 text-[#C5B4DA] hover:text-white cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold text-white min-w-[16px] text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-0.5 text-[#C5B4DA] hover:text-white cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#15101F] border border-[#231A33]">
              <span className="text-[11px] text-[#C5B4DA]">Total calculé</span>
              <span className="text-base font-bold text-[#DFC9F8] tabular-nums">
                {totalDA.toLocaleString('fr-DZ')} DA
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-2.5 px-3 rounded-xl bg-[#231A33] hover:bg-[#2c2140] text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#3D2E55] cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#DFC9F8]" />
                <span>Panier</span>
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsAppOrder}
                className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
