import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentAdminAccess } from "@/lib/auth/admin";
import { invalidateCatalogCache } from "@/lib/catalog";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  productId: z.string().uuid(),
  variantSku: z.string().trim().min(2).optional(),
  quantity: z.number().int().nonnegative(),
});

export async function PATCH(request: Request) {
  const access = await getCurrentAdminAccess();
  if (!access?.isAdmin) {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: access ? 403 : 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid inventory data.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { productId, variantSku, quantity } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { data: product, error: readError } = await supabase
    .from("products")
    .select("stock,variants")
    .eq("id", productId)
    .maybeSingle();
  if (readError) {
    return NextResponse.json({ error: readError.message }, { status: 400 });
  }
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const variants = Array.isArray(product.variants) ? product.variants : [];
  let stock = quantity;
  let updatedVariants = variants;

  if (variantSku) {
    let found = false;
    updatedVariants = variants.map((variant) => {
      if (
        typeof variant !== "object" ||
        variant === null ||
        variant.sku !== variantSku
      ) {
        return variant;
      }
      found = true;
      return { ...variant, stock: quantity };
    });
    if (!found) {
      return NextResponse.json(
        { error: "Product variant not found." },
        { status: 404 },
      );
    }
    stock = updatedVariants.reduce(
      (total, variant) =>
        typeof variant === "object" &&
        variant !== null &&
        typeof variant.stock === "number"
          ? total + variant.stock
          : total,
      0,
    );
  } else if (variants.length > 0) {
    return NextResponse.json(
      { error: "Choose a variant SKU when updating variant stock." },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("products")
    .update({
      stock,
      ...(variantSku ? { variants: updatedVariants } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  invalidateCatalogCache();
  revalidateTag("catalog", "max");
  revalidatePath("/", "layout");
  revalidatePath("/products");
  return NextResponse.json({ ok: true, stock });
}
