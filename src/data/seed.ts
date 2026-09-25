// ─── Seed Data ────────────────────────────────────────────────────
// Initial catalog data for the sushi restaurant

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  prepTime: number;
  available: boolean;
  extras: ProductExtra[];
}

export const CATEGORIES: Category[] = [
  { id: 'combos', name: 'Combos', icon: '🍱', order: 1 },
  { id: 'temakis', name: 'Temakis', icon: '🌯', order: 2 },
  { id: 'uramakis', name: 'Uramakis', icon: '🍣', order: 3 },
  { id: 'hots', name: 'Hot Rolls', icon: '🔥', order: 4 },
  { id: 'sashimis', name: 'Sashimis', icon: '🐟', order: 5 },
  { id: 'nigiri', name: 'Niguiris', icon: '🍚', order: 6 },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤', order: 7 },
];

export const PRODUCTS: Product[] = [
  // ── COMBOS ──
  {
    id: 'combo-1',
    categoryId: 'combos',
    name: 'Combo Sakura',
    description: '20 peças variadas: 8 uramakis, 4 hots, 4 sashimis e 4 niguiris. Acompanha shoyu e gengibre.',
    price: 79.90,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80',
    prepTime: 35,
    available: true,
    extras: [
      { id: 'extra-tare', name: 'Molho Tarê Extra', price: 3.00 },
      { id: 'extra-shoyu', name: 'Shoyu Extra', price: 2.00 },
      { id: 'extra-gengibre', name: 'Gengibre Extra', price: 2.50 },
    ],
  },
  {
    id: 'combo-2',
    categoryId: 'combos',
    name: 'Combo Fuji',
    description: '30 peças especiais: 10 uramakis, 8 hots, 6 sashimis, 4 niguiris e 2 temakis.',
    price: 119.90,
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&q=80',
    prepTime: 45,
    available: true,
    extras: [
      { id: 'extra-tare', name: 'Molho Tarê Extra', price: 3.00 },
      { id: 'extra-shoyu', name: 'Shoyu Extra', price: 2.00 },
      { id: 'extra-wasabi', name: 'Wasabi Extra', price: 2.00 },
    ],
  },
  {
    id: 'combo-3',
    categoryId: 'combos',
    name: 'Combo Casal',
    description: '40 peças para dois: seleção premium com salmão, atum, camarão e kani.',
    price: 149.90,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80',
    prepTime: 50,
    available: true,
    extras: [
      { id: 'extra-tare', name: 'Molho Tarê Extra', price: 3.00 },
      { id: 'extra-cream', name: 'Cream Cheese Extra', price: 4.00 },
    ],
  },

  // ── TEMAKIS ──
  {
    id: 'temaki-1',
    categoryId: 'temakis',
    name: 'Temaki Salmão',
    description: 'Cone de alga recheado com salmão fresco, cream cheese, cebolinha e gergelim.',
    price: 28.90,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80',
    prepTime: 10,
    available: true,
    extras: [
      { id: 'extra-tare', name: 'Molho Tarê', price: 3.00 },
      { id: 'no-cebolinha', name: 'Sem Cebolinha', price: 0 },
    ],
  },
  {
    id: 'temaki-2',
    categoryId: 'temakis',
    name: 'Temaki Camarão',
    description: 'Cone de alga com camarão empanado, cream cheese, manga e molho especial.',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=600&q=80',
    prepTime: 12,
    available: true,
    extras: [
      { id: 'extra-tare', name: 'Molho Tarê', price: 3.00 },
    ],
  },
  {
    id: 'temaki-3',
    categoryId: 'temakis',
    name: 'Temaki Skin',
    description: 'Cone de alga com pele de salmão grelhada, cream cheese e cebolinha.',
    price: 24.90,
    image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=600&q=80',
    prepTime: 10,
    available: true,
    extras: [],
  },

  // ── URAMAKIS ──
  {
    id: 'uramaki-1',
    categoryId: 'uramakis',
    name: 'Uramaki Philadelphia',
    description: '8 peças de uramaki com salmão, cream cheese e cebolinha. Coberto com gergelim.',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&q=80',
    prepTime: 15,
    available: true,
    extras: [
      { id: 'extra-tare', name: 'Molho Tarê', price: 3.00 },
      { id: 'extra-shoyu', name: 'Shoyu Extra', price: 2.00 },
    ],
  },
  {
    id: 'uramaki-2',
    categoryId: 'uramakis',
    name: 'Uramaki Crocante',
    description: '8 peças com salmão, cream cheese, empanado por fora, coberto com flakes.',
    price: 36.90,
    image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=600&q=80',
    prepTime: 18,
    available: true,
    extras: [
      { id: 'extra-tare', name: 'Molho Tarê', price: 3.00 },
    ],
  },

  // ── HOT ROLLS ──
  {
    id: 'hot-1',
    categoryId: 'hots',
    name: 'Hot Roll Salmão',
    description: '8 peças empanadas e fritas com salmão, cream cheese. Acompanha tarê.',
    price: 29.90,
    image: 'https://images.unsplash.com/photo-1534256958597-7fe685cbd745?w=600&q=80',
    prepTime: 15,
    available: true,
    extras: [
      { id: 'extra-tare', name: 'Molho Tarê Extra', price: 3.00 },
    ],
  },
  {
    id: 'hot-2',
    categoryId: 'hots',
    name: 'Hot Roll Camarão',
    description: '8 peças empanadas com camarão, cream cheese e cebolinha. Acompanha tarê.',
    price: 34.90,
    image: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80',
    prepTime: 15,
    available: true,
    extras: [],
  },
  {
    id: 'hot-3',
    categoryId: 'hots',
    name: 'Hot Roll Kani',
    description: '8 peças empanadas com kani, cream cheese e manga. Acompanha shoyu.',
    price: 26.90,
    image: 'https://images.unsplash.com/photo-1576097449798-7c7f90e1248a?w=600&q=80',
    prepTime: 15,
    available: true,
    extras: [
      { id: 'extra-shoyu', name: 'Shoyu Extra', price: 2.00 },
    ],
  },

  // ── SASHIMIS ──
  {
    id: 'sashimi-1',
    categoryId: 'sashimis',
    name: 'Sashimi de Salmão',
    description: '10 fatias finas de salmão fresco premium, servido com shoyu e wasabi.',
    price: 42.90,
    image: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&q=80',
    prepTime: 8,
    available: true,
    extras: [
      { id: 'extra-wasabi', name: 'Wasabi Extra', price: 2.00 },
    ],
  },
  {
    id: 'sashimi-2',
    categoryId: 'sashimis',
    name: 'Sashimi de Atum',
    description: '10 fatias de atum fresco, servido com shoyu e gengibre.',
    price: 48.90,
    image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80',
    prepTime: 8,
    available: true,
    extras: [],
  },

  // ── NIGUIRIS ──
  {
    id: 'nigiri-1',
    categoryId: 'nigiri',
    name: 'Niguiri Salmão',
    description: '4 peças de arroz prensado coberto com fatia de salmão fresco.',
    price: 22.90,
    image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=600&q=80',
    prepTime: 10,
    available: true,
    extras: [],
  },
  {
    id: 'nigiri-2',
    categoryId: 'nigiri',
    name: 'Niguiri de Camarão',
    description: '4 peças de arroz prensado coberto com camarão cozido e molho especial.',
    price: 26.90,
    image: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=600&q=80',
    prepTime: 10,
    available: true,
    extras: [],
  },

  // ── BEBIDAS ──
  {
    id: 'bebida-1',
    categoryId: 'bebidas',
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná ou Sprite 350ml.',
    price: 6.90,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&q=80',
    prepTime: 0,
    available: true,
    extras: [],
  },
  {
    id: 'bebida-2',
    categoryId: 'bebidas',
    name: 'Suco Natural',
    description: 'Suco de laranja, maracujá ou limão 500ml.',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80',
    prepTime: 5,
    available: true,
    extras: [],
  },
  {
    id: 'bebida-3',
    categoryId: 'bebidas',
    name: 'Água Mineral',
    description: 'Água mineral sem gás 500ml.',
    price: 4.90,
    image: 'https://images.unsplash.com/photo-1564419320461-6c65a2bfaa1f?w=600&q=80',
    prepTime: 0,
    available: true,
    extras: [],
  },
  {
    id: 'bebida-4',
    categoryId: 'bebidas',
    name: 'Cerveja Asahi',
    description: 'Cerveja japonesa Asahi Super Dry 330ml.',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&q=80',
    prepTime: 0,
    available: true,
    extras: [],
  },
];

export const DELIVERY_FEE = 8.00;
export const STORE_WHATSAPP = '5511999999999';
export const STORE_PIX_KEY = 'sushi@restaurante.com.br';
export const STORE_NAME = 'Sushiya';
