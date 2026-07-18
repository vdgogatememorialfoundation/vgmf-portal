import Link from "next/link";
import { ArrowRight, FlaskConical, Presentation, Heart, BookOpen, MapPin, Phone, Mail, ArrowUpRight, Star, Users, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [events, articles, announcements] = await Promise.all([
    prisma.event.findMany({ where: { isPublished: true }, orderBy: { eventDate: "desc" }, take: 3 }),
    prisma.article.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
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

  const programmeColors: Record<string, string> = {
    Seminar: "from-teal to-teal-light",
    Fellowship: "from-navy to-navy-light",
    Autism: "from-maroon to-maroon-light",
  };

  const pinnedAnnouncements = announcements.filter(a => a.isPinned);

  return (
    <>
      {/* PINNED BANNER */}
      {pinnedAnnouncements.length > 0 && (
        <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 border-b border-gold/20">
          <div className="max-w-7xl mx-auto px-6 py-2.5">
            {pinnedAnnouncements.map(a => (
              <div key={a.id} className="flex items-center justify-center gap-2 text-sm text-navy">
                <Star size={14} className="text-gold fill-gold" />
                <span className="font-bold">{a.title}</span>
                {a.summary && <span className="text-muted hidden sm:inline">- {a.summary}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative bg-navy min-h-[92vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-navy via-navy-light to-navy" />
          <div className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-gold/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-teal/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-maroon/5 rounded-full blur-[150px]" />
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-8">
                <div className="w-2 h-2 bg-emerald-accent rounded-full animate-pulse" />
                <span className="text-gold-light text-xs font-bold tracking-widest uppercase">Advancing Ayurveda Since 1972</span>
              </div>
              <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
                Vaidya Gogate
                <br />
                Memorial <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">Foundation</span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-lg">
                Preserving the legacy of Vaidya R.B. Gogate through research fellowships, national seminars, and community healthcare initiatives rooted in authentic Ayurvedic tradition.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/fellowship" className="btn-gold text-base !py-3.5 !px-7">
                  Explore Fellowship <ArrowRight size={18} />
                </Link>
                <Link href="/about" className="btn-outline !border-white/25 !text-white hover:!bg-white/10 hover:!border-white/40 text-base !py-3.5 !px-7">
                  About Us
                </Link>
              </div>
            </div>

            {/* Foundation Snapshot Cards */}
            <div className="hidden lg:block space-y-4 animate-fade-up" style={{ animationDelay: "0.15s" }}>
              {[
                { icon: FlaskConical, title: "Research Fellowship", desc: "Grants up to ₹75,000 for Viddhakarma research", color: "from-navy to-teal" },
                { icon: Presentation, title: "National Seminar", desc: "Annual conference on Agnikarma & Viddhakarma", color: "from-navy to-navy-600" },
                { icon: Heart, title: "Autism Programme", desc: "Free awareness & therapy for families", color: "from-navy to-maroon" },
              ].map((item, i) => (
                <div key={i} className="glass-dark rounded-2xl p-5 flex gap-4 group hover:bg-white/[0.08] transition-all duration-300 cursor-pointer">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-gold shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-base mb-0.5">{item.title}</h4>
                    <p className="text-sm text-white/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative -mt-12 z-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-xl shadow-navy/8 border border-gray-100">
            {[
              { n: "1972", l: "Founded", icon: Calendar },
              { n: "5000+", l: "Patients Served", icon: Users },
              { n: "100+", l: "Vaidyas Trained", icon: Star },
              { n: "3", l: "Programmes", icon: FlaskConical },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/20 transition-colors">
                  <s.icon size={20} className="text-gold" />
                </div>
                <div className="font-heading text-2xl md:text-3xl font-extrabold text-navy">{s.n}</div>
                <div className="text-xs text-muted font-medium mt-1 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Programmes</span>
            <h2>Our Initiatives</h2>
            <p>Comprehensive programmes advancing Ayurvedic knowledge and community wellbeing</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((evt, i) => {
              const Icon = programmeIcons[evt.eventType] || BookOpen;
              const href = programmeHrefs[evt.eventType] || "#";
              const gradient = programmeColors[evt.eventType] || "from-navy to-navy-light";
              return (
                <Link key={evt.id} href={href} className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 card-hover">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-[60px] transition-all duration-500 group-hover:w-40 group-hover:h-40`} />
                  <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading text-xl font-extrabold text-navy mb-3">{evt.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed mb-6">{evt.shortDesc || evt.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-navy group-hover:text-gold transition-colors">
                    Learn More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS & NOTICES */}
      <section className="py-20 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Notices</span>
            <h2>Announcements</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {announcements.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-gray-100">
                <p className="text-muted font-medium">No active announcements</p>
              </div>
            ) : (
              announcements.map(a => (
                <div key={a.id} className={`bg-white rounded-2xl p-6 card-hover border ${a.isPinned ? "border-gold/30 shadow-lg shadow-gold/5" : "border-gray-100"}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-heading font-bold text-navy text-lg">{a.title}</h3>
                    {a.isPinned && (
                      <span className="text-xs bg-gold/10 text-gold px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <Star size={10} className="fill-gold" /> Pinned
                      </span>
                    )}
                  </div>
                  {a.summary && <p className="text-sm text-ink-soft leading-relaxed">{a.summary}</p>}
                  <p className="text-xs text-muted mt-4 font-medium">
                    {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ARTICLES SECTION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Knowledge</span>
            <h2>Articles & Research</h2>
            <p>Explore Dr. R.B. Gogate&apos;s contributions to Ayurvedic science</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map(a => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="group bg-white rounded-3xl border border-gray-100 p-7 card-hover">
                <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-bold rounded-full mb-4 uppercase tracking-wider">{a.category || "General"}</span>
                <h3 className="font-heading text-lg font-extrabold text-navy mb-3 group-hover:text-gold transition-colors leading-snug">{a.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed mb-5 line-clamp-3">{a.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-navy group-hover:text-gold transition-colors">
                  Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
            <span className="text-gold-light text-xs font-bold tracking-widest uppercase">VGMF Fellowship 2026</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to Advance Ayurvedic Research?
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-2xl mx-auto">
            Apply for the Viddhakarma Research Fellowship and contribute to evidence-based Ayurveda under expert mentorship.
          </p>
          <Link href="/fellowship" className="btn-gold text-lg !py-4 !px-10">
            Apply Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* CONTACT MINI */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* About Card */}
            <div className="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="font-heading text-3xl font-extrabold mb-4">About the Foundation</h3>
                <p className="text-white/50 leading-relaxed mb-8">
                  Advancing Ayurvedic Research & Viddhakarma Studies since 1972. Carrying forward Vaidya R.B. Gogate&apos;s legacy through education, research, and community service.
                </p>
                <Link href="/about" className="btn-gold !py-3">
                  About Us <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {[
                { icon: MapPin, label: "Address", value: "102, Ramprasad Chambers, 368/1, Jawaharlal Nehru Rd, Pune 411002", href: "https://maps.google.com/?q=102+Ramprasad+Chambers+Pune+411002" },
                { icon: Phone, label: "Phone", value: "+91 93737 92952", href: "tel:+919373792952" },
                { icon: Mail, label: "Email", value: "care@vaidyagogate.org", href: "mailto:care@vaidyagogate.org" },
              ].map((c, i) => (
                <a key={i} href={c.href} target={i === 0 ? "_blank" : undefined} rel={i === 0 ? "noopener noreferrer" : undefined}
                  className="block bg-white rounded-2xl border border-gray-100 p-5 card-hover group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                      <c.icon size={20} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">{c.label}</p>
                      <p className="text-sm text-navy font-medium leading-relaxed">{c.value}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
