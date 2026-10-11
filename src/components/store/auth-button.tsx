"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthButton() {
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ? { id: session.user.id } : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (currentUser) {
    return (
      <Link
        href="/account"
        aria-label="Account"
        className="max-[960px]:[display:none] [&_svg]:[width:19px] [&_svg]:[height:19px]"
      >
        <UserRound size={19} />
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      aria-label="Log in / Sign up"
      className="[display:inline-flex] [align-items:center] [gap:6px] [font:10px_var(--mono)] [text-transform:uppercase] [letter-spacing:.08em] [color:var(--ink)] [&:hover]:[color:var(--terra)] max-[960px]:[display:none]"
    >
      <UserRound size={19} />
      Log in / Sign up
    </Link>
  );
}
