DO $$
DECLARE
  cat_combos UUID;
  cat_temakis UUID;
  cat_uramakis UUID;
  cat_hots UUID;
  cat_sashimis UUID;
  cat_nigiri UUID;
  cat_bebidas UUID;
BEGIN
  INSERT INTO public.categories (name, slug, sort_order) VALUES ('Combos', 'combos', 1) RETURNING id INTO cat_combos;
  INSERT INTO public.categories (name, slug, sort_order) VALUES ('Temakis', 'temakis', 2) RETURNING id INTO cat_temakis;
  INSERT INTO public.categories (name, slug, sort_order) VALUES ('Uramakis', 'uramakis', 3) RETURNING id INTO cat_uramakis;
  INSERT INTO public.categories (name, slug, sort_order) VALUES ('Hot Rolls', 'hots', 4) RETURNING id INTO cat_hots;
  INSERT INTO public.categories (name, slug, sort_order) VALUES ('Sashimis', 'sashimis', 5) RETURNING id INTO cat_sashimis;
  INSERT INTO public.categories (name, slug, sort_order) VALUES ('Niguiris', 'nigiri', 6) RETURNING id INTO cat_nigiri;
  INSERT INTO public.categories (name, slug, sort_order) VALUES ('Bebidas', 'bebidas', 7) RETURNING id INTO cat_bebidas;

  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_combos, 'Combo Sakura', '20 peças variadas: 8 uramakis, 4 hots, 4 sashimis e 4 niguiris. Acompanha shoyu e gengibre.', 79.9, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80', true);
  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_combos, 'Combo Fuji', '30 peças especiais: 10 uramakis, 8 hots, 6 sashimis, 4 niguiris e 2 temakis.', 119.9, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&q=80', true);
  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_combos, 'Combo Casal', '40 peças para dois: seleção premium com salmão, atum, camarão e kani.', 149.9, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80', true);
  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_temakis, 'Temaki Salmão', 'Cone de alga recheado com salmão fresco, cream cheese, cebolinha e gergelim.', 28.9, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80', true);
  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_temakis, 'Temaki Filadélfia Hot', 'Temaki empanado e frito (hot) recheado de salmão, cream cheese e molho tarê.', 32.9, 'https://images.unsplash.com/photo-1628198751486-1d13b4c100e4?w=600&q=80', true);
  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_uramakis, 'Uramaki Filadélfia (8 un)', 'Arroz por fora, recheado com salmão, cream cheese e gergelim torrado.', 26.9, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80', true);
  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_uramakis, 'Uramaki Skin (8 un)', 'Arroz por fora, pele de salmão grelhada, cream cheese, cebolinha e molho tarê.', 22.9, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&q=80', true);
  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_hots, 'Hot Roll Clássico (10 un)', 'Sushi empanado e frito, recheado com salmão e cream cheese. Coberto com molho tarê e cebolinha.', 34.9, 'https://images.unsplash.com/photo-1628198751486-1d13b4c100e4?w=600&q=80', true);
  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_sashimis, 'Sashimi de Salmão (10 un)', 'Cortes finos e precisos de salmão fresco de alta qualidade.', 45.9, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80', true);
  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_nigiri, 'Niguiri de Salmão (4 un)', 'Bolinho de arroz coberto por uma bela fatia de salmão.', 20.9, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80', true);
  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_bebidas, 'Refrigerante Lata 350ml', 'Coca-cola, Guaraná, Sprite ou Fanta.', 6.9, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80', true);
  INSERT INTO public.products (category_id, name, description, price, image_url, is_available) VALUES (cat_bebidas, 'Chá Gelado (Ice Tea)', 'Pêssego ou Limão. 300ml.', 7.9, 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600&q=80', true);
END $$;
