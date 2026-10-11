import type { Product } from "@/lib/products";

export const formatPrice = (price: Product["price"]) => `Rs. ${price.toLocaleString("en-IN")}`;
