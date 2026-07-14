"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default function ApplyPage() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", education: "", institution: "", areaOfInterest: "", experience: "", researchProposal: "", preferredMentor: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  if (submitted) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl border p-10">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600 text-2xl">&check;</div>
        <h1 className="font-heading text-3xl font-extrabold text-navy mb-4">Application Submitted!</h1>
        <p className="text-muted mb-6">Your application has been received. You will receive a tracking number via email.</p>
        <Link href="/fellowship" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-xl">&larr; Back to Fellowship</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/fellowship" className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy mb-8"><ArrowLeft size={16} /> Back to Fellowship</Link>
      <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-2">Fellowship Application</h1>
      <p className="text-muted mb-8">Viddhakarma Research Fellowship 2026</p>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-8 space-y-5">
        {["fullName","email","phone","education","institution","areaOfInterest","experience","preferredMentor"].map(f => (
          <div key={f}>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{f.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</label>
            <input value={(form as any)[f]} onChange={e => setForm({...form, [f]: e.target.value})} required className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
          </div>
        ))}
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Research Proposal</label>
          <textarea rows={6} value={form.researchProposal} onChange={e => setForm({...form, researchProposal: e.target.value})} required className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
        </div>
        <button type="submit" className="w-full py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light flex items-center justify-center gap-2"><Send size={18} /> Submit Application</button>
      </form>
    </div>
  );
}
