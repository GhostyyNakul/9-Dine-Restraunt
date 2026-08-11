import { useState } from 'react';
import BrandLogo from './BrandLogo';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-[#0e0e0e] w-full py-20 border-t border-[#4d4635]/40" id="contact">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4 sm:px-8 md:px-16 max-w-[1280px] mx-auto">
        
        {/* Col 1: Brand & Social */}
        <div className="space-y-4">
          <BrandLogo size="lg" showText={true} className="mb-4" />
          <p className="font-body-md text-sm text-[#d0c5af] leading-relaxed max-w-sm">
            Elevating Indian cuisine to a global art form. Join us for a journey of the senses.
          </p>
          <a
            href={RESTAURANT_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-[#f2ca50] pt-1 hover:underline group"
          >
            <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">location_on</span>
            <span className="text-xs text-[#d0c5af] font-body-md group-hover:text-[#f2ca50] transition-colors">Yamuna Vihar, New Delhi, India</span>
          </a>

          {/* Social Media Section */}
          <div className="pt-4 border-t border-[#4d4635]/30">
            <h5 className="font-label-caps text-xs text-[#f2ca50] uppercase tracking-wider mb-3">
              Connect With Us
            </h5>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/nakuldoesstuff/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Instagram"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#201f1f] border border-[#4d4635] text-[#d0c5af] hover:text-[#f2ca50] hover:border-[#f2ca50] transition-all hover:scale-105 shadow-md group"
              >
                <svg className="w-4 h-4 text-[#e1306c] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="text-xs font-label-caps tracking-wide">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: Location & Hours */}
        <div className="flex flex-col gap-3">
          <h4 className="font-label-caps text-label-caps text-[#f2ca50] mb-2 uppercase tracking-widest">
            Location & Hours
          </h4>
          <a
            href={RESTAURANT_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors font-body-md text-sm inline-flex items-center gap-1.5"
          >
            <span>Yamuna Vihar, Delhi</span>
            <span className="material-symbols-outlined text-xs">open_in_new</span>
          </a>
          <span className="text-[#d0c5af] font-body-md text-sm">Open Daily: 12:00 PM – 11:00 PM</span>
          <span className="text-[#d0c5af] font-body-md text-sm pt-2">Phone: {RESTAURANT_INFO.phone}</span>
          <span className="text-[#d0c5af] font-body-md text-sm">Reservations: {RESTAURANT_INFO.email}</span>
        </div>

        {/* Col 3: Legal & Directions */}
        <div className="flex flex-col gap-3">
          <h4 className="font-label-caps text-label-caps text-[#f2ca50] mb-2 uppercase tracking-widest">
            Customer Care & Legal
          </h4>
          <button
            onClick={() => setLegalModal('privacy')}
            className="text-left text-[#d0c5af] hover:text-[#8dd6ab] transition-colors font-body-md text-sm"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setLegalModal('terms')}
            className="text-left text-[#d0c5af] hover:text-[#8dd6ab] transition-colors font-body-md text-sm"
          >
            Terms of Service
          </button>
          <a
            href={RESTAURANT_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#f2ca50] hover:underline pt-2 font-label-caps"
          >
            <span>Get Directions On Google Maps</span>
            <span className="material-symbols-outlined text-xs">open_in_new</span>
          </a>

          <div className="flex items-center justify-between flex-wrap gap-2 mt-6 pt-4 border-t border-[#4d4635]/20">
            <p className="text-[10px] text-[#4d4635] uppercase tracking-widest font-label-caps">
              © 2026 9 DINE LUXURY DINING. ALL RIGHTS RESERVED.
            </p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-[10px] text-[#4d4635] hover:text-[#d0c5af] transition-colors font-label-caps uppercase tracking-wider flex items-center gap-1 opacity-60 hover:opacity-100 group"
                title="Staff Portal (Ctrl + Shift + A)"
              >
                <span className="material-symbols-outlined text-[11px] group-hover:text-[#f2ca50] transition-colors">lock</span>
                <span>Staff Access</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-[#0e0e0e]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-8 border border-[#f2ca50]/30 rounded-2xl relative space-y-4 bg-[#1c1b1b] shadow-2xl">
            <button
              onClick={() => setLegalModal(null)}
              className="absolute top-4 right-4 text-[#d0c5af] hover:text-[#f2ca50]"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h3 className="font-headline-md text-2xl text-[#f2ca50] capitalize">
              {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h3>

            <p className="font-body-md text-xs text-[#d0c5af] leading-relaxed">
              {legalModal === 'privacy'
                ? 'At 9 Dine Luxury Dining, we preserve the highest standards of guest privacy. All personal data collected during table reservations or order placements is processed securely in compliance with strict privacy standards and is never shared with third parties.'
                : 'Welcome to 9 Dine. By reserving a table or making an online order, you agree to our restaurant etiquette standards, cancellation window (at least 2 hours prior to reservation), and health & safety compliance rules.'}
            </p>

            <button
              onClick={() => setLegalModal(null)}
              className="w-full bg-[#f2ca50] text-[#3c2f00] py-3 rounded-full font-label-caps text-xs uppercase font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
