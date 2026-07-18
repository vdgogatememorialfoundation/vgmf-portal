import Link from "next/link";
import { ArrowRight, FlaskConical, Presentation, Heart, MapPin, Phone, Mail, Calendar, Users, Star, ShieldCheck, ExternalLink, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/HeroSlider";
import EventGallery from "@/components/EventGallery";
import EventCountdown from "@/components/EventCountdown";
import SiteReviews from "@/components/SiteReviews";
import SiteNotices from "@/components/SiteNotices";

export default async function Home() {
  const now = new Date();

  const [events, articles, upcomingEvents, reviews, notices] = await Promise.all([
    prisma.event.findMany({ where: { isPublished: true }, orderBy: { eventDate: "desc" }, take: 6 }),
    prisma.article.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.event.findMany({
      where: { isPublished: true, eventDate: { gt: now } },
      orderBy: { eventDate: "asc" },
      take: 4,
      select: { id: true, title: true, slug: true, eventDate: true, location: true, isRegistrationOpen: true },
    }),
    prisma.siteReview.findMany({
      where: { isApproved: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      take: 8,
      select: { id: true, rating: true, title: true, content: true, userId: true, createdAt: true, user: { select: { name: true, role: true } } },
    }),
    prisma.siteNotice.findMany({
      where: {
        isActive: true,
        position: "above-hero",
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const countdownEvents = upcomingEvents.map((e) => ({
    id: e.id,
    title: e.title,
    eventDate: e.eventDate.toISOString(),
    location: e.location,
    isRegistrationOpen: e.isRegistrationOpen,
    slug: e.slug,
  }));

  const reviewItems = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    content: r.content,
    userName: r.user.name,
    userDesignation: r.role || null,
  }));

  const activeNotices = notices.filter(n => n.isActive && (!n.startDate || n.startDate <= now) && (!n.endDate || n.endDate >= now));

  return (
    <>
      {/* SITE NOTICES - Below Header */}
      <SiteNotices />

      {/* HERO SLIDER */}
      <HeroSlider />

      {/* STATS BAR */}
      <section className="relative -mt-6 z-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-xl shadow-[#0d6662]/5 border border-[#0d6662]/10">
            {[
              { n: "1972", l: "Founded", icon: Calendar },
              { n: "5000+", l: "Patients Served", icon: Users },
              { n: "100+", l: "Vaidyas Trained", icon: Star },
              { n: "3", l: "Programmes", icon: FlaskConical },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-[#0d6662]/10 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                  <s.icon size={16} className="text-[#0d6662]" />
                </div>
                <div className="font-heading text-xl md:text-2xl font-extrabold text-[#1a1a2e]">{s.n}</div>
                <div className="text-[10px] text-[#7c7c8a] font-medium uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS COUNTDOWN */}
      <EventCountdown events={countdownEvents} />

      {/* PROGRAMMES */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="section-heading">
            <span className="badge">Programmes</span>
            <h2>Our Initiatives</h2>
            <p>Advancing Ayurvedic knowledge and community wellbeing</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: FlaskConical, title: "Research Fellowship", desc: "Grants up to ₹75,000 for Viddhakarma research under expert mentorship", href: "/fellowship", color: "bg-[#0d6662]/10 text-[#0d6662]", accent: "#0d6662" },
              { icon: Presentation, title: "National Seminar", desc: "Annual conference on Agnikarma & Viddhakarma with live demonstrations", href: "/seminar", color: "bg-[#c2761c]/10 text-[#c2761c]", accent: "#c2761c" },
              { icon: Heart, title: "Autism Programme", desc: "Free awareness, therapy, and community support for families", href: "/autism", color: "bg-[#7c1d1d]/10 text-[#7c1d1d]", accent: "#7c1d1d" },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="group bg-white rounded-2xl border border-[#1a1a2e]/5 p-6 card-hover">
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon size={20} />
                </div>
                <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-1.5">{item.title}</h3>
                <p className="text-sm text-[#7c7c8a] leading-relaxed mb-4">{item.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold group-hover:gap-2.5 transition-all" style={{ color: item.accent }}>
                  Learn More <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EVENT GALLERY */}
      <EventGallery />

      {/* ARTICLES */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="section-heading">
            <span className="badge">Knowledge</span>
            <h2>Articles & Research</h2>
            <p>Explore Dr. R.B. Gogate&apos;s contributions to Ayurvedic science</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {articles.map(a => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="group bg-white rounded-2xl border border-[#1a1a2e]/5 p-5 card-hover">
                <span className="inline-block px-2.5 py-0.5 bg-[#0d6662]/10 text-[#0d6662] text-[10px] font-bold rounded-full mb-2.5 uppercase tracking-wider">{a.category || "General"}</span>
                <h3 className="font-heading text-base font-extrabold text-[#1a1a2e] mb-1.5 group-hover:text-[#0d6662] transition-colors leading-snug">{a.title}</h3>
                <p className="text-sm text-[#7c7c8a] leading-relaxed mb-3 line-clamp-3">{a.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0d6662] group-hover:gap-2.5 transition-all">
                  Read Article <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SITE REVIEWS */}
      <SiteReviews reviews={reviewItems} />

      {/* CTA */}
      <section className="py-10 bg-gradient-to-r from-[#0d6662] to-[#0a8480] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#c2761c] rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white mb-3">
            Ready to Advance Ayurvedic Research?
          </h2>
          <p className="text-white/80 text-base mb-7 max-w-xl mx-auto">
            Apply for the Viddhakarma Research Fellowship and contribute to evidence-based Ayurveda.
          </p>
          <Link href="/about" className="btn-gold !text-sm !py-2.5">
            Learn More <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CONTACT & VERIFY */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="section-heading">
            <span className="badge">Contact</span>
            <h2>Get in Touch</h2>
            <p>We&apos;re here to help and answer any questions you may have</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#0d6662]/5 rounded-2xl p-7 border border-[#0d6662]/10">
              <h3 className="font-heading text-xl font-extrabold text-[#1a1a2e] mb-2">About the Foundation</h3>
              <p className="text-[#7c7c8a] text-sm leading-relaxed mb-5">
                Advancing Ayurvedic Research &amp; Viddhakarma Studies since 1972. Carrying forward Vaidya R.B. Gogate&apos;s legacy through education, research, and community service.
              </p>
              <Link href="/about" className="btn-primary !text-xs !py-2">
                About Us <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-2.5">
              {[
                { icon: MapPin, label: "Address", value: "102, Ramprasad Chambers, 368/1, Jawaharlal Nehru Rd, Pune 411002", href: "https://maps.google.com/?q=102+Ramprasad+Chambers+Pune+411002", external: true },
                { icon: Phone, label: "Phone", value: "+91 93737 92952", href: "tel:+919373792952" },
                { icon: Mail, label: "Email", value: "care@vaidyagogate.org", href: "mailto:care@vaidyagogate.org" },
                { icon: ShieldCheck, label: "Verify", value: "Verify Certificate / Check Application Status", href: "/verify" },
              ].map((c, i) => (
                <a key={i} href={c.href} target={c.external ? "_blank" : undefined} rel={c.external ? "noopener noreferrer" : undefined}
                  className="block bg-white rounded-xl border border-[#1a1a2e]/5 p-3.5 card-hover group">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#0d6662]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#0d6662]/20 transition-colors">
                      <c.icon size={14} className="text-[#0d6662]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#7c7c8a] font-bold uppercase tracking-wider mb-0.5">{c.label}</p>
                      <p className="text-xs text-[#1a1a2e] font-medium leading-relaxed">{c.value}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="py-10 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-heading text-sm font-extrabold text-white mb-3">Programmes</h4>
              <div className="space-y-2">
                {[
                  { label: "Research Fellowship", href: "/fellowship" },
                  { label: "National Seminar", href: "/seminar" },
                  { label: "Autism Programme", href: "/autism" },
                ].map((link, i) => (
                  <Link key={i} href={link.href} className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs transition-colors">
                    <ChevronRight size={10} /> {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-heading text-sm font-extrabold text-white mb-3">Quick Links</h4>
              <div className="space-y-2">
                {[
                  { label: "Verify Certificate", href: "/verify" },
                  { label: "Track Application", href: "/dashboard?tab=my-fellowships" },
                  { label: "My Registrations", href: "/dashboard?tab=my-registrations" },
                ].map((link, i) => (
                  <Link key={i} href={link.href} className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs transition-colors">
                    <ChevronRight size={10} /> {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-heading text-sm font-extrabold text-white mb-3">Resources</h4>
              <div className="space-y-2">
                {[
                  { label: "Articles", href: "/articles" },
                  { label: "Events Gallery", href: "/#gallery" },
                  { label: "About Us", href: "/about" },
                ].map((link, i) => (
                  <Link key={i} href={link.href} className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs transition-colors">
                    <ChevronRight size={10} /> {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-heading text-sm font-extrabold text-white mb-3">Contact</h4>
              <div className="space-y-2 text-white/60 text-xs">
                <p className="flex items-center gap-1.5"><Phone size={10} /> +91 93737 92952</p>
                <p className="flex items-center gap-1.5"><Mail size={10} /> care@vaidyagogate.org</p>
                <a href="https://maps.google.com/?q=102+Ramprasad+Chambers+Pune+411002" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <MapPin size={10} /> Pune, Maharashtra
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
