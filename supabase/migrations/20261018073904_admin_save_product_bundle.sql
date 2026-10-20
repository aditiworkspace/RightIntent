create or replace function public.admin_save_product_bundle(
  p_product jsonb,
  p_stock integer,
  p_low_stock_threshold integer,
  p_images jsonb,
  p_variants jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_product_id uuid;
  v_image jsonb;
  v_variant jsonb;
  v_image_id uuid;
  v_variant_id uuid;
  v_variant_ids uuid[] := '{}';
  v_removed_image_paths jsonb := '[]'::jsonb;
  v_saved_images jsonb := '[]'::jsonb;
  v_saved_variants jsonb := '[]'::jsonb;
  v_is_update boolean;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  if jsonb_typeof(p_product) is distinct from 'object'
    or jsonb_typeof(coalesce(p_images, '[]'::jsonb)) is distinct from 'array'
    or jsonb_typeof(coalesce(p_variants, '[]'::jsonb)) is distinct from 'array' then
    raise exception 'Invalid product bundle';
  end if;

  if jsonb_array_length(coalesce(p_images, '[]'::jsonb)) > 5 then
    raise exception 'A product can have at most five images';
  end if;

  if jsonb_array_length(coalesce(p_variants, '[]'::jsonb)) > 100 then
    raise exception 'A product can have at most one hundred variants';
  end if;

  v_is_update := nullif(p_product ->> 'id', '') is not null;

  if v_is_update then
    v_product_id := (p_product ->> 'id')::uuid;
    update public.products
    set
      name = p_product ->> 'name',
      slug = p_product ->> 'slug',
      description = p_product ->> 'description',
      category_id = nullif(p_product ->> 'categoryId', '')::uuid,
      price_inr = (p_product ->> 'priceInr')::integer,
      sale_price_inr = nullif(p_product ->> 'salePriceInr', '')::integer,
      sku = p_product ->> 'sku',
      is_published = (p_product ->> 'isPublished')::boolean,
      seo_title = nullif(p_product ->> 'seoTitle', ''),
      seo_description = nullif(p_product ->> 'seoDescription', ''),
      updated_at = now()
    where id = v_product_id;

    if not found then
      raise exception 'Product not found';
    end if;
  else
    insert into public.products (
      name, slug, description, category_id, price_inr, sale_price_inr,
      sku, is_published, seo_title, seo_description
    )
    values (
      p_product ->> 'name',
      p_product ->> 'slug',
      p_product ->> 'description',
      nullif(p_product ->> 'categoryId', '')::uuid,
      (p_product ->> 'priceInr')::integer,
      nullif(p_product ->> 'salePriceInr', '')::integer,
      p_product ->> 'sku',
      (p_product ->> 'isPublished')::boolean,
      nullif(p_product ->> 'seoTitle', ''),
      nullif(p_product ->> 'seoDescription', '')
    )
    returning id into v_product_id;
  end if;

  select coalesce(jsonb_agg(storage_path), '[]'::jsonb)
  into v_removed_image_paths
  from public.product_images
  where product_id = v_product_id
    and not exists (
      select 1
      from jsonb_array_elements(coalesce(p_images, '[]'::jsonb)) as submitted(image)
      where submitted.image ->> 'id' = product_images.id::text
    );

  delete from public.product_images
  where product_id = v_product_id
    and not exists (
      select 1
      from jsonb_array_elements(coalesce(p_images, '[]'::jsonb)) as submitted(image)
      where submitted.image ->> 'id' = product_images.id::text
    );

  for v_image in
    select value from jsonb_array_elements(coalesce(p_images, '[]'::jsonb))
  loop
    if nullif(v_image ->> 'id', '') is not null then
      v_image_id := (v_image ->> 'id')::uuid;
      update public.product_images
      set
        storage_path = v_image ->> 'storagePath',
        alt_text = v_image ->> 'altText',
        sort_order = (v_image ->> 'sortOrder')::integer
      where id = v_image_id and product_id = v_product_id;

      if not found then
        raise exception 'Product image does not belong to this product';
      end if;
    else
      insert into public.product_images (product_id, storage_path, alt_text, sort_order)
      values (
        v_product_id,
        v_image ->> 'storagePath',
        v_image ->> 'altText',
        (v_image ->> 'sortOrder')::integer
      )
      returning id into v_image_id;
    end if;

    v_saved_images := v_saved_images || jsonb_build_array(jsonb_build_object(
      'id', v_image_id,
      'storage_path', v_image ->> 'storagePath',
      'alt_text', v_image ->> 'altText',
      'sort_order', (v_image ->> 'sortOrder')::integer
    ));
  end loop;

  for v_variant in
    select value from jsonb_array_elements(coalesce(p_variants, '[]'::jsonb))
  loop
    if jsonb_typeof(coalesce(v_variant -> 'options', '{}'::jsonb)) is distinct from 'object' then
      raise exception 'Variant options must be an object';
    end if;

    if nullif(v_variant ->> 'id', '') is not null then
      v_variant_id := (v_variant ->> 'id')::uuid;
      update public.product_variants
      set
        name = v_variant ->> 'name',
        sku = v_variant ->> 'sku',
        options = coalesce(v_variant -> 'options', '{}'::jsonb),
        price_inr = nullif(v_variant ->> 'priceInr', '')::integer
      where id = v_variant_id and product_id = v_product_id;

      if not found then
        raise exception 'Product variant does not belong to this product';
      end if;
    else
      insert into public.product_variants (product_id, name, sku, options, price_inr)
      values (
        v_product_id,
        v_variant ->> 'name',
        v_variant ->> 'sku',
        coalesce(v_variant -> 'options', '{}'::jsonb),
        nullif(v_variant ->> 'priceInr', '')::integer
      )
      returning id into v_variant_id;
    end if;

    insert into public.inventory (variant_id, quantity, low_stock_threshold, updated_at)
    values (
      v_variant_id,
      (v_variant ->> 'stock')::integer,
      (v_variant ->> 'lowStockThreshold')::integer,
      now()
    )
    on conflict (variant_id) do update
    set
      quantity = excluded.quantity,
      low_stock_threshold = excluded.low_stock_threshold,
      updated_at = now();

    v_variant_ids := array_append(v_variant_ids, v_variant_id);
    v_saved_variants := v_saved_variants || jsonb_build_array(jsonb_build_object(
      'id', v_variant_id,
      'name', v_variant ->> 'name',
      'sku', v_variant ->> 'sku',
      'options', coalesce(v_variant -> 'options', '{}'::jsonb),
      'price_inr', nullif(v_variant ->> 'priceInr', '')::integer,
      'stock', (v_variant ->> 'stock')::integer,
      'low_stock_threshold', (v_variant ->> 'lowStockThreshold')::integer
    ));
  end loop;

  delete from public.product_variants
  where product_id = v_product_id
    and not (id = any(v_variant_ids));

  if cardinality(v_variant_ids) = 0 then
    insert into public.inventory (product_id, quantity, low_stock_threshold, updated_at)
    values (v_product_id, p_stock, p_low_stock_threshold, now())
    on conflict (product_id) do update
    set
      quantity = excluded.quantity,
      low_stock_threshold = excluded.low_stock_threshold,
      updated_at = now();
  else
    delete from public.inventory where product_id = v_product_id;
  end if;

  return jsonb_build_object(
    'productId', v_product_id,
    'removedImagePaths', v_removed_image_paths,
    'images', v_saved_images,
    'variants', v_saved_variants
  );
end;
$$;

revoke execute on function public.admin_save_product_bundle(jsonb, integer, integer, jsonb, jsonb) from public, anon;
grant execute on function public.admin_save_product_bundle(jsonb, integer, integer, jsonb, jsonb) to authenticated;