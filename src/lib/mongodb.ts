import mongoose from "mongoose";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { connection: null, promise: null };
global.mongooseCache = cached;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI environment variable");
  if (cached.connection) return cached.connection;
  if (!cached.promise) cached.promise = mongoose.connect(uri, { bufferCommands: false, dbName: process.env.MONGODB_DB_NAME || "aditi" });
  cached.connection = await cached.promise;
  return cached.connection;
}
