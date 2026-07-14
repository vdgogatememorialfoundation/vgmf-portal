import Link from "next/link";
import { ArrowRight, FlaskConical, Presentation, Heart, BookOpen, MapPin, Phone, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [events, articles] = await Promise.all([
    prisma.event.findMany({ where: { isPublished: true }, orderBy: { eventDate: "desc" }, take: 3 }),
    prisma.article.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const programmeIcons: Record<string, any> = {
    Seminar: Presentation,
    Fellowship: FlaskConical,
    Autism: Heart,
  };

  const programmeHrefs: Record<string, string> = {
    Seminar: "/seminar",
    Fellowship: "/fellowship",
    Autism: "/autism",
  };

  return (
    <>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-navy via-navy-light to-navy min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-maroon rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur text-gold-light text-xs font-semibold rounded-full mb-6 tracking-wider uppercase">Advancing Ayurveda Since 1972</span>
              <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Vaidya Gogate<br />Memorial <span className="text-gold">Foundation</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                Preserving the legacy of Vaidya R.B. Gogate through research fellowships, national seminars, and community healthcare initiatives rooted in authentic Ayurvedic tradition.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/fellowship" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-semibold rounded-xl hover:bg-gold-light transition-all hover:-translate-y-0.5 shadow-lg shadow-gold/20">
                  Explore Fellowship <ArrowRight size={18} />
                </Link>
                <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                  About Us
                </Link>
              </div>
            </div>
            <div className="glass rounded-3xl p-8 hidden lg:block">
              <div className="text-center mb-6">
                <span className="text-gold text-sm font-semibold tracking-wider uppercase">Foundation Snapshot</span>
              </div>
              <div className="space-y-4">
                {[
                  { icon: FlaskConical, title: "Research Fellowship", desc: "Grants up to ₹75,000 for Viddhakarma research" },
                  { icon: Presentation, title: "National Seminar", desc: "Annual conference on Agnikarma & Viddhakarma" },
                  { icon: Heart, title: "Autism Programme", desc: "Free awareness & therapy for families" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-navy/5">
                    <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center text-gold shrink-0"><item.icon size={24} /></div>
                    <div><h4 className="font-heading font-bold text-navy">{item.title}</h4><p className="text-sm text-ink-soft">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative -mt-10 z-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="glass rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-lg">
            {[{ n: "1972", l: "Founded" }, { n: "5000+", l: "Patients Served" }, { n: "100+", l: "Vaidyas Trained" }, { n: "3", l: "Programmes" }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-heading text-2xl md:text-3xl font-extrabold text-navy">{s.n}</div>
                <div className="text-xs text-muted mt-1 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Programmes</span>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy">Our Initiatives</h2>
            <p className="text-muted mt-3 max-w-2xl mx-auto">Comprehensive programmes advancing Ayurvedic knowledge and community wellbeing</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((evt, i) => {
              const Icon = programmeIcons[evt.eventType] || BookOpen;
              const href = programmeHrefs[evt.eventType] || "#";
              const featured = i === 0;
              return (
                <Link key={evt.id} href={href} className={`card-hover group rounded-2xl border p-6 ${featured ? "bg-gradient-to-br from-navy to-navy-light text-white border-navy" : "bg-white border-gray-100"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${featured ? "bg-white/15 text-gold" : "bg-navy/5 text-navy"}`}><Icon size={24} /></div>
                  <h3 className={`font-heading text-xl font-bold mb-2 ${featured ? "text-white" : "text-navy"}`}>{evt.title}</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${featured ? "text-white/70" : "text-ink-soft"}`}>{evt.shortDesc || evt.description}</p>
                  <span className={`inline-flex items-center gap-1 text-sm font-semibold ${featured ? "text-gold" : "text-navy"}`}>Learn More <ArrowRight size={16} /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ARTICLES SECTION */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Knowledge</span>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy">Articles & Research</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((a) => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="card-hover bg-white rounded-2xl border border-gray-100 p-6">
                <span className="text-xs font-semibold text-gold uppercase tracking-wider">{a.category || "General"}</span>
                <h3 className="font-heading text-lg font-bold text-navy mt-2 mb-2">{a.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{a.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy mt-4">Read Article <ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-navy via-navy-light to-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-3 py-1 bg-white/10 text-gold-light text-xs font-semibold rounded-full mb-6 tracking-wider uppercase">VGMF Fellowship 2026</span>
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-white mb-4">Ready to Advance Ayurvedic Research?</h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">Apply for the Viddhakarma Research Fellowship and contribute to evidence-based Ayurveda under expert mentorship.</p>
          <Link href="/fellowship" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-all hover:-translate-y-0.5 shadow-xl shadow-gold/20 text-lg">
            Apply Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* CONTACT MINI */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gold/10 to-cream rounded-2xl p-8">
              <h3 className="font-heading text-2xl font-bold text-navy mb-3">About the Foundation</h3>
              <p className="text-ink-soft mb-6">Advancing Ayurvedic Research & Viddhakarma Studies since 1972. Carrying forward Vaidya R.B. Gogate&apos;s legacy through education, research, and community service.</p>
              <Link href="/about" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-navy text-navy font-semibold rounded-xl hover:bg-navy hover:text-white transition-all">About Us <ArrowRight size={16} /></Link>
            </div>
            <div className="space-y-4">
              <div className="card-hover bg-white rounded-xl border p-4 flex items-start gap-3">
                <MapPin className="text-gold shrink-0 mt-0.5" size={20} />
                <div><p className="text-xs text-muted uppercase tracking-wider mb-0.5">Address</p><p className="text-sm text-navy font-medium">102, Ramprasad Chambers, 368/1, Jawaharlal Nehru Rd, near Kirad Hospital, Pune 411002</p></div>
              </div>
              <div className="card-hover bg-white rounded-xl border p-4 flex items-center gap-3">
                <Phone className="text-gold" size={20} />
                <div><p className="text-xs text-muted uppercase tracking-wider mb-0.5">Phone</p><p className="text-sm text-navy font-medium">+91 93737 92952</p></div>
              </div>
              <div className="card-hover bg-white rounded-xl border p-4 flex items-center gap-3">
                <Mail className="text-gold" size={20} />
                <div><p className="text-xs text-muted uppercase tracking-wider mb-0.5">Email</p><p className="text-sm text-navy font-medium">care@vaidyagogate.org</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
