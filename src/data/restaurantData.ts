// All food dish photographs in this application are sourced from Unsplash (https://unsplash.com)
// under the Unsplash License (free, non-copyrighted, royalty-free for commercial & non-commercial use).

import { MenuItem, Review, SpecialOffer } from '../types';

export const CHEFS_SPECIALS: MenuItem[] = [
  {
    id: 'spec-1',
    name: 'Dal Makhani (Signature)',
    price: 249,
    description: 'Slow-cooked black lentils overnight with authentic butter & cream, 7 Dine style.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    category: 'Dal/Lentil Dishes',
    tags: ['Overnight Dum Cooked', 'Rich & Creamy', 'Bestseller'],
    dietary: 'veg',
    isChefSpecial: true
  },
  {
    id: 'spec-2',
    name: 'Shahi Malai Kofta',
    price: 319,
    description: 'Soft cottage cheese & dry fruit dumplings in a velvety cashew and saffron gravy.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800',
    category: 'Gravy Chaap & Mushroom',
    tags: ['Velvety Rich', 'Royal Special'],
    dietary: 'veg',
    isChefSpecial: true
  },
  {
    id: 'spec-3',
    name: 'Hydrabadi Biryani (with Raita)',
    price: 239,
    description: 'Fragrant long-grain basmati rice layered with aromatic spices and served with fresh raita.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
    category: 'Rice & Biryani',
    tags: ['Dum Biryani', 'Served with Raita', 'Aromatic'],
    dietary: 'veg',
    isChefSpecial: true
  },
  {
    id: 'spec-4',
    name: 'Malai Chaap Roll',
    price: 259,
    description: 'Tandoor-charred soya chaap marinated in creamy malai & aromatic spices wrapped in rumali.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    category: 'Tandoori Rolls',
    tags: ['Tandoori Flame', 'Creamy Malai'],
    dietary: 'veg',
    isChefSpecial: true
  },
  {
    id: 'spec-5',
    name: 'Honey Chilli Potato',
    price: 229,
    description: 'Crispy fried potato fingers tossed in a sweet & spicy honey chili glaze topped with sesame.',
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Crunchy', 'Honey Glaze'],
    dietary: 'veg',
    isChefSpecial: true
  },
  {
    id: 'spec-6',
    name: 'Paneer Malai Tikka Roll',
    price: 289,
    description: 'Succulent paneer cubes tossed in rich malai marinade, grilled over charcoal.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800',
    category: 'Tandoori Rolls',
    tags: ['Charcoal Smoked', 'Chef Secret'],
    dietary: 'veg',
    isChefSpecial: true
  }
];

export const FULL_MENU: MenuItem[] = [
  ...CHEFS_SPECIALS,

  // CHINESE
  {
    id: 'c-1',
    name: 'Veg Chowmein',
    price: 189,
    description: 'Classic wok-tossed noodles with fresh shredded vegetables & soy sauce.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Street Style', 'Wok Tossed'],
    dietary: 'veg'
  },
  {
    id: 'c-2',
    name: 'Hakka Noodles',
    price: 199,
    description: 'Indo-Chinese style Hakka noodles sautéed with bell peppers and garlic.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Garlic Infused', 'Popular'],
    dietary: 'veg'
  },
  {
    id: 'c-3',
    name: 'Butter Chowmein',
    price: 239,
    description: 'Rich chowmein noodles sautéed generously in amul butter.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Amul Butter', 'Indulgent'],
    dietary: 'veg'
  },
  {
    id: 'c-4',
    name: 'Chilli Garlic Chowmein',
    price: 249,
    description: 'Spicy wok noodles infused with crushed red chillies & garlic.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Spicy', 'Chilli Garlic'],
    dietary: 'veg'
  },
  {
    id: 'c-5',
    name: 'Singapuri Chowmein',
    price: 249,
    description: 'Special curry-flavored wok noodles with vegetables & crunchy veggies.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Flavorful', 'Tangy'],
    dietary: 'veg'
  },
  {
    id: 'c-6',
    name: 'Paneer Chowmein',
    price: 259,
    description: 'Delicious noodles tossed with golden fried paneer cubes.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Fresh Paneer'],
    dietary: 'veg'
  },
  {
    id: 'c-7',
    name: 'Butter Paneer Chowmein',
    price: 259,
    description: 'Rich chowmein tossed with fresh paneer & loaded butter.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Butter Rich', 'Paneer Special'],
    dietary: 'veg'
  },
  {
    id: 'c-8',
    name: 'French Fries',
    price: 189,
    description: 'Golden, crispy salt-seasoned potato fries served with dip.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Crispy Snacking'],
    dietary: 'veg'
  },
  {
    id: 'c-9',
    name: 'Chilli Potato',
    price: 209,
    description: 'Crispy potatoes tossed in hot chili garlic sauce.',
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Spicy', 'Crispy'],
    dietary: 'veg'
  },
  {
    id: 'c-10',
    name: 'Manchurian (Dry)',
    price: 239,
    description: 'Crispy vegetable balls tossed with onion, ginger, garlic & soya sauce.',
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Indo-Chinese Classic'],
    dietary: 'veg'
  },
  {
    id: 'c-11',
    name: 'Manchurian (Gravy)',
    price: 249,
    description: 'Veg Manchurian dumplings simmered in dark savory Chinese gravy.',
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Rich Gravy'],
    dietary: 'veg'
  },
  {
    id: 'c-12',
    name: 'Paneer Manchurian',
    price: 269,
    description: 'Crispy paneer cubes in spicy garlic manchurian reduction.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Paneer Classic'],
    dietary: 'veg'
  },
  {
    id: 'c-13',
    name: 'Chilli Chaap',
    price: 269,
    description: 'Tender soya chaap sautéed with spring onions and green chillies.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Soya Chaap Special'],
    dietary: 'veg'
  },
  {
    id: 'c-14',
    name: 'Chilli Mushroom',
    price: 279,
    description: 'Fresh button mushrooms tossed in hot Schezwan chilli pepper oil.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Fresh Mushroom'],
    dietary: 'veg'
  },
  {
    id: 'c-15',
    name: 'Chilli Paneer (Gravy)',
    price: 269,
    description: 'Cottage cheese cubes tossed with capsicum in rich chili soya gravy.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['All-Time Favorite'],
    dietary: 'veg'
  },
  {
    id: 'c-16',
    name: 'Chilli Paneer (Dry)',
    price: 289,
    description: 'Pan-fried cottage cheese with crunchy bell peppers and green chillies.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Crispy Starter'],
    dietary: 'veg'
  },
  {
    id: 'c-17',
    name: 'Crispy Sweet Corn',
    price: 239,
    description: 'Golden sweet corn kernels deep fried & seasoned with herbs & chillies.',
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Crunchy Delight'],
    dietary: 'veg'
  },
  {
    id: 'c-18',
    name: 'Combo - Fried Rice + Manchurian + Cold Drink',
    price: 279,
    description: 'Complete Chinese meal with wok fried rice, manchurian gravy & refreshing drink.',
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Value Combo', 'Full Meal'],
    dietary: 'veg'
  },
  {
    id: 'c-19',
    name: 'Combo - Hakka Noodles + Manchurian + Cold Drink',
    price: 269,
    description: 'Hakka noodles served with hot manchurian gravy and chilled cold drink.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800',
    category: 'Chinese',
    tags: ['Value Combo'],
    dietary: 'veg'
  },

  // ROTI / PARATHA / NAAN
  {
    id: 'r-1',
    name: 'Rumali Roti',
    price: 10,
    description: 'Paper-thin hand-spun traditional flatbread.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800',
    category: 'Roti/Paratha/Naan',
    tags: ['Paper Thin'],
    dietary: 'veg'
  },
  {
    id: 'r-2',
    name: 'Tawa Roti',
    price: 12,
    description: 'Fresh whole wheat Indian flatbread prepared on tawa.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
    category: 'Roti/Paratha/Naan',
    tags: ['Whole Wheat'],
    dietary: 'veg'
  },
  {
    id: 'r-3',
    name: 'Butter Roti',
    price: 20,
    description: 'Tandoori wheat roti glazed generously with fresh butter.',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=800',
    category: 'Roti/Paratha/Naan',
    tags: ['Butter Glazed'],
    dietary: 'veg'
  },
  {
    id: 'r-4',
    name: 'Missi Roti',
    price: 35,
    description: 'Spiced gram flour flatbread flavored with onion and green chillies.',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=800',
    category: 'Roti/Paratha/Naan',
    tags: ['Gram Flour'],
    dietary: 'veg'
  },
  {
    id: 'r-5',
    name: 'Butter Naan',
    price: 45,
    description: 'Soft refined flour flatbread baked in clay tandoor with melting butter.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
    category: 'Roti/Paratha/Naan',
    tags: ['Clay Tandoor', 'Popular'],
    dietary: 'veg'
  },
  {
    id: 'r-6',
    name: 'Garlic Naan',
    price: 50,
    description: 'Tandoori naan topped with roasted minced garlic & fresh coriander.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    category: 'Roti/Paratha/Naan',
    tags: ['Garlic Butter'],
    dietary: 'veg'
  },
  {
    id: 'r-7',
    name: 'Aloo Pyaaz Naan',
    price: 55,
    description: 'Stuffed naan with spicy mashed potato and onion mix.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    category: 'Roti/Paratha/Naan',
    tags: ['Spicy Potato & Onion'],
    dietary: 'veg'
  },
  {
    id: 'r-8',
    name: 'Paneer Naan',
    price: 60,
    description: 'Leavened flatbread generously stuffed with spiced cottage cheese.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800',
    category: 'Roti/Paratha/Naan',
    tags: ['Stuffed Paneer'],
    dietary: 'veg'
  },
  {
    id: 'r-9',
    name: 'Lachha Paratha',
    price: 45,
    description: 'Multi-layered crispy whole wheat paratha baked in tandoor.',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=800',
    category: 'Roti/Paratha/Naan',
    tags: ['Crispy Layers'],
    dietary: 'veg'
  },
  {
    id: 'r-10',
    name: 'Paneer Paratha',
    price: 60,
    description: 'Flaky paratha stuffed with seasoned cottage cheese & roasted cumin.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800',
    category: 'Roti/Paratha/Naan',
    tags: ['Paneer Stuffed'],
    dietary: 'veg'
  },

  // GRAVY CHAAP & MUSHROOM
  {
    id: 'g-1',
    name: 'Shahi Chaap',
    price: 239,
    description: 'Rich soya chaap simmered in creamy royal cashew & tomato gravy.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    category: 'Gravy Chaap & Mushroom',
    tags: ['Royal Creamy'],
    dietary: 'veg'
  },
  {
    id: 'g-2',
    name: 'Chaap Butter Masala',
    price: 239,
    description: 'Tandoori soya chaap cooked in rich buttery tomato onion gravy.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800',
    category: 'Gravy Chaap & Mushroom',
    tags: ['Butter Masala', 'Bestseller'],
    dietary: 'veg'
  },
  {
    id: 'g-3',
    name: 'Kadhai Chaap',
    price: 259,
    description: 'Soya chaap tossed with capsicum and fresh pounded kadhai spices.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800',
    category: 'Gravy Chaap & Mushroom',
    tags: ['Kadhai Spices'],
    dietary: 'veg'
  },
  {
    id: 'g-4',
    name: 'Mushroom Masala',
    price: 259,
    description: 'Plump button mushrooms cooked in thick onion tomato gravy.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    category: 'Gravy Chaap & Mushroom',
    tags: ['Fresh Mushroom'],
    dietary: 'veg'
  },
  {
    id: 'g-5',
    name: 'Matar Mushroom',
    price: 259,
    description: 'Tender green peas & fresh mushrooms cooked in aromatic North Indian gravy.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    category: 'Gravy Chaap & Mushroom',
    tags: ['Peas & Mushroom'],
    dietary: 'veg'
  },
  {
    id: 'g-6',
    name: 'Dum Aloo',
    price: 219,
    description: 'Baby potatoes slow dum-cooked in spiced yoghurt gravy.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800',
    category: 'Gravy Chaap & Mushroom',
    tags: ['Classic Kashmiri Style'],
    dietary: 'veg'
  },
  {
    id: 'g-7',
    name: 'Malai Kofta',
    price: 269,
    description: 'Golden paneer-potato dumplings simmered in rich cashew cream gravy.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800',
    category: 'Gravy Chaap & Mushroom',
    tags: ['Creamy & Sweet'],
    dietary: 'veg'
  },

  // DAL / LENTIL DISHES
  {
    id: 'd-1',
    name: 'Yellow Dal Tadka',
    price: 229,
    description: 'Yellow arhar dal tempered with ghee, garlic, cumin & red chillies.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    category: 'Dal/Lentil Dishes',
    tags: ['Desi Ghee Tadka'],
    dietary: 'veg'
  },
  {
    id: 'd-2',
    name: 'Dal Handi',
    price: 259,
    description: 'Black lentil & kidney beans cooked slow in handi with aromatic herbs.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    category: 'Dal/Lentil Dishes',
    tags: ['Handi Special'],
    dietary: 'veg'
  },
  {
    id: 'd-3',
    name: 'Rajma',
    price: 229,
    description: 'Red kidney beans slow cooked in rich onion tomato masala sauce.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    category: 'Dal/Lentil Dishes',
    tags: ['Home Style'],
    dietary: 'veg'
  },
  {
    id: 'd-4',
    name: 'Chana Masala',
    price: 229,
    description: 'Tangy chickpea curry spiced with pomegranate powder & amchur.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800',
    category: 'Dal/Lentil Dishes',
    tags: ['Pint-Sized Tangy'],
    dietary: 'veg'
  },

  // TANDOORI ROLLS
  {
    id: 'tr-1',
    name: 'Spring Roll',
    price: 239,
    description: 'Crispy fried rolls stuffed with shredded vegetables & noodles.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    category: 'Tandoori Rolls',
    tags: ['Crispy Crust'],
    dietary: 'veg'
  },
  {
    id: 'tr-2',
    name: 'Chatpati Chaap Roll',
    price: 249,
    description: 'Spicy tangy chaap wrapped with mint chutney and fresh onion rings.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    category: 'Tandoori Rolls',
    tags: ['Spicy Tangy'],
    dietary: 'veg'
  },
  {
    id: 'tr-3',
    name: 'Achari Chaap Roll',
    price: 259,
    description: 'Soya chaap steeped in pickled spice marinade, grilled over coals.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    category: 'Tandoori Rolls',
    tags: ['Achari Flavor'],
    dietary: 'veg'
  },
  {
    id: 'tr-4',
    name: 'Paneer Tikka Roll',
    price: 289,
    description: 'Smoked tandoori paneer wrapped in warm flatbread with mint sauce.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800',
    category: 'Tandoori Rolls',
    tags: ['Tandoori Paneer'],
    dietary: 'veg'
  },

  // TAWA SPECIAL
  {
    id: 'tw-1',
    name: 'Tawa Chaap Masala',
    price: 259,
    description: 'Soya chaap tossed on iron tawa with minced tomatoes, chillies & spices.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800',
    category: 'Tawa Special',
    tags: ['Street Style Tawa'],
    dietary: 'veg'
  },
  {
    id: 'tw-2',
    name: 'Tawa Paneer Masala',
    price: 269,
    description: 'Fresh paneer cubes seared on open tawa with onion tomato reduction.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800',
    category: 'Tawa Special',
    tags: ['Iron Tawa Special'],
    dietary: 'veg'
  },
  {
    id: 'tw-3',
    name: 'Tawa Pulao',
    price: 279,
    description: 'Spicy Mumbai-style street pulao cooked with butter & pav bhaji masala.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
    category: 'Tawa Special',
    tags: ['Mumbai Street Style'],
    dietary: 'veg'
  },

  // RICE & BIRYANI
  {
    id: 'rb-1',
    name: 'Jeera Rice',
    price: 169,
    description: 'Steamed basmati rice tempered with golden cumin seeds & desi ghee.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
    category: 'Rice & Biryani',
    tags: ['Basmati'],
    dietary: 'veg'
  },
  {
    id: 'rb-2',
    name: 'Veg Biryani (with Raita)',
    price: 209,
    description: 'Dum cooked rice with seasonal veggies, saffron and served with boondi raita.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
    category: 'Rice & Biryani',
    tags: ['Dum Biryani'],
    dietary: 'veg'
  },
  {
    id: 'rb-3',
    name: 'Paneer Fried Rice',
    price: 239,
    description: 'Basmati rice wok tossed with paneer cubes, spring onions & soy.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
    category: 'Rice & Biryani',
    tags: ['Chinese Style'],
    dietary: 'veg'
  },

  // BEVERAGES
  {
    id: 'b-1',
    name: 'Mojito',
    price: 99,
    description: 'Refreshing mint & lime cooler crushed with ice and sparkling soda.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
    category: 'Beverages',
    tags: ['Fresh Mint', 'Chilled'],
    dietary: 'vegan'
  },
  {
    id: 'b-2',
    name: 'Blue Lagoon',
    price: 109,
    description: 'Vibrant blue curaçao soda infused with lemon & crushed ice.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    category: 'Beverages',
    tags: ['Mocktail'],
    dietary: 'vegan'
  },
  {
    id: 'b-3',
    name: 'Cold Coffee',
    price: 109,
    description: 'Thick blended dark roasted coffee with cold milk and cocoa powder.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800',
    category: 'Beverages',
    tags: ['Thick & Creamy'],
    dietary: 'veg'
  },
  {
    id: 'b-4',
    name: 'Cold Coffee Vanilla',
    price: 119,
    description: 'Rich cold coffee blended with vanilla bean ice cream scoop.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    category: 'Beverages',
    tags: ['Vanilla Ice Cream'],
    dietary: 'veg'
  },
  {
    id: 'b-5',
    name: 'Masala Tea',
    price: 25,
    description: 'Authentic Indian chai brewed with cardamom, ginger and spices.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    category: 'Beverages',
    tags: ['Desi Chai'],
    dietary: 'veg'
  },

  // SOUP
  {
    id: 's-1',
    name: 'Soup Veg Manchow',
    price: 129,
    description: 'Hot garlic vegetable soup topped with crispy fried noodles.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=800',
    category: 'Soup',
    tags: ['Crispy Noodles'],
    dietary: 'veg'
  },
  {
    id: 's-2',
    name: 'Hot and Sour Soup',
    price: 149,
    description: 'Tangy and spicy thick broth with mushrooms, tofu & bamboo shoots.',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=800',
    category: 'Soup',
    tags: ['Spicy & Tangy'],
    dietary: 'veg'
  },

  // PASTA
  {
    id: 'p-1',
    name: 'Red Sauce Pasta',
    price: 189,
    description: 'Penne pasta tossed in tangy Italian arrabbiata tomato basil sauce.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3def6166739?auto=format&fit=crop&q=80&w=800',
    category: 'Pasta',
    tags: ['Arrabbiata'],
    dietary: 'veg'
  },
  {
    id: 'p-2',
    name: 'White Sauce Pasta',
    price: 209,
    description: 'Creamy alfredo sauce penne with garlic, herbs & mozzarella cheese.',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=800',
    category: 'Pasta',
    tags: ['Cheesy Alfredo'],
    dietary: 'veg'
  },
  {
    id: 'p-3',
    name: 'Double Cheese Pasta',
    price: 249,
    description: 'Loaded penne pasta with melted processed cheese and liquid cheddar.',
    image: 'https://images.unsplash.com/photo-1555949258-eb67b280c05b?auto=format&fit=crop&q=80&w=800',
    category: 'Pasta',
    tags: ['Double Cheese'],
    dietary: 'veg'
  },

  // DESSERTS
  {
    id: 'des-1',
    name: 'Brownie with Hot Chocolate & Vanilla Ice Cream',
    price: 239,
    description: 'Warm fudge brownie topped with rich hot chocolate syrup & vanilla ice cream.',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=800',
    category: 'Desserts',
    tags: ['Sizzling Favorite'],
    dietary: 'veg'
  },
  {
    id: 'des-2',
    name: 'Gulab Jamun (2 pc)',
    price: 59,
    description: 'Soft milk solids dumplings fried golden and soaked in cardamom sugar syrup.',
    image: 'https://images.unsplash.com/photo-1605888967806-3831f26a11e5?auto=format&fit=crop&q=80&w=800',
    category: 'Desserts',
    tags: ['Hot Dessert'],
    dietary: 'veg'
  },

  // PARTY COMBOS
  {
    id: 'pc-1',
    name: 'Party Combo 1 (For Small Gathering)',
    price: 625,
    description: 'Includes 3 Starters + 3 Main Course + 3 Types of Breads + Choice of Rice + Raita + Green Salad + 1 Beverage + 1 Dessert.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800',
    category: 'Party Combos',
    tags: ['Grand Banquet', 'Serves 3-4'],
    dietary: 'veg'
  },
  {
    id: 'pc-2',
    name: 'Party Combo 2 (Royal Feast)',
    price: 725,
    description: 'Includes 4 Starters + 4 Main Course + 4 Types of Breads + Choice of Rice + Raita + Green Salad + 1 Beverage + 1 Dessert.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800',
    category: 'Party Combos',
    tags: ['Royal Feast', 'Serves 4-6'],
    dietary: 'veg'
  },
  {
    id: 'pc-3',
    name: 'Party Combo 3 (Ultimate Celebration)',
    price: 825,
    description: 'Includes 4 Starters + 3 Snacks + 4 Main Course + 4 Types of Breads + Choice of Rice + Raita + Green Salad + 1 Beverage + 1 Dessert.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800',
    category: 'Party Combos',
    tags: ['Ultimate Celebration', 'Serves 6-8'],
    dietary: 'veg'
  }
];

export const SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: 'offer-1',
    title: 'Party Combo Feast',
    badge: 'BEST VALUE',
    description: 'Multi-course luxury spread starting at ₹625. Includes starters, main course, breads, rice, raita, beverage & dessert.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800',
    badgeColor: 'secondary',
    buttonText: 'Reserve Party Table'
  },
  {
    id: 'offer-2',
    title: '7 Dine Special Combo',
    badge: 'CHINESE SPECIAL',
    description: 'Fried Rice or Hakka Noodles + Manchurian Gravy + Cold Drink combo for just ₹269.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800',
    badgeColor: 'primary',
    buttonText: 'Order Chinese Combo'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'ADITYA SHARMA',
    role: 'Google Local Guide',
    text: '"The Dal Makhani and Malai Chaap at 7 Dine are unbeatable in Yamuna Vihar! The food quality and packaging are premium."',
    rating: 5,
    date: '2 weeks ago',
    verifiedGuest: true
  },
  {
    id: 'rev-2',
    author: 'PRIYA MALHOTRA',
    role: 'Delhi Foodie',
    text: '"Loved the Chinese combo and the Paneer Tikka roll. Super fast service and wonderful luxury ambience."',
    rating: 5,
    date: '1 month ago',
    verifiedGuest: true
  },
  {
    id: 'rev-3',
    author: 'VIKRAM & SNEHA',
    role: 'Regular Guests',
    text: '"We ordered Party Combo 2 for our family dinner. The food quantity, rich taste, and breads were all top notch!"',
    rating: 5,
    date: '3 weeks ago',
    verifiedGuest: true
  }
];

export const RESTAURANT_INFO = {
  name: '7 Dine',
  tagline: 'Where Every Meal Becomes a Celebration | 100% Pure Vegetarian',
  address: 'Yamuna Vihar, Delhi',
  mapsUrl: 'https://maps.app.goo.gl/En8xuqytUpm4PJ2J8',
  hours: 'Open: 12 PM - 11 PM',
  phone: '+91 98765 43210',
  email: 'reservations@7dine.com',
  isPureVeg: true,
  logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0cKVa-ZamaPGmXZUdmkDqTjVPu_VdP6uKG67C7BcVhjiYYlJU7CPp9FW2m54EfXOuCs75dC268VGqGV9GQK1vEF71XHHGbJ2YqOv02ML4TuN5fLM8M0fS4WZff28mB30bWYOjeBx68o4bkFsjVkTp2Nnwc0DFtM44D3SY-88UUT_tKkCen35Q82msus9NDngRVB2cBzjnf9VhxiFIpBpdDmo3w6H5LqIRz5ZYktDRoy3GEQxFa2v8vAOaBAeFbifWDQ',
  heroGoldLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3fjxCgnhi9iSvKUE-snWWCHbr_W6nC67iH0cSs_oKIlnk_pxGWUmq2UYOE2jlfW2ulmu0SfqBIP--2ABlIivZGYyRTflFj9JawEl7rWF8A23yWZoVrEoshP9BjbfZK3yoCwSvktI9El8cKG-vUqg5zV8kiBV9QQ1gs1FDuUuEFKS6QUaw6X_9H9QxsEVnuzrID3mu-QN6x19a-d9jCSgQpXaQuEFoO5x93aHTQP3_BO5-RWluaYzUWPGbnJ5Ih_OtfQ',
  aboutImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMzx7av721H4P3zFYT3UiViA-1HuCv_WUfXaFUIdVF5ZF3Y_33Gy6o65cHXa7cwwzjOgqDuipe-jEwxGTSUZhBZsjzSCwk_GrzTu5pTJ2RKklSShcg8ZfsaHx1BBx1GSzDG8Hw_ABOHU0yyLd3-Acd1eQ3_ir9ERQ0F9a7BMYgLszaB234bKRnFHVaAbm0gxhc9P8xyuyouYe8X--rtGaWBf8F07QOXydt7jdzUaeG-y-VaMYovrUf'
};
