import dotenv from "dotenv";
import { connectToDatabase } from "../src/lib/mongodb";
import { ProductModel } from "../src/lib/models";
import { products } from "../src/lib/products";

dotenv.config({ path: ".env.local" });

async function main() {
  await connectToDatabase();
  await ProductModel.bulkWrite(products.map((product) => ({
    updateOne: {
      filter: { slug: product.name.toLowerCase().replaceAll(" ", "-") },
      update: { $set: { name: product.name, slug: product.name.toLowerCase().replaceAll(" ", "-"), category: product.category, description: product.description, priceInr: product.price, compareAtPriceInr: product.compareAt, sku: `AD-${product.id}`, images: [{ path: product.image, alt: product.name, sortOrder: 0 }], isPublished: true, stock: 25 } },
      upsert: true,
    },
  })));
  console.log(`Seeded ${products.length} products into MongoDB.`);
}

main().catch((error) => {
  console.error("MongoDB seed failed", error);
  process.exitCode = 1;
});
