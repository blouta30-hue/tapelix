import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Check } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { useCatalog } from '../context/CatalogContext';
import { ProductCard } from './ProductCard';

interface ProductSectionProps {
  id: string;
  category: ProductCategory;
  title: string;
  subtitle: string;
  description?: string;
  products: Product[];
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  id,
  title,
  subtitle,
  description,
  products
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { openProductModal } = useCatalog();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section id={id} className="py-10 md:py-14 border-t border-[#231A33] scroll-mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Carousel Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#DFC9F8] uppercase block">
              {subtitle}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#FAF7FC] mt-1">
              {title}
            </h2>
            {description && (
              <p className="text-xs sm:text-sm text-[#C5B4DA] mt-1.5 max-w-xl leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {products.length > 2 && (
            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-xl bg-[#181324] hover:bg-[#231A33] text-[#C5B4DA] hover:text-white border border-[#3D2E55] transition-colors cursor-pointer"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-xl bg-[#181324] hover:bg-[#231A33] text-[#C5B4DA] hover:text-white border border-[#3D2E55] transition-colors cursor-pointer"
                aria-label="Suivant"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel / Product Cards Container (Horizontal scrolling on small/medium, grid on large or scrollable) */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory lg:grid lg:grid-cols-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="snap-start shrink-0 w-[260px] sm:w-[290px] lg:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
