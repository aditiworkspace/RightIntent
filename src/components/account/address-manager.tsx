"use client";

import { useState } from "react";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";

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

export function AddressManager({
  initialAddresses,
}: {
  initialAddresses: Address[];
}) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    recipientName: "",
    phone: "",
    houseNumber: "",
    streetArea: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, country: "India" }),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) setMessage(data.error || "Could not save address.");
    else {
      setAddresses((current) => [data.address, ...current]);
      setForm({
        recipientName: "",
        phone: "",
        houseNumber: "",
        streetArea: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
      });
      setMessage("Address saved.");
    }
  };
  const remove = async (id: string) => {
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    setAddresses((current) => current.filter((address) => address._id !== id));
  };
  const fields: Array<[keyof typeof form, string]> = [
    ["recipientName", "Full name"],
    ["phone", "Mobile number"],
    ["houseNumber", "House / Flat number"],
    ["streetArea", "Street / Area"],
    ["city", "City"],
    ["state", "State"],
    ["pincode", "Pincode"],
    ["landmark", "Landmark (optional)"],
  ];
  return (
    <div className="address-manager">
      {addresses.length > 0 && (
        <div className="saved-addresses">
          {addresses.map((address) => (
            <article className="saved-address" key={address._id}>
              <div>
                <strong>{address.recipientName}</strong>
                {address.isDefault && (
                  <span className="address-default">Default</span>
                )}
                <p>
                  {address.houseNumber}, {address.streetArea}, {address.city},{" "}
                  {address.state} - {address.pincode}
                </p>
                <small>{address.phone}</small>
              </div>
              <button
                aria-label="Delete address"
                onClick={() => remove(address._id)}
              >
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>
      )}
      <form className="[max-width:550px] [margin-top:45px]" onSubmit={save}>
        <p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">
          <Plus size={13} /> Add address
        </p>
        {fields.map(([key, label]) => (
          <label
            key={key}
            className="[display:flex] [flex-direction:column] [gap:8px] [margin-bottom:18px] [font:10px_var(--mono)] [text-transform:uppercase]"
          >
            {label}
            <input
              value={form[key]}
              onChange={(event) => update(key, event.target.value)}
              required={key !== "landmark"}
              className="[min-height:44px] [padding:0_12px] [border:1px_solid_var(--line)] [border-radius:0] [outline-color:var(--terra)] [background:transparent] [color:var(--ink)] [font:13px_var(--sans)] [text-transform:none]"
            />
          </label>
        ))}
        {message && (
          <p className="[color:var(--terra)] [font-size:12px]">{message}</p>
        )}
        <button
          className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]"
          disabled={saving}
        >
          {saving ? (
            <LoaderCircle
              className="[animation:spin_1s_linear_infinite]"
              size={16}
            />
          ) : (
            "Save address"
          )}
        </button>
      </form>
    </div>
  );
}
