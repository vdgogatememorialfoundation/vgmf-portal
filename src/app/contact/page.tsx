"use client";
import { useState } from "react";
import { MapPin, Phone, Mail, Send, Clock, MessageSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#0d6662] via-[#0d6662] to-[#14918b] py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-[10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 left-[5%] w-[300px] h-[300px] bg-[#c2761c]/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <MessageSquare size={14} className="text-white" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">Get in Touch</span>
          </span>
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-white mb-4">
            Contact <span className="text-[#d4922a]">Us</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">We&apos;d love to hear from you. Reach out with questions, feedback, or partnership inquiries.</p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* FORM */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-sm">
                <h2 className="font-heading text-2xl font-extrabold text-navy mb-2">Send a Message</h2>
                <p className="text-sm text-muted mb-8">Fill out the form below and we&apos;ll respond as soon as possible.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-2">Full Name *</label>
                      <input type="text" value={form.name} onChange={e => handleChange("name", e.target.value)} required placeholder="Dr. Sharma"
                        className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-2">Email Address *</label>
                      <input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} required placeholder="you@example.com"
                        className="input-field" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-2">Phone Number</label>
                      <input type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+91 93737 92952"
                        className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-2">Subject *</label>
                      <input type="text" value={form.subject} onChange={e => handleChange("subject", e.target.value)} required placeholder="Fellowship Inquiry"
                        className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-2">Message *</label>
                    <textarea rows={5} value={form.message} onChange={e => handleChange("message", e.target.value)} required placeholder="Tell us how we can help..."
                      className="input-field resize-none" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={18} /> Send Message</>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="lg:col-span-2 space-y-5">
              {[
                { icon: MapPin, title: "Our Office", value: "102, Ramprasad Chambers, 368/1, Jawaharlal Nehru Rd, near Kirad Hospital, above Shraddha Medicals, New Nana Peth, Pune, Maharashtra 411002", href: "https://maps.google.com/?q=102+Ramprasad+Chambers+Pune+411002", color: "from-[#0d6662] to-[#14918b]" },
                { icon: Phone, title: "Phone", value: "+91 93737 92952", href: "tel:+919373792952", color: "from-[#0d6662] to-[#14918b]" },
                { icon: Mail, title: "Email", value: "care@vaidyagogate.org", href: "mailto:care@vaidyagogate.org", color: "from-[#0a5250] to-[#0d6662]" },
                { icon: Clock, title: "Office Hours", value: "Mon – Sat: 10:00 AM – 6:00 PM\nSunday: Closed", href: undefined, color: "from-[#c2761c] to-[#d4922a]" },
              ].map((c, i) => (
                <div key={i} className="card-hover bg-white rounded-2xl border border-gray-100 p-6 group">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center text-white shrink-0 shadow-md`}>
                      <c.icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">{c.title}</p>
                      {c.href ? (
                        <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-sm text-navy font-medium leading-relaxed hover:text-[#0d6662] transition-colors whitespace-pre-line">
                          {c.value}
                        </a>
                      ) : (
                        <p className="text-sm text-navy font-medium leading-relaxed whitespace-pre-line">{c.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* MAP EMBED */}
              <div className="card-hover bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="bg-cream-dark flex items-center justify-center h-48">
                  <div className="text-center">
                    <MapPin size={32} className="text-[#0d6662] mx-auto mb-2" />
                    <p className="text-sm font-bold text-navy">Pune, Maharashtra</p>
                    <a href="https://maps.google.com/?q=102+Ramprasad+Chambers+Pune+411002" target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[#0d6662] font-semibold mt-1 inline-block hover:underline">Open in Maps →</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
