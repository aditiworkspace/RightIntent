insert into public.categories (name, slug, description, is_active)
values
  ('Objects', 'objects', 'Small objects with a point of view.', true),
  ('Textiles', 'textiles', 'Soft layers for slower days.', true),
  ('Tableware', 'tableware', 'Considered pieces for generous tables.', true),
  ('Carry', 'carry', 'Useful forms for days out.', true)
on conflict (slug) do nothing;

insert into public.products (category_id, name, slug, description, specifications, price_inr, compare_at_price_inr, sku, is_published)
select c.id, p.name, p.slug, p.description, p.specifications::jsonb, p.price_inr, p.compare_at_price_inr, p.sku, true
from (values
  ('Tableware', 'Sienna Stoneware Set', 'sienna-stoneware-set', 'Hand-finished forms for everyday rituals.', '{"material":"Stoneware","care":"Hand wash recommended"}', 1890, 2490, 'AD-SIE-001'),
  ('Textiles', 'Mitti Linen Throw', 'mitti-linen-throw', 'Washed linen with a quietly generous drape.', '{"material":"100% linen","size":"140 x 200 cm"}', 2650, null, 'AD-MIT-002'),
  ('Objects', 'Dhoop Brass Candle', 'dhoop-brass-candle', 'Warm sandalwood, smoke, and a slow evening.', '{"material":"Brass and soy wax","burn_time":"35 hours"}', 1290, null, 'AD-DHO-003'),
  ('Carry', 'Neel Everyday Tote', 'neel-everyday-tote', 'A considered canvas carryall for full days out.', '{"material":"Cotton canvas","capacity":"18 litres"}', 2290, null, 'AD-NEE-004')
) as p(category_name, name, slug, description, specifications, price_inr, compare_at_price_inr, sku)
join public.categories c on c.name = p.category_name
on conflict (slug) do nothing;

insert into public.inventory (product_id, quantity, low_stock_threshold)
select id, 25, 5 from public.products
on conflict do nothing;

-- Promote an auth user to admin only after that user has signed up.
-- update public.profiles set role = 'admin' where id = 'YOUR_AUTH_USER_UUID';
