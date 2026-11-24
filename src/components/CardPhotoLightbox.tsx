import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { SocialNetworkId } from '../types';

export const CardPhotoLightbox: React.FC = () => {
  const { selectedPhotoForZoom, setSelectedPhotoForZoom, openCardConfigurator } = useCatalog();

  if (!selectedPhotoForZoom) return null;

  const handleOrderThis = () => {
    const net = ['instagram', 'tiktok', 'facebook', 'whatsapp'].includes(selectedPhotoForZoom.networkTag)
      ? (selectedPhotoForZoom.networkTag as SocialNetworkId)
      : undefined;
    setSelectedPhotoForZoom(null);
    openCardConfigurator(net);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-[#0D0B12]/90 backdrop-blur-md transition-opacity"
        onClick={() => setSelectedPhotoForZoom(null)}
      />

      <div className="relative max-w-3xl w-full max-h-[92vh] bg-[#181324] border border-[#3D2E55] rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-[#231A33] flex items-center justify-between bg-[#15101F]">
          <div>
            <h3 className="font-bold text-[#FAF7FC] text-sm sm:text-base">
              {selectedPhotoForZoom.title}
            </h3>
            <span className="text-[11px] text-[#DFC9F8]">
              Modèle : {selectedPhotoForZoom.modelType}
            </span>
          </div>

          <button
            onClick={() => setSelectedPhotoForZoom(null)}
            className="p-1.5 rounded-lg bg-[#181324] text-[#C5B4DA] hover:text-white border border-[#231A33] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-[#0D0B12]">
          <img
            src={selectedPhotoForZoom.imageUrl}
            alt={selectedPhotoForZoom.title}
            referrerPolicy="no-referrer"
            className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>

        <div className="p-4 border-t border-[#231A33] bg-[#15101F] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-[#C5B4DA] text-[11px] max-w-md">
            {selectedPhotoForZoom.description || 'Puce NFC scellée NTAG216 haute sensibilité, compatible 100% iPhone et Android.'}
          </p>

          <button
            onClick={handleOrderThis}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#8F6BB6] hover:bg-[#A27BCB] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
          >
            <span>Configurer ce modèle</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
