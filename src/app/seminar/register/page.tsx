"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CreditCard } from "lucide-react";

export default function SeminarRegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", institution: "", designation: "", dietaryPreference: "", accommodation: "no", paymentMode: "online" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  if (submitted) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl border p-10">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600 text-2xl">&check;</div>
        <h1 className="font-heading text-3xl font-extrabold text-navy mb-4">Registration Confirmed!</h1>
        <p className="text-muted mb-6">You have successfully registered for the National Seminar on Agnikarma & Viddhakarma. A confirmation email will be sent shortly.</p>
        <Link href="/seminar" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-xl">&larr; Back to Seminar</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/seminar" className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy mb-8"><ArrowLeft size={16} /> Back to Seminar</Link>
      <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-2">Seminar Registration</h1>
      <p className="text-muted mb-8">National Seminar on Agnikarma & Viddhakarma &mdash; December 2026, Pune</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-8 space-y-5">
        {[
          { key: "fullName", label: "Full Name", type: "text" },
          { key: "email", label: "Email Address", type: "email" },
          { key: "phone", label: "Phone Number", type: "tel" },
          { key: "institution", label: "Institution / Organisation", type: "text" },
          { key: "designation", label: "Designation", type: "text" },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{f.label}</label>
            <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} required className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Dietary Preference</label>
          <select value={form.dietaryPreference} onChange={e => setForm({...form, dietaryPreference: e.target.value})} required className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20">
            <option value="">Select preference</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="jain">Jain</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Accommodation Required</label>
          <div className="flex gap-4">
            {["yes","no"].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="accommodation" value={opt} checked={form.accommodation === opt} onChange={e => setForm({...form, accommodation: e.target.value})} className="accent-navy" />
                <span className="text-sm capitalize">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Payment Mode</label>
          <div className="flex gap-4">
            {["online","offline"].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="paymentMode" value={opt} checked={form.paymentMode === opt} onChange={e => setForm({...form, paymentMode: e.target.value})} className="accent-navy" />
                <span className="text-sm capitalize">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full py-3 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light flex items-center justify-center gap-2">
          <CreditCard size={18} /> Register &amp; Pay &#8377;1,500
        </button>
      </form>
    </div>
  );
}
