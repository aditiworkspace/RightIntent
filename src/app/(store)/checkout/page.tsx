"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  LoaderCircle,
  LockKeyhole,
  X,
  ShieldCheck,
  MapPin,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { RouteNav } from "@/components/store/route-page";
import { useCartStore } from "@/lib/cart-store";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Address = {
  _id: string;
  recipientName: string;
  phone: string;
  houseNumber: string;
  streetArea: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [email, setEmail] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneStep, setPhoneStep] = useState<"number" | "otp">("number");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [localPhoneVerified, setLocalPhoneVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  useEffect(() => {
    void useCartStore.persist.rehydrate();
    const load = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) {
          router.replace("/login?next=/checkout");
          return;
        }
        setEmail(user.email || "");
        setPhone(user.phone?.replace(/^\+91/, "") || "");
        setPhoneVerified(Boolean(user.phone));

        const response = await fetch("/api/account/addresses");
        if (response.status === 401) {
          router.replace("/login?next=/checkout");
          return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load addresses.");
        setAddresses(data.addresses ?? []);
        setSelectedAddress(
          data.addresses?.find((address: Address) => address.isDefault)?._id ??
            data.addresses?.[0]?._id ??
            "",
        );
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Unable to load checkout details.",
        );
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [router]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const address = addresses.find((entry) => entry._id === selectedAddress);

  const pay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!address) {
      setMessage("Please select or add a delivery address to continue.");
      return;
    }
    if (!items.length) {
      setMessage("Your cart is empty.");
      return;
    }
    if (!phoneVerified && !localPhoneVerified) {
      setPhoneModalOpen(true);
      setPhoneMessage("Verify your mobile number to continue securely.");
      return;
    }
    setPaying(true);
    setMessage("");
    const response = await fetch("/api/checkout/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        couponCode: couponCode || undefined,
        items: items.map((item) => ({
          productId: item.slug,
          quantity: item.quantity,
        })),
        address: {
          recipientName: address.recipientName,
          phone: address.phone,
          houseNumber: address.houseNumber,
          streetArea: address.streetArea,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          landmark: address.landmark,
          country: "India",
        },
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Unable to start payment.");
      setPaying(false);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      if (!window.Razorpay) {
        setMessage("Payment checkout could not load.");
        setPaying(false);
        return;
      }
      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Right Intent",
        description: "Right Intent Order Checkout",
        order_id: data.razorpayOrderId,
        prefill: {
          email,
          contact: address.phone,
          name: address.recipientName,
        },
        handler: async (payment: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          if (payment.razorpay_order_id !== data.razorpayOrderId) {
            setMessage("Payment order mismatch. Please try again.");
            setPaying(false);
            return;
          }
          const verification = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              razorpayOrderId: payment.razorpay_order_id,
              razorpayPaymentId: payment.razorpay_payment_id,
              razorpaySignature: payment.razorpay_signature,
              amount: data.amount,
            }),
          });
          if (!verification.ok) {
            setMessage(
              "Payment could not be verified. Please contact support immediately.",
            );
            setPaying(false);
            return;
          }
          clearCart();
          router.push(`/order-success?order=${data.orderId}`);
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      checkout.open();
    };
    script.onerror = () => {
      setMessage("Payment checkout could not load.");
      setPaying(false);
    };
    document.body.appendChild(script);
  };

  const sendPhoneCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setPhoneMessage("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setPhoneLoading(true);
    setPhoneMessage("");
    const devVerification = await fetch("/api/account/phone/dev-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: digits, otp: "123456" }),
    });
    if (devVerification.ok) {
      setPhone(digits);
      setLocalPhoneVerified(true);
      setPhoneModalOpen(false);
      setPhoneMessage("");
      setMessage(
        "Mobile number verified in local development mode. You can now pay securely.",
      );
      setPhoneLoading(false);
      return;
    }
    const result = await createSupabaseBrowserClient().auth.updateUser({
      phone: `+91${digits}`,
    });
    setPhoneLoading(false);
    if (result.error) {
      setPhoneMessage(result.error.message);
      return;
    }
    setPhone(digits);
    setPhoneStep("otp");
    setPhoneMessage("Enter the six-digit code sent to your mobile.");
  };

  const verifyPhone = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPhoneLoading(true);
    setPhoneMessage("");
    const supabase = createSupabaseBrowserClient();
    const result = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: phoneOtp,
      type: "phone_change",
    });
    setPhoneLoading(false);
    if (result.error) {
      setPhoneMessage(result.error.message);
      return;
    }
    const refreshed = await supabase.auth.refreshSession();
    if (refreshed.error) {
      setPhoneMessage("Number verified. Refresh this page before continuing.");
      return;
    }
    setPhoneVerified(true);
    setPhoneModalOpen(false);
    setPhoneStep("number");
    setPhoneOtp("");
    setPhoneMessage("");
    setMessage("Mobile number verified. You can now pay securely.");
  };

  return (
    <>
      <RouteNav />
      <main className="max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-16">
        <Link
          className="inline-flex items-center gap-2 font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)] mb-8"
          href="/cart"
        >
          <ArrowLeft size={14} /> Back to bag
        </Link>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <LoaderCircle className="animate-spin text-[var(--terra)]" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Section: Details & Shipping Choice */}
            <div className="lg:col-span-7">
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-[rgba(28,38,34,0.05)] text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] mb-3">
                  Step 2 of 2 · Secure Checkout
                </span>
                <h1 className="font-[family-name:var(--serif)] text-[clamp(34px,4vw,54px)] font-normal tracking-tight text-[var(--ink)] m-0">
                  Review & Complete
                </h1>
                <p className="mt-2 text-[14px] text-[var(--muted)]">
                  Confirm your delivery destination and finalize your order.
                </p>
              </div>

              <form onSubmit={pay} className="space-y-8">
                {/* Contact Card */}
                <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-sm">
                  <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--ink)] mb-4 pb-3 border-b border-[rgba(28,38,34,0.08)]">
                    <span className="w-5 h-5 rounded-full bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span>Account Contact</span>
                  </div>
                  <label className="block text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] mb-2">
                    Confirmation Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="editorial-input w-full"
                    placeholder="you@domain.com"
                  />
                  <span className="block mt-2 text-[11px] text-[var(--muted)]">
                    We will send your invoice, dispatch tracking, and digital guides here.
                  </span>
                </div>

                {/* Delivery Address Card */}
                <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(28,38,34,0.08)]">
                    <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--ink)]">
                      <span className="w-5 h-5 rounded-full bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center text-[10px]">
                        2
                      </span>
                      <span>Delivery Address</span>
                    </div>
                    <Link
                      href="/account/addresses"
                      className="inline-flex items-center gap-1 text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--terra)] hover:underline"
                    >
                      <Plus size={12} /> Add new
                    </Link>
                  </div>

                  {addresses.length ? (
                    <div className="grid gap-3">
                      {addresses.map((entry) => {
                        const isSelected = selectedAddress === entry._id;
                        return (
                          <label
                            key={entry._id}
                            className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? "bg-[rgba(187,98,73,0.04)] border-[var(--terra)] shadow-sm"
                                : "bg-white border-[var(--line)] hover:border-[var(--ink)]"
                            }`}
                          >
                            <input
                              type="radio"
                              name="address"
                              checked={isSelected}
                              onChange={() => setSelectedAddress(entry._id)}
                              className="mt-1 accent-[var(--terra)]"
                            />
                            <div className="text-[13px] leading-relaxed">
                              <div className="flex items-center gap-2">
                                <strong className="font-medium text-[var(--ink)]">
                                  {entry.recipientName}
                                </strong>
                                <span className="font-[family-name:var(--mono)] text-[11px] text-[var(--muted)]">
                                  · {entry.phone}
                                </span>
                                {entry.isDefault && (
                                  <span className="px-2 py-0.5 rounded text-[9px] font-[family-name:var(--mono)] uppercase tracking-wider bg-[var(--cream)] text-[var(--ink)]">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="m-0 mt-1 text-[var(--muted)]">
                                {entry.houseNumber}, {entry.streetArea}, {entry.city},{" "}
                                {entry.state} - {entry.pincode}
                                {entry.landmark && ` (Near ${entry.landmark})`}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <MapPin size={24} className="mx-auto text-[var(--muted)] mb-2" />
                      <p className="text-[13px] text-[var(--muted)] mb-3">
                        No saved delivery addresses found.
                      </p>
                      <Link
                        className="editorial-btn editorial-btn-primary text-[10px]"
                        href="/account/addresses"
                      >
                        Add address to continue
                      </Link>
                    </div>
                  )}
                </div>

                {/* Promotional Code */}
                <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-sm">
                  <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--ink)] mb-4 pb-3 border-b border-[rgba(28,38,34,0.08)]">
                    <span className="w-5 h-5 rounded-full bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span>Discount or Gift Code</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(event) =>
                        setCouponCode(event.target.value.toUpperCase())
                      }
                      placeholder="Enter promo code (e.g. WELCOME10)"
                      className="editorial-input flex-1"
                    />
                    <button
                      type="button"
                      className="editorial-btn editorial-btn-secondary px-5 text-[10px]"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {message && (
                  <div className="p-4 rounded-xl bg-[rgba(187,98,73,0.1)] border border-[var(--terra)] text-[var(--terra)] text-[12px] font-[family-name:var(--mono)]">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={paying}
                  className="editorial-btn editorial-btn-primary w-full min-h-[56px] text-[13px]"
                >
                  {paying ? (
                    <LoaderCircle className="animate-spin" size={18} />
                  ) : (
                    <>
                      Pay securely with Razorpay <LockKeyhole size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Section: Order Breakdown */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[var(--line)] shadow-sm sticky top-28">
                <h3 className="m-0 font-[family-name:var(--serif)] text-[22px] font-normal text-[var(--ink)] pb-4 border-b border-[var(--line)]">
                  Order Summary
                </h3>

                {items.length ? (
                  <>
                    <div className="divide-y divide-[rgba(28,38,34,0.06)] py-2">
                      {items.map((item) => (
                        <div
                          key={item.slug}
                          className="py-3 flex justify-between items-center text-[12px] font-[family-name:var(--mono)]"
                        >
                          <div className="pr-4">
                            <span className="font-medium text-[var(--ink)] block">
                              {item.name}
                            </span>
                            <span className="text-[var(--muted)] text-[11px]">
                              Qty: {item.quantity} · Rs. {item.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <strong className="text-[var(--ink)] shrink-0">
                            Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2.5 py-4 border-y border-[var(--line)] text-[13px]">
                      <div className="flex justify-between text-[var(--muted)]">
                        <span>Items Subtotal</span>
                        <span className="font-[family-name:var(--mono)] text-[var(--ink)]">
                          Rs. {subtotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-[var(--muted)]">
                        <span>Shipping</span>
                        <span className="font-[family-name:var(--mono)] text-[#4f8055]">
                          FREE
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline pt-4 pb-2">
                      <span className="font-[family-name:var(--serif)] text-[20px] text-[var(--ink)]">
                        Total Amount
                      </span>
                      <span className="font-[family-name:var(--mono)] text-[24px] font-medium text-[var(--ink)]">
                        Rs. {subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="mt-6 p-3 rounded-xl bg-[rgba(28,38,34,0.03)] border border-[rgba(28,38,34,0.06)] flex items-center gap-2 text-[10px] font-[family-name:var(--mono)] text-[var(--muted)]">
                      <ShieldCheck size={16} className="text-[#4f8055] shrink-0" />
                      <span>Razorpay verified checkout. Cards, UPI, Netbanking, & EMI accepted.</span>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-[var(--muted)]">
                    Bag is empty.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Phone Verification Modal */}
        {phoneModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
              className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white border border-[var(--line)] shadow-2xl"
              role="dialog"
              aria-modal="true"
            >
              <button
                className="absolute top-4 right-4 p-2 text-[var(--muted)] hover:text-[var(--ink)]"
                aria-label="Close"
                onClick={() => setPhoneModalOpen(false)}
              >
                <X size={18} />
              </button>
              <span className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--terra)]">
                Security Verification
              </span>
              <h2 className="font-[family-name:var(--serif)] text-[26px] font-normal text-[var(--ink)] mt-1 mb-2">
                Verify Mobile Number
              </h2>
              <p className="text-[13px] text-[var(--muted)] mb-6">
                We protect your order and deliveries with a verified SMS contact.
              </p>

              {phoneStep === "number" ? (
                <form onSubmit={sendPhoneCode} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] mb-1.5">
                      10-Digit Mobile Number
                    </label>
                    <input
                      autoFocus
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                      className="editorial-input w-full"
                    />
                  </div>
                  {phoneMessage && (
                    <p className="text-[12px] text-[var(--terra)]">{phoneMessage}</p>
                  )}
                  <button
                    type="submit"
                    disabled={phoneLoading}
                    className="editorial-btn editorial-btn-primary w-full"
                  >
                    {phoneLoading ? (
                      <LoaderCircle className="animate-spin" size={16} />
                    ) : (
                      "Send Verification Code"
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={verifyPhone} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] mb-1.5">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      autoFocus
                      inputMode="numeric"
                      value={phoneOtp}
                      onChange={(event) => setPhoneOtp(event.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      required
                      className="editorial-input w-full"
                    />
                  </div>
                  {phoneMessage && (
                    <p className="text-[12px] text-[var(--terra)]">{phoneMessage}</p>
                  )}
                  <button
                    type="submit"
                    disabled={phoneLoading}
                    className="editorial-btn editorial-btn-primary w-full"
                  >
                    {phoneLoading ? (
                      <LoaderCircle className="animate-spin" size={16} />
                    ) : (
                      "Verify & Proceed to Pay"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneStep("number");
                      setPhoneMessage("");
                    }}
                    className="w-full text-center text-[11px] font-[family-name:var(--mono)] text-[var(--muted)] hover:text-[var(--ink)] mt-2"
                  >
                    Change mobile number
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
