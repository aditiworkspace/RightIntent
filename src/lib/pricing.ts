export type PriceLine = { unitPriceInr: number; quantity: number };
export type CouponRule = { discountType: "percentage" | "fixed"; discountValue: number; minimumOrderInr: number };

export const FREE_SHIPPING_THRESHOLD_INR = 999;
export const STANDARD_SHIPPING_INR = 0;

export function calculateSubtotal(lines: PriceLine[]) {
  return lines.reduce((total, line) => total + line.unitPriceInr * line.quantity, 0);
}

export function calculateDiscount(subtotalInr: number, coupon?: CouponRule) {
  if (!coupon || subtotalInr < coupon.minimumOrderInr) return 0;
  const discount = coupon.discountType === "percentage"
    ? Math.floor(subtotalInr * coupon.discountValue / 100)
    : coupon.discountValue;
  return Math.min(Math.max(discount, 0), subtotalInr);
}

export function calculateShipping(subtotalAfterDiscountInr: number) {
  return subtotalAfterDiscountInr >= FREE_SHIPPING_THRESHOLD_INR ? 0 : STANDARD_SHIPPING_INR;
}

export function calculateOrderTotal(lines: PriceLine[], coupon?: CouponRule) {
  const subtotalInr = calculateSubtotal(lines);
  const discountInr = calculateDiscount(subtotalInr, coupon);
  const shippingInr = calculateShipping(subtotalInr - discountInr);
  return { subtotalInr, discountInr, shippingInr, taxInr: 0, totalInr: subtotalInr - discountInr + shippingInr };
}
