create extension if not exists "pgcrypto";

create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
create type public.payment_status as enum ('pending', 'authorized', 'paid', 'failed', 'refunded');
create type public.discount_type as enum ('percentage', 'fixed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  specifications jsonb not null default '{}'::jsonb,
  price_inr integer not null check (price_inr >= 0),
  compare_at_price_inr integer check (compare_at_price_inr is null or compare_at_price_inr >= price_inr),
  sku text not null unique,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sku text not null unique,
  options jsonb not null default '{}'::jsonb,
  price_inr integer check (price_inr is null or price_inr >= 0),
  created_at timestamptz not null default now()
);

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  updated_at timestamptz not null default now(),
  constraint inventory_item_check check ((product_id is not null) <> (variant_id is not null)),
  constraint inventory_product_unique unique (product_id),
  constraint inventory_variant_unique unique (variant_id)
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  session_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cart_owner_check check (user_id is not null or session_id is not null)
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid references public.product_variants(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  unique(cart_id, product_id, variant_id)
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Home',
  recipient_name text not null,
  phone text not null,
  line_one text not null,
  line_two text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type public.discount_type not null,
  discount_value integer not null check (discount_value > 0),
  minimum_order_inr integer not null default 0 check (minimum_order_inr >= 0),
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  used_count integer not null default 0 check (used_count >= 0),
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'pending',
  email text not null,
  shipping_address jsonb not null,
  subtotal_inr integer not null check (subtotal_inr >= 0),
  discount_inr integer not null default 0 check (discount_inr >= 0),
  shipping_inr integer not null default 0 check (shipping_inr >= 0),
  tax_inr integer not null default 0 check (tax_inr >= 0),
  total_inr integer not null check (total_inr >= 0),
  coupon_id uuid references public.coupons(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  sku text not null,
  unit_price_inr integer not null check (unit_price_inr >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'razorpay',
  provider_order_id text unique,
  provider_payment_id text unique,
  signature_verified boolean not null default false,
  amount_inr integer not null check (amount_inr >= 0),
  status public.payment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text not null,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  unique(product_id, user_id)
);

create table public.wishlists (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.coupon_usage (
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (coupon_id, user_id, order_id)
);

create index products_category_idx on public.products(category_id);
create index products_published_idx on public.products(is_published);
create index product_images_product_idx on public.product_images(product_id, sort_order);
create index inventory_low_stock_idx on public.inventory(quantity, low_stock_threshold);
create index carts_user_idx on public.carts(user_id);
create index orders_user_idx on public.orders(user_id, created_at desc);
create index orders_status_idx on public.orders(status, created_at desc);
create index reviews_product_idx on public.reviews(product_id, is_approved);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

 alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.addresses enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.coupon_usage enable row level security;

create policy "published products are public" on public.products for select using (is_published = true or public.is_admin());
create policy "public categories are readable" on public.categories for select using (is_active = true or public.is_admin());
create policy "product images are public" on public.product_images for select using (exists (select 1 from public.products p where p.id = product_id and (p.is_published or public.is_admin())));
create policy "product variants are public" on public.product_variants for select using (exists (select 1 from public.products p where p.id = product_id and (p.is_published or public.is_admin())));
create policy "approved reviews are public" on public.reviews for select using (is_approved = true or user_id = auth.uid() or public.is_admin());
create policy "users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "users manage own addresses" on public.addresses for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "users manage own wishlist" on public.wishlists for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own carts" on public.carts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own cart items" on public.cart_items for all using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())) with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create policy "users read own orders" on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy "users read own order items" on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy "admins manage catalog" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage variants" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage inventory" on public.inventory for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage order items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage payments" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage coupons" on public.coupons for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage reviews" on public.reviews for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage coupon usage" on public.coupon_usage for all using (public.is_admin()) with check (public.is_admin());
