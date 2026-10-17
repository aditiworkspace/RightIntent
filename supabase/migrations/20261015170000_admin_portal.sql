create table if not exists public.site_settings (key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now(), updated_by uuid references auth.users(id) on delete set null);
alter table public.site_settings enable row level security;
do $$ begin
  create policy "public can read site settings" on public.site_settings for select to anon, authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admins manage site settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;
alter table public.products add column if not exists seo_title text;
alter table public.products add column if not exists seo_description text;
alter table public.products add column if not exists sale_price_inr integer check (sale_price_inr is null or sale_price_inr >= 0);
alter table public.products add column if not exists download_files jsonb not null default '[]'::jsonb;
create index if not exists products_admin_search_idx on public.products using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,'')));
insert into public.site_settings (key, value) values ('announcement', '{"enabled":true,"text":"Free 2027 calendar + intentions card on every order","linkText":"Join our community","link":"#journal"}'::jsonb), ('header', '{"navigation":[{"label":"Shop all","href":"/products"},{"label":"Collections","href":"/category/objects"},{"label":"Intelligent Trader","href":"/#intelligent-trader"},{"label":"Our story","href":"/#story"},{"label":"Journal","href":"/#journal"}]}'::jsonb), ('footer', '{"tagline":"Objects with a little soul. Made in India, sent with care.","email":"hello@rightintent.in","social":{}}'::jsonb), ('seo', '{"title":"Right Intent | Build with purpose","description":"Thoughtful objects for intentional living."}'::jsonb) on conflict (key) do nothing;
insert into storage.buckets (id, name, public) values ('product-media', 'product-media', false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
do $$ begin create policy "public can view product images" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images'); exception when duplicate_object then null; end $$;
do $$ begin create policy "admins upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin()); exception when duplicate_object then null; end $$;
do $$ begin create policy "admins update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_admin()) with check (bucket_id = 'product-images' and public.is_admin()); exception when duplicate_object then null; end $$;
do $$ begin create policy "admins delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_admin()); exception when duplicate_object then null; end $$;
do $$ begin create policy "admins upload product media" on storage.objects for insert to authenticated with check (bucket_id = 'product-media' and public.is_admin()); exception when duplicate_object then null; end $$;
do $$ begin create policy "admins read product media" on storage.objects for select to authenticated using (bucket_id = 'product-media' and public.is_admin()); exception when duplicate_object then null; end $$;
do $$ begin create policy "admins update product media" on storage.objects for update to authenticated using (bucket_id = 'product-media' and public.is_admin()) with check (bucket_id = 'product-media' and public.is_admin()); exception when duplicate_object then null; end $$;
do $$ begin create policy "admins delete product media" on storage.objects for delete to authenticated using (bucket_id = 'product-media' and public.is_admin()); exception when duplicate_object then null; end $$;
