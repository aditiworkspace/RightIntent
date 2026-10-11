"use client";

import { useState } from "react";

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
        ? "Your details are saved."
        : data.error || "Unable to save details.",
    );
  };
  return (
    <form className="[max-width:550px] [margin-top:45px]" onSubmit={save}>
      <label className="[display:flex] [flex-direction:column] [gap:8px] [margin-bottom:18px] [font:10px_var(--mono)] [text-transform:uppercase]">
        Email
        <input
          value={email}
          readOnly
          className="[min-height:44px] [padding:0_12px] [border:1px_solid_var(--line)] [border-radius:0] [outline-color:var(--terra)] [background:transparent] [color:var(--ink)] [font:13px_var(--sans)] [text-transform:none]"
        />
      </label>
      <label className="[display:flex] [flex-direction:column] [gap:8px] [margin-bottom:18px] [font:10px_var(--mono)] [text-transform:uppercase]">
        Full name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="[min-height:44px] [padding:0_12px] [border:1px_solid_var(--line)] [border-radius:0] [outline-color:var(--terra)] [background:transparent] [color:var(--ink)] [font:13px_var(--sans)] [text-transform:none]"
        />
      </label>
      {message && (
        <p className="[color:var(--terra)] [font-size:12px]">{message}</p>
      )}
      <button
        className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]"
        type="submit"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
