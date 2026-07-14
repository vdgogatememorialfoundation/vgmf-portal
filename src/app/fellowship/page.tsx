import Link from "next/link";
import { ArrowRight, FlaskConical, FileCheck, Users, TrendingUp } from "lucide-react";

export default function FellowshipPage() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold-light text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Fellowship 2026</span>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white mb-4">Viddhakarma Research Fellowship</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">Advance evidence-based Ayurvedic research with grants up to ₹75,000 under expert mentorship</p>
          <Link href="/fellowship/apply" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-all text-lg shadow-xl shadow-gold/20">Apply Now <ArrowRight size={20} /></Link>
        </div>
      </section>

      {/* STATS */}
      <section className="relative -mt-10 z-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="glass rounded-2xl p-6 grid grid-cols-3 gap-4 shadow-lg">
            {[{v:"₹75,000",l:"Grant Amount"},{v:"12-Digit",l:"Tracking ID"},{v:"Viddhakarma",l:"Focus Area"}].map((s,i) => (
              <div key={i} className="text-center"><div className="font-heading text-xl font-extrabold text-navy">{s.v}</div><div className="text-xs text-muted mt-1 uppercase tracking-wider">{s.l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Programme</span><h2 className="font-heading text-3xl font-extrabold text-navy">Programme Highlights</h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[{i:FlaskConical,t:"Research Grants",d:"Up to ₹75,000 milestone-based funding"},{i:Users,t:"Expert Review",d:"Scoring, remarks, and shortlisting by panel"},{i:TrendingUp,t:"Smart Tracking",d:"12-digit application tracking number"}].map((c,i) => (
              <div key={i} className="card-hover bg-white rounded-2xl border p-6"><div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center text-navy mb-4"><c.i size={24} /></div><h3 className="font-heading text-lg font-bold text-navy mb-2">{c.t}</h3><p className="text-sm text-ink-soft">{c.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">3 Simple Steps</span><h2 className="font-heading text-3xl font-extrabold text-navy">Application Journey</h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[{s:"01",t:"Register & Verify",d:"Create account, verify email & WhatsApp"},{s:"02",t:"Submit Proposal",d:"Complete form, upload documents"},{s:"03",t:"Review & Award",d:"Panel review, interview, grant disbursement"}].map((step,i) => (
              <div key={i} className="card-hover bg-white rounded-2xl border p-6 relative">
                <div className="font-heading text-5xl font-extrabold text-navy/5 absolute top-4 right-4">{step.s}</div>
                <div className="relative z-10"><h3 className="font-heading text-xl font-bold text-navy mb-2">{step.t}</h3><p className="text-sm text-ink-soft">{step.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-navy to-navy-light text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-extrabold text-white mb-4">Ready to Begin Your Research Journey?</h2>
          <p className="text-white/70 mb-8">Apply now and contribute to evidence-based Ayurveda research</p>
          <Link href="/fellowship/apply" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-all">Apply Now <ArrowRight size={20} /></Link>
        </div>
      </section>
    </div>
  );
}
