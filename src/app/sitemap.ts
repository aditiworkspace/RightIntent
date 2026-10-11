import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return ["", "/products", "/category/objects", "/category/textiles", "/category/tableware", "/category/carry", "/search", "/wishlist"].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "weekly" : "daily", priority: path === "" ? 1 : 0.7 }));
}
