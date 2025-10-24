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

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && name === "purpose") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((p) => ({
        ...p,
        purpose: checked ? [...p.purpose, value] : p.purpose.filter((i) => i !== value),
      }));
      return;
    }
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((p) => ({ ...p, [name]: checked }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
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
      const j = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && j.ok) {
        setMsg("Authorization submitted. Thank you!");
        setForm((p) => ({ ...p, cardNumber: "", cvv: "" }));
      } else {
        setMsg(`Error: ${j.error || "Unexpected error"}`);
      }
    } catch (err: any) {
      setMsg(`Network error: ${err?.message || String(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <form onSubmit={submit} className="card">
        <div className="cardHeader">
          <h1>Authorize Ad Spend & Services</h1>
          <span className="badge">
            <span className="badgeDot" />
            Secure submission
          </span>
        </div>

        <div className="section">
          <label className="label">Business</label>
          <select
            name="business"
            value={form.business}
            onChange={onChange}
            required
            className="input"
          >
            <option value="">Select…</option>
            <option value="WOW 1 DAY PAINTING – Atlanta">WOW 1 DAY PAINTING – Atlanta</option>
            <option value="Tailor My Space">Tailor My Space</option>
          </select>

          <div style={{ marginTop: 12 }}>
            <div className="labelRow">
              <span className="label">Purpose of Payment</span>
              <span className="muted">multi-select</span>
            </div>
            <div className="tagWrap">
              {PURPOSES.map((p) => {
                const selected = form.purpose.includes(p);
                return (
                  <label
                    key={p}
                    className={selected ? "tag tagSelected" : "tag"}
                  >
                    <input
                      type="checkbox"
                      className="srOnly"
                      name="purpose"
                      value={p}
                      checked={selected}
                      onChange={onChange}
                    />
                    {p}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Contact & Billing</h2>
          <div className="gridTwo">
            <input
              className="input"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={onChange}
              required
            />
            <input
              className="input"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              required
            />
            <input
              className="input span2"
              name="billingAddress"
              placeholder="Billing Address"
              value={form.billingAddress}
              onChange={onChange}
            />
            <input
              className="input span2"
              name="cityStateZip"
              placeholder="City, State, ZIP"
              value={form.cityStateZip}
              onChange={onChange}
            />
            <input
              className="input"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="section">
          <h2>Card Details</h2>
          <div className="gridTwo">
            <select className="input" name="cardType" value={form.cardType} onChange={onChange}>
              <option value="">Card Type</option>
              <option>Visa</option>
              <option>MasterCard</option>
              <option>American Express</option>
              <option>Discover</option>
            </select>
            <input
              className="input"
              name="nameOnCard"
              placeholder="Name on Card"
              value={form.nameOnCard}
              onChange={onChange}
            />
            <input
              className="input"
              name="cardNumber"
              placeholder="Card Number"
              value={form.cardNumber}
              onChange={onChange}
            />
            <input
              className="input"
              name="expiration"
              placeholder="Expiration (MM/YY)"
              value={form.expiration}
              onChange={onChange}
            />
            <input
              className="input"
              name="cvv"
              placeholder="CVV"
              value={form.cvv}
              onChange={onChange}
            />
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            We only store last 4 digits. Do not email card details.
          </p>
        </div>

        <div className="section">
          <h2>Authorization</h2>
          <div className="gridTwo">
            <input
              className="input"
              name="amount"
              placeholder="Amount ($)"
              value={form.amount}
              onChange={onChange}
            />
            <input
              className="input"
              name="date"
              type="date"
              value={form.date}
              onChange={onChange}
            />
          </div>
          <textarea
            className="input"
            rows={4}
            name="description"
            placeholder="Description of Services"
            value={form.description}
            onChange={onChange}
            style={{ marginTop: 12 }}
          />
          <label className="checkboxRow">
            <input
              type="checkbox"
              name="recurring"
              checked={form.recurring}
              onChange={onChange}
            />
            <span>Recurring Monthly Charge</span>
          </label>
        </div>

        <button disabled={submitting} className="button">
          {submitting ? "Submitting..." : "Authorize Payment"}
        </button>

        <p className="smallCenter">
          By submitting, you authorize Jordan &amp; Borden Automation Consulting to process payments
          for the selected services and ad spend.
        </p>

        {msg && <div className="message">{msg}</div>}
      </form>
    </div>
  );
}

