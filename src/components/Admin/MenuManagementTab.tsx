import { useState, FormEvent, useMemo } from 'react';
import { MenuItem, DietaryType } from '../../types';

interface MenuManagementTabProps {
  menu: MenuItem[];
  onAddDish: (dish: Partial<MenuItem>) => Promise<void>;
  onUpdateDish: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  onDeleteDish: (id: string) => Promise<void>;
  onToggleAvailability: (id: string) => Promise<void>;
}

export default function MenuManagementTab({
  menu,
  onAddDish,
  onUpdateDish,
  onDeleteDish,
  onToggleAvailability
}: MenuManagementTabProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  // Form State for Add / Edit
  const [name, setName] = useState('');
  const [price, setPrice] = useState(300);
  const [category, setCategory] = useState('Paneer Specialties');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800');
  const [tags, setTags] = useState('Signature, Chef Favorite');
  const [dietary, setDietary] = useState<DietaryType>('veg');
  const [isChefSpecial, setIsChefSpecial] = useState(false);

  // Extract unique categories in order
  const categories = useMemo(() => {
    const set = new Set<string>();
    menu.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set);
  }, [menu]);

  // Menu stats
  const totalItems = menu.length;
  const availableItemsCount = menu.filter((item) => item.available !== false).length;
  const soldOutItemsCount = totalItems - availableItemsCount;

  // Filter menu by search and category
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [menu, selectedCategory, search]);

  // Group filtered items by category
  const groupedMenu = useMemo(() => {
    const groups: { [key: string]: MenuItem[] } = {};
    filteredMenu.forEach((item) => {
      const cat = item.category || 'Main Course';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [filteredMenu]);

  const handleOpenAdd = () => {
    setName('');
    setPrice(350);
    setCategory('Paneer Specialties');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800');
    setTags('Chef Special');
    setDietary('veg');
    setIsChefSpecial(false);
    setEditingDish(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (dish: MenuItem) => {
    setEditingDish(dish);
    setName(dish.name);
    setPrice(dish.price);
    setCategory(dish.category || 'Main Course');
    setDescription(dish.description);
    setImage(dish.image);
    setTags(dish.tags ? dish.tags.join(', ') : '');
    setDietary(dish.dietary || 'veg');
    setIsChefSpecial(!!dish.isChefSpecial);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingDish) {
      await onUpdateDish(editingDish.id, {
        name,
        price,
        category,
        description,
        image,
        tags: tagList,
        dietary,
        isChefSpecial
      });
    } else {
      await onAddDish({
        name,
        price,
        category,
        description,
        image,
        tags: tagList,
        dietary,
        isChefSpecial
      });
    }

    setIsAddModalOpen(false);
    setEditingDish(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-[#4d4635]/40 bg-[#131313]/90 flex flex-col justify-between">
          <span className="text-[11px] text-[#d0c5af] font-label-caps uppercase">Total Menu Items</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-headline-md text-2xl font-bold text-[#f2ca50]">{totalItems}</span>
            <span className="text-xs text-[#82cba0]">100% Pure Veg</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-[#4d4635]/40 bg-[#131313]/90 flex flex-col justify-between">
          <span className="text-[11px] text-[#d0c5af] font-label-caps uppercase">Categories</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-headline-md text-2xl font-bold text-[#e5e2e1]">{categories.length}</span>
            <span className="text-xs text-[#d0c5af]">Sections</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-[#4d4635]/40 bg-[#131313]/90 flex flex-col justify-between">
          <span className="text-[11px] text-[#d0c5af] font-label-caps uppercase">Active & Available</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-headline-md text-2xl font-bold text-emerald-400">{availableItemsCount}</span>
            <span className="text-xs text-emerald-400 font-semibold">Ready</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-[#4d4635]/40 bg-[#131313]/90 flex flex-col justify-between">
          <span className="text-[11px] text-[#d0c5af] font-label-caps uppercase">Sold Out</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-headline-md text-2xl font-bold text-rose-400">{soldOutItemsCount}</span>
            <span className="text-xs text-rose-400">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 glass-card p-4 rounded-2xl border border-[#4d4635]/40 bg-[#131313]/90">
        <div className="relative flex-1 max-w-xl">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d0c5af] text-sm">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all categories by dish name, ingredient, or tag..."
            className="w-full bg-[#1c1b1b] border border-[#4d4635] text-xs text-[#e5e2e1] pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-[#f2ca50]"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#f2ca50] text-[#3c2f00] px-6 py-2.5 rounded-full font-label-caps text-xs uppercase tracking-wider font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md flex-shrink-0"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Category Pills Selector */}
      <div className="glass-card p-3 rounded-2xl border border-[#4d4635]/40 bg-[#131313]/90 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-label-caps font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-[#f2ca50] text-[#3c2f00] font-bold shadow-md'
                : 'bg-[#1c1b1b] text-[#d0c5af] hover:text-[#f2ca50] border border-[#4d4635]/50'
            }`}
          >
            <span>All Categories</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedCategory === 'all' ? 'bg-[#3c2f00]/20 text-[#3c2f00]' : 'bg-[#4d4635]/40 text-[#f2ca50]'}`}>
              {menu.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = menu.filter((m) => m.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-label-caps font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#f2ca50] text-[#3c2f00] font-bold shadow-md'
                    : 'bg-[#1c1b1b] text-[#d0c5af] hover:text-[#f2ca50] border border-[#4d4635]/50'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-[#3c2f00]/20 text-[#3c2f00]' : 'bg-[#4d4635]/40 text-[#e5e2e1]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped Category Content Sections */}
      {Object.keys(groupedMenu).length === 0 ? (
        <div className="glass-card p-12 text-center border border-[#4d4635]/40 rounded-2xl bg-[#131313]/90 space-y-3">
          <span className="material-symbols-outlined text-4xl text-[#d0c5af]">restaurant</span>
          <p className="text-sm text-[#e5e2e1] font-semibold">No menu dishes found matching your filter or search.</p>
          <p className="text-xs text-[#d0c5af]">Try clearing your search query or choosing another category.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.entries(groupedMenu) as [string, MenuItem[]][]).map(([catName, items]) => (
            <div key={catName} className="space-y-4">
              {/* Category Header Banner */}
              <div className="flex items-center justify-between border-b border-[#4d4635]/40 pb-2 px-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#005736] text-[#f2ca50] flex items-center justify-center font-bold text-sm border border-[#f2ca50]/30 shadow">
                    <span className="material-symbols-outlined text-base">restaurant_menu</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-lg text-[#f2ca50] font-bold flex items-center gap-2">
                      {catName}
                    </h3>
                    <p className="text-[11px] text-[#d0c5af]">
                      {items.length} {items.length === 1 ? 'Dish' : 'Dishes'} in this category
                    </p>
                  </div>
                </div>

                <span className="bg-[#1c1b1b] border border-[#4d4635] text-[#d0c5af] text-[11px] font-label-caps px-3 py-1 rounded-full">
                  {items.filter((i) => i.available !== false).length} Available
                </span>
              </div>

              {/* Category Dishes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="glass-card p-4 border border-[#4d4635]/40 rounded-2xl bg-[#131313]/90 flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-[#f2ca50]/50 transition-all duration-300 shadow-lg"
                  >
                    {/* Dish Image Header */}
                    <div className="relative h-44 rounded-xl overflow-hidden bg-[#1c1b1b]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                        {item.isChefSpecial && (
                          <span className="bg-[#005736] text-[#82cba0] text-[10px] font-label-caps px-2 py-0.5 rounded-full border border-[#82cba0]/30 shadow">
                            Chef Special
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-label-caps px-2 py-0.5 rounded-full border shadow ${
                            item.available !== false
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {item.available !== false ? 'Available' : 'Sold Out'}
                        </span>
                      </div>

                      {/* Veg Symbol Badge */}
                      <div className="absolute top-2 left-2 bg-[#131313]/90 backdrop-blur p-1 rounded-lg border border-[#4d4635]">
                        <div className="w-3.5 h-3.5 border border-emerald-500 flex items-center justify-center p-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        </div>
                      </div>
                    </div>

                    {/* Dish Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-headline-md text-sm text-[#e5e2e1] font-bold line-clamp-1">{item.name}</h4>
                        <span className="font-price-display text-sm font-bold text-[#f2ca50] whitespace-nowrap">₹{item.price}</span>
                      </div>
                      <p className="text-[11px] text-[#d0c5af] line-clamp-2 leading-relaxed">{item.description}</p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="bg-[#1c1b1b] border border-[#4d4635]/40 text-[#d0c5af] text-[9px] px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions & Availability Toggle */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-[#4d4635]/30">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#d0c5af] font-label-caps uppercase font-semibold">Available</span>
                        <button
                          onClick={() => onToggleAvailability(item.id)}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            item.available !== false ? 'bg-[#005736]' : 'bg-neutral-700'
                          }`}
                          title={item.available !== false ? 'Click to mark Sold Out' : 'Click to mark Available'}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              item.available !== false ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-[#d0c5af] hover:text-[#f2ca50] bg-[#1c1b1b] border border-[#4d4635] rounded-lg text-xs transition-colors"
                          title="Edit Dish"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteDish(item.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 bg-[#1c1b1b] border border-[#4d4635] rounded-lg text-xs transition-colors"
                          title="Delete Dish"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0e0e0e]/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="glass-card max-w-lg w-full p-6 border border-[#f2ca50]/40 rounded-2xl bg-[#1c1b1b] shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#d0c5af] hover:text-[#f2ca50]"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h3 className="font-headline-md text-xl text-[#f2ca50] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">restaurant</span>
              <span>{editingDish ? 'Edit Gourmet Dish' : 'Add New Gourmet Dish'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Malai Paneer Tikka"
                  className="w-full bg-[#131313] border border-[#4d4635] text-[#e5e2e1] px-3 py-2 text-xs outline-none rounded-xl focus:border-[#f2ca50]"
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-[#131313] border border-[#4d4635] text-[#e5e2e1] px-3 py-2 text-xs outline-none rounded-xl focus:border-[#f2ca50]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">Category *</label>
                <input
                  type="text"
                  required
                  list="category-suggestions"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Paneer Specialties, Chinese"
                  className="w-full bg-[#131313] border border-[#4d4635] text-[#e5e2e1] px-3 py-2 text-xs outline-none rounded-xl focus:border-[#f2ca50]"
                />
                <datalist id="category-suggestions">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Signature, Spicy, Charcoal"
                  className="w-full bg-[#131313] border border-[#4d4635] text-[#e5e2e1] px-3 py-2 text-xs outline-none rounded-xl focus:border-[#f2ca50]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">Image URL *</label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-[#131313] border border-[#4d4635] text-[#e5e2e1] px-3 py-2 text-xs outline-none rounded-xl focus:border-[#f2ca50]"
              />
            </div>

            <div>
              <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Exquisite description of ingredients and preparation method..."
                className="w-full bg-[#131313] border border-[#4d4635] text-[#e5e2e1] p-3 text-xs outline-none rounded-xl focus:border-[#f2ca50]"
              ></textarea>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-2 text-xs text-[#e5e2e1] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChefSpecial}
                  onChange={(e) => setIsChefSpecial(e.target.checked)}
                  className="rounded text-[#f2ca50] focus:ring-0"
                />
                <span>Mark as Chef's Special</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#f2ca50] text-[#3c2f00] py-3 rounded-full font-label-caps text-xs uppercase tracking-wider font-bold hover:opacity-90 transition-all shadow-md mt-2"
            >
              {editingDish ? 'Update Dish' : 'Publish Dish To Menu'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

