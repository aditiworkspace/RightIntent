"use client";

import { useState } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";

export function ProfileForm({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) {
  const [name, setName] = useState(fullName);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: name }),
    });
    const data = await response.json();
    setSaving(false);
    setMessage(
      response.ok
        ? "Your profile changes were saved successfully."
        : data.error || "Unable to save details.",
    );
  };

  return (
    <div className="max-w-xl p-6 sm:p-8 rounded-2xl bg-white border border-[var(--line)] shadow-sm">
      <form onSubmit={save} className="space-y-5">
        <div>
          <label className="block text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] mb-1.5">
            Registered Email Address
          </label>
          <input
            value={email}
            readOnly
            className="editorial-input w-full bg-[var(--paper)] cursor-not-allowed opacity-80"
          />
          <span className="block mt-1.5 text-[11px] text-[var(--muted)]">
            Primary identifier managed securely via Supabase Auth.
          </span>
        </div>

        <div>
          <label className="block text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] mb-1.5">
            Full Name
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="Your full legal or preferred name"
            className="editorial-input w-full"
          />
        </div>

        {message && (
          <div className="p-3 rounded-lg bg-[var(--cream)]/60 text-[var(--ink)] text-[12px] font-[family-name:var(--mono)]">
            {message}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="editorial-btn editorial-btn-primary min-h-[46px]"
          >
            {saving ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : (
              "Save profile changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
