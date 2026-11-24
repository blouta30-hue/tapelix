import React from 'react';
import { BrandLogo } from './BrandLogo';
import { InstagramIcon, WhatsAppIcon } from './SocialIcons';
import { useCatalog } from '../context/CatalogContext';
import { Settings } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsAdminOpen } = useCatalog();

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0A080E] border-t border-[#231A33] pt-12 pb-8 text-[#C5B4DA] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#231A33]">
          {/* Col 1 & 2: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-3">
            <BrandLogo size="md" showBadge={true} />
            <p className="font-display italic text-base text-[#FAF7FC]">
              « Connect. Share. Grow. »
            </p>
            <p className="text-xs text-[#C5B4DA] max-w-sm leading-relaxed">
              TAPELIX est la marque de référence en Algérie pour les cartes NFC connectées, supports intelligents pour restaurants et solutions digitales innovantes.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://wa.me/213782308820"
                target="_blank"
                rel="noreferrer noopener"
                className="w-8 h-8 rounded-xl bg-[#181324] hover:bg-[#25D366]/20 border border-[#231A33] hover:border-[#25D366]/50 flex items-center justify-center text-[#C5B4DA] hover:text-[#25D366] transition-colors"
                aria-label="WhatsApp TAPELIX"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://instagram.com/tapelix.dz"
                target="_blank"
                rel="noreferrer noopener"
                className="w-8 h-8 rounded-xl bg-[#181324] hover:bg-[#833ab4]/20 border border-[#231A33] hover:border-[#833ab4]/50 flex items-center justify-center text-[#C5B4DA] hover:text-white transition-colors"
                aria-label="Instagram TAPELIX"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 3: Categories 1 */}
          <div className="space-y-2.5">
            <h4 className="font-sans font-bold text-xs text-[#FAF7FC] uppercase tracking-wider">
              Produits NFC
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleScroll('nos-cartes')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cartes NFC (Galerie & Commande)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('nfc-keychains')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  NFC Keychains
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('nfc-table-stands')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  NFC Table Stands
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Categories 2 */}
          <div className="space-y-2.5">
            <h4 className="font-sans font-bold text-xs text-[#FAF7FC] uppercase tracking-wider">
              Solutions Digitales
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleScroll('digital-menu')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Digital Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('digital-cards')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Digital Cards
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('creative-design')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Creative Design
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Direct info */}
          <div className="space-y-2.5">
            <h4 className="font-sans font-bold text-xs text-[#FAF7FC] uppercase tracking-wider">
              Contact Direct
            </h4>
            <ul className="space-y-1.5">
              <li>
                <span className="text-[#C5B4DA]/60 block text-[11px]">WhatsApp officiel</span>
                <a
                  href="https://wa.me/213782308820"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[#FAF7FC] hover:text-[#8F6BB6] font-medium"
                >
                  0782308820
                </a>
              </li>
              <li>
                <span className="text-[#C5B4DA]/60 block text-[11px]">Instagram</span>
                <a
                  href="https://instagram.com/tapelix.dz"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[#FAF7FC] hover:text-[#8F6BB6] font-medium"
                >
                  @tapelix.dz
                </a>
              </li>
              <li>
                <span className="text-[#C5B4DA]/60 block text-[11px]">Site Web</span>
                <span className="text-[#FAF7FC]">tapelix.dz</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#C5B4DA]/70">
          <div>
            © {new Date().getFullYear()} TAPELIX · tapelix.dz. Tous droits réservés.
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#C5B4DA]/50">NFC • PARTAGE • CONNECTE</span>
            <span>·</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1 text-[#8F6BB6] hover:text-[#DFC9F8] transition-colors cursor-pointer"
              title="Gérer les prix et le catalogue"
            >
              <Settings className="w-3 h-3" />
              <span>Gestion & Photos (Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
