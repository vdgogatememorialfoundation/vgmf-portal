import Link from "next/link";
import { ArrowRight, Heart, Brain, Users, ClipboardCheck, Calendar, MessageCircle } from "lucide-react";

export default function AutismPage() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold-light text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Community Initiative</span>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white mb-4">Autism Awareness Programme</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">Free awareness, therapy, and support integrating Ayurvedic approaches with community care</p>
          <Link href="/autism/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-all text-lg shadow-xl shadow-gold/20">Pre-Register Now <ArrowRight size={20} /></Link>
        </div>
      </section>

      {/* STATS */}
      <section className="relative -mt-10 z-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="glass rounded-2xl p-6 grid grid-cols-3 gap-4 shadow-lg">
            {[{v:"Free",l:"Programme Fee"},{v:"Panchakarma",l:"Therapy Used"},{v:"All Ages",l:"Eligibility"}].map((s,i) => (
              <div key={i} className="text-center"><div className="font-heading text-xl font-extrabold text-navy">{s.v}</div><div className="text-xs text-muted mt-1 uppercase tracking-wider">{s.l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Programme</span><h2 className="font-heading text-3xl font-extrabold text-navy">About the Programme</h2></div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card-hover bg-white rounded-2xl border p-8">
              <h3 className="font-heading text-xl font-bold text-navy mb-3">Our Mission</h3>
              <p className="text-sm text-ink-soft leading-relaxed">VGMF's Autism Awareness Programme is a community-driven initiative providing free consultation, therapy, and support to families affected by Autism Spectrum Disorder. We integrate Ayurvedic Panchakarma therapies with modern supportive care to improve quality of life.</p>
            </div>
            <div className="card-hover bg-white rounded-2xl border p-8">
              <h3 className="font-heading text-xl font-bold text-navy mb-3">Who Can Join</h3>
              <p className="text-sm text-ink-soft leading-relaxed">Children and adults diagnosed with or showing signs of ASD. Parents, caregivers, and special educators are also welcome to attend our awareness workshops and training sessions conducted by experienced Ayurvedic physicians.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Process</span><h2 className="font-heading text-3xl font-extrabold text-navy">How It Works</h2></div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {s:"01",t:"Pre-Register",d:"Fill out the registration form with basic details"},
              {s:"02",t:"Assessment",d:"Initial consultation and Ayurvedic assessment"},
              {s:"03",t:"Therapy Plan",d:"Personalised Panchakarma therapy schedule"},
              {s:"04",t:"Ongoing Support",d:"Regular follow-ups and caregiver guidance"},
            ].map((step,i) => (
              <div key={i} className="card-hover bg-white rounded-2xl border p-6 relative">
                <div className="font-heading text-5xl font-extrabold text-navy/5 absolute top-4 right-4">{step.s}</div>
                <div className="relative z-10"><h3 className="font-heading text-lg font-bold text-navy mb-2">{step.t}</h3><p className="text-sm text-ink-soft">{step.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Features</span><h2 className="font-heading text-3xl font-extrabold text-navy">Programme Features</h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {i:Brain,t:"Ayurvedic Approach",d:"Panchakarma therapies tailored to individual constitution"},
              {i:Users,t:"Expert Team",d:"Experienced Ayurvedic physicians and trained therapists"},
              {i:Heart,t:"Family Support",d:"Counselling, caregiver training, and awareness workshops"},
            ].map((c,i) => (
              <div key={i} className="card-hover bg-white rounded-2xl border p-6"><div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center text-navy mb-4"><c.i size={24} /></div><h3 className="font-heading text-lg font-bold text-navy mb-2">{c.t}</h3><p className="text-sm text-ink-soft">{c.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12"><span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">FAQ</span><h2 className="font-heading text-3xl font-extrabold text-navy">Frequently Asked Questions</h2></div>
          <div className="space-y-4">
            {[
              {q:"Is the programme really free?",a:"Yes, the Autism Awareness Programme is completely free of charge. It is funded by VGMF as a community service initiative."},
              {q:"What therapies are provided?",a:"We offer Ayurvedic Panchakarma therapies including Abhyanga, Shirodhara, Nasya, and Basti, tailored to each individual's needs."},
              {q:"How long is the therapy programme?",a:"The duration varies based on individual assessment. Typical therapy cycles run for 7 to 21 days with periodic follow-ups."},
              {q:"Can adults register for the programme?",a:"Yes, the programme is open to individuals of all ages diagnosed with or showing signs of Autism Spectrum Disorder."},
            ].map((faq,i) => (
              <details key={i} className="card-hover bg-white rounded-2xl border p-6 group">
                <summary className="font-heading font-bold text-navy cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <MessageCircle size={20} className="text-gold shrink-0 ml-4" />
                </summary>
                <p className="text-sm text-ink-soft mt-4 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-navy to-navy-light text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-extrabold text-white mb-4">Join the Programme Today</h2>
          <p className="text-white/70 mb-8">Free Ayurvedic support for families affected by Autism Spectrum Disorder</p>
          <Link href="/autism/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-all">Pre-Register Now <ArrowRight size={20} /></Link>
        </div>
      </section>
    </div>
  );
}
