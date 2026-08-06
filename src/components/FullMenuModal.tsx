import { useState } from 'react';
import { FULL_MENU } from '../data/restaurantData';
import { MenuItem } from '../types';

interface FullMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem) => void;
}

export default function FullMenuModal({ isOpen, onClose, onAddToCart }: FullMenuModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(FULL_MENU.map((item) => item.category)))];

  const filteredMenu = FULL_MENU.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/90 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-4xl w-full h-[90vh] flex flex-col border border-[#f2ca50]/40 rounded-2xl relative my-4 bg-[#1c1b1b] shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#4d4635]/50 flex justify-between items-center bg-[#131313] rounded-t-2xl">
          <div>
            <h2 className="font-headline-md text-2xl text-[#e5e2e1]">Complete Restaurant Menu</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#d0c5af] hover:text-[#f2ca50] focus:outline-none"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-[#4d4635]/40 bg-[#131313]/60 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#d0c5af] text-xl">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, ingredients (e.g., Paneer, Truffle, Biryani)..."
                className="w-full bg-[#201f1f] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] pl-10 pr-4 py-2 text-sm outline-none rounded-full"
              />
            </div>

            {/* Pure Veg Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0a2016] border border-[#82cba0]/40 rounded-full text-[#82cba0] text-xs font-label-caps whitespace-nowrap self-start sm:self-auto shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#82cba0] animate-pulse"></span>
              <span className="font-semibold tracking-wider">100% Pure Veg</span>
            </div>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 font-label-caps text-xs border rounded-full transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#f2ca50] text-[#3c2f00] border-[#f2ca50] font-semibold shadow-sm'
                    : 'bg-[#201f1f] text-[#d0c5af] border-[#4d4635] hover:border-[#f2ca50]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMenu.length === 0 ? (
            <div className="col-span-full py-16 text-center text-[#d0c5af] space-y-2">
              <span className="material-symbols-outlined text-4xl">search_off</span>
              <p className="font-body-md text-base">No culinary items match your filter.</p>
            </div>
          ) : (
            filteredMenu.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 border border-[#4d4635]/40 flex gap-4 items-center justify-between bg-[#131313]/80 hover:border-[#f2ca50]/60 transition-all group rounded-xl shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0 grayscale-[0.2] group-hover:grayscale-0 transition-all"
                />

                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex justify-between items-baseline gap-2">
                    <h4 className="font-headline-md text-base text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors truncate">
                      {item.name}
                    </h4>
                    <span className="font-price-display text-base text-[#f2ca50]">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="font-body-md text-xs text-[#d0c5af] line-clamp-2 mt-1">
                    {item.description}
                  </p>

                  <span className="inline-block mt-2 text-[9px] font-label-caps px-2.5 py-0.5 bg-[#201f1f] text-[#8dd6ab] border border-[#8dd6ab]/30 rounded-full">
                    {item.category}
                  </span>
                </div>

                <button
                  onClick={() => onAddToCart(item)}
                  className="bg-[#201f1f] border border-[#f2ca50] text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#3c2f00] p-2.5 rounded-xl transition-all flex-shrink-0 shadow-sm"
                  aria-label={`Add ${item.name} to order`}
                >
                  <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#4d4635]/50 bg-[#131313] flex justify-between items-center text-xs text-[#d0c5af] rounded-b-2xl">
          <span>Showing {filteredMenu.length} items</span>
          <button
            onClick={onClose}
            className="bg-[#f2ca50] text-[#3c2f00] px-6 py-2.5 rounded-full font-label-caps text-xs uppercase font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            Close Menu
          </button>
        </div>

      </div>
    </div>
  );
}
