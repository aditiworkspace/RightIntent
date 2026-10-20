import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminProducts() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getAdminProducts error, trying fallback without relation:", error);
      const fallback = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      return fallback.data ?? [];
    }
    return data ?? [];
  } catch (err) {
    console.error("getAdminProducts unexpected error:", err);
    return [];
  }
}

export async function getAdminStats() {
  try {
    const supabase = await createSupabaseServerClient();
    const [products, allOrders] = await Promise.all([
      supabase
        .from("products")
        .select("id,is_published,stock,low_stock_threshold,variants", {
          count: "exact",
        }),
      getAdminOrders(),
    ]);

    const productRows = products.data ?? [];

    const lowStock = productRows.filter((product) => {
      const variants = Array.isArray(product.variants) ? product.variants : [];
      if (variants.length > 0) {
        return variants.some(
          (variant) =>
            typeof variant === "object" &&
            variant !== null &&
            typeof variant.stock === "number" &&
            variant.stock <= (variant.low_stock_threshold ?? 5),
        );
      }
      return (product.stock ?? 0) <= (product.low_stock_threshold ?? 5);
    }).length;

    return {
      products: products.count ?? productRows.length,
      published: productRows.filter((product) => product.is_published).length,
      orders: allOrders.length,
      revenue: allOrders
        .filter((order) => order.status !== "cancelled" && (order.payment_status?.toLowerCase() === "paid" || order.status === "confirmed"))
        .reduce((sum, order) => sum + (order.total_inr ?? 0), 0),
      lowStock,
    };
  } catch (err) {
    console.error("getAdminStats unexpected error:", err);
    return {
      products: 0,
      published: 0,
      orders: 0,
      revenue: 0,
      lowStock: 0,
    };
  }
}

export type AdminOrderItem = {
  product_name: string;
  sku: string;
  quantity: number;
  unit_price_inr: number;
};

export type AdminOrder = {
  id: string;
  email: string;
  total_inr: number;
  status: string;
  payment_status: string;
  created_at: string;
  shipping_address?: Record<string, any>;
  order_items: AdminOrderItem[];
};

export async function getAdminOrders(): Promise<AdminOrder[]> {
  try {
    const { connectToDatabase } = await import("@/lib/mongodb");
    const { OrderModel } = await import("@/lib/models");
    await connectToDatabase();
    const mongoOrders = await OrderModel.find().sort({ createdAt: -1 }).lean();

    const orders: AdminOrder[] = mongoOrders.map((mo: any) => ({
      id: String(mo._id),
      email: mo.email,
      total_inr: mo.totalInr,
      status: mo.status || "confirmed",
      payment_status: mo.paymentStatus || "pending",
      created_at: mo.createdAt ? new Date(mo.createdAt).toISOString() : new Date().toISOString(),
      shipping_address: mo.shippingAddress,
      order_items: (mo.items || []).map((it: any) => ({
        product_name: it.productName || "Product",
        sku: it.sku || "SKU",
        quantity: it.quantity || 1,
        unit_price_inr: it.unitPriceInr || 0,
      })),
    }));

    return orders;
  } catch (err) {
    console.error("getAdminOrders error:", err);
    return [];
  }
}

export async function getAdminCategories() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,slug,is_active,created_at")
      .order("name");
    if (error) {
      console.error("getAdminCategories error:", error);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("getAdminCategories unexpected error:", err);
    return [];
  }
}

export async function getAdminInventory() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: products, error } = await supabase
      .from("products")
      .select("id,name,sku,stock,low_stock_threshold,variants")
      .order("name");

    if (error) {
      console.error("getAdminInventory error:", error);
      return [];
    }

    return (products ?? []).flatMap((product) => {
      const variants = Array.isArray(product.variants) ? product.variants : [];
      if (variants.length === 0) {
        return [
          {
            id: product.id,
            product_id: product.id,
            variant_sku: null,
            variant_name: null,
            quantity: typeof product.stock === "number" ? product.stock : 0,
            low_stock_threshold:
              typeof product.low_stock_threshold === "number"
                ? product.low_stock_threshold
                : 5,
            products: { id: product.id, name: product.name, sku: product.sku },
          },
        ];
      }
      return variants.flatMap((variant) => {
        if (
          typeof variant !== "object" ||
          variant === null ||
          typeof variant.sku !== "string"
        ) {
          return [];
        }
        return [
          {
            id: `${product.id}:${variant.sku}`,
            product_id: product.id,
            variant_sku: variant.sku,
            variant_name:
              typeof variant.name === "string" ? variant.name : "Variant",
            quantity:
              typeof variant.stock === "number" ? variant.stock : 0,
            low_stock_threshold:
              typeof variant.low_stock_threshold === "number"
                ? variant.low_stock_threshold
                : 5,
            products: { id: product.id, name: product.name, sku: product.sku },
          },
        ];
      });
    });
  } catch (err) {
    console.error("getAdminInventory unexpected error:", err);
    return [];
  }
}

export async function getSiteSettings() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("site_settings").select("key,value");
    if (error) {
      console.error("getSiteSettings error:", error);
      return {};
    }
    return Object.fromEntries((data ?? []).map((item) => [item.key, item.value]));
  } catch (err) {
    console.error("getSiteSettings unexpected error:", err);
    return {};
  }
}
