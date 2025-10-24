"use client";
import Image from "next/image";
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && name === "purpose") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((p) => ({
        ...p,
        purpose: checked ? [...p.purpose, value] : p.purpose.filter((i) => i !== value),
      }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((p) => ({ ...p, [name]: checked }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const submit = async (e: React.FormEvent) => {
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
        setForm((p) => ({ ...p, cardNumber: "", cvv: "" }));
      } else setMsg(`Error: ${j.error || "Unknown"}`);
    } catch (err: any) {
      setMsg(`Network error: ${err?.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-jabBlue via-jabPurple/70 to-jabBlue2/90 pb-16">
      {/* Top bar with logo */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/10 border-b border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
          <Image src="/jab-logo.png" width={36} height={36} alt="JAB logo" className="rounded-sm ring-2 ring-jabNeon" />
          <div className="text-white/90">
            <div className="font-semibold tracking-tight">Jordan &amp; Borden Automation</div>
            <div className="text-xs opacity-75">Credit Card Authorization</div>
          </div>
        </div>
      </header>

      {/* Card */}
      <div className="mx-auto max-w-5xl px-4">
        <form
          onSubmit={submit}
          className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* Hero strip */}
          <div className="bg-gradient-to-r from-jabBlue to-jabPurple text-white px-6 py-5 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold">Authorize Ad Spend & Services</h1>
            <span className="inline-flex items-center gap-2 text-xs md:text-sm bg-white/10 px-3 py-1.5 rounded-full">
              <span className="inline-block h-2 w-2 rounded-full bg-jabNeon shadow-neon" />
              Secure submission
            </span>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Business */}
            <section>
              <label className="block font-semibold text-slate-800 mb-2">Business</label>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  name="business"
                  value={form.business}
                  onChange={onChange}
                  required
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-jabNeon/80"
                >
                  <option value="">Select…</option>
                  <option value="WOW 1 DAY PAINTING – Atlanta">WOW 1 DAY PAINTING – Atlanta</option>
                  <option value="Tailor My Space">Tailor My Space</option>
                </select>

                {/* Purpose chips */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-800">Purpose of Payment</span>
                    <span className="text-xs text-slate-500">multi-select</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PURPOSES.map((p) => {
                      const selected = form.purpose.includes(p);
                      return (
                        <label
                          key={p}
                          className={`cursor-pointer select-none rounded-full border px-3 py-1.5 text-sm transition
                          ${selected ? "bg-jabNeon/90 text-black border-jabNeon shadow-neon" : "hover:border-jabNeon/60 border-slate-300"}`}
                        >
                          <input type="checkbox" className="sr-only" name="purpose" value={p} checked={selected} onChange={onChange} />
                          {p}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-lg font-semibold text-slate-800">Contact & Billing</h2>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <input className="input" name="fullName" placeholder="Full Name" value={form.fullName} onChange={onChange} required />
                <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
                <input className="input md:col-span-2" name="billingAddress" placeholder="Billing Address" value={form.billingAddress} onChange={onChange} />
                <input className="input md:col-span-2" name="cityStateZip" placeholder="City, State, ZIP" value={form.cityStateZip} onChange={onChange} />
                <input className="input" name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
              </div>
            </section>

            {/* Card */}
            <section>
              <h2 className="text-lg font-semibold text-slate-800">Card Details</h2>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <select className="input" name="cardType" value={form.cardType} onChange={onChange}>
                  <option value="">Card Type</option>
                  <option>Visa</option>
                  <option>MasterCard</option>
                  <option>American Express</option>
                  <option>Discover</option>
                </select>
                <input className="input" name="nameOnCard" placeholder="Name on Card" value={form.nameOnCard} onChange={onChange} />
                <input className="input" name="cardNumber" placeholder="Card Number" value={form.cardNumber} onChange={onChange} />
                <input className="input" name="expiration" placeholder="Expiration (MM/YY)" value={form.expiration} onChange={onChange} />
                <input className="input" name="cvv" placeholder="CVV" value={form.cvv} onChange={onChange} />
              </div>
              <p className="mt-2 text-xs text-slate-500">We only store last 4 digits. Do not email card details.</p>
            </section>

            {/* Authorization */}
            <section>
              <h2 className="text-lg font-semibold text-slate-800">Authorization</h2>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <input className="input" name="amount" placeholder="Amount ($)" value={form.amount} onChange={onChange} />
                <input className="input" name="date" type="date" value={form.date} onChange={onChange} />
              </div>
              <textarea className="input mt-3 h-28" name="description" placeholder="Description of Services" value={form.description} onChange={onChange} />
              <label className="mt-3 inline-flex items-center gap-2">
                <input type="checkbox" name="recurring" checked={form.recurring} onChange={onChange} />
                <span className="text-sm text-slate-700">Recurring Monthly Charge</span>
              </label>
            </section>

            {/* Submit */}
            <button
  disabled={submitting}
  className={`w-full rounded-xl bg-jabBlue text-white font-semibold py-3 shadow-lg hover:bg-jabPurple transition ring-2 ring-transparent hover:ring-jabNeon/70 disabled:opacity-60`}
>
  {submitting ? "Submitting…" : "Authorize Payment"}
</button>
            <p className="text-xs text-center text-slate-500">
              By submitting, you authorize Jordan &amp; Borden Automation Consulting to process payments for the selected services and ad spend.
            </p>
            {msg && <div className="text-center text-sm font-medium text-jabBlue">{msg}</div>}
          </div>
        </form>
      </div>

      {/* Utility input style */}
    
