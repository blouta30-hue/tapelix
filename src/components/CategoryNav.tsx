import React from 'react';
import { ArrowDownRight } from 'lucide-react';
import { CATEGORY_DEFINITIONS } from '../data/initialProducts';

export const CategoryNav: React.FC = () => {
  const scrollToCategory = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="nos-produits" className="py-16 md:py-24 border-t border-[#30283D]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-[#B7A5C9] uppercase">
              Catalogue Complet · tapelix.dz
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#F2EEF5] mt-2">
              Découvrez nos produits
            </h2>
          </div>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_DEFINITIONS.map((cat, index) => (
            <div
              key={cat.id}
              onClick={() => scrollToCategory(cat.anchor)}
              className="group relative rounded-2xl overflow-hidden bg-[#1E1A27] border border-[#30283D] hover:border-[#76618E]/60 transition-all duration-300 shadow-lg hover:shadow-[#76618E]/10 cursor-pointer flex flex-col"
            >
              {/* Category Image Box */}
              <div className="aspect-[16/10] w-full overflow-hidden relative bg-[#15131B]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A27] via-transparent to-transparent opacity-80" />
                
                {/* Number index */}
                <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-md bg-[#15131B]/75 backdrop-blur-md border border-[#76618E]/30 text-[11px] font-mono text-[#B7A5C9]">
                  0{index + 1}
                </div>

                {/* Count tag */}
                <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-md bg-[#30283D]/80 backdrop-blur-md text-[11px] font-medium text-[#F2EEF5]">
                  {cat.countText}
                </div>
              </div>

              {/* Text & Button */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#F2EEF5] group-hover:text-white transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#B7A5C9] mt-1.5 line-clamp-2">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#30283D] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#76618E] group-hover:text-[#B7A5C9] transition-colors">
                    Explorer la catégorie
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#30283D] group-hover:bg-[#76618E] text-[#B7A5C9] group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
