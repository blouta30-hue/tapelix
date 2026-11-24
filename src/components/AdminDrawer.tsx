import React, { useState } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Plus,
  Search,
  Tag,
  DollarSign,
  Check,
  Image as ImageIcon,
  ShoppingBag,
  Trash2,
  Edit2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { Product, ProductCategory, CardGalleryPhoto, SocialNetworkId } from '../types';

export const AdminDrawer: React.FC = () => {
  const {
    products,
    updateProduct,
    resetProductsToDefault,
    addNewProduct,
    deleteProduct,
    cardPhotos,
    addCardPhoto,
    removeCardPhoto,
    updateCardPhoto,
    cardPricing,
    updateCardPricing,
    orderHistory,
    updateOrderStatus,
    isAdminOpen,
    setIsAdminOpen
  } = useCatalog();

  const [activeTab, setActiveTab] = useState<'photos' | 'pricing' | 'products' | 'orders'>('photos');
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Card photo form state
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photoForm, setPhotoForm] = useState<Omit<CardGalleryPhoto, 'id'>>({
    title: '',
    networkTag: 'instagram',
    imageUrl: '',
    description: '',
    modelType: 'Noir Mat & Liseré Lilas'
  });
  const [editingPhoto, setEditingPhoto] = useState<CardGalleryPhoto | null>(null);

  // Pricing matrix local state
  const [pricingForm, setPricingForm] = useState(cardPricing);

  // Product edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAdminOpen) return null;

  const triggerFeedback = () => {
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 1800);
  };

  const handleSaveCardPricing = (e: React.FormEvent) => {
    e.preventDefault();
    updateCardPricing(pricingForm);
    triggerFeedback();
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title || !photoForm.imageUrl) return;
    addCardPhoto(photoForm);
    setPhotoForm({
      title: '',
      networkTag: 'instagram',
      imageUrl: '',
      description: '',
      modelType: 'Noir Mat'
    });
    setIsAddingPhoto(false);
    triggerFeedback();
  };

  const handleUpdatePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    updateCardPhoto(editingPhoto);
    setEditingPhoto(null);
    triggerFeedback();
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0B12]/85 backdrop-blur-md transition-opacity"
        onClick={() => setIsAdminOpen(false)}
      />

      {/* Main Container */}
      <div className="relative w-full max-w-4xl bg-[#181324] border border-[#3D2E55] rounded-2xl md:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#231A33] flex items-center justify-between bg-[#15101F]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#231A33] border border-[#3D2E55] flex items-center justify-center text-[#DFC9F8]">
              <Sliders className="w-4 h-4 text-[#8F6BB6]" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#FAF7FC]">
                Administration TAPELIX · Gestion Boutique
              </h3>
              <p className="text-[11px] text-[#C5B4DA]">
                Gérez la galerie de photos de vos cartes, le barème des prix, les produits et commandes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveFeedback && (
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> Enregistré !
              </span>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-lg bg-[#181324] text-[#C5B4DA] hover:text-white border border-[#231A33] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#231A33] bg-[#15101F] px-4 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-3.5 font-bold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'photos'
                ? 'border-[#8F6BB6] text-[#FAF7FC]'
                : 'border-transparent text-[#C5B4DA] hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#8F6BB6]" />
            <span>Galerie Photos Cartes ({cardPhotos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-3.5 font-bold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pricing'
                ? 'border-[#8F6BB6] text-[#FAF7FC]'
                : 'border-transparent text-[#C5B4DA] hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Barème des Prix (DA)</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3.5 font-bold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'border-[#8F6BB6] text-[#FAF7FC]'
                : 'border-transparent text-[#C5B4DA] hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-[#DFC9F8]" />
            <span>Catalogue Autres Produits</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 font-bold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#8F6BB6] text-[#FAF7FC]'
                : 'border-transparent text-[#C5B4DA] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#8F6BB6]" />
            <span>Commandes Reçues ({orderHistory.length})</span>
          </button>
        </div>

        {/* Tab 1: Card Photos Management (Section 8 Requirement) */}
        {activeTab === 'photos' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#FAF7FC] text-sm">Photos des Cartes du Carrousel</h4>
                <p className="text-[#C5B4DA] text-[11px]">
                  Ajoutez vos propres photos de cartes réelles pour les afficher dans la vitrine.
                </p>
              </div>

              <button
                onClick={() => setIsAddingPhoto(true)}
                className="px-3.5 py-2 rounded-xl bg-[#8F6BB6] hover:bg-[#A27BCB] text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une photo de carte</span>
              </button>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {cardPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="p-3 rounded-xl bg-[#15101F] border border-[#231A33] flex flex-col justify-between space-y-2 group"
                >
                  <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#0D0B12] relative">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0D0B12]/80 text-[10px] text-[#DFC9F8] capitalize font-medium">
                      {photo.networkTag}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-[#FAF7FC] truncate">{photo.title}</h5>
                    <span className="text-[10px] text-[#C5B4DA] block">Modèle : {photo.modelType}</span>
                  </div>

                  <div className="pt-2 border-t border-[#231A33] flex items-center justify-between">
                    <button
                      onClick={() => setEditingPhoto(photo)}
                      className="px-2.5 py-1 rounded-lg bg-[#231A33] hover:bg-[#3D2E55] text-[#C5B4DA] hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Modifier</span>
                    </button>

                    <button
                      onClick={() => removeCardPhoto(photo.id)}
                      className="p-1 rounded-lg text-red-400 hover:text-red-300 cursor-pointer"
                      title="Supprimer la photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Pricing Matrix (Section 8 Requirement) */}
        {activeTab === 'pricing' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div>
              <h4 className="font-bold text-[#FAF7FC] text-sm">Barème des Cartes NFC selon les Réseaux</h4>
              <p className="text-[#C5B4DA] text-[11px]">
                Définissez les tarifs officiels en Dinars Algériens (DA) appliqués automatiquement dans le configurateur.
              </p>
            </div>

            <form onSubmit={handleSaveCardPricing} className="space-y-4 max-w-lg">
              <div className="p-4 rounded-xl bg-[#15101F] border border-[#231A33] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[#FAF7FC] font-semibold">1 Réseau unique (ex: Instagram seul) :</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="50"
                      value={pricingForm.oneNetwork}
                      onChange={(e) => setPricingForm({ ...pricingForm, oneNetwork: Number(e.target.value) })}
                      className="w-24 px-2.5 py-1.5 rounded-lg bg-[#0D0B12] border border-[#3D2E55] text-white font-bold text-right"
                    />
                    <span className="text-[#C5B4DA]">DA</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-[#FAF7FC] font-semibold">2 Réseaux combinés (ex: Insta + TikTok) :</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="50"
                      value={pricingForm.twoNetworks}
                      onChange={(e) => setPricingForm({ ...pricingForm, twoNetworks: Number(e.target.value) })}
                      className="w-24 px-2.5 py-1.5 rounded-lg bg-[#0D0B12] border border-[#3D2E55] text-white font-bold text-right"
                    />
                    <span className="text-[#C5B4DA]">DA</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-[#FAF7FC] font-semibold">3 Réseaux combinés :</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="50"
                      value={pricingForm.threeNetworks}
                      onChange={(e) => setPricingForm({ ...pricingForm, threeNetworks: Number(e.target.value) })}
                      className="w-24 px-2.5 py-1.5 rounded-lg bg-[#0D0B12] border border-[#3D2E55] text-white font-bold text-right"
                    />
                    <span className="text-[#C5B4DA]">DA</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-[#FAF7FC] font-semibold">4 Réseaux complets (Insta + TikTok + FB + WA) :</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="50"
                      value={pricingForm.fourNetworks}
                      onChange={(e) => setPricingForm({ ...pricingForm, fourNetworks: Number(e.target.value) })}
                      className="w-24 px-2.5 py-1.5 rounded-lg bg-[#0D0B12] border border-[#3D2E55] text-white font-bold text-right"
                    />
                    <span className="text-[#C5B4DA]">DA</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Réinitialiser aux valeurs d’origine ?')) {
                      resetProductsToDefault();
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#15101F] text-[#C5B4DA] hover:text-white border border-[#231A33] cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 inline mr-1" />
                  Valeurs par défaut
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8F6BB6] hover:bg-[#A27BCB] text-white font-bold shadow-md cursor-pointer"
                >
                  Enregistrer les prix du barème
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Other Products */}
        {activeTab === 'products' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-[#8F6BB6] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filtrer les produits..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#15101F] border border-[#231A33] text-white outline-none"
                />
              </div>
            </div>

            <div className="divide-y divide-[#231A33]">
              {filteredProducts.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={p.image} alt={p.name} className="w-9 h-9 rounded object-cover bg-[#0D0B12]" />
                    <div className="min-w-0">
                      <h5 className="font-bold text-[#FAF7FC] truncate">{p.name}</h5>
                      <span className="text-[10px] text-[#C5B4DA]">{p.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      step="50"
                      value={p.priceDA}
                      onChange={(e) => {
                        updateProduct({ ...p, priceDA: Number(e.target.value) });
                        triggerFeedback();
                      }}
                      className="w-20 px-2 py-1 rounded bg-[#0D0B12] border border-[#231A33] text-right text-white font-bold"
                    />
                    <span className="text-[#C5B4DA]">DA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Orders History */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#FAF7FC] text-sm">Historique des Commandes Transmises</h4>
                <p className="text-[#C5B4DA] text-[11px]">
                  Visualisez les commandes générées par les clients et mettez à jour leur statut.
                </p>
              </div>
            </div>

            {orderHistory.length === 0 ? (
              <div className="text-center py-12 text-[#C5B4DA]">
                Aucune commande enregistrée pour le moment. Les commandes passées sur WhatsApp s’afficheront ici.
              </div>
            ) : (
              <div className="space-y-3">
                {orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-xl bg-[#15101F] border border-[#231A33] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#FAF7FC]">{order.customerName} ({order.phone})</span>
                      <span className="text-[11px] text-[#DFC9F8]">{order.date}</span>
                    </div>

                    <p className="text-[11px] text-[#C5B4DA]">
                      <strong>Articles :</strong> {order.itemsSummary}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#231A33]">
                      <span className="font-bold text-white text-xs">
                        Total : {order.totalDA.toLocaleString('fr-DZ')} DA
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="px-2 py-1 rounded-lg bg-[#0D0B12] border border-[#3D2E55] text-[11px] text-[#DFC9F8] outline-none"
                      >
                        <option value="Reçue sur WhatsApp">Reçue sur WhatsApp</option>
                        <option value="En préparation">En préparation</option>
                        <option value="Expédiée">Expédiée</option>
                        <option value="Livrée">Livrée</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Photo Modal */}
        {isAddingPhoto && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-[#0D0B12]/90 backdrop-blur-sm"
              onClick={() => setIsAddingPhoto(false)}
            />

            <div className="relative max-w-md w-full bg-[#181324] border border-[#3D2E55] rounded-2xl p-5 shadow-2xl z-10 space-y-3">
              <h4 className="font-bold text-[#FAF7FC] text-sm">Ajouter une photo de carte NFC</h4>

              <form onSubmit={handleAddPhotoSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-[#FAF7FC] font-semibold block mb-1">Titre de la carte *</label>
                  <input
                    type="text"
                    required
                    value={photoForm.title}
                    onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                    placeholder="Ex : Carte Instagram Noir & Lilas"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#FAF7FC] font-semibold block mb-1">Réseau / Catégorie *</label>
                  <select
                    value={photoForm.networkTag}
                    onChange={(e) => setPhotoForm({ ...photoForm, networkTag: e.target.value as any })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-white outline-none"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="custom">Carte Personnalisée</option>
                    <option value="multi">Multi-Réseaux</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#FAF7FC] font-semibold block mb-1">Modèle / Finition</label>
                  <input
                    type="text"
                    value={photoForm.modelType}
                    onChange={(e) => setPhotoForm({ ...photoForm, modelType: e.target.value })}
                    placeholder="Ex : Noir Mat & Liseré Lilas"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#FAF7FC] font-semibold block mb-1">URL de la photo *</label>
                  <input
                    type="text"
                    required
                    value={photoForm.imageUrl}
                    onChange={(e) => setPhotoForm({ ...photoForm, imageUrl: e.target.value })}
                    placeholder="Lien ou chemin vers la photo..."
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#FAF7FC] font-semibold block mb-1">Description courte</label>
                  <textarea
                    rows={2}
                    value={photoForm.description}
                    onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                    placeholder="Détails du produit..."
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-white outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingPhoto(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#15101F] text-[#C5B4DA] cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#8F6BB6] text-white font-semibold cursor-pointer"
                  >
                    Ajouter au carrousel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Photo Modal */}
        {editingPhoto && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-[#0D0B12]/90 backdrop-blur-sm"
              onClick={() => setEditingPhoto(null)}
            />

            <div className="relative max-w-md w-full bg-[#181324] border border-[#3D2E55] rounded-2xl p-5 shadow-2xl z-10 space-y-3">
              <h4 className="font-bold text-[#FAF7FC] text-sm">Modifier la photo de carte</h4>

              <form onSubmit={handleUpdatePhotoSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-[#FAF7FC] font-semibold block mb-1">Titre de la carte</label>
                  <input
                    type="text"
                    required
                    value={editingPhoto.title}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#FAF7FC] font-semibold block mb-1">Modèle</label>
                  <input
                    type="text"
                    value={editingPhoto.modelType}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, modelType: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#FAF7FC] font-semibold block mb-1">URL de l’image</label>
                  <input
                    type="text"
                    required
                    value={editingPhoto.imageUrl}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, imageUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#FAF7FC] font-semibold block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingPhoto.description}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0D0B12] border border-[#231A33] text-white outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPhoto(null)}
                    className="px-3 py-1.5 rounded-lg bg-[#15101F] text-[#C5B4DA] cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#8F6BB6] text-white font-semibold cursor-pointer"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
