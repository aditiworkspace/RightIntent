"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

import { useMounted } from "@/lib/use-mounted";

export function AuthButton() {
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);
  const mounted = useMounted();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // 1. Immediately read existing session from cookies/storage on mount
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (data?.session?.user) {
        setCurrentUser({ id: data.session.user.id, email: data.session.user.email });
      } else {
        setCurrentUser(null);
      }
    });

    // 2. Listen to real-time auth changes (sign-in, sign-out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setCurrentUser({ id: session.user.id, email: session.user.email });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className="[display:inline-flex] [align-items:center] [gap:6px] [font:10px_var(--mono)] [text-transform:uppercase] [letter-spacing:.08em] [color:var(--muted)] opacity-50 max-[960px]:[display:none]"
      >
        <UserRound size={17} />
        Log in / Sign up
      </span>
    );
  }

  if (currentUser) {
    return (
      <Link
        href="/account"
        aria-label="Account"
        className="[display:inline-flex] [align-items:center] [gap:6px] [font:10px_var(--mono)] [text-transform:uppercase] [letter-spacing:.08em] [color:var(--ink)] hover:[color:var(--terra)] transition-colors max-[960px]:[display:none]"
      >
        <UserRound size={17} className="text-[var(--terra)]" />
        <span>Account</span>
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      aria-label="Log in / Sign up"
      className="[display:inline-flex] [align-items:center] [gap:6px] [font:10px_var(--mono)] [text-transform:uppercase] [letter-spacing:.08em] [color:var(--ink)] hover:[color:var(--terra)] transition-colors max-[960px]:[display:none]"
    >
      <UserRound size={17} />
      <span>Log in / Sign up</span>
    </Link>
  );
}
