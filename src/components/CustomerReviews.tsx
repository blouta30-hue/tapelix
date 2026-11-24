import React, { useState } from 'react';
import { Maximize2, Plus, X, Image as ImageIcon, Camera } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { CustomerShowcaseItem } from '../types';

export const CustomerReviews: React.FC = () => {
  const { showcaseItems, addShowcaseItem, removeShowcaseItem, lightboxItem, setLightboxItem } = useCatalog();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('NFC Card personnalisée');
  const [newClientType, setNewClientType] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) return;

    addShowcaseItem({
      title: newTitle || 'Commande client TAPELIX',
      category: newCategory,
      clientType: newClientType || 'Client TAPELIX',
      imageUrl: newImageUrl,
      dateAdded: new Date().getFullYear().toString()
    });

    setNewTitle('');
    setNewClientType('');
    setNewImageUrl('');
    setIsAddModalOpen(false);
  };

  return (
    <section id="avis-clients" className="py-16 md:py-24 border-t border-[#30283D]/60 scroll-mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-[#B7A5C9] uppercase">
              Réalisations & Commandes Réelles
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#F2EEF5] mt-2">
              Ils nous font confiance
            </h2>
            <p className="text-sm text-[#B7A5C9] mt-3 max-w-xl leading-relaxed">
              Galerie authentique de nos produits NFC et solutions digitales déployés pour nos clients et partenaires à travers l’Algérie.
            </p>
          </div>

          {/* Button to add client photo */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#30283D] hover:bg-[#76618E] text-[#F2EEF5] hover:text-white border border-[#76618E]/40 text-xs font-medium transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une photo client</span>
          </button>
        </div>

        {/* Modern Image Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative rounded-2xl overflow-hidden bg-[#1E1A27] border border-[#30283D] hover:border-[#76618E]/60 transition-all duration-300 shadow-md cursor-pointer flex flex-col"
            >
              <div className="aspect-square w-full overflow-hidden relative bg-[#15131B]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.opacity = '0.5';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A27] via-transparent to-transparent opacity-80" />

                {/* Enlarge button overlay */}
                <div className="absolute inset-0 bg-[#15131B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-3 rounded-full bg-[#30283D]/90 text-white border border-[#76618E]/40 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 className="w-5 h-5 text-[#F2EEF5]" />
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#B7A5C9] uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#F2EEF5] mt-1 group-hover:text-white transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#B7A5C9] mt-1">
                    {item.clientType}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#30283D]/60 flex items-center justify-between text-[11px] text-[#76618E]">
                  <span>Cliquer pour agrandir</span>
                  <span>{item.dateAdded}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery notice */}
        <div className="mt-8 p-4 rounded-xl bg-[#1E1A27]/40 border border-[#30283D] flex items-center gap-3 text-xs text-[#B7A5C9] max-w-2xl mx-auto text-center justify-center">
          <Camera className="w-4 h-4 text-[#B7A5C9] shrink-0" />
          <span>Photos réelles de nos produits en production et sur le terrain chez nos clients.</span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-[#15131B]/90 backdrop-blur-md transition-opacity"
            onClick={() => setLightboxItem(null)}
          />

          <div className="relative max-w-4xl w-full max-h-[90vh] bg-[#1E1A27] border border-[#76618E]/40 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col">
            <div className="p-4 border-b border-[#30283D] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#F2EEF5]">{lightboxItem.title}</h3>
                <span className="text-xs text-[#B7A5C9]">{lightboxItem.category} · {lightboxItem.clientType}</span>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="p-1.5 rounded-lg bg-[#15131B] text-[#B7A5C9] hover:text-white border border-[#30283D] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-[#15131B]">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-lg"
              />
            </div>

            <div className="p-4 border-t border-[#30283D] flex items-center justify-between text-xs text-[#B7A5C9]">
              <span>TAPELIX · Réalisation client</span>
              <button
                onClick={() => {
                  removeShowcaseItem(lightboxItem.id);
                  setLightboxItem(null);
                }}
                className="text-red-400 hover:text-red-300 underline cursor-pointer"
              >
                Retirer cet emplacement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#15131B]/80 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative max-w-md w-full bg-[#1E1A27] border border-[#76618E]/40 rounded-2xl p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-[#F2EEF5]">
                Ajouter une photo client
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#B7A5C9] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#F2EEF5] block mb-1">
                  Titre du projet / réalisation
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex : Chevalet NFC Restaurant El Bahdja"
                  className="w-full px-3 py-2 rounded-xl bg-[#15131B] border border-[#30283D] text-xs text-[#F2EEF5] placeholder-[#76618E]/60 outline-none focus:border-[#76618E]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#F2EEF5] block mb-1">
                  Catégorie du produit
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#15131B] border border-[#30283D] text-xs text-[#F2EEF5] outline-none focus:border-[#76618E]"
                >
                  <option value="NFC Card personnalisée">NFC Card personnalisée</option>
                  <option value="Porte-clés connecté">Porte-clés connecté</option>
                  <option value="Chevalet de table NFC/QR">Chevalet de table NFC/QR</option>
                  <option value="Menu digital">Menu digital</option>
                  <option value="Carte de visite digitale">Carte de visite digitale</option>
                  <option value="Creative Design">Creative Design</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#F2EEF5] block mb-1">
                  Client ou Établissement
                </label>
                <input
                  type="text"
                  value={newClientType}
                  onChange={(e) => setNewClientType(e.target.value)}
                  placeholder="Ex : Restaurant Lounge à Alger"
                  className="w-full px-3 py-2 rounded-xl bg-[#15131B] border border-[#30283D] text-xs text-[#F2EEF5] placeholder-[#76618E]/60 outline-none focus:border-[#76618E]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#F2EEF5] block mb-1">
                  URL de l’image
                </label>
                <input
                  type="url"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://... ou chemin local"
                  className="w-full px-3 py-2 rounded-xl bg-[#15131B] border border-[#30283D] text-xs text-[#F2EEF5] placeholder-[#76618E]/60 outline-none focus:border-[#76618E]"
                />
                <span className="text-[11px] text-[#B7A5C9] mt-1 block">
                  Collez le lien direct vers la photo de votre client.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#30283D] text-xs font-medium text-[#B7A5C9] hover:text-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#76618E] hover:bg-[#866fa0] text-xs font-semibold text-white shadow-md cursor-pointer"
                >
                  Ajouter à la galerie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
