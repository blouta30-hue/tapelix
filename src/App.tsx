import React from 'react';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { NfcCardsGallery } from './components/NfcCardsGallery';
import { ProductSection } from './components/ProductSection';
import { CardConfiguratorModal } from './components/CardConfiguratorModal';
import { CardPhotoLightbox } from './components/CardPhotoLightbox';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { ContactSection } from './components/ContactSection';
import { AdminDrawer } from './components/AdminDrawer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { products } = useCatalog();

  const nfcKeychains = products.filter((p) => p.category === 'nfc-keychains');
  const nfcTableStands = products.filter((p) => p.category === 'nfc-table-stands');
  const digitalMenu = products.filter((p) => p.category === 'digital-menu');
  const digitalCards = products.filter((p) => p.category === 'digital-cards');
  const creativeDesign = products.filter((p) => p.category === 'creative-design');

  return (
    <div className="min-h-screen bg-[#0D0B12] text-[#FAF7FC] flex flex-col selection:bg-[#8F6BB6] selection:text-white">
      {/* 1. Header */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Section (Court & Visuel + Catégories) */}
        <Hero />

        {/* 3. Pièce Maîtresse : Nos Cartes NFC avec Carrousel Horizontal */}
        <NfcCardsGallery />

        {/* 6. Autres Catégories avec Présentation Visuelle et Défilement */}
        <ProductSection
          id="nfc-keychains"
          category="nfc-keychains"
          title="NFC Keychains"
          subtitle="Accessoires Mobiles"
          description="Porte-clés connectés compacts et robustes pour partager vos coordonnées et réseaux partout avec vous."
          products={nfcKeychains}
        />

        <ProductSection
          id="nfc-table-stands"
          category="nfc-table-stands"
          title="NFC Table Stands"
          subtitle="Restauration & Hôtellerie"
          description="Chevalets de table sans contact pour restaurants, cafés et hôtels. Connexion au menu et avis Google en un tap."
          products={nfcTableStands}
        />

        {/* Container Services */}
        <div id="services" className="scroll-mt-20">
          <ProductSection
            id="digital-menu"
            category="digital-menu"
            title="Digital Menu"
            subtitle="Solutions Restauration"
            description="Menus digitaux sur smartphone : actualisation des prix en temps réel, photos HD et zéro réimpression."
            products={digitalMenu}
          />

          <ProductSection
            id="digital-cards"
            category="digital-cards"
            title="Digital Cards"
            subtitle="Profil vCard Connecté"
            description="Partagez votre fiche contact complète et enregistrez-la instantanément dans le répertoire de vos clients."
            products={digitalCards}
          />

          <ProductSection
            id="creative-design"
            category="creative-design"
            title="Creative Design"
            subtitle="Studio Graphique"
            description="Conception de logos, identités visuelles et supports publicitaires professionnels pour votre marque."
            products={creativeDesign}
          />
        </div>

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals & Drawers */}
      <CardConfiguratorModal />
      <CardPhotoLightbox />
      <ProductModal />
      <CartDrawer />
      <AdminDrawer />
    </div>
  );
};

export default function App() {
  return (
    <CatalogProvider>
      <AppContent />
    </CatalogProvider>
  );
}
