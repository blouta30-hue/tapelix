import React from 'react';
import { Eye, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useCatalog } from '../context/CatalogContext';
import { InstagramIcon, TikTokIcon, FacebookIcon, WhatsAppIcon, NfcIcon, QrCodeIcon } from './SocialIcons';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductModal, openCardConfigurator } = useCatalog();

  const handleCardClick = () => {
    if (product.category === 'nfc-cards') {
      const tag = ['instagram', 'tiktok', 'facebook', 'whatsapp'].includes(product.socialType || '')
        ? (product.socialType as any)
        : undefined;
      openCardConfigurator(tag);
    } else {
      openProductModal(product);
    }
  };

  const renderSocialIcon = () => {
    switch (product.socialType) {
      case 'instagram':
        return (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#833ab4]/30 via-[#fd1d1d]/30 to-[#fcb045]/30 border border-[#833ab4]/40 flex items-center justify-center text-[#DFC9F8]" title="Instagram">
            <InstagramIcon className="w-3.5 h-3.5" />
          </div>
        );
      case 'tiktok':
        return (
          <div className="w-7 h-7 rounded-lg bg-[#0D0B12] border border-[#3D2E55] flex items-center justify-center text-white" title="TikTok">
            <TikTokIcon className="w-3.5 h-3.5" />
          </div>
        );
      case 'facebook':
        return (
          <div className="w-7 h-7 rounded-lg bg-[#1877F2]/20 border border-[#1877F2]/40 flex items-center justify-center text-[#1877F2]" title="Facebook">
            <FacebookIcon className="w-3.5 h-3.5" />
          </div>
        );
      case 'whatsapp':
        return (
          <div className="w-7 h-7 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]" title="WhatsApp">
            <WhatsAppIcon className="w-3.5 h-3.5" />
          </div>
        );
      case 'menu':
        return (
          <div className="w-7 h-7 rounded-lg bg-[#231A33] border border-[#3D2E55] flex items-center justify-center text-[#DFC9F8]" title="Menu Digital">
            <QrCodeIcon className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-[#231A33] border border-[#3D2E55] flex items-center justify-center text-[#DFC9F8]" title="NFC">
            <NfcIcon className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <div className="group rounded-2xl overflow-hidden bg-[#181324] border border-[#231A33] hover:border-[#8F6BB6]/60 transition-all duration-300 shadow-md flex flex-col justify-between h-full">
      <div>
        {/* Product Image Box */}
        <div
          className="aspect-[4/3] w-full overflow-hidden relative bg-[#0D0B12] cursor-pointer"
          onClick={handleCardClick}
        >
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181324] via-transparent to-transparent opacity-60" />

          {/* Social Tag / Type */}
          <div className="absolute top-2.5 left-2.5">
            {renderSocialIcon()}
          </div>

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#0D0B12]/85 backdrop-blur-md border border-[#3D2E55] text-[10px] font-semibold text-[#DFC9F8]">
              {product.badge}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg sm:text-xl font-bold text-[#FAF7FC] group-hover:text-white transition-colors truncate">
              {product.name}
            </h3>
            {/* Price in DA */}
            <div className="text-right shrink-0">
              <span className="font-sans font-bold text-sm sm:text-base text-[#FAF7FC] tabular-nums">
                {product.priceDA.toLocaleString('fr-DZ')} <span className="text-[10px] text-[#C5B4DA]">DA</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-[#C5B4DA] mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
        <button
          onClick={handleCardClick}
          className="w-full py-2 px-3 rounded-xl bg-[#231A33] hover:bg-[#8F6BB6] text-[#FAF7FC] hover:text-white text-xs font-semibold transition-all duration-200 border border-[#3D2E55] hover:border-[#8F6BB6] flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
        >
          <span>{product.category === 'nfc-cards' ? 'Configurer la carte' : product.isService ? 'Découvrir' : 'Voir le modèle'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
