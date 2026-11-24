import React, { useState } from 'react';
import { ShoppingBag, Menu, X, ArrowRight, MessageCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useCatalog } from '../context/CatalogContext';

export const Header: React.FC = () => {
  const { cartTotalCount, setIsCartOpen, openCardConfigurator } = useCatalog();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Accueil', href: '#accueil' },
    { label: 'Nos produits', href: '#nos-cartes' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0D0B12]/90 backdrop-blur-md border-b border-[#231A33] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
          {/* Zone 1: Logo TAPELIX */}
          <a
            href="#accueil"
            onClick={(e) => handleNavClick(e, '#accueil')}
            className="whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
          >
            <BrandLogo size="md" showBadge={true} />
          </a>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#C5B4DA]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="hover:text-[#FAF7FC] transition-colors whitespace-nowrap shrink-0 tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Actions (Panier + Bouton Commander) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Direct Commander button */}
            <button
              onClick={() => openCardConfigurator()}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8F6BB6] hover:bg-[#A27BCB] text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Commander ma carte</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Cart Icon Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#181324] hover:bg-[#231A33] border border-[#3D2E55] text-[#FAF7FC] transition-all cursor-pointer flex items-center justify-center group"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-[#C5B4DA] group-hover:text-white transition-colors" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-[#8F6BB6] text-white text-[11px] font-bold flex items-center justify-center shadow-lg border border-[#0D0B12]">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-[#181324] text-[#FAF7FC] border border-[#3D2E55] cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-[#0D0B12]/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-18 right-0 bottom-0 w-full max-w-xs bg-[#181324] border-l border-[#231A33] p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div className="space-y-6">
              <div className="pb-3 border-b border-[#231A33]">
                <BrandLogo size="md" showBadge={true} />
              </div>

              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#C5B4DA] hover:text-[#FAF7FC] hover:bg-[#231A33] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#231A33] space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCardConfigurator();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#8F6BB6] text-white font-semibold text-xs shadow-md"
              >
                <span>Commander ma carte NFC</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#231A33] text-[#FAF7FC] text-xs font-medium"
              >
                <ShoppingBag className="w-4 h-4 text-[#C5B4DA]" />
                <span>Voir mon panier ({cartTotalCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
