import React, { useState } from 'react';
import { Send, CheckCircle2, MessageCircle, Instagram, Globe } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from './SocialIcons';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneOrEmail: '',
    projectType: 'Carte NFC multi-réseaux',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phoneOrEmail) return;

    const text = `Bonjour TAPELIX 👋\nNouveau message de contact depuis tapelix.dz :\n\n• Nom : ${formData.name}\n• Contact : ${formData.phoneOrEmail}\n• Projet : ${formData.projectType}\n• Message : ${formData.message || 'Souhaite échanger sur un projet'}`;
    const url = `https://wa.me/213782308820?text=${encodeURIComponent(text)}`;

    setSubmitted(true);
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  return (
    <section id="contact" className="py-12 md:py-16 border-t border-[#231A33] scroll-mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Info */}
          <div>
            <span className="text-[11px] font-bold tracking-[0.15em] text-[#DFC9F8] uppercase">
              Contact & Devis Personnalisé
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#FAF7FC] mt-1.5">
              Parlons de votre projet
            </h2>
            <p className="text-xs sm:text-sm text-[#C5B4DA] mt-3 leading-relaxed max-w-lg">
              Une question sur nos cartes NFC, nos chevalets de restaurant ou nos créations graphiques ? Notre équipe en Algérie vous répond directement sur WhatsApp ou Instagram.
            </p>

            {/* Direct Cards */}
            <div className="mt-6 space-y-3 max-w-md">
              <a
                href="https://wa.me/213782308820"
                target="_blank"
                rel="noreferrer noopener"
                className="p-3.5 rounded-2xl bg-[#181324] border border-[#231A33] hover:border-[#25D366]/60 transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shrink-0">
                    <WhatsAppIcon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#C5B4DA] block font-medium">WhatsApp direct</span>
                    <strong className="text-sm font-bold text-[#FAF7FC] group-hover:text-white transition-colors">
                      0782308820
                    </strong>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#25D366] group-hover:translate-x-0.5 transition-transform">
                  Discuter →
                </span>
              </a>

              <a
                href="https://instagram.com/tapelix.dz"
                target="_blank"
                rel="noreferrer noopener"
                className="p-3.5 rounded-2xl bg-[#181324] border border-[#231A33] hover:border-[#8F6BB6]/60 transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#833ab4]/20 via-[#fd1d1d]/20 to-[#fcb045]/20 border border-[#833ab4]/40 flex items-center justify-center text-[#DFC9F8] shrink-0">
                    <InstagramIcon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#C5B4DA] block font-medium">Instagram officiel</span>
                    <strong className="text-sm font-bold text-[#FAF7FC] group-hover:text-white transition-colors">
                      @tapelix.dz
                    </strong>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#DFC9F8] group-hover:translate-x-0.5 transition-transform">
                  Suivre →
                </span>
              </a>

              <div className="p-3.5 rounded-2xl bg-[#181324] border border-[#231A33] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#231A33] border border-[#3D2E55] flex items-center justify-center text-[#DFC9F8] shrink-0">
                    <Globe className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#C5B4DA] block font-medium">Site Web officiel</span>
                    <strong className="text-sm font-bold text-[#FAF7FC]">
                      tapelix.dz
                    </strong>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-[#8F6BB6]">
                  Algérie 🇩🇿
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#181324] border border-[#231A33] shadow-xl">
            <h3 className="font-display text-xl font-bold text-[#FAF7FC] mb-1">
              Envoyez-nous un message
            </h3>
            <p className="text-[11px] text-[#C5B4DA] mb-4">
              Réponse rapide et devis gratuit adapté à votre établissement.
            </p>

            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-display text-lg font-bold text-[#FAF7FC]">
                  Message transmis sur WhatsApp !
                </h4>
                <p className="text-xs text-[#C5B4DA]">
                  Nous traitons votre demande immédiatement.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-3.5 py-1.5 rounded-xl bg-[#231A33] text-xs font-medium text-[#C5B4DA] hover:text-white cursor-pointer"
                >
                  Nouveau message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-[#FAF7FC] block mb-1">
                    Votre nom ou nom d'établissement *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex : Karim / Café Le Cyrnos"
                    className="w-full px-3 py-2 rounded-xl bg-[#0D0B12] border border-[#231A33] text-xs text-[#FAF7FC] placeholder-[#C5B4DA]/40 outline-none focus:border-[#8F6BB6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#FAF7FC] block mb-1">
                    Téléphone ou Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phoneOrEmail}
                    onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                    placeholder="07XX XX XX XX"
                    className="w-full px-3 py-2 rounded-xl bg-[#0D0B12] border border-[#231A33] text-xs text-[#FAF7FC] placeholder-[#C5B4DA]/40 outline-none focus:border-[#8F6BB6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#FAF7FC] block mb-1">
                    Votre demande
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0D0B12] border border-[#231A33] text-xs text-[#FAF7FC] outline-none focus:border-[#8F6BB6]"
                  >
                    <option value="Carte NFC multi-réseaux">Carte NFC multi-réseaux</option>
                    <option value="Chevalets de table restaurant (NFC/QR)">Chevalets de table restaurant (NFC/QR)</option>
                    <option value="Menu Digital interactif">Menu Digital interactif</option>
                    <option value="Porte-clés connectés">Porte-clés connectés</option>
                    <option value="Carte de visite digitale & profil vCard">Carte de visite digitale & profil vCard</option>
                    <option value="Design Graphique (Logo, Flyer)">Design Graphique (Logo, Flyer)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#FAF7FC] block mb-1">
                    Message ou précisions
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Quantités, wilaya..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0D0B12] border border-[#231A33] text-xs text-[#FAF7FC] placeholder-[#C5B4DA]/40 outline-none focus:border-[#8F6BB6] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#8F6BB6] hover:bg-[#A27BCB] text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer la demande sur WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
