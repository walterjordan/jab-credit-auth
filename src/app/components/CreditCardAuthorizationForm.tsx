"use client";
import { useState } from "react";

type FormState = {
  business: string;
  purpose: string[];
  fullName: string;
  billingAddress: string;
  cityStateZip: string;
  phone: string;
  email: string;
  cardType: string;
  nameOnCard: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  amount: string;
  date: string;
  description: string;
  recurring: boolean;
};

const PURPOSES = [
  "Advertising & Marketing Services",
  "Facebook / Google Ad Spend",
  "Consultation or Campaign Management",
  "Other",
];

export default function CreditCardAuthorizationForm() {
  const [form, setForm] = useState<FormState>({
    business: "",
    purpose: [],
    fullName: "",
    billingAddress: "",
    cityStateZip: "",
    phone: "",
    email: "",
    cardType: "",
    nameOnCard: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
    amount: "",
    date: "",
    description: "",
    recurring: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "purpose") {
      setForm((p) => ({
        ...p,
        purpose: checked ? [...p.purpose, value] : p.purpose.filter((i) => i !== value),
      }));
    } else if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const submit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (j.ok) {
        setMsg("Authorization submitted. Thank you!");
        // Optionally clear sensitive fields:
        setForm((p) => ({ ...p, cardNumber: "", cvv: "" }));
      } else {
        setMsg(`Error: ${j.error || "Unknown"}`);
      }
    } catch (err: any) {
      setMsg(`Network error: ${err?.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-start justify-center p-6 bg-gray-50">
      <form onSubmit={submit} className="w-full max-w-3xl bg-white rounded-2xl shadow p-6 space-y-5">
        <h1 className="text-2xl font-semibold">Credit Card Authorization</h1>

        <div>
          <label className="font-medium">Business</label>
          <select
            name="business"
            value={form.business}
            onChange={onChange}
            required
            className="mt-1 w-full border rounded p-2"
          >
            <option value="">Select…</option>
            <option value="WOW 1 DAY PAINTING – Atlanta">WOW 1 DAY PAINTING – Atlanta</option>
            <option value="Tailor My Space">Tailor My Space</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Purpose of Payment</label>
          <div className="mt-2 flex flex-wrap gap-4">
            {PURPOSES.map((p) => (
              <label key={p} className="flex items-center gap-2">
                <input type="checkbox" name="purpose" value={p} onChange={onChange} />
                {p}
              </label>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input className="border rounded p-2" name="fullName" placeholder="Full Name" value={form.fullName} onChange={onChange} required />
          <input className="border rounded p-2" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input className="border rounded p-2 md:col-span-2" name="billingAddress" placeholder="Billing Address" value={form.billingAddress} onChange={onChange} />
          <input className="border rounded p-2 md:col-span-2" name="cityStateZip" placeholder="City, State, ZIP" value={form.cityStateZip} onChange={onChange} />
          <input className="border rounded p-2" name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
        </div>

        <div>
          <h2 className="text-lg font-semibold">Card Details</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <select className="border rounded p-2" name="cardType" value={form.cardType} onChange={onChange}>
              <option value="">Card Type</option>
              <option>Visa</option><option>MasterCard</option><option>American Express</option><option>Discover</option>
            </select>
            <input className="border rounded p-2" name="nameOnCard" placeholder="Name on Card" value={form.nameOnCard} onChange={onChange} />
            <input className="border rounded p-2" name="cardNumber" placeholder="Card Number" value={form.cardNumber} onChange={onChange} />
            <input className="border rounded p-2" name="expiration" placeholder="Expiration (MM/YY)" value={form.expiration} onChange={onChange} />
            <input className="border rounded p-2" name="cvv" placeholder="CVV" value={form.cvv} onChange={onChange} />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Authorization</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <input className="border rounded p-2" name="amount" placeholder="Amount ($)" value={form.amount} onChange={onChange} />
            <input className="border rounded p-2" name="date" type="date" value={form.date} onChange={onChange} />
          </div>
          <textarea className="border rounded p-2 w-full mt-3" rows={3} name="description" placeholder="Description of Services" value={form.description} onChange={onChange} />
          <label className="flex items-center gap-2 mt-3">
            <input type="checkbox" name="recurring" checked={form.recurring} onChange={onChange} />
            Recurring Monthly Charge
          </label>
        </div>

        <button disabled={submitting} className="w-full bg-[#004085] text-white py-2 rounded hover:opacity-90">
          {submitting ? "Submitting…" : "Authorize Payment"}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you authorize Jordan & Borden Automation Consulting to process payments for the selected services and ad spend.
        </p>

        {msg && <div className="text-sm text-center mt-2">{msg}</div>}
      </form>
    </div>
  );
}
