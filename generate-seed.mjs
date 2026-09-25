import fs from 'fs';

const CATEGORIES = [
  { id: 'combos', name: 'Combos', icon: '🍱', order: 1 },
  { id: 'temakis', name: 'Temakis', icon: '🌯', order: 2 },
  { id: 'uramakis', name: 'Uramakis', icon: '🍣', order: 3 },
  { id: 'hots', name: 'Hot Rolls', icon: '🔥', order: 4 },
  { id: 'sashimis', name: 'Sashimis', icon: '🐟', order: 5 },
  { id: 'nigiri', name: 'Niguiris', icon: '🍚', order: 6 },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤', order: 7 },
];

const PRODUCTS = [
  {
    id: 'combo-1',
    categoryId: 'combos',
    name: 'Combo Sakura',
    description: '20 peças variadas: 8 uramakis, 4 hots, 4 sashimis e 4 niguiris. Acompanha shoyu e gengibre.',
    price: 79.90,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80',
    prepTime: 35,
    available: true
  },
  {
    id: 'combo-2',
    categoryId: 'combos',
    name: 'Combo Fuji',
    description: '30 peças especiais: 10 uramakis, 8 hots, 6 sashimis, 4 niguiris e 2 temakis.',
    price: 119.90,
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&q=80',
    prepTime: 45,
    available: true
  },
  {
    id: 'combo-3',
    categoryId: 'combos',
    name: 'Combo Casal',
    description: '40 peças para dois: seleção premium com salmão, atum, camarão e kani.',
    price: 149.90,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80',
    prepTime: 50,
    available: true
  },
  {
    id: 'temaki-1',
    categoryId: 'temakis',
    name: 'Temaki Salmão',
    description: 'Cone de alga recheado com salmão fresco, cream cheese, cebolinha e gergelim.',
    price: 28.90,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80',
    prepTime: 10,
    available: true
  },
  {
    id: 'temaki-2',
    categoryId: 'temakis',
    name: 'Temaki Filadélfia Hot',
    description: 'Temaki empanado e frito (hot) recheado de salmão, cream cheese e molho tarê.',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1628198751486-1d13b4c100e4?w=600&q=80',
    prepTime: 15,
    available: true
  },
  {
    id: 'urama-1',
    categoryId: 'uramakis',
    name: 'Uramaki Filadélfia (8 un)',
    description: 'Arroz por fora, recheado com salmão, cream cheese e gergelim torrado.',
    price: 26.90,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80',
    prepTime: 15,
    available: true
  },
  {
    id: 'urama-2',
    categoryId: 'uramakis',
    name: 'Uramaki Skin (8 un)',
    description: 'Arroz por fora, pele de salmão grelhada, cream cheese, cebolinha e molho tarê.',
    price: 22.90,
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&q=80',
    prepTime: 15,
    available: true
  },
  {
    id: 'hot-1',
    categoryId: 'hots',
    name: 'Hot Roll Clássico (10 un)',
    description: 'Sushi empanado e frito, recheado com salmão e cream cheese. Coberto com molho tarê e cebolinha.',
    price: 34.90,
    image: 'https://images.unsplash.com/photo-1628198751486-1d13b4c100e4?w=600&q=80',
    prepTime: 20,
    available: true
  },
  {
    id: 'sashimi-1',
    categoryId: 'sashimis',
    name: 'Sashimi de Salmão (10 un)',
    description: 'Cortes finos e precisos de salmão fresco de alta qualidade.',
    price: 45.90,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80',
    prepTime: 10,
    available: true
  },
  {
    id: 'niguiri-1',
    categoryId: 'nigiri',
    name: 'Niguiri de Salmão (4 un)',
    description: 'Bolinho de arroz coberto por uma bela fatia de salmão.',
    price: 20.90,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80',
    prepTime: 10,
    available: true
  },
  {
    id: 'drink-1',
    categoryId: 'bebidas',
    name: 'Refrigerante Lata 350ml',
    description: 'Coca-cola, Guaraná, Sprite ou Fanta.',
    price: 6.90,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80',
    prepTime: 0,
    available: true
  },
  {
    id: 'drink-2',
    categoryId: 'bebidas',
    name: 'Chá Gelado (Ice Tea)',
    description: 'Pêssego ou Limão. 300ml.',
    price: 7.90,
    image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600&q=80',
    prepTime: 0,
    available: true
  }
];

let sql = '';
sql += 'DO $$\nDECLARE\n';
CATEGORIES.forEach(cat => {
  sql += `  cat_${cat.id} UUID;\n`;
});
sql += 'BEGIN\n';

CATEGORIES.forEach(cat => {
  sql += `  INSERT INTO public.categories (name, slug, sort_order) VALUES ('${cat.name}', '${cat.id}', ${cat.order}) RETURNING id INTO cat_${cat.id};\n`;
});

sql += '\n';

PRODUCTS.forEach(prod => {
  sql += `  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_${prod.categoryId}, '${prod.name}', '${prod.description}', ${prod.price}, '${prod.image}', ${prod.available});\n`;
});

sql += 'END $$;\n';

fs.writeFileSync('supabase/seed.sql', sql);
console.log('SQL generated!');
