import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  onOpenReservation: () => void;
  onOpenCart: () => void;
  onOpenFullMenu: () => void;
  cartCount: number;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'menu', label: 'Gallery & Menu' },
  { id: 'offers', label: 'Special Offers' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ onOpenReservation, onOpenCart, onOpenFullMenu, cartCount }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Check current section
      const sections = ['about', 'menu', 'offers', 'reviews', 'contact'];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#131313]/90 backdrop-blur-xl border-b border-[#f2ca50]/20 py-3 shadow-2xl'
          : 'bg-[#131313]/80 backdrop-blur-md border-b border-[#f2ca50]/15 py-4'
      }`}
    >
      <div className="flex justify-between items-center px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1280px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollTo('home')}
            className="group focus:outline-none"
          >
            <BrandLogo size="md" showText={false} />
          </button>
          
          {/* 100% Pure Vegetarian Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-[#005736]/40 border border-[#82cba0]/40 rounded-full text-[#82cba0] text-[11px] font-label-caps tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block animate-pulse"></span>
            <span>100% Pure Veg</span>
          </div>
        </div>

        {/* Desktop Links - Animated Glass Capsule Bar */}
        <div className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-[#1c1b1b]/70 backdrop-blur-md border border-[#f2ca50]/25 shadow-lg shadow-black/40">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`relative px-3.5 xl:px-4 py-1.5 rounded-full font-label-caps text-[11px] xl:text-xs uppercase tracking-wider transition-colors duration-300 focus:outline-none whitespace-nowrap ${
                  isActive
                    ? 'text-[#f2ca50] font-semibold'
                    : 'text-[#d0c5af] hover:text-[#f2ca50]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbarActiveGlassTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f2ca50]/25 via-[#f2ca50]/15 to-[#f2ca50]/25 border border-[#f2ca50]/60 backdrop-blur-md shadow-[0_0_15px_rgba(242,202,80,0.3)]"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 z-20">
          {/* Cart Icon */}
          <button
            id="navbar-cart-btn"
            data-cart-basket="true"
            onClick={onOpenCart}
            aria-label="View Order"
            className="relative p-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors focus:outline-none will-change-transform"
          >
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#f2ca50] text-[#3c2f00] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Book Now Button */}
          <button
            onClick={onOpenReservation}
            className="hidden sm:inline-block bg-[#f2ca50] text-[#3c2f00] px-5 lg:px-8 py-2.5 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-all duration-300 active:scale-95 shadow-md shadow-[#f2ca50]/10"
          >
            Book Now
          </button>

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#e5e2e1] hover:text-[#f2ca50] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1c1b1b]/95 backdrop-blur-xl border-b border-[#f2ca50]/20 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-2 font-label-caps text-label-caps uppercase">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-left py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? 'bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/50 backdrop-blur-md font-semibold'
                      : 'text-[#d0c5af] hover:text-[#f2ca50] hover:bg-[#201f1f]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#f2ca50] shadow-[0_0_8px_#f2ca50]"></span>
                  )}
                </button>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFullMenu();
              }}
              className="text-left text-[#f2ca50] py-2.5 px-4 rounded-xl border border-[#f2ca50]/30 bg-[#201f1f]/80 flex items-center justify-between"
            >
              <span>Explore Full Menu</span>
              <span className="material-symbols-outlined text-sm">restaurant_menu</span>
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="w-full bg-[#f2ca50] text-[#3c2f00] py-3 rounded-full font-label-caps text-label-caps uppercase text-center tracking-widest shadow-md"
            >
              Book Table
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCart();
              }}
              className="w-full border border-[#f2ca50] text-[#f2ca50] py-3 rounded-full font-label-caps text-label-caps uppercase text-center tracking-widest"
            >
              View Order ({cartCount})
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
