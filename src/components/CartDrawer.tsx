import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { OrderCustomerInfo } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotalDA,
    cartTotalCount,
    generateWhatsAppUrl
  } = useCatalog();

  const [customerInfo, setCustomerInfo] = useState<OrderCustomerInfo>({
    fullName: '',
    phone: '',
    wilaya: '',
    notes: ''
  });

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;
    const url = generateWhatsAppUrl(cart, customerInfo);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0B12]/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#181324] border-l border-[#231A33] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 text-xs">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#231A33] flex items-center justify-between bg-[#15101F]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#231A33] text-[#FAF7FC]">
                <ShoppingBag className="w-4 h-4 text-[#DFC9F8]" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#FAF7FC]">
                  Mon Panier TAPELIX
                </h3>
                <span className="text-[11px] text-[#C5B4DA]">
                  {cartTotalCount} article{cartTotalCount > 1 ? 's' : ''} sélectionné{cartTotalCount > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg bg-[#181324] text-[#C5B4DA] hover:text-white border border-[#231A33] cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-2.5">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#231A33] border border-[#3D2E55] flex items-center justify-center text-[#C5B4DA]">
                  <ShoppingBag className="w-6 h-6 opacity-60" />
                </div>
                <h4 className="font-display text-base font-bold text-[#FAF7FC]">
                  Votre panier est vide
                </h4>
                <p className="text-[11px] text-[#C5B4DA] max-w-xs mx-auto">
                  Découvrez nos cartes NFC configurables, porte-clés et solutions digitales.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8F6BB6] text-white text-xs font-semibold cursor-pointer"
                >
                  <span>Voir les produits</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-[11px] text-[#C5B4DA] pb-2 border-b border-[#231A33]">
                  <span>Articles sélectionnés</span>
                  <button
                    onClick={clearCart}
                    className="text-[#C5B4DA] hover:text-red-400 underline cursor-pointer"
                  >
                    Vider le panier
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#15101F] border border-[#231A33] flex gap-3 items-start justify-between"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#0D0B12] shrink-0 border border-[#3D2E55]">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#FAF7FC] truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#DFC9F8] tabular-nums mt-0.5">
                        {item.priceDA.toLocaleString('fr-DZ')} DA
                      </p>

                      {/* Options & Networks badges */}
                      {item.selectedNetworks && item.selectedNetworks.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.selectedNetworks.map((net) => (
                            <span key={net} className="px-1.5 py-0.5 rounded bg-[#231A33] text-[9px] text-white capitalize">
                              {net}
                            </span>
                          ))}
                        </div>
                      )}

                      {Object.keys(item.selectedOptions).length > 0 && (
                        <div className="text-[10px] text-[#C5B4DA] mt-1 space-y-0.5">
                          {Object.entries(item.selectedOptions).map(([k, v]) => (
                            <span key={k} className="block truncate">
                              • {k}: <strong className="text-white">{v}</strong>
                            </span>
                          ))}
                        </div>
                      )}

                      {item.customerNote && (
                        <p className="text-[10px] text-[#C5B4DA] italic truncate mt-0.5">
                          {item.customerNote}
                        </p>
                      )}

                      {/* Stepper */}
                      <div className="flex items-center gap-2.5 mt-2.5">
                        <div className="flex items-center gap-1.5 bg-[#0D0B12] border border-[#231A33] rounded-lg px-1.5 py-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="text-[#C5B4DA] hover:text-white p-0.5 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white min-w-[14px] text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="text-[#C5B4DA] hover:text-white p-0.5 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-white tabular-nums">
                          {(item.priceDA * item.quantity).toLocaleString('fr-DZ')} DA
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-[#C5B4DA] hover:text-red-400 cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Optional Customer info */}
                <div className="mt-4 pt-3 border-t border-[#231A33] space-y-2">
                  <span className="text-[11px] font-semibold text-[#FAF7FC] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#DFC9F8]" />
                    <span>Vos coordonnées pour l’expédition (optionnel) :</span>
                  </span>

                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                    placeholder="Nom complet ou Entreprise"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-xs text-[#FAF7FC] placeholder-[#C5B4DA]/40 outline-none"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="Téléphone (ex: 05...)"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-xs text-[#FAF7FC] placeholder-[#C5B4DA]/40 outline-none"
                    />
                    <input
                      type="text"
                      value={customerInfo.wilaya}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, wilaya: e.target.value })}
                      placeholder="Wilaya / Ville"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-xs text-[#FAF7FC] placeholder-[#C5B4DA]/40 outline-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Checkout footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#231A33] bg-[#15101F] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#C5B4DA] block">Total de la commande</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Paiement à la livraison</span>
                </div>
                <div className="text-right">
                  <span className="font-sans text-xl font-bold text-white tabular-nums">
                    {cartTotalDA.toLocaleString('fr-DZ')}{' '}
                    <span className="text-xs font-normal text-[#C5B4DA]">DA</span>
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Confirmer la commande sur WhatsApp (0782308820)</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#C5B4DA]">
                <ShieldCheck className="w-3 h-3 text-[#DFC9F8]" />
                <span>Message automatique prêt à envoyer, vous gardez le contrôle</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
