"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { Product } from "@/lib/products";
import type { CatalogProduct } from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";
import { SiteHeader } from "@/components/store/home/site-header";
import { FeaturedProducts } from "@/components/store/home/featured-products";
import { CartDrawer } from "@/components/store/home/cart-drawer";
import { ScrollEnhancements } from "@/components/store/home/scroll-enhancements";

export function HomeClient({
  featuredProducts,
  aboveFeatured,
  belowFeatured,
}: {
  featuredProducts: CatalogProduct[];
  aboveFeatured: ReactNode;
  belowFeatured: ReactNode;
}) {
  const router = useRouter();
  const addPersistentItem = useCartStore((state) => state.addItem);
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  const addToCart = (product: Product) => {
    setCart((current) => [...current, product]);
    addPersistentItem({
      slug: (product as any).slug ?? product.name.toLowerCase().replaceAll(" ", "-"),
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setCartOpen(true);
  };

  const toggleSaved = (id: string) => {
    setSaved((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <main className="overflow-x-clip" suppressHydrationWarning>
      <ScrollEnhancements />
      <div className="sticky top-0 z-50 bg-[var(--brand-paper)]/95 backdrop-blur-md max-[960px]:[backdrop-filter:none] border-b border-[var(--line)] shadow-2xs">
        <SiteHeader cartCount={cart.length} savedCount={saved.length} />
      </div>
      <div>
        {aboveFeatured}
      </div>
      <FeaturedProducts
        products={featuredProducts}
        saved={saved}
        onToggleSaved={toggleSaved}
        onAddToCart={addToCart}
      />
      {belowFeatured}
      <CartDrawer
        isOpen={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onRemoveItem={(index) =>
          setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))
        }
        onCheckout={() => router.push("/checkout")}
      />
    </main>
  );
}
