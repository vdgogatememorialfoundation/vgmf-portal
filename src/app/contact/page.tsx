"use client";
import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Get in Touch</span>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-navy mb-4">Contact Us</h1>
        <p className="text-muted">We&apos;d love to hear from you</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="space-y-4">
          {[
            { icon: MapPin, title: "Address", value: "102, Ramprasad Chambers, 368/1, Jawaharlal Nehru Rd, near Kirad Hospital, above Shraddha Medicals, New Nana Peth, Pune, Maharashtra 411002" },
            { icon: Phone, title: "Phone", value: "+91 93737 92952" },
            { icon: Mail, title: "Email", value: "care@vaidyagogate.org" },
          ].map((c, i) => (
            <div key={i} className="card-hover bg-white rounded-xl border p-4 flex items-start gap-3">
              <c.icon className="text-gold shrink-0 mt-0.5" size={20} /><div><p className="text-xs text-muted uppercase tracking-wider mb-0.5">{c.title}</p><p className="text-sm text-navy font-medium">{c.value}</p></div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 space-y-4">
          {sent && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl">Message sent successfully!</div>}
          {["name","email","phone","subject"].map(f => (
            <div key={f}>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 capitalize">{f}</label>
              <input type={f === "email" ? "email" : "text"} value={(form as any)[f]} onChange={e => setForm({...form, [f]: e.target.value})} required
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Message</label>
            <textarea rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required
              className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light transition-colors flex items-center justify-center gap-2">
            <Send size={18} /> {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
