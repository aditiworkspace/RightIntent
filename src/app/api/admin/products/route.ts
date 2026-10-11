import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ProductModel, ProfileModel } from "@/lib/models";
import { revalidateTag } from "next/cache";
import {
  measureAuthentication,
  measureDatabaseConnection,
  measureDatabaseQuery,
  withApiPerformance,
  type ApiPerformanceMetrics,
} from "@/lib/api-performance";

const schema = z.object({ name: z.string().trim().min(2), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().trim().min(10), category: z.string().trim().min(2), priceInr: z.coerce.number().int().nonnegative(), sku: z.string().trim().min(2), stock: z.coerce.number().int().nonnegative(), isPublished: z.boolean().default(false) });

async function admin(metrics: ApiPerformanceMetrics) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await measureAuthentication(metrics, () => supabase.auth.getUser());
  if (!user) return null;
  await measureDatabaseConnection(metrics, connectToDatabase);
  return (await measureDatabaseQuery(metrics, () => ProfileModel.findOne({ authUserId: user.id }).select("role").lean()))?.role === "admin";
}

export const POST = withApiPerformance("/api/admin/products", async (request, metrics) => {
  if (!(await admin(metrics))) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Product details are invalid." }, { status: 400 });
  try {
    const product = await measureDatabaseQuery(metrics, () => ProductModel.create(parsed.data));
    revalidateTag("catalog", "max");
    return NextResponse.json({ product }, { status: 201 });
  }
  catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "A product with this slug or SKU already exists." }, { status: 409 });
    }
    console.error("Product creation failed", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json({ error: "Unable to create product." }, { status: 500 });
  }
});
