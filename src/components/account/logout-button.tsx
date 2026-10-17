"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LoaderCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--line)] text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--terra)] hover:border-[var(--terra)] transition-colors"
    >
      {loading ? (
        <LoaderCircle className="animate-spin" size={13} />
      ) : (
        <LogOut size={13} />
      )}
      <span>Log out</span>
    </button>
  );
}
