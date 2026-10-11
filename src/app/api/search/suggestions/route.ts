import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/catalog";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length > 80) {
    return NextResponse.json({ error: "Search query must be 80 characters or fewer." }, { status: 400 });
  }

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  const normalizedQuery = query.toLocaleLowerCase();
  const products = await getCatalogProducts();
  const suggestions = products
    .filter((product) => `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase().includes(normalizedQuery))
    .slice(0, 5)
    .map(({ id, slug, name, category, price, image }) => ({ id, slug, name, category, price, image }));

  return NextResponse.json({ suggestions }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
