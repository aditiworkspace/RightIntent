import dotenv from "dotenv";
import mongoose from "mongoose";
import { AddressModel, OrderModel, ProductModel } from "../src/lib/models";
import { connectToDatabase } from "../src/lib/mongodb";

dotenv.config({ path: ".env.local" });

async function main() {
  try {
    await connectToDatabase();
    await Promise.all([
      ProductModel.createIndexes(),
      AddressModel.createIndexes(),
      OrderModel.createIndexes(),
    ]);
    console.log("MongoDB performance indexes are ready.");
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("MongoDB index setup failed", error);
  process.exitCode = 1;
});
