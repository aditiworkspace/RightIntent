import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkoutSchema } from "@/lib/validation";
import { connectToDatabase } from "@/lib/mongodb";
import { CouponModel, ProductModel, OrderModel, ProfileModel } from "@/lib/models";
import { calculateOrderTotal } from "@/lib/pricing";
import { getRazorpayClient } from "@/lib/razorpay";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { products as sampleProducts } from "@/lib/products";
import {
  measureAuthentication,
  measureDatabaseConnection,
  measureDatabaseQuery,
  measureExternalApi,
  withApiPerformance,
} from "@/lib/api-performance";

export const POST = withApiPerformance("/api/checkout/create-order", async (request, metrics) => {
  try {
    const payload = checkoutSchema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await measureAuthentication(metrics, () => supabase.auth.getUser());
    if (!user) return NextResponse.json({ error: "Sign in before checkout." }, { status: 401 });
    const devPhone = process.env.NODE_ENV !== "production" && process.env.DEV_BYPASS_PHONE_OTP === "true" ? (await cookies()).get("aditi-dev-phone")?.value : undefined;
    if (!user.phone && !devPhone) return NextResponse.json({ error: "Verify your mobile number before checkout." }, { status: 403 });
    const verifiedPhone = user.phone ? user.phone.replace(/\D/g, "").replace(/^91/, "") : devPhone ?? "";
    if (payload.address.phone !== verifiedPhone) return NextResponse.json({ error: "Use the verified mobile number on your account." }, { status: 400 });
    await measureDatabaseConnection(metrics, connectToDatabase);

    const requestedItems = payload.items;
    const requestedSlugs = requestedItems.map((item) => item.productId);
    const couponQuery = payload.couponCode
      ? measureDatabaseQuery(metrics, () => CouponModel.findOne({ code: payload.couponCode, isActive: true }).lean())
      : Promise.resolve(undefined);
    const [profile, initialProducts, coupon] = await Promise.all([
      measureDatabaseQuery(metrics, () => ProfileModel.findOneAndUpdate(
        { authUserId: user.id },
        { $set: { email: user.email ?? payload.email, phone: user.phone }, $setOnInsert: { authUserId: user.id } },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
      ).lean()),
      measureDatabaseQuery(metrics, () => ProductModel.find({ slug: { $in: requestedSlugs }, isPublished: true }).lean()),
      couponQuery,
    ]);
    let products = initialProducts;

    // Sync from Supabase catalog if any requested products are missing in MongoDB
    if (products.length !== requestedItems.length) {
      const liveSlugs = new Set(products.map((product) => product.slug));
      const missingSlugs = requestedSlugs.filter((slug) => !liveSlugs.has(slug));

      if (missingSlugs.length > 0) {
        const { data: supabaseProducts } = await supabase
          .from("products")
          .select("id, name, slug, price_inr, sale_price_inr, compare_at_price_inr, sku, description, subcategory, stock, images, is_published")
          .in("slug", missingSlugs)
          .eq("is_published", true);

        if (supabaseProducts && supabaseProducts.length > 0) {
          await measureDatabaseQuery(metrics, () =>
            ProductModel.bulkWrite(
              supabaseProducts.map((p) => ({
                updateOne: {
                  filter: { slug: p.slug },
                  update: {
                    $set: {
                      name: p.name,
                      slug: p.slug,
                      category: p.subcategory || "Objects",
                      description: p.description || p.name,
                      priceInr: p.sale_price_inr ?? p.price_inr,
                      compareAtPriceInr: p.compare_at_price_inr ?? undefined,
                      sku: p.sku || `SP-${p.slug}`,
                      images: Array.isArray(p.images)
                        ? p.images.map((img: unknown, idx: number) => ({
                            path: typeof img === "string" ? img : ((img as Record<string, unknown>)?.storage_path || (img as Record<string, unknown>)?.path || (img as Record<string, unknown>)?.url || ""),
                            alt: p.name,
                            sortOrder: idx,
                          }))
                        : [],
                      isPublished: true,
                      stock: typeof p.stock === "number" ? p.stock : 25,
                    },
                  },
                  upsert: true,
                },
              }))
            )
          );
          products = await measureDatabaseQuery(metrics, () =>
            ProductModel.find({ slug: { $in: requestedSlugs }, isPublished: true }).lean()
          );
        }
      }

      // Also fallback to sampleProducts for local demo fixtures
      if (products.length !== requestedItems.length) {
        const currentSlugs = new Set(products.map((product) => product.slug));
        const missingSamples = sampleProducts.filter(
          (product) =>
            requestedSlugs.includes(product.name.toLowerCase().replaceAll(" ", "-")) &&
            !currentSlugs.has(product.name.toLowerCase().replaceAll(" ", "-"))
        );
        if (missingSamples.length) {
          await measureDatabaseQuery(metrics, () =>
            ProductModel.bulkWrite(
              missingSamples.map((product) => ({
                updateOne: {
                  filter: { slug: product.name.toLowerCase().replaceAll(" ", "-") },
                  update: {
                    $set: {
                      name: product.name,
                      slug: product.name.toLowerCase().replaceAll(" ", "-"),
                      category: product.category,
                      description: product.description,
                      priceInr: product.price,
                      compareAtPriceInr: product.compareAt,
                      sku: `AD-${product.id}`,
                      images: [{ path: product.image, alt: product.name, sortOrder: 0 }],
                      isPublished: true,
                      stock: 25,
                    },
                  },
                  upsert: true,
                },
              }))
            )
          );
          products = await measureDatabaseQuery(metrics, () =>
            ProductModel.find({ slug: { $in: requestedSlugs }, isPublished: true }).lean()
          );
        }
      }
    }

    if (products.length !== requestedItems.length) return NextResponse.json({ error: "One or more products are unavailable." }, { status: 400 });

    const productBySlug = new Map(products.map((product) => [product.slug, product]));
    const lines = requestedItems.map((item) => {
      const product = productBySlug.get(item.productId);
      if (!product || product.stock < item.quantity) throw new Error(`${product?.name ?? "Product"} is out of stock.`);
      return { productId: product._id, productName: product.name, sku: product.sku, unitPriceInr: product.priceInr, quantity: item.quantity };
    });

    if (coupon?.expiresAt && coupon.expiresAt.getTime() < Date.now()) return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
    if (coupon?.usageLimit && coupon.usedCount >= coupon.usageLimit) return NextResponse.json({ error: "This coupon is no longer available." }, { status: 400 });

    const totals = calculateOrderTotal(lines, coupon ? { discountType: coupon.discountType as "percentage" | "fixed", discountValue: coupon.discountValue, minimumOrderInr: coupon.minimumOrderInr } : undefined);
    const order = await measureDatabaseQuery(metrics, () => OrderModel.create({
      userId: profile?._id,
      email: payload.email,
      shippingAddress: payload.address,
      items: lines,
      couponCode: coupon?.code,
      ...totals,
    }));

    const razorpay = getRazorpayClient();
    const currency = process.env.RAZORPAY_CURRENCY || "INR";
    const razorpayOrder = await measureExternalApi(metrics, () => razorpay.orders.create({ amount: totals.totalInr * 100, currency, receipt: String(order._id) }));
    order.razorpayOrderId = razorpayOrder.id;
    await measureDatabaseQuery(metrics, () => order.save());

    return NextResponse.json({ orderId: String(order._id), razorpayOrderId: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") return NextResponse.json({ error: "Checkout details are invalid." }, { status: 400 });
    const message = error instanceof Error ? error.message : "Unable to create payment order.";
    if (message.includes("credentials")) return NextResponse.json({ error: "Payment service is unavailable." }, { status: 503 });
    if (message.endsWith("is out of stock.")) return NextResponse.json({ error: message }, { status: 400 });
    console.error("Checkout order creation failed", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json({ error: "Unable to create payment order." }, { status: 500 });
  }
});
