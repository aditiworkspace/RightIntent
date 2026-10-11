import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, index: true },
  category: { type: String, required: true, index: true }, description: { type: String, required: true },
  specifications: { type: Map, of: String, default: {} }, priceInr: { type: Number, required: true, min: 0 },
  compareAtPriceInr: { type: Number, min: 0 }, sku: { type: String, required: true, unique: true },
  images: [{ path: String, alt: String, sortOrder: Number }], stock: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 5, min: 0 }, isPublished: { type: Boolean, default: false, index: true },
}, { timestamps: true });
productSchema.index({ isPublished: 1, createdAt: -1 });

const orderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" }, email: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"], default: "pending" },
  paymentStatus: { type: String, enum: ["pending", "authorized", "paid", "failed", "refunded"], default: "pending" },
  items: [{ productId: mongoose.Schema.Types.ObjectId, productName: String, sku: String, unitPriceInr: Number, quantity: Number }],
  shippingAddress: { type: Schema.Types.Mixed, required: true }, subtotalInr: { type: Number, required: true, min: 0 },
  discountInr: { type: Number, default: 0, min: 0 }, shippingInr: { type: Number, default: 0, min: 0 }, taxInr: { type: Number, default: 0, min: 0 },
  totalInr: { type: Number, required: true, min: 0 }, couponCode: String, razorpayOrderId: String, razorpayPaymentId: String,
}, { timestamps: true });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ razorpayOrderId: 1 }, { sparse: true });

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true }, discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true, min: 1 }, minimumOrderInr: { type: Number, default: 0, min: 0 }, usageLimit: Number,
  usedCount: { type: Number, default: 0, min: 0 }, expiresAt: Date, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const addressSchema = new Schema({
  authUserId: { type: String, required: true, index: true },
  label: { type: String, default: "Home" }, recipientName: { type: String, required: true }, phone: { type: String, required: true },
  houseNumber: { type: String, required: true }, streetArea: { type: String, required: true }, city: { type: String, required: true },
  state: { type: String, required: true }, pincode: { type: String, required: true }, landmark: String, isDefault: { type: Boolean, default: false },
}, { timestamps: true });
addressSchema.index({ authUserId: 1, isDefault: -1, createdAt: -1 });

export { ProfileModel, type Profile } from "./models/profile";
export const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);
export const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);
export const CouponModel = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export const AddressModel = mongoose.models.Address || mongoose.model("Address", addressSchema);
