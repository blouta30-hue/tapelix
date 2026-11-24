import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Sparkles, Plus, Check } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { SocialNetworkId } from '../types';
import { InstagramIcon, TikTokIcon, FacebookIcon, WhatsAppIcon, NfcIcon } from './SocialIcons';

export const NfcCardsGallery: React.FC = () => {
  const {
    cardPhotos,
    openCardConfigurator,
    setSelectedPhotoForZoom,
    cardPricing
  } = useCatalog();

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const getNetworkIcon = (tag: string) => {
    switch (tag) {
      case 'instagram':
        return <InstagramIcon className="w-3.5 h-3.5 text-[#DFC9F8]" />;
      case 'tiktok':
        return <TikTokIcon className="w-3.5 h-3.5 text-white" />;
      case 'facebook':
        return <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2]" />;
      case 'whatsapp':
        return <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />;
      default:
        return <NfcIcon className="w-3.5 h-3.5 text-[#8F6BB6]" />;
    }
  };

  return (
    <section id="nos-cartes" className="py-12 md:py-16 border-t border-[#231A33] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#181324] border border-[#3D2E55] text-[11px] font-semibold text-[#DFC9F8] uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-[#DFC9F8]" />
              <span>Gamme Principale · Sans Contact</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#FAF7FC]">
              Nos cartes NFC
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl bg-[#181324] hover:bg-[#231A33] text-[#C5B4DA] hover:text-white border border-[#3D2E55] transition-colors cursor-pointer"
              aria-label="Faire défiler vers la gauche"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl bg-[#181324] hover:bg-[#231A33] text-[#C5B4DA] hover:text-white border border-[#3D2E55] transition-colors cursor-pointer"
              aria-label="Faire défiler vers la droite"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel (Smooth horizontal scroll) */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cardPhotos.map((photo) => (
            <div
              key={photo.id}
              className="snap-start shrink-0 w-[270px] sm:w-[300px] md:w-[320px] rounded-2xl overflow-hidden bg-[#181324] border border-[#231A33] hover:border-[#8F6BB6]/60 transition-all duration-300 shadow-md flex flex-col justify-between group"
            >
              {/* Photo Area with Click to Enlarge */}
              <div
                className="aspect-[4/3] w-full overflow-hidden relative bg-[#0D0B12] cursor-pointer"
                onClick={() => setSelectedPhotoForZoom(photo)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181324] via-transparent to-transparent opacity-60" />

                {/* Network Tag Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#0D0B12]/85 backdrop-blur-md border border-[#3D2E55] flex items-center gap-1.5 text-[11px] font-semibold text-[#FAF7FC]">
                  {getNetworkIcon(photo.networkTag)}
                  <span className="capitalize">{photo.networkTag}</span>
                </div>

                {/* Enlarge Icon */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoForZoom(photo);
                  }}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-[#0D0B12]/80 hover:bg-[#8F6BB6] text-[#C5B4DA] hover:text-white border border-[#3D2E55] transition-colors cursor-pointer"
                  title="Agrandir la photo"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Photo Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#FAF7FC] group-hover:text-white transition-colors truncate">
                    {photo.title}
                  </h3>
                  <span className="text-[11px] text-[#DFC9F8] font-medium block mt-0.5">
                    Modèle : {photo.modelType}
                  </span>
                  {photo.description && (
                    <p className="text-xs text-[#C5B4DA] mt-1.5 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#231A33] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8F6BB6]">
                    Dès {cardPricing.oneNetwork.toLocaleString('fr-DZ')} DA
                  </span>
                  <button
                    onClick={() => {
                      const tag = ['instagram', 'tiktok', 'facebook', 'whatsapp'].includes(photo.networkTag)
                        ? (photo.networkTag as SocialNetworkId)
                        : undefined;
                      openCardConfigurator(tag);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#231A33] hover:bg-[#8F6BB6] text-[#FAF7FC] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Choisir ce modèle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Presentation and Primary Order CTA (Section 3 Requirement) */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#181324] via-[#231A33]/70 to-[#181324] border border-[#3D2E55] text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
          <p className="text-base sm:text-lg md:text-xl font-medium text-[#FAF7FC] tracking-wide text-balance">
            « Une seule carte pour partager vos réseaux sociaux en un simple contact. »
          </p>

          <p className="text-xs sm:text-sm text-[#C5B4DA] max-w-xl text-balance">
            Combinez librement Instagram, TikTok, Facebook et WhatsApp sur une carte connectée personnalisée. Compatible 100% avec iPhone et Android sans aucune application.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openCardConfigurator()}
              className="px-8 py-3.5 rounded-xl bg-[#8F6BB6] hover:bg-[#A27BCB] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#8F6BB6]/25 hover:shadow-[#8F6BB6]/40 cursor-pointer active:scale-95"
            >
              Commander ma carte
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
