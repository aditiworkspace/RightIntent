import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentAdminAccess } from "@/lib/auth/admin";
import { invalidateCatalogCache } from "@/lib/catalog";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const imageSchema = z.object({
  id: z.string().uuid(),
  storage_path: z.string().trim().min(1),
  alt_text: z.string().trim().min(1),
  sort_order: z.number().int().nonnegative(),
});

const variantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  sku: z.string().trim().min(2).max(100),
  options: z.record(z.string(), z.string()).default({}),
  price_inr: z.number().int().nonnegative().nullable(),
  stock: z.number().int().nonnegative(),
  low_stock_threshold: z.number().int().nonnegative(),
});

const schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(10),
  category_id: z.string().uuid().nullable(),
  subcategory: z.string().trim().min(1).max(100),
  price_inr: z.number().int().nonnegative(),
  sale_price_inr: z.number().int().nonnegative().nullable(),
  sku: z.string().trim().min(2).max(100),
  stock: z.number().int().nonnegative(),
  low_stock_threshold: z.number().int().nonnegative(),
  specifications: z.record(z.string(), z.unknown()).default({}),
  is_published: z.boolean(),
  compare_at_price_inr: z.number().int().nonnegative().nullable().optional(),
  seo_title: z.string().max(160).nullable().optional(),
  seo_description: z.string().max(320).nullable().optional(),
  images: z.array(imageSchema).max(5).default([]),
  variants: z.array(variantSchema).max(100).default([]),
}).superRefine((product, context) => {
  if (
    product.compare_at_price_inr !== null &&
    product.compare_at_price_inr !== undefined &&
    product.compare_at_price_inr < product.price_inr
  ) {
    context.addIssue({
      code: "custom",
      path: ["compare_at_price_inr"],
      message: "Compare-at price must be at least the product price.",
    });
  }
  if (new Set(product.variants.map((variant) => variant.id)).size !== product.variants.length) {
    context.addIssue({
      code: "custom",
      path: ["variants"],
      message: "Variant IDs must be unique within a product.",
    });
  }
});

async function guard() {
  const access = await getCurrentAdminAccess();
  return access?.isAdmin
    ? null
    : NextResponse.json(
        { error: "Admin access required." },
        { status: access ? 403 : 401 },
      );
}

function imagePaths(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((image) =>
    typeof image === "object" &&
    image !== null &&
    "storage_path" in image &&
    typeof image.storage_path === "string"
      ? [image.storage_path]
      : [],
  );
}

function storageWarning(error: { message: string }) {
  console.error("Product saved but product image storage cleanup failed.", error);
  return "Product details were saved, but one or more removed image files could not be deleted from storage.";
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ products: data });
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Product details are invalid.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { data: productInput } = parsed;
  const variantSkus = productInput.variants.map((variant) => variant.sku);
  if (
    new Set(variantSkus).size !== variantSkus.length ||
    variantSkus.includes(productInput.sku)
  ) {
    return NextResponse.json(
      { error: "Product and variant SKUs must be unique." },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  let oldImages: unknown = [];
  if (productInput.id) {
    const { data: existing, error: existingError } = await supabase
      .from("products")
      .select("images")
      .eq("id", productInput.id)
      .maybeSingle();
    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 400 });
    }
    if (!existing) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    oldImages = existing.images;
  }

  const stock =
    productInput.variants.length > 0
      ? productInput.variants.reduce((sum, variant) => sum + variant.stock, 0)
      : productInput.stock;
  const values = {
    ...(productInput.id ? { id: productInput.id } : {}),
    name: productInput.name,
    slug: productInput.slug,
    description: productInput.description,
    category_id: productInput.category_id,
    subcategory: productInput.subcategory,
    price_inr: productInput.price_inr,
    sale_price_inr: productInput.sale_price_inr,
    compare_at_price_inr: productInput.compare_at_price_inr,
    sku: productInput.sku,
    stock,
    low_stock_threshold: productInput.low_stock_threshold,
    specifications: productInput.specifications,
    is_published: productInput.is_published,
    seo_title: productInput.seo_title,
    seo_description: productInput.seo_description,
    images: productInput.images,
    variants: productInput.variants,
    updated_at: new Date().toISOString(),
  };

  const saveQuery = productInput.id
    ? supabase.from("products").update(values).eq("id", productInput.id).select("id").single()
    : supabase.from("products").insert(values).select("id").single();

  const { data: saved, error } = await saveQuery;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const savedPaths = new Set(imagePaths(productInput.images));
  const removedPaths = imagePaths(oldImages).filter((path) => !savedPaths.has(path));
  let warning: string | undefined;
  if (removedPaths.length > 0) {
    const { error: cleanupError } = await supabase.storage
      .from("product-images")
      .remove(removedPaths);
    if (cleanupError) warning = storageWarning(cleanupError);
  }

  invalidateCatalogCache();
  revalidateTag("catalog", "max");
  revalidatePath("/", "layout");
  revalidatePath("/products");

  return NextResponse.json(
    {
      product: saved,
      images: productInput.images,
      variants: productInput.variants,
      ...(warning ? { warning } : {}),
    },
    { status: productInput.id ? 200 : 201 },
  );
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Product id is required." },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing, error: readError } = await supabase
    .from("products")
    .select("images")
    .eq("id", id)
    .maybeSingle();
  if (readError) {
    return NextResponse.json({ error: readError.message }, { status: 400 });
  }
  if (!existing) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  let warning: string | undefined;
  const paths = imagePaths(existing.images);
  if (paths.length > 0) {
    const { error: cleanupError } = await supabase.storage
      .from("product-images")
      .remove(paths);
    if (cleanupError) warning = storageWarning(cleanupError);
  }

  invalidateCatalogCache();
  revalidateTag("catalog", "max");
  revalidatePath("/", "layout");
  revalidatePath("/products");
  return NextResponse.json({ ok: true, ...(warning ? { warning } : {}) });
}
