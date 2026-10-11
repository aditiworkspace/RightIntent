"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, LoaderCircle, LockKeyhole, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { RouteNav } from "@/components/store/route-page";
import { useCartStore } from "@/lib/cart-store";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void }; } }

type Address = { _id: string; recipientName: string; phone: string; houseNumber: string; streetArea: string; city: string; state: string; pincode: string; landmark?: string; isDefault: boolean };

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
        const [{ data: { session } }, response] = await Promise.all([
          supabase.auth.getSession(),
          fetch("/api/account/addresses"),
        ]);
        const user = session?.user;
        if (!user) { router.replace("/login?next=/checkout"); return; }
        setEmail(user.email || "");
        setPhone(user.phone?.replace(/^\+91/, "") || "");
        setPhoneVerified(Boolean(user.phone));
        if (response.status === 401) {
          router.replace("/login?next=/checkout");
          return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load addresses.");
        setAddresses(data.addresses ?? []);
        setSelectedAddress(data.addresses?.find((address: Address) => address.isDefault)?._id ?? data.addresses?.[0]?._id ?? "");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load checkout details.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [router]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const address = addresses.find((entry) => entry._id === selectedAddress);

  const pay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!address) { setMessage("Add and select a delivery address first."); return; }
    if (!items.length) { setMessage("Your cart is empty."); return; }
    if (!phoneVerified && !localPhoneVerified) {
      setPhoneModalOpen(true);
      setPhoneMessage("Verify your mobile number to continue securely.");
      return;
    }
    setPaying(true); setMessage("");
    const response = await fetch("/api/checkout/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, couponCode: couponCode || undefined, items: items.map((item) => ({ productId: item.slug, quantity: item.quantity })), address: { recipientName: address.recipientName, phone: address.phone, houseNumber: address.houseNumber, streetArea: address.streetArea, city: address.city, state: address.state, pincode: address.pincode, landmark: address.landmark, country: "India" } }) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || "Unable to start payment."); setPaying(false); return; }
    const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.onload = () => {
      if (!window.Razorpay) { setMessage("Payment checkout could not load."); setPaying(false); return; }
      const checkout = new window.Razorpay({ key: data.keyId, amount: data.amount, currency: data.currency, name: "Right Intent", description: "Right Intent order", order_id: data.razorpayOrderId, prefill: { email, contact: address.phone, name: address.recipientName }, handler: async (payment: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        if (payment.razorpay_order_id !== data.razorpayOrderId) { setMessage("Payment order mismatch. Please try again."); setPaying(false); return; }
        const verification = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: data.orderId, razorpayOrderId: payment.razorpay_order_id, razorpayPaymentId: payment.razorpay_payment_id, razorpaySignature: payment.razorpay_signature, amount: data.amount }) });
        if (!verification.ok) { setMessage("Payment could not be verified. Please contact support."); setPaying(false); return; }
        clearCart(); router.push(`/order-success?order=${data.orderId}`);
      }, modal: { ondismiss: () => setPaying(false) } }); checkout.open();
    }; script.onerror = () => { setMessage("Payment checkout could not load."); setPaying(false); }; document.body.appendChild(script);
  };

  const sendPhoneCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) { setPhoneMessage("Enter a valid 10-digit Indian mobile number."); return; }
    setPhoneLoading(true); setPhoneMessage("");
    const devVerification = await fetch("/api/account/phone/dev-verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: digits, otp: "123456" }) });
    if (devVerification.ok) {
      setPhone(digits); setLocalPhoneVerified(true); setPhoneModalOpen(false); setPhoneMessage(""); setMessage("Mobile number verified in local development mode. You can now pay securely."); setPhoneLoading(false); return;
    }
    const result = await createSupabaseBrowserClient().auth.updateUser({ phone: `+91${digits}` });
    setPhoneLoading(false);
    if (result.error) { setPhoneMessage(result.error.message); return; }
    setPhone(digits); setPhoneStep("otp"); setPhoneMessage("Enter the six-digit code sent to your mobile.");
  };

  const verifyPhone = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setPhoneLoading(true); setPhoneMessage("");
    const supabase = createSupabaseBrowserClient();
    const result = await supabase.auth.verifyOtp({ phone: `+91${phone}`, token: phoneOtp, type: "phone_change" });
    setPhoneLoading(false);
    if (result.error) { setPhoneMessage(result.error.message); return; }
    const refreshed = await supabase.auth.refreshSession();
    if (refreshed.error) { setPhoneMessage("Number verified. Refresh this page before continuing."); return; }
    setPhoneVerified(true);
    setPhoneModalOpen(false); setPhoneStep("number"); setPhoneOtp(""); setPhoneMessage(""); setMessage("Mobile number verified. You can now pay securely.");
  };

  return <><RouteNav /><main className="[max-width:1240px] [margin:auto] [padding:100px_5vw_140px] [&_h1]:[margin:0] [&_h1]:[font:400_clamp(46px,_6vw,_78px)/1_var(--serif)] [&_h1]:[letter-spacing:-.06em] max-[960px]:[padding:70px_20px_90px]"><Link className="[display:inline-flex] [align-items:center] [gap:8px] [margin-bottom:55px] [font:10px_var(--mono)] [text-transform:uppercase]" href="/cart"><ArrowLeft size={15} /> Back to bag</Link>{loading ? <LoaderCircle className="[animation:spin_1s_linear_infinite]" /> : <div className="[display:grid] [grid-template-columns:1.2fr_.8fr] [gap:10vw] max-[960px]:[display:block]"><section><p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">Checkout</p><h1>Almost yours.</h1><form className="[max-width:550px] [margin-top:45px] [&_fieldset]:[padding:0] [&_fieldset]:[margin:0_0_38px] [&_fieldset]:[border:0] [&_legend]:[margin-bottom:22px] [&_legend]:[font:11px_var(--mono)] [&_legend]:[text-transform:uppercase] [&_label.address-option]:[display:grid] [&_label.address-option]:[grid-template-columns:20px_1fr] [&_label.address-option]:[gap:12px] [&_label.address-option]:[align-items:start] [&_label.address-option]:[padding:16px] [&_label.address-option]:[margin:0] [&_label.address-option]:[border:1px_solid_var(--line)] [&_label.address-option]:[text-transform:none] [&_label.address-option]:[cursor:pointer] [&_label.address-option:has(input:checked)]:[border-color:var(--terra)] [&_label.address-option:has(input:checked)]:[background:rgba(187,_98,_73,_.06)]" onSubmit={pay}><fieldset><legend>Contact</legend><label className="[display:flex] [flex-direction:column] [gap:8px] [margin-bottom:18px] [font:10px_var(--mono)] [text-transform:uppercase]">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="[min-height:44px] [padding:0_12px] [border:1px_solid_var(--line)] [border-radius:0] [outline-color:var(--terra)] [background:transparent] [color:var(--ink)] [font:13px_var(--sans)] [text-transform:none]" /></label></fieldset><fieldset><legend>Delivery address</legend>{addresses.length ? <div className="[display:grid] [gap:10px]">{addresses.map((entry) => <label className="address-option [&_input]:[min-height:18px] [&_input]:[margin-top:2px] [&_input]:[accent-color:var(--terra)] [&_span]:[display:grid] [&_span]:[gap:6px] [&_strong]:[font:14px_var(--sans)] [&_strong]:[text-transform:none] [&_small]:[color:var(--muted)] [&_small]:[font:12px/1.5_var(--sans)] [&_small]:[text-transform:none] [display:flex] [flex-direction:column] [gap:8px] [margin-bottom:18px] [font:10px_var(--mono)] [text-transform:uppercase]" key={entry._id}><input type="radio" name="address" checked={selectedAddress === entry._id} onChange={() => setSelectedAddress(entry._id)} className="[min-height:44px] [padding:0_12px] [border:1px_solid_var(--line)] [border-radius:0] [outline-color:var(--terra)] [background:transparent] [color:var(--ink)] [font:13px_var(--sans)] [text-transform:none]" /><span><strong>{entry.recipientName}</strong><small>{entry.houseNumber}, {entry.streetArea}, {entry.city}, {entry.state} - {entry.pincode}</small></span></label>)}</div> : <Link className="text-link [display:inline-flex] [align-items:center] [gap:9px] [font:10px_var(--mono)] [text-transform:uppercase] [letter-spacing:.08em] [border-bottom:1px_solid_var(--ink)] [padding-bottom:6px]" href="/account/addresses">Add a delivery address <ArrowLeft size={15} /></Link>}</fieldset><fieldset><legend>Discount</legend><label className="[display:flex] [flex-direction:column] [gap:8px] [margin-bottom:18px] [font:10px_var(--mono)] [text-transform:uppercase]">Coupon code<input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder="Optional" className="[min-height:44px] [padding:0_12px] [border:1px_solid_var(--line)] [border-radius:0] [outline-color:var(--terra)] [background:transparent] [color:var(--ink)] [font:13px_var(--sans)] [text-transform:none]" /></label></fieldset>{message && <p className="[color:var(--terra)] [font-size:12px]">{message}</p>}<button className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]" type="submit" disabled={paying}>{paying ? <LoaderCircle className="[animation:spin_1s_linear_infinite]" size={16} /> : <>Pay securely <LockKeyhole size={15} /></>}</button></form></section><aside className="[padding:30px] [background:var(--cream)] [&_h2]:[font-size:30px] max-[960px]:[margin-top:55px]"><p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">Order summary</p>{items.length ? <>{items.map((item) => <div className="[display:flex] [justify-content:space-between] [align-items:baseline] [gap:20px] [padding:10px_0] [border-bottom:1px_solid_rgba(28,_38,_34,_.12)] [font:12px/1.4_var(--mono)] [&_span]:[min-width:0] [&_strong]:[flex:0_0_auto] [&_strong]:[white-space:nowrap]" key={item.slug}><span>{item.name} x {item.quantity}</span><strong>Rs. {(item.price * item.quantity).toLocaleString("en-IN")}</strong></div>)}<div className="[display:flex] [justify-content:space-between] [align-items:baseline] [gap:20px] [padding:10px_0] [border-bottom:1px_solid_rgba(28,_38,_34,_.12)] [font:12px/1.4_var(--mono)] [&_span]:[min-width:0] [&_strong]:[flex:0_0_auto] [&_strong]:[white-space:nowrap] [margin-top:8px] [padding-top:18px] [border-bottom:0] [font-weight:600]"><span>Subtotal</span><strong>Rs. {subtotal.toLocaleString("en-IN")}</strong></div><p className="[display:flex] [align-items:center] [justify-content:center] [gap:6px] [color:var(--muted)] [font:10px_var(--mono)]"><Check size={14} /> Final shipping and discounts are calculated securely at payment.</p></> : <><h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">Your bag is empty</h2><p>Add products before continuing to checkout.</p></>}</aside></div>}{phoneModalOpen && <div className="[position:fixed] [inset:0] [z-index:30] [display:grid] [place-items:center] [padding:20px] [background:rgba(13,_18,_15,_.55)]"><div className="[position:relative] [width:min(460px,_100%)] [padding:38px] [background:var(--paper)] [box-shadow:0_20px_70px_rgba(13,_18,_15,_.2)] [&_h2]:[max-width:330px] [&_h2]:[font-size:38px] [&_form_.button]:[width:100%]" role="dialog" aria-modal="true" aria-labelledby="phone-verification-title"><button className="[position:absolute] [top:22px] [right:22px] [display:grid] [place-items:center] [width:32px] [height:32px] [&:hover]:[color:var(--terra)]" aria-label="Close verification" onClick={() => setPhoneModalOpen(false)}><X size={18} /></button><p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">Secure checkout</p><h2 id="phone-verification-title" className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">Verify your mobile number</h2><p className="[max-width:330px] [margin:16px_0_28px] [color:var(--muted)] [font-size:13px] [line-height:1.6]">We use your verified number for delivery and payment protection.</p>{phoneStep === "number" ? <form onSubmit={sendPhoneCode}><label className="[display:flex] [flex-direction:column] [gap:8px] [margin-bottom:18px] [font:10px_var(--mono)] [text-transform:uppercase]">Mobile number<input autoFocus type="tel" inputMode="numeric" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="9876543210" maxLength={10} required className="[min-height:44px] [padding:0_12px] [border:1px_solid_var(--line)] [border-radius:0] [outline-color:var(--terra)] [background:transparent] [color:var(--ink)] [font:13px_var(--sans)] [text-transform:none]" /></label><button className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]" disabled={phoneLoading}>{phoneLoading ? <LoaderCircle className="[animation:spin_1s_linear_infinite]" size={16} /> : "Send verification code"}</button></form> : <form onSubmit={verifyPhone}><label className="[display:flex] [flex-direction:column] [gap:8px] [margin-bottom:18px] [font:10px_var(--mono)] [text-transform:uppercase]">Verification code<input autoFocus inputMode="numeric" value={phoneOtp} onChange={(event) => setPhoneOtp(event.target.value)} placeholder="123456" maxLength={6} required className="[min-height:44px] [padding:0_12px] [border:1px_solid_var(--line)] [border-radius:0] [outline-color:var(--terra)] [background:transparent] [color:var(--ink)] [font:13px_var(--sans)] [text-transform:none]" /></label><button className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]" disabled={phoneLoading}>{phoneLoading ? <LoaderCircle className="[animation:spin_1s_linear_infinite]" size={16} /> : "Verify number"}</button><button className="[display:flex] [align-items:center] [gap:7px] [margin:24px_auto_0] [color:var(--muted)] [font:10px_var(--mono)] [text-decoration:underline]" type="button" onClick={() => { setPhoneStep("number"); setPhoneMessage(""); }}>Change number</button></form>}{phoneMessage && <p className="[color:var(--terra)] [font-size:12px]">{phoneMessage}</p>}</div></div>}</main></>;
}
