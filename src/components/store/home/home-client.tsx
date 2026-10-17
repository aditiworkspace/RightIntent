"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { Product } from "@/lib/products";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCartStore } from "@/lib/cart-store";
import { SiteHeader } from "@/components/store/home/site-header";
import { FeaturedProducts } from "@/components/store/home/featured-products";
import { CartDrawer } from "@/components/store/home/cart-drawer";

export function HomeClient({
  aboveFeatured,
  belowFeatured,
}: {
  aboveFeatured: ReactNode;
  belowFeatured: ReactNode;
}) {
  const router = useRouter();
  const addPersistentItem = useCartStore((state) => state.addItem);
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  const addToCart = async (product: Product) => {
    setCart((current) => [...current, product]);
    addPersistentItem({ slug: product.name.toLowerCase().replaceAll(" ", "-"), name: product.name, price: product.price, image: product.image });
    setCartOpen(true);
    const supabase = createSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) router.push(`/login?next=/checkout&return=${encodeURIComponent("/#shop")}`);
  };

  const toggleSaved = (id: string) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <main className="overflow-x-clip">
      <div className="[position:sticky] [top:0] [z-index:50]">
        <SiteHeader cartCount={cart.length} savedCount={saved.length} />
      </div>
      {aboveFeatured}
      <FeaturedProducts saved={saved} onToggleSaved={toggleSaved} onAddToCart={addToCart} />
      {belowFeatured}
      <CartDrawer isOpen={cartOpen} cart={cart} onClose={() => setCartOpen(false)} onRemoveItem={(index) => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))} onCheckout={() => router.push("/checkout")} />
    </main>
  );
}
