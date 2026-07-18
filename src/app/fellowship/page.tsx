import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ArrowRight, FlaskConical, FileCheck, Users, TrendingUp, Clock, CheckCircle, HelpCircle, Award, BookOpen, Target, Shield } from "lucide-react";

export const metadata = { title: "Research Fellowship" };

export default async function FellowshipPage() {
  const session = await auth();
  const event = await prisma.event.findFirst({ where: { eventType: "Fellowship" }, orderBy: { eventDate: "desc" } });

  if (!event || !event.isPublished) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <FlaskConical size={48} className="text-muted/30 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-navy mb-2">Coming Soon</h2>
          <p className="text-sm text-muted mb-6">The Research Fellowship programme is not available at this moment. Please check back later.</p>
          <Link href="/" className="btn-primary">Back to Home <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  if (event.restrictToDoctors && !session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <FlaskConical size={48} className="text-[#0891b2] mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-navy mb-2">Medical Practitioners Only</h2>
          <p className="text-sm text-muted mb-6">This fellowship is for registered medical practitioners only.</p>
          <Link href="/login" className="btn-primary">Log In to Continue <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#0891b2] via-[#06b6d4] to-[#22d3ee] py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">Fellowship 2026</span>
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
            Viddhakarma<br />
            <span className="text-gold-light">Research Fellowship</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            {event.shortDesc || "Advance evidence-based Ayurvedic research with grants up to ₹75,000 under expert mentorship from leading Shalya Tantra specialists."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/fellowship/apply" className="btn-gold text-lg !py-4 !px-10">Apply Now <ArrowRight size={20} /></Link>
            <Link href="#details" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 hover:!border-white/50 text-lg !py-4 !px-10">Learn More</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative -mt-12 z-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-6 grid grid-cols-3 gap-4 shadow-xl shadow-[#0891b2]/8 border border-gray-100">
            {[
              { v: "₹75,000", l: "Grant Amount" },
              { v: "12-Digit", l: "Tracking ID" },
              { v: "Viddhakarma", l: "Focus Area" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-heading text-xl font-extrabold text-navy">{s.v}</div>
                <div className="text-xs text-muted mt-1 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      {event.description && (
        <section id="details" className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="section-heading">
              <span className="badge">About</span>
              <h2>About the Fellowship</h2>
            </div>
            <div className="card-hover bg-white rounded-3xl border border-gray-100 p-8 md:p-10">
              <p className="text-ink-soft leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* ELIGIBILITY & BENEFITS */}
      <section className="py-24 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-hover bg-white rounded-3xl border border-gray-100 p-8 md:p-10">
              <div className="w-14 h-14 bg-gradient-to-br from-[#0891b2] to-[#06b6d4] rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                <Shield size={24} />
              </div>
              <h3 className="font-heading text-2xl font-extrabold text-navy mb-5">Eligibility</h3>
              <div className="space-y-3">
                {[
                  "Registered medical practitioners (BAMS / MD Ayurveda)",
                  "Graduate students in Ayurveda with research interest",
                  "Faculty members of Ayurvedic colleges",
                  "Researchers in Shalya Tantra or allied disciplines",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-emerald-accent mt-0.5 shrink-0" />
                    <p className="text-sm text-ink-soft">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-hover bg-white rounded-3xl border border-gray-100 p-8 md:p-10">
              <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold-light rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                <Award size={24} />
              </div>
              <h3 className="font-heading text-2xl font-extrabold text-navy mb-5">Benefits</h3>
              <div className="space-y-3">
                {[
                  "Milestone-based funding up to ₹75,000",
                  "Expert panel review with detailed feedback",
                  "Mentorship from renowned Ayurvedic surgeons",
                  "Certificate of recognition upon completion",
                  "Publication support for research findings",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-gold mt-0.5 shrink-0" />
                    <p className="text-sm text-ink-soft">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Features</span>
            <h2>Programme Highlights</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FlaskConical, title: "Research Grants", desc: "Up to ₹75,000 milestone-based funding for Viddhakarma and Agnikarma research.", color: "from-[#0891b2] to-[#06b6d4]" },
              { icon: Users, title: "Expert Review", desc: "Scoring, remarks, and shortlisting by a panel of distinguished Ayurvedic scholars.", color: "from-[#0e7490] to-[#0891b2]" },
              { icon: TrendingUp, title: "Smart Tracking", desc: "12-digit application tracking number with real-time status updates on your dashboard.", color: "from-[#0e7490] to-teal" },
            ].map((c, i) => (
              <div key={i} className="card-hover bg-white rounded-3xl border border-gray-100 p-8 text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${c.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <c.icon size={28} />
                </div>
                <h3 className="font-heading text-xl font-extrabold text-navy mb-3">{c.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION PROCESS */}
      <section className="py-24 bg-gradient-to-br from-[#0891b2] via-[#06b6d4] to-[#22d3ee] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-white/15 rounded-full border border-white/20 mb-6">
              <span className="text-white text-xs font-bold tracking-widest uppercase">Application Journey</span>
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-4">How It Works</h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">A simple 3-step process to begin your research journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { s: "01", t: "Register & Verify", d: "Create your account, verify your email and phone number. Medical practitioners can log in directly.", icon: FileCheck },
              { s: "02", t: "Submit Proposal", d: "Complete the application form, upload required documents, and submit your research proposal for review.", icon: BookOpen },
              { s: "03", t: "Review & Award", d: "Expert panel reviews your proposal, conducts interviews, and awards the research grant.", icon: Target },
            ].map((step, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 relative group hover:bg-white/15 transition-all duration-300">
                <div className="font-heading text-6xl font-extrabold text-white/10 absolute top-4 right-6">{step.s}</div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gold rounded-2xl flex items-center justify-center text-navy mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <step.icon size={24} />
                  </div>
                  <h3 className="font-heading text-xl font-extrabold text-white mb-3">{step.t}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "What is the fellowship amount?", a: "The fellowship provides milestone-based funding up to ₹75,000 for approved research proposals in Viddhakarma and Agnikarma." },
              { q: "Who can apply?", a: "Registered medical practitioners (BAMS/MD), graduate students, and faculty members of Ayurvedic colleges with a focus on Shalya Tantra research." },
              { q: "How long does the review take?", a: "Applications are typically reviewed within 4-6 weeks. Shortlisted candidates will be contacted for an interview before final selection." },
              { q: "What research areas are supported?", a: "We support research in Viddhakarma, Agnikarma, Raktamokshana, and related Shalya Tantra procedures including comparative studies with modern medicine." },
              { q: "Can I track my application?", a: "Yes, you receive a 12-digit tracking number and can monitor your application status in real-time from your dashboard." },
            ].map((faq, i) => (
              <details key={i} className="card-hover bg-white rounded-2xl border border-gray-100 p-6 group">
                <summary className="font-heading font-bold text-navy cursor-pointer list-none flex justify-between items-center text-base">
                  {faq.q}
                  <HelpCircle size={20} className="text-gold shrink-0 ml-4" />
                </summary>
                <p className="text-sm text-ink-soft mt-4 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[#0891b2] via-[#06b6d4] to-[#22d3ee] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to Begin Your Research Journey?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Apply now and contribute to evidence-based Ayurveda research under expert mentorship.
          </p>
          <Link href="/fellowship/apply" className="btn-gold text-lg !py-4 !px-10">Apply Now <ArrowRight size={20} /></Link>
        </div>
      </section>
    </div>
  );
}
