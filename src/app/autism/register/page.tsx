"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, UserPlus } from "lucide-react";

export default function AutismRegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", patientName: "", patientAge: "", patientGender: "", diagnosis: "", previousTherapy: "", guardianName: "", relation: "", address: "", additionalInfo: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  if (submitted) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl border p-10">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600 text-2xl">&check;</div>
        <h1 className="font-heading text-3xl font-extrabold text-navy mb-4">Pre-Registration Successful!</h1>
        <p className="text-muted mb-6">Thank you for registering for the Autism Awareness Programme. Our team will contact you within 3-5 working days for the initial assessment.</p>
        <Link href="/autism" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-xl">&larr; Back to Programme</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/autism" className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy mb-8"><ArrowLeft size={16} /> Back to Programme</Link>
      <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-2">Pre-Registration</h1>
      <p className="text-muted mb-2">Autism Awareness Programme &mdash; Free Ayurvedic Support</p>
      <div className="flex items-center gap-2 mb-8 p-3 bg-gold/10 border border-gold/20 rounded-xl text-sm text-navy">
        <UserPlus size={16} className="text-gold shrink-0" />
        <span>This programme is <strong>completely free</strong>. No payment is required at any stage.</span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-8 space-y-5">
        <div className="border-b pb-4 mb-2">
          <h3 className="font-heading font-bold text-navy text-lg">Guardian / Contact Person</h3>
        </div>
        {[
          { key: "fullName", label: "Your Full Name", type: "text" },
          { key: "email", label: "Email Address", type: "email" },
          { key: "phone", label: "Phone Number", type: "tel" },
          { key: "relation", label: "Relation to Patient", type: "text" },
          { key: "address", label: "Full Address", type: "text" },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{f.label}</label>
            <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} required className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
          </div>
        ))}

        <div className="border-b pb-4 mb-2 pt-4">
          <h3 className="font-heading font-bold text-navy text-lg">Patient Information</h3>
        </div>
        {[
          { key: "patientName", label: "Patient Name", type: "text" },
          { key: "patientAge", label: "Patient Age", type: "number" },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{f.label}</label>
            <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} required className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Gender</label>
          <select value={form.patientGender} onChange={e => setForm({...form, patientGender: e.target.value})} required className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Diagnosis / Condition</label>
          <textarea rows={3} value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} required className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" placeholder="Describe the diagnosis or observed symptoms" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Previous Therapy (if any)</label>
          <textarea rows={3} value={form.previousTherapy} onChange={e => setForm({...form, previousTherapy: e.target.value})} className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" placeholder="Describe any previous treatments or therapies" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Additional Information</label>
          <textarea rows={3} value={form.additionalInfo} onChange={e => setForm({...form, additionalInfo: e.target.value})} className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" placeholder="Any other details you would like to share" />
        </div>

        <button type="submit" className="w-full py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light flex items-center justify-center gap-2"><Send size={18} /> Submit Registration</button>
      </form>
    </div>
  );
}
