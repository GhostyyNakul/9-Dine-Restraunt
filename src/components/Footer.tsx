import { useState } from 'react';
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
          <img
            alt="7 DINE Logo"
            className="h-12 w-auto object-contain mb-4"
            src={RESTAURANT_INFO.logoUrl}
          />
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
                href="https://www.instagram.com/7dine.cafe/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow 7 Dine on Instagram"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#201f1f] border border-[#4d4635] text-[#d0c5af] hover:text-[#f2ca50] hover:border-[#f2ca50] transition-all hover:scale-105 shadow-md group"
              >
                <svg className="w-4 h-4 text-[#e1306c] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="text-xs font-label-caps tracking-wide">Instagram</span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/7dine.cafe/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow 7 Dine on Facebook"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#201f1f] border border-[#4d4635] text-[#d0c5af] hover:text-[#f2ca50] hover:border-[#f2ca50] transition-all hover:scale-105 shadow-md group"
              >
                <svg className="w-4 h-4 text-[#1877f2] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-xs font-label-caps tracking-wide">Facebook</span>
              </a>

              {/* TripAdvisor */}
              <a
                href="https://www.tripadvisor.com/Search?q=7+Dine+Yamuna+Vihar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find 7 Dine on TripAdvisor"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#201f1f] border border-[#4d4635] text-[#d0c5af] hover:text-[#f2ca50] hover:border-[#f2ca50] transition-all hover:scale-105 shadow-md group"
              >
                <svg className="w-4 h-4 text-[#00af87] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-5.5 13c-1.38 0-2.5-1.12-2.5-2.5S5.12 10 6.5 10s2.5 1.12 2.5 2.5S7.88 15 6.5 15zm0-3.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm11 3.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm0-3.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zM12 14c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/>
                </svg>
                <span className="text-xs font-label-caps tracking-wide">TripAdvisor</span>
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
              © 2026 7 DINE LUXURY DINING. ALL RIGHTS RESERVED.
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
                ? 'At 7 Dine Luxury Dining, we preserve the highest standards of guest privacy. All personal data collected during table reservations or order placements is processed securely in compliance with strict privacy standards and is never shared with third parties.'
                : 'Welcome to 7 Dine. By reserving a table or making an online order, you agree to our restaurant etiquette standards, cancellation window (at least 2 hours prior to reservation), and health & safety compliance rules.'}
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
