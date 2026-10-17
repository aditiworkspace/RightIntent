"use client";

import { useState } from "react";
import { LoaderCircle, Plus, Trash2, MapPin, Check } from "lucide-react";

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
  const [showAddForm, setShowAddForm] = useState(initialAddresses.length === 0);
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
      setMessage("Address saved successfully.");
      setShowAddForm(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    setAddresses((current) => current.filter((address) => address._id !== id));
  };

  const fields: Array<[keyof typeof form, string, string]> = [
    ["recipientName", "Full recipient name", "E.g. Siddharth Rao"],
    ["phone", "Mobile number", "10-digit number for courier contact"],
    ["houseNumber", "House / Flat / Studio", "E.g. Apt 4B, Lotus Enclave"],
    ["streetArea", "Street / Area", "E.g. Indiranagar 100ft Road"],
    ["city", "City", "E.g. Bengaluru"],
    ["state", "State", "E.g. Karnataka"],
    ["pincode", "Pincode", "6-digit postal code"],
    ["landmark", "Landmark (optional)", "Near Metro Station / Landmark"],
  ];

  return (
    <div className="space-y-8">
      {addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <article
              key={address._id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[var(--line)] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <strong className="font-[family-name:var(--serif)] text-[18px] text-[var(--ink)]">
                      {address.recipientName}
                    </strong>
                    {address.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-[rgba(79,128,85,0.1)] text-[#4f8055] font-[family-name:var(--mono)] text-[9px] uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </div>
                  <button
                    aria-label="Delete address"
                    onClick={() => remove(address._id)}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--terra)] transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-[13px] leading-relaxed text-[var(--muted)] m-0 mb-3">
                  {address.houseNumber}, {address.streetArea}, {address.city},{" "}
                  {address.state} - {address.pincode}
                  {address.landmark && ` (Near ${address.landmark})`}
                </p>
              </div>
              <div className="pt-3 border-t border-[rgba(28,38,34,0.06)] flex items-center justify-between text-[11px] font-[family-name:var(--mono)] text-[var(--muted)]">
                <span>Phone: {address.phone}</span>
                <span className="text-[var(--ink)]">India</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="editorial-btn editorial-btn-secondary"
        >
          <Plus size={14} /> Add new address
        </button>
      ) : (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[var(--line)] shadow-sm max-w-2xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--line)]">
            <h3 className="m-0 font-[family-name:var(--serif)] text-[22px] font-normal text-[var(--ink)]">
              Add New Shipping Address
            </h3>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)]"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(([key, label, placeholder]) => (
                <div key={key} className={key === "houseNumber" || key === "streetArea" ? "sm:col-span-2" : ""}>
                  <label className="block text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] mb-1.5">
                    {label}
                  </label>
                  <input
                    value={form[key]}
                    onChange={(event) => update(key, event.target.value)}
                    placeholder={placeholder}
                    required={key !== "landmark"}
                    className="editorial-input w-full"
                  />
                </div>
              ))}
            </div>

            {message && (
              <p className="text-[12px] font-[family-name:var(--mono)] text-[var(--terra)] pt-2">
                {message}
              </p>
            )}

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="editorial-btn editorial-btn-primary"
              >
                {saving ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  "Save address destination"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
