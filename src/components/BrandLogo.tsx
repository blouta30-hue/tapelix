import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showBadge = false,
  className = ''
}) => {
  // Official uploaded brand asset slot
  const logoSrc = '/assets/aistudio/5D413423-3405-455F-9A5E-69BCA64D9200_b5fd4a93.png';

  const sizeClasses = {
    sm: {
      img: 'w-7 h-7',
      text: 'text-lg',
      sub: 'text-[9px]'
    },
    md: {
      img: 'w-9 h-9',
      text: 'text-2xl',
      sub: 'text-[10px]'
    },
    lg: {
      img: 'w-12 h-12',
      text: 'text-3xl',
      sub: 'text-xs'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Brand Icon / Logo image slot with fallback */}
      <div className={`relative ${currentSize.img} rounded-lg overflow-hidden border border-[#3D2E55] bg-[#181324] flex items-center justify-center shrink-0 shadow-md group-hover:border-[#8F6BB6] transition-colors`}>
        <img
          src={logoSrc}
          alt="TAPELIX Logo"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
        <span className="font-display font-bold text-white text-base tracking-widest hidden [display:none]:inline">
          T
        </span>
      </div>

      {/* Elegant Wordmark */}
      <div className="flex flex-col">
        <span className={`font-display font-bold tracking-[0.2em] text-[#FAF7FC] leading-none ${currentSize.text} group-hover:text-white transition-colors`}>
          TAPELIX
        </span>
        {showBadge && (
          <span className={`font-sans tracking-[0.25em] text-[#C5B4DA] uppercase font-semibold mt-0.5 ${currentSize.sub}`}>
            tapelix.dz
          </span>
        )}
      </div>
    </div>
  );
};
