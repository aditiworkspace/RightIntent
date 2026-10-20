-- Consolidate the product document while retaining the categories lookup table.
alter table public.products
  add column if not exists subcategory text not null default 'Uncategorized',
  add column if not exists stock integer not null default 0,
  add column if not exists low_stock_threshold integer not null default 5,
  add column if not exists images jsonb not null default '[]'::jsonb,
  add column if not exists variants jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.products'::regclass
      and conname = 'products_stock_nonnegative'
  ) then
    alter table public.products
      add constraint products_stock_nonnegative check (stock >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.products'::regclass
      and conname = 'products_low_stock_threshold_nonnegative'
  ) then
    alter table public.products
      add constraint products_low_stock_threshold_nonnegative
      check (low_stock_threshold >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.products'::regclass
      and conname = 'products_images_is_array'
  ) then
    alter table public.products
      add constraint products_images_is_array
      check (jsonb_typeof(images) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.products'::regclass
      and conname = 'products_variants_is_array'
  ) then
    alter table public.products
      add constraint products_variants_is_array
      check (jsonb_typeof(variants) = 'array');
  end if;
end;
$$;

-- Move existing normalized rows into the owning product row before removing
-- the old tables. Storage objects themselves remain in the existing bucket.
update public.products as p
set
  images = coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', image.id,
        'storage_path', image.storage_path,
        'alt_text', image.alt_text,
        'sort_order', image.sort_order
      )
      order by image.sort_order, image.created_at, image.id
    )
    from public.product_images as image
    where image.product_id = p.id
  ), '[]'::jsonb),
  variants = coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', variant.id,
        'name', variant.name,
        'sku', variant.sku,
        'options', variant.options,
        'price_inr', variant.price_inr,
        'stock', coalesce(variant_inventory.quantity, 0),
        'low_stock_threshold', coalesce(variant_inventory.low_stock_threshold, 5)
      )
      order by variant.created_at, variant.id
    )
    from public.product_variants as variant
    left join public.inventory as variant_inventory
      on variant_inventory.variant_id = variant.id
    where variant.product_id = p.id
  ), '[]'::jsonb),
  stock = coalesce((
    select sum(variant_inventory.quantity)::integer
    from public.product_variants as variant
    join public.inventory as variant_inventory
      on variant_inventory.variant_id = variant.id
    where variant.product_id = p.id
  ), (
    select product_inventory.quantity
    from public.inventory as product_inventory
    where product_inventory.product_id = p.id
  ), 0),
  low_stock_threshold = coalesce((
    select min(variant_inventory.low_stock_threshold)
    from public.product_variants as variant
    join public.inventory as variant_inventory
      on variant_inventory.variant_id = variant.id
    where variant.product_id = p.id
  ), (
    select product_inventory.low_stock_threshold
    from public.inventory as product_inventory
    where product_inventory.product_id = p.id
  ), 5);

-- Preserve the existing product RLS access model and ensure exposed roles have
-- the table privileges required for their respective policies.
alter table public.products enable row level security;
drop policy if exists "published products are public" on public.products;
drop policy if exists "admins manage catalog" on public.products;

create policy "published products are public"
  on public.products
  for select
  to anon, authenticated
  using (is_published or public.is_admin());

create policy "admins manage catalog"
  on public.products
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

create index if not exists products_category_subcategory_idx
  on public.products (category_id, subcategory);

-- There are no cart/order rows referencing a variant at migration time. Drop
-- the obsolete foreign-key columns and keep order item name/SKU/price snapshots.
alter table public.cart_items drop column if exists variant_id;
alter table public.order_items drop column if exists variant_id;

alter table public.cart_items
  drop constraint if exists cart_items_cart_id_product_id_variant_id_key;
create unique index if not exists cart_items_cart_product_unique
  on public.cart_items (cart_id, product_id);

drop function if exists public.admin_save_product_bundle(
  jsonb, integer, integer, jsonb, jsonb
);

drop table if exists public.inventory;
drop table if exists public.product_variants;
drop table if exists public.product_images;

-- Preserve global SKU uniqueness for both product and embedded variant SKUs.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.enforce_product_document_skus()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_duplicate_sku text;
begin
  perform pg_catalog.pg_advisory_xact_lock(241018, 1);

  if jsonb_typeof(new.images) is distinct from 'array'
    or jsonb_typeof(new.variants) is distinct from 'array' then
    raise exception 'Product images and variants must be JSON arrays'
      using errcode = '23514';
  end if;

  with submitted_skus as (
    select new.sku as sku
    union all
    select item.value ->> 'sku'
    from pg_catalog.jsonb_array_elements(new.variants) as item(value)
  )
  select sku
  into v_duplicate_sku
  from submitted_skus
  group by sku
  having sku is null or pg_catalog.btrim(sku) = '' or count(*) > 1
  limit 1;

  if found then
    raise exception 'Product and variant SKUs must be present and unique'
      using errcode = '23505';
  end if;

  with submitted_skus as (
    select new.sku as sku
    union all
    select item.value ->> 'sku'
    from pg_catalog.jsonb_array_elements(new.variants) as item(value)
  ),
  existing_skus as (
    select product.sku as sku
    from public.products as product
    where product.id <> new.id
    union all
    select item.value ->> 'sku'
    from public.products as product
    cross join lateral pg_catalog.jsonb_array_elements(product.variants) as item(value)
    where product.id <> new.id
  )
  select submitted.sku
  into v_duplicate_sku
  from submitted_skus as submitted
  join existing_skus as existing using (sku)
  limit 1;

  if found then
    raise exception 'SKU "%" is already assigned to another product or variant', v_duplicate_sku
      using errcode = '23505';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_product_document_skus() from public, anon, authenticated;

drop trigger if exists enforce_product_document_skus on public.products;
create trigger enforce_product_document_skus
  before insert or update of sku, variants
  on public.products
  for each row
  execute function private.enforce_product_document_skus();