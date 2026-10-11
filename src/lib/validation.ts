import { z } from "zod";

export const emailSchema = z.string().trim().email("Enter a valid email address.");

export const addressSchema = z.object({
  recipientName: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number."),
  houseNumber: z.string().trim().min(1).max(40),
  streetArea: z.string().trim().min(4).max(160),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid six-digit PIN code."),
  landmark: z.string().trim().max(120).optional(),
  country: z.literal("India"),
});

export const cartItemSchema = z.object({
  productId: z.string().trim().min(1),
  variantId: z.string().trim().nullable().optional(),
  quantity: z.number().int().min(1).max(25),
});

export const checkoutSchema = z.object({
  email: emailSchema,
  address: addressSchema,
  items: z.array(cartItemSchema).min(1).max(50),
  couponCode: z.string().trim().toUpperCase().max(32).optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(10).max(5000),
  categoryId: z.string().uuid().nullable(),
  priceInr: z.number().int().nonnegative(),
  compareAtPriceInr: z.number().int().nonnegative().nullable(),
  sku: z.string().trim().min(2).max(80),
  isPublished: z.boolean(),
  specifications: z.record(z.string(), z.string()).default({}),
});

export const couponSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9_-]{3,32}$/),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().int().positive(),
  minimumOrderInr: z.number().int().nonnegative(),
  usageLimit: z.number().int().positive().nullable(),
  expiresAt: z.coerce.date().nullable(),
  isActive: z.boolean(),
}).superRefine((coupon, context) => {
  if (coupon.discountType === "percentage" && coupon.discountValue > 100) {
    context.addIssue({ code: "custom", path: ["discountValue"], message: "Percentage discounts cannot exceed 100." });
  }
});

export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
