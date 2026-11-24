import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { CATEGORY_DEFINITIONS } from '../data/initialProducts';

export const Hero: React.FC = () => {
  const { openCardConfigurator } = useCatalog();

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="accueil" className="pt-6 pb-10 md:pt-10 md:pb-14 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#8F6BB6]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181324] border border-[#3D2E55] text-[11px] font-medium text-[#C5B4DA] mb-3">
            <Sparkles className="w-3 h-3 text-[#DFC9F8]" />
            <span>Technologie NFC & Solutions Digitales en Algérie</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FAF7FC] leading-tight mb-2">
            Bienvenue chez <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FAF7FC] via-[#DFC9F8] to-[#8F6BB6]">TAPELIX</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#C5B4DA] font-normal">
            « Des solutions intelligentes pour connecter votre activité. »
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openCardConfigurator()}
              className="px-6 py-2.5 rounded-xl bg-[#8F6BB6] hover:bg-[#A27BCB] text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Commander ma carte NFC
            </button>
            <button
              onClick={() => scrollTo('#nos-cartes')}
              className="px-5 py-2.5 rounded-xl bg-[#181324] hover:bg-[#231A33] text-[#FAF7FC] border border-[#3D2E55] font-medium text-xs transition-colors cursor-pointer"
            >
              Voir la galerie des cartes
            </button>
          </div>
        </div>

        {/* Big Composed Visual with Compact Aspect */}
        <div className="relative rounded-2xl overflow-hidden border border-[#3D2E55] bg-[#181324] shadow-xl group mb-8">
          <div className="aspect-[21/9] sm:aspect-[2.4/1] w-full relative">
            <img
              src="/src/assets/images/hero_tapelix_showcase_1793921691463.jpg"
              alt="Produits NFC TAPELIX"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B12] via-transparent to-transparent opacity-75" />

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-lg bg-[#0D0B12]/80 backdrop-blur-md border border-[#3D2E55] text-[#FAF7FC] text-[11px] font-medium">
                Cartes NFC • Porte-clés • Chevalets QR • Menus Digitaux
              </span>
              <span className="hidden sm:inline-block text-[11px] text-[#DFC9F8] font-medium">
                Sans application requise
              </span>
            </div>
          </div>
        </div>

        {/* Directly Below: Compact Category Cards (No empty space!) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-[0.15em] text-[#C5B4DA] uppercase">
              Catégories de produits
            </span>
            <span className="text-[11px] text-[#8F6BB6]">Accès rapide ↓</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORY_DEFINITIONS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollTo(cat.id === 'nfc-cards' ? '#nos-cartes' : `#${cat.anchor}`)}
                className="group p-2.5 rounded-xl bg-[#181324] hover:bg-[#231A33] border border-[#231A33] hover:border-[#8F6BB6]/60 transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div className="aspect-square w-full rounded-lg overflow-hidden relative mb-2 bg-[#0D0B12]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#FAF7FC] group-hover:text-white transition-colors truncate">
                    {cat.title}
                  </h3>
                  <span className="text-[10px] text-[#C5B4DA] truncate block">
                    {cat.countText}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
