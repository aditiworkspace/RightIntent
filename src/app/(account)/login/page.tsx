"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle, ShieldCheck, Smartphone, Mail, RefreshCw } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { BrandLogo } from "@/components/store/brand-logo";

type LoginMode = "phone" | "email";
type LoginStep = "identifier" | "otp" | "email-sent";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [nextPath, setNextPath] = useState("/account");
  const [mode, setMode] = useState<LoginMode>("phone");
  const [step, setStep] = useState<LoginStep>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      setNextPath(next);
    }
    // Show any error forwarded back from the OAuth callback route.
    const cbError = params.get("error_description") || params.get("error");
    if (cbError) {
      setMessage(decodeURIComponent(cbError));
    }
  }, []);

  const triggerCooldown = () => {
    setResendCooldown(30);
    const interval = window.setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getCleanPhone = (val: string) => {
    const raw = val.replace(/\D/g, "");
    if (raw.startsWith("91") && raw.length === 12) return `+${raw}`;
    return `+91${raw}`;
  };

  const sendCode = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    setLoading(true);
    setMessage("");

    let target = identifier.trim();
    if (mode === "phone") {
      const digits = target.replace(/\D/g, "");
      const cleanDigits = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
      if (!/^[6-9]\d{9}$/.test(cleanDigits)) {
        setLoading(false);
        setMessage("Please enter a valid 10-digit Indian mobile number.");
        return;
      }
      target = `+91${cleanDigits}`;
    }

    const supabase = createSupabaseBrowserClient();
    const result =
      mode === "phone"
        ? await supabase.auth.signInWithOtp({
            phone: target,
            options: { channel: "sms" },
          })
        : await supabase.auth.signInWithOtp({
            email: target,
            options: {
              shouldCreateUser: true,
              emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
            },
          });

    setLoading(false);
    if (result.error) {
      setMessage(result.error.message);
    } else {
      setIdentifier(target);
      setStep(mode === "phone" ? "otp" : "email-sent");
      triggerCooldown();
      setMessage(
        mode === "phone"
          ? "We sent a 6-digit verification code to your mobile via SMS."
          : "Open the secure sign-in link sent to your email to continue.",
      );
    }
  };

  const verifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createSupabaseBrowserClient();

    const result =
      mode === "phone"
        ? await supabase.auth.verifyOtp({
            phone: identifier,
            token: otp.trim(),
            type: "sms",
          })
        : await supabase.auth.verifyOtp({
            email: identifier,
            token: otp.trim(),
            type: "email",
          });

    setLoading(false);
    if (result.error) {
      setMessage(result.error.message);
    } else {
      router.push(nextPath);
      router.refresh();
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    setMessage("");
    const { error } = await createSupabaseBrowserClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) {
      setLoading(false);
      setMessage(error.message);
    }
  };

  return (
    <main
      suppressHydrationWarning
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[var(--cream)]"
    >
      <div
        suppressHydrationWarning
        className="w-full max-w-[460px] p-8 sm:p-12 rounded-3xl bg-white border border-[var(--line)] shadow-xl"
      >
        <div className="mb-8">
          <BrandLogo />
        </div>

        <div className="mb-6">
          <span className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-[0.16em] text-[var(--terra)]">
            Member Access
          </span>
          <h1 className="font-[family-name:var(--serif)] text-[clamp(28px,4vw,38px)] font-normal tracking-tight text-[var(--ink)] mt-1 mb-2">
            {!mounted
              ? "Welcome to Right Intent."
              : step === "identifier"
              ? "Welcome to Right Intent."
              : step === "email-sent"
              ? "Check your inbox."
              : "Verify your code."}
          </h1>
          <p className="text-[13px] leading-relaxed text-[var(--muted)]">
            {!mounted
              ? "Enter your mobile or email to enter your studio. Your session will stay saved for up to 28 days."
              : step === "identifier"
              ? "Enter your mobile or email to enter your studio. Your session will stay saved for up to 28 days."
              : step === "email-sent"
              ? `We sent a magic sign-in link to ${identifier}. Tap it on this device to proceed.`
              : `Enter the 6-digit SMS verification code sent to ${identifier}.`}
          </p>
        </div>

        {!mounted ? (
          <div className="h-56 flex items-center justify-center">
            <LoaderCircle className="animate-spin text-[var(--terra)]" size={24} />
          </div>
        ) : step === "identifier" ? (
          <>
            {/* Mode switch */}
            <div className="grid grid-cols-2 gap-1 p-1 mb-6 rounded-xl bg-[var(--paper)] border border-[rgba(28,38,34,0.08)]">
              <button
                type="button"
                onClick={() => {
                  setMode("phone");
                  setMessage("");
                }}
                className={`flex items-center justify-center gap-1.5 py-2 text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider rounded-lg transition-all ${
                  mode === "phone"
                    ? "bg-white text-[var(--ink)] shadow-sm font-medium"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <Smartphone size={13} /> Mobile
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("email");
                  setMessage("");
                }}
                className={`flex items-center justify-center gap-1.5 py-2 text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider rounded-lg transition-all ${
                  mode === "email"
                    ? "bg-white text-[var(--ink)] shadow-sm font-medium"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <Mail size={13} /> Email
              </button>
            </div>

            <form onSubmit={sendCode} className="space-y-4">
              <div>
                <label className="block text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  {mode === "phone" ? "Mobile Number (India +91)" : "Email Address"}
                </label>
                <input
                  autoFocus
                  suppressHydrationWarning
                  type={mode === "phone" ? "tel" : "email"}
                  inputMode={mode === "phone" ? "tel" : "email"}
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder={mode === "phone" ? "9876543210" : "alex@example.com"}
                  required
                  className="editorial-input w-full"
                />
              </div>

              {message && (
                <div className="p-3 rounded-lg bg-[rgba(187,98,73,0.08)] text-[var(--terra)] text-[12px] font-[family-name:var(--mono)]">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="editorial-btn editorial-btn-primary w-full min-h-[50px] text-[12px]"
              >
                {loading ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  <>
                    Continue <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-[10px] font-[family-name:var(--mono)] text-[var(--muted)] uppercase tracking-wider">
              <div className="h-[1px] flex-1 bg-[var(--line)]" />
              <span>or</span>
              <div className="h-[1px] flex-1 bg-[var(--line)]" />
            </div>

            <button
              type="button"
              onClick={googleLogin}
              disabled={loading}
              className="editorial-btn editorial-btn-secondary w-full text-[11px] flex items-center justify-center gap-2.5 py-3 hover:bg-[var(--cream)]/40 transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </>
        ) : step === "email-sent" ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white border border-[var(--line)] text-[13px] text-[var(--ink)]">
              {message}
            </div>
            <button
              type="button"
              onClick={() => {
                setStep("identifier");
                setMessage("");
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-[family-name:var(--mono)] uppercase text-[var(--muted)] hover:text-[var(--ink)]"
            >
              <ArrowLeft size={13} /> Use another email address
            </button>
          </div>
        ) : (
          <form onSubmit={verifyCode} className="space-y-4">
            <div>
              <label className="block text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] mb-1.5">
                6-Digit Security Code
              </label>
              <input
                autoFocus
                suppressHydrationWarning
                inputMode="numeric"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="123456"
                maxLength={6}
                required
                className="editorial-input w-full text-center tracking-[0.3em] font-[family-name:var(--mono)] text-[18px]"
              />
            </div>

            {message && (
              <div className="p-3 rounded-lg bg-[rgba(187,98,73,0.08)] text-[var(--terra)] text-[12px] font-[family-name:var(--mono)]">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="editorial-btn editorial-btn-primary w-full min-h-[50px] text-[12px]"
            >
              {loading ? (
                <LoaderCircle className="animate-spin" size={16} />
              ) : (
                <>
                  Verify & Sign in <ArrowRight size={14} />
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep("identifier");
                  setOtp("");
                  setMessage("");
                }}
                className="text-[11px] font-[family-name:var(--mono)] text-[var(--muted)] hover:text-[var(--ink)]"
              >
                Change mobile number
              </button>

              <button
                type="button"
                disabled={loading || resendCooldown > 0}
                onClick={() => void sendCode()}
                className="inline-flex items-center gap-1 text-[11px] font-[family-name:var(--mono)] text-[var(--terra)] disabled:text-[var(--muted)]"
              >
                <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-[rgba(28,38,34,0.08)] flex items-center justify-center gap-1.5 text-[10px] font-[family-name:var(--mono)] text-[var(--muted)]">
          <ShieldCheck size={14} className="text-[#4f8055]" />
          <span>Secured by Supabase Auth · 28-day persistent session</span>
        </div>
      </div>
    </main>
  );
}
