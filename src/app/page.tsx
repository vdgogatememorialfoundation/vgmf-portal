import Link from "next/link";
import { ArrowRight, FlaskConical, Presentation, Heart, MapPin, Phone, Mail, Calendar, Users, Star, Stethoscope, GraduationCap, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/HeroSlider";
import EventGallery from "@/components/EventGallery";

const serveCategories = [
  {
    icon: Stethoscope, title: "Ayurvedic Practitioners", desc: "Access seminars, fellowship opportunities, and research collaborations to advance your practice.",
    color: "bg-teal/10 text-teal", href: "/signup",
  },
  {
    icon: GraduationCap, title: "Students", desc: "Discover learning resources, study materials, and career pathways in Ayurveda.",
    color: "bg-gold/10 text-gold", href: "/signup",
  },
  {
    icon: BookOpen, title: "Researchers", desc: "Apply for the Viddhakarma Research Fellowship and publish your findings with expert mentorship.",
    color: "bg-maroon/10 text-maroon", href: "/fellowship",
  },
  {
    icon: Heart, title: "Patients & Families", desc: "Access autism care, health resources, and community support programmes at no cost.",
    color: "bg-rose-50 text-rose-600", href: "/autism",
  },
];

export default async function Home() {
  const [events, articles, announcements] = await Promise.all([
    prisma.event.findMany({ where: { isPublished: true }, orderBy: { eventDate: "desc" }, take: 6 }),
    prisma.article.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
  ]);

  const pinnedAnnouncements = announcements.filter(a => a.isPinned);

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      {pinnedAnnouncements.length > 0 && (
        <div className="bg-gradient-to-r from-teal to-teal-light">
          <div className="max-w-7xl mx-auto px-4 py-1.5 text-center">
            {pinnedAnnouncements.map(a => (
              <div key={a.id} className="flex items-center justify-center gap-2 text-xs text-white">
                <Star size={10} className="fill-white" />
                <span className="font-bold">{a.title}</span>
                {a.summary && <span className="hidden sm:inline opacity-80">- {a.summary}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HERO SLIDER */}
      <HeroSlider />

      {/* STATS BAR */}
      <section className="relative -mt-8 z-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-lg shadow-teal/5 border border-slate-100">
            {[
              { n: "1972", l: "Founded", icon: Calendar },
              { n: "5000+", l: "Patients Served", icon: Users },
              { n: "100+", l: "Vaidyas Trained", icon: Star },
              { n: "3", l: "Programmes", icon: FlaskConical },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <s.icon size={18} className="text-teal" />
                </div>
                <div className="font-heading text-xl md:text-2xl font-extrabold text-ink">{s.n}</div>
                <div className="text-[10px] text-muted font-medium uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="section-heading">
            <span className="badge">Programmes</span>
            <h2>Our Initiatives</h2>
            <p>Advancing Ayurvedic knowledge and community wellbeing</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FlaskConical, title: "Research Fellowship", desc: "Grants up to ₹75,000 for Viddhakarma research under expert mentorship", href: "/fellowship", color: "bg-teal/10 text-teal" },
              { icon: Presentation, title: "National Seminar", desc: "Annual conference on Agnikarma & Viddhakarma with live demonstrations", href: "/seminar", color: "bg-gold/10 text-gold" },
              { icon: Heart, title: "Autism Programme", desc: "Free awareness, therapy, and community support for families", href: "/autism", color: "bg-maroon/10 text-maroon" },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="group bg-white rounded-2xl border border-slate-100 p-6 card-hover">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon size={22} />
                </div>
                <h3 className="font-heading text-lg font-extrabold text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed mb-4">{item.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-teal group-hover:gap-2.5 transition-all">
                  Learn More <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="section-heading">
            <span className="badge">Who We Serve</span>
            <h2>For Everyone in Ayurveda</h2>
            <p>Tailored programmes and resources for every member of the Ayurvedic community</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serveCategories.map((item, i) => (
              <Link key={i} href={item.href} className="group bg-cream rounded-2xl border border-slate-100 p-6 card-hover">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <item.icon size={26} />
                </div>
                <h3 className="font-heading text-lg font-extrabold text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed mb-4">{item.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-teal group-hover:gap-2.5 transition-all">
                  Get Started <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/signup" className="btn-primary">
              Create Your Account <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* EVENT GALLERY */}
      <EventGallery />

      {/* ANNOUNCEMENTS */}
      {announcements.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="section-heading">
              <span className="badge">Notices</span>
              <h2>Announcements</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {announcements.map(a => (
                <div key={a.id} className={`rounded-2xl p-5 card-hover border ${a.isPinned ? "bg-teal/5 border-teal/20" : "bg-slate-50 border-slate-100"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading font-bold text-ink">{a.title}</h3>
                    {a.isPinned && <span className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded-full font-bold">Pinned</span>}
                  </div>
                  {a.summary && <p className="text-sm text-ink-soft">{a.summary}</p>}
                  <p className="text-[10px] text-muted mt-3 font-medium">
                    {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ARTICLES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="section-heading">
            <span className="badge">Knowledge</span>
            <h2>Articles & Research</h2>
            <p>Explore Dr. R.B. Gogate&apos;s contributions to Ayurvedic science</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map(a => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="group bg-white rounded-2xl border border-slate-100 p-6 card-hover">
                <span className="inline-block px-2.5 py-0.5 bg-teal/10 text-teal text-[10px] font-bold rounded-full mb-3 uppercase tracking-wider">{a.category || "General"}</span>
                <h3 className="font-heading text-base font-extrabold text-ink mb-2 group-hover:text-teal transition-colors leading-snug">{a.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed mb-4 line-clamp-3">{a.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-teal group-hover:gap-2.5 transition-all">
                  Read Article <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-teal to-teal-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white mb-3">
            Ready to Advance Ayurvedic Research?
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-xl mx-auto">
            Apply for the Viddhakarma Research Fellowship and contribute to evidence-based Ayurveda.
          </p>
          <Link href="/fellowship" className="btn-gold !text-base !py-3">
            Apply Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-teal/5 rounded-2xl p-8 border border-teal/10">
              <h3 className="font-heading text-2xl font-extrabold text-ink mb-3">About the Foundation</h3>
              <p className="text-ink-soft text-sm leading-relaxed mb-6">
                Advancing Ayurvedic Research &amp; Viddhakarma Studies since 1972. Carrying forward Vaidya R.B. Gogate&apos;s legacy through education, research, and community service.
              </p>
              <Link href="/about" className="btn-primary !text-sm">
                About Us <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { icon: MapPin, label: "Address", value: "102, Ramprasad Chambers, 368/1, Jawaharlal Nehru Rd, Pune 411002", href: "https://maps.google.com/?q=102+Ramprasad+Chambers+Pune+411002", external: true },
                { icon: Phone, label: "Phone", value: "+91 93737 92952", href: "tel:+919373792952" },
                { icon: Mail, label: "Email", value: "care@vaidyagogate.org", href: "mailto:care@vaidyagogate.org" },
              ].map((c, i) => (
                <a key={i} href={c.href} target={c.external ? "_blank" : undefined} rel={c.external ? "noopener noreferrer" : undefined}
                  className="block bg-white rounded-xl border border-slate-100 p-4 card-hover group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-teal/20 transition-colors">
                      <c.icon size={16} className="text-teal" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-0.5">{c.label}</p>
                      <p className="text-xs text-ink font-medium leading-relaxed">{c.value}</p>
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
