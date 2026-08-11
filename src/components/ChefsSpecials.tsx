import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { FULL_MENU } from '../data/restaurantData';
import { MenuItem } from '../types';

interface ChefsSpecialsProps {
  onAddToCart: (item: MenuItem) => void;
  onOpenFullMenu: () => void;
}

export default function ChefsSpecials({ onAddToCart, onOpenFullMenu }: ChefsSpecialsProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<'bestsellers' | 'signature' | 'combos'>('bestsellers');

  const filteredItems = FULL_MENU.filter((item) => {
    if (activeCategory === 'signature') {
      return item.isChefSpecial || item.name.toLowerCase().includes('signature');
    }
    if (activeCategory === 'combos') {
      return item.category.includes('Combo') || item.name.toLowerCase().includes('combo');
    }
    // Default 'bestsellers'
    return (
      item.isChefSpecial ||
      item.tags.some((t) =>
        t.toLowerCase().includes('bestseller') ||
        t.toLowerCase().includes('popular') ||
        t.toLowerCase().includes('special')
      )
    );
  });

  // Limit vertical list to 6 dishes max
  const displayedItems = filteredItems.slice(0, 6);

  const handleScrollVertical = (direction: 'up' | 'down') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'up' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#0e0e0e]" id="menu">
      {/* Header Bar */}
      <div className="px-4 sm:px-8 md:px-16 max-w-[1100px] mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#005736]/40 border border-[#82cba0]/40 text-[#82cba0] font-label-caps text-xs tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block animate-pulse"></span>
              <span>100% Pure Vegetarian Kitchen</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-[#e5e2e1] mt-1">
              Chef's Specials & Bestsellers
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#201f1f] p-1.5 border border-[#4d4635]/40 rounded-full">
              <button
                onClick={() => setActiveCategory('bestsellers')}
                className={`px-4 py-1.5 rounded-full font-label-caps text-xs transition-all ${
                  activeCategory === 'bestsellers'
                    ? 'bg-[#f2ca50] text-[#3c2f00] font-semibold shadow-md'
                    : 'text-[#d0c5af] hover:text-[#f2ca50]'
                }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveCategory('signature')}
                className={`px-4 py-1.5 rounded-full font-label-caps text-xs transition-all ${
                  activeCategory === 'signature'
                    ? 'bg-[#8dd6ab] text-[#003921] font-semibold shadow-md'
                    : 'text-[#d0c5af] hover:text-[#8dd6ab]'
                }`}
              >
                Signature Specials
              </button>
              <button
                onClick={() => setActiveCategory('combos')}
                className={`px-4 py-1.5 rounded-full font-label-caps text-xs transition-all ${
                  activeCategory === 'combos'
                    ? 'bg-[#f2ca50] text-[#3c2f00] font-semibold shadow-md'
                    : 'text-[#d0c5af] hover:text-[#f2ca50]'
                }`}
              >
                Party Combos
              </button>
            </div>

            {/* Vertical Scroll Control Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleScrollVertical('up')}
                aria-label="Scroll Up Dishes"
                className="p-2.5 border border-[#4d4635] text-[#d0c5af] hover:text-[#f2ca50] hover:border-[#f2ca50] transition-all active:scale-95 bg-[#201f1f] rounded-full shadow-md"
              >
                <span className="material-symbols-outlined text-xl">keyboard_arrow_up</span>
              </button>
              <button
                onClick={() => handleScrollVertical('down')}
                aria-label="Scroll Down Dishes"
                className="p-2.5 border border-[#4d4635] text-[#d0c5af] hover:text-[#f2ca50] hover:border-[#f2ca50] transition-all active:scale-95 bg-[#201f1f] rounded-full shadow-md"
              >
                <span className="material-symbols-outlined text-xl">keyboard_arrow_down</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Scroll Menu Container (Shows up to 6 dishes) */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 md:px-16">
        <div className="p-3 bg-[#131313]/60 border border-[#4d4635]/40 rounded-3xl backdrop-blur-md shadow-2xl">
          <div
            ref={scrollContainerRef}
            className="flex flex-col gap-3.5 max-h-[570px] overflow-y-auto pr-2 scroll-smooth custom-scrollbar"
          >
            {displayedItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{
                  y: -5,
                  boxShadow: '0 12px 28px -5px rgba(242, 202, 80, 0.22), 0 0 16px 0 rgba(242, 202, 80, 0.15)',
                  borderColor: 'rgba(242, 202, 80, 0.6)',
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="glass-card p-4 sm:p-5 border border-[#f2ca50]/20 rounded-2xl bg-[#201f1f]/90 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-xl group cursor-pointer"
              >
                {/* Left: Dish Image & Badges */}
                <div className="relative w-full sm:w-36 h-32 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                {item.isChefSpecial && (
                  <span className="bg-[#3c2f00]/90 text-[#f2ca50] border border-[#f2ca50]/30 text-[9px] font-label-caps px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                    Chef Special
                  </span>
                )}
                  </div>
                </div>

                {/* Center: Details */}
                <div className="flex-1 min-w-0 w-full space-y-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="font-headline-md text-lg sm:text-xl text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors truncate">
                      {item.name}
                    </h3>
                    <span className="font-price-display text-xl text-[#f2ca50] font-bold whitespace-nowrap">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="font-body-md text-xs sm:text-sm text-[#d0c5af] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-label-caps text-[#d0c5af]/80 bg-[#131313] px-2.5 py-0.5 rounded-full border border-[#4d4635]/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Add to Order Button */}
                <div className="w-full sm:w-auto flex-shrink-0 pt-1 sm:pt-0">
                  <button
                    onClick={() => onAddToCart(item)}
                    className="w-full sm:w-auto text-[#8dd6ab] hover:text-[#f2ca50] font-label-caps text-xs uppercase tracking-wider flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl border border-[#8dd6ab]/30 hover:border-[#f2ca50] bg-[#131313]/90 hover:bg-[#201f1f] transition-all shadow-md group/btn"
                  >
                    <span>Add To Order</span>
                    <span className="material-symbols-outlined text-base group-hover/btn:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View Full Menu Button right after 6 dishes */}
        <div className="mt-8 text-center">
          <button
            onClick={onOpenFullMenu}
            className="shimmer-btn bg-[#201f1f] border-2 border-[#f2ca50] text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#3c2f00] px-10 py-4 rounded-full font-label-caps text-sm uppercase tracking-widest transition-all duration-500 shadow-2xl inline-flex items-center gap-3 font-bold"
          >
            <span>View Complete Gourmet Menu</span>
            <span className="material-symbols-outlined text-xl">restaurant_menu</span>
          </button>
        </div>
      </div>
    </section>
  );
}

