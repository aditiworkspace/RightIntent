"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { BrandLogo } from "@/components/store/brand-logo";

type LoginMode = "phone" | "email";
type LoginStep = "identifier" | "otp" | "email-sent";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("phone");
  const [step, setStep] = useState<LoginStep>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const nextPath = typeof window === "undefined" ? "/account" : new URLSearchParams(window.location.search).get("next") || "/account";

  const sendCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setMessage("");
    const supabase = createSupabaseBrowserClient();
    const target = mode === "phone" && !identifier.startsWith("+") ? `+91${identifier}` : identifier;
    const result = mode === "phone" ? await supabase.auth.signInWithOtp({ phone: target }) : await supabase.auth.signInWithOtp({ email: target, options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}` } });
    setLoading(false);
    if (result.error) setMessage(result.error.message);
    else { setIdentifier(target); setStep(mode === "phone" ? "otp" : "email-sent"); setMessage(mode === "phone" ? "We sent a verification code to your mobile." : "Open the secure sign-in link sent to your email to continue."); }
  };

  const verifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setMessage("");
    const supabase = createSupabaseBrowserClient();
    const result = mode === "phone" ? await supabase.auth.verifyOtp({ phone: identifier, token: otp, type: "sms" }) : await supabase.auth.verifyOtp({ email: identifier, token: otp, type: "email" });
    setLoading(false);
    if (result.error) setMessage(result.error.message); else router.push(nextPath);
  };

  const googleLogin = async () => {
    const { error } = await createSupabaseBrowserClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}` } });
    if (error) setMessage(error.message);
  };

  return <main className="[min-height:100vh] [display:grid] [place-items:center] [padding:35px_20px] [background:var(--cream)]"><div className="[width:min(440px,_100%)] [padding:45px] [background:var(--paper)] [&_.wordmark]:[display:block] [&_.wordmark]:[margin-bottom:75px] [&_h1]:[margin:0] [&_h1]:[font:400_48px_var(--serif)] [&_h1]:[letter-spacing:-.06em] max-[800px]:[padding:30px_24px]"><BrandLogo /><p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">Sign in / Create account</p><h1>{step === "identifier" ? "Welcome to Right Intent." : step === "email-sent" ? "Check your inbox." : "Check your code."}</h1><p className="[max-width:300px] [margin:20px_0_30px] [color:var(--muted)] [font-size:13px] [line-height:1.6]">{step === "identifier" ? "Use your mobile number or email to continue. Your bag will be waiting when you return." : step === "email-sent" ? `We sent a secure sign-in link to ${identifier}. Open it on this device to continue.` : `Enter the six-digit code sent to ${identifier}.`}</p>{step === "identifier" ? <><div className="[display:grid] [grid-template-columns:1fr_1fr] [margin-bottom:28px] [border-bottom:1px_solid_var(--line)] [&_button]:[padding:12px_0] [&_button]:[color:var(--muted)] [&_button]:[font:10px_var(--mono)] [&_button]:[text-transform:uppercase] [&_button.active]:[color:var(--ink)] [&_button.active]:[border-bottom:2px_solid_var(--terra)]"><button type="button" className={mode === "phone" ? "active" : ""} onClick={() => { setMode("phone"); setMessage(""); }}>Phone number</button><button type="button" className={mode === "email" ? "active" : ""} onClick={() => { setMode("email"); setMessage(""); }}>Email address</button></div><form onSubmit={sendCode}><label className="[display:flex] [flex-direction:column] [gap:8px] [margin-bottom:18px] [font:10px_var(--mono)] [text-transform:uppercase]">{mode === "phone" ? "Mobile number" : "Email address"}<input autoFocus type={mode === "phone" ? "tel" : "email"} inputMode={mode === "phone" ? "tel" : "email"} value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder={mode === "phone" ? "9876543210" : "you@gmail.com"} pattern={mode === "phone" ? "(?:\\+91)?[6-9][0-9]{9}" : undefined} required className="[min-height:44px] [padding:0_12px] [border:1px_solid_var(--line)] [border-radius:0] [outline-color:var(--terra)] [background:transparent] [color:var(--ink)] [font:13px_var(--sans)] [text-transform:none]" /></label>{message && <p className="[color:var(--terra)] [font-size:12px]">{message}</p>}<button className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)] [width:100%]" disabled={loading}>{loading ? <LoaderCircle className="[animation:spin_1s_linear_infinite]" size={16} /> : <>Continue <ArrowRight size={16} /></>}</button></form><div className="[display:flex] [align-items:center] [gap:10px] [margin:27px_0] [color:var(--muted)] [font:9px_var(--mono)] [text-transform:uppercase] [&:before]:[content:''] [&:before]:[height:1px] [&:before]:[flex:1] [&:before]:[background:var(--line)] [&:after]:[content:''] [&:after]:[height:1px] [&:after]:[flex:1] [&:after]:[background:var(--line)]"><span>or</span></div><button className="[width:100%] [display:flex] [justify-content:space-between] [padding:14px_0] [border-bottom:1px_solid_var(--ink)] [font:11px_var(--mono)] [text-transform:uppercase]" onClick={googleLogin}>Continue with Google <ArrowRight size={16} /></button><p className="[margin:28px_0_0] [color:var(--muted)] [font-size:10px] [line-height:1.6]">By continuing, you agree to Right Intent&apos;s terms and privacy policy.</p></> : step === "email-sent" ? <><p className="[color:var(--terra)] [font-size:12px]">{message}</p><button className="[display:flex] [align-items:center] [gap:7px] [margin:24px_auto_0] [color:var(--muted)] [font:10px_var(--mono)] [text-decoration:underline]" type="button" onClick={() => { setStep("identifier"); setMessage(""); }}><ArrowLeft size={14} /> Use another email</button></> : <form onSubmit={verifyCode}><label className="[display:flex] [flex-direction:column] [gap:8px] [margin-bottom:18px] [font:10px_var(--mono)] [text-transform:uppercase]">Verification code<input autoFocus inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="123456" pattern="[0-9]{6}" maxLength={6} required className="[min-height:44px] [padding:0_12px] [border:1px_solid_var(--line)] [border-radius:0] [outline-color:var(--terra)] [background:transparent] [color:var(--ink)] [font:13px_var(--sans)] [text-transform:none]" /></label>{message && <p className="[color:var(--terra)] [font-size:12px]">{message}</p>}<button className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)] [width:100%]" disabled={loading}>{loading ? <LoaderCircle className="[animation:spin_1s_linear_infinite]" size={16} /> : <>Verify and continue <ArrowRight size={16} /></>}</button><button className="[display:flex] [align-items:center] [gap:7px] [margin:24px_auto_0] [color:var(--muted)] [font:10px_var(--mono)] [text-decoration:underline]" type="button" onClick={() => { setStep("identifier"); setOtp(""); setMessage(""); }}><ArrowLeft size={14} /> Change number</button></form>}</div></main>;
}
