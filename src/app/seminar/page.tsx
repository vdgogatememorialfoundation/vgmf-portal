import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ArrowRight, Calendar, MapPin, Users, Video, Award, Mic, Presentation, Clock, CheckCircle, History } from "lucide-react";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";

export const metadata = { title: "National Seminar" };

export default async function SeminarPage() {
  const session = await auth();
  const event = await prisma.event.findFirst({ where: { eventType: "Seminar" }, orderBy: { eventDate: "desc" } });

  if (!event || !event.isPublished) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <Presentation size={48} className="text-muted/30 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-navy mb-2">Coming Soon</h2>
          <p className="text-sm text-muted mb-6">The National Seminar is not scheduled at this moment. Please check back later.</p>
          <Link href="/" className="btn-primary">Back to Home <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  if (event.restrictToDoctors && !session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <Presentation size={48} className="text-[#0d6662] mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-navy mb-2">Medical Practitioners Only</h2>
          <p className="text-sm text-muted mb-6">This event is for registered medical practitioners only.</p>
          <Link href="/login" className="btn-primary">Log In to Continue <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  const eventDate = event.eventDate ? new Date(event.eventDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "December 2026";
  const eventDateFull = event.eventDate ? new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";
  const location = event.city || "Pune, Maharashtra";

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#0d6662] via-[#0d6662] to-[#14918b] py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] bg-[#c2761c]/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">Annual Event</span>
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
            {event.title || "National Seminar on Agnikarma & Viddhakarma"}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            {event.shortDesc || "Bringing together Ayurvedic practitioners, researchers, and students from across India for knowledge exchange and live demonstrations."}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="flex items-center gap-2 text-white/80 text-sm bg-white/15 px-4 py-2 rounded-full border border-white/20">
              <Calendar size={16} className="text-white" /> {eventDate}
            </span>
            <span className="flex items-center gap-2 text-white/80 text-sm bg-white/15 px-4 py-2 rounded-full border border-white/20">
              <MapPin size={16} className="text-white" /> {location}
            </span>
            {event.ticketPrice !== undefined && event.ticketPrice !== null && (
              <span className="flex items-center gap-2 text-white/80 text-sm bg-white/15 px-4 py-2 rounded-full border border-white/20">
                ₹{event.ticketPrice} Registration
              </span>
            )}
          </div>
          <Link href="/dashboard" className="btn-gold text-lg !py-4 !px-10">Register in Dashboard <ArrowRight size={20} /></Link>
        </div>
      </section>

      {/* STATS */}
      <section className="relative -mt-12 z-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-6 grid grid-cols-3 gap-4 shadow-xl shadow-[#0d6662]/8 border border-gray-100">
            {[
              { v: "15th", l: "Edition" },
              { v: "500+", l: "Attendees" },
              { v: "2 Days", l: "Duration" },
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
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">About</span>
            <h2>About the Seminar</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card-hover bg-white rounded-3xl border border-gray-100 p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#0d6662] to-[#14918b] rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg">
                <Award size={24} />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-navy mb-3">Our Legacy</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{event.description || "Since its inception, the National Seminar on Agnikarma and Viddhakarma has been a cornerstone event for Ayurvedic professionals. Founded to honour Vaidya R.B. Gogate's pioneering work, the seminar has grown into a premier platform for knowledge exchange, live demonstrations, and research presentations."}</p>
            </div>
            <div className="card-hover bg-white rounded-3xl border border-gray-100 p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#c2761c] to-[#d4922a] rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg">
                <Users size={24} />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-navy mb-3">Who Should Attend</h3>
              <p className="text-sm text-ink-soft leading-relaxed">Ayurvedic practitioners, researchers, BAMS students, and healthcare professionals interested in Shalya Tantra. The seminar offers CME credits and provides hands-on exposure to traditional techniques validated by modern evidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-28 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Highlights</span>
            <h2>Event Highlights</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Mic, title: "Keynote Lectures", desc: "Eminent speakers from leading Ayurvedic institutions across India sharing cutting-edge research.", color: "from-[#0d6662] to-[#14918b]" },
              { icon: Video, title: "Live Demonstrations", desc: "Hands-on Agnikarma and Viddhakarma technique sessions performed by expert practitioners.", color: "from-[#0a5250] to-[#0d6662]" },
              { icon: Award, title: "Paper Presentations", desc: "Research paper submissions with awards and recognition for best presentations.", color: "from-[#0d6662] to-[#14918b]" },
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

      {/* SPEAKERS */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Faculty</span>
            <h2>Eminent Speakers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Dr. Anagha Gogate", role: "Chief Patron", org: "VGMF, Pune" },
              { name: "Dr. S. K. Sharma", role: "Keynote Speaker", org: "AIIA, New Delhi" },
              { name: "Dr. Meera Bhojani", role: "Session Chair", org: "Tilak Ayurved, Pune" },
            ].map((s, i) => (
              <div key={i} className="card-hover bg-white rounded-3xl border border-gray-100 p-8 text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0d6662]/10 to-[#c2761c]/10 rounded-full mx-auto mb-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users size={36} className="text-[#0d6662]/30" />
                </div>
                <h3 className="font-heading text-lg font-extrabold text-navy">{s.name}</h3>
                <p className="text-sm text-[#0d6662] font-bold mt-1">{s.role}</p>
                <p className="text-xs text-muted mt-1">{s.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAST SEMINARS */}
      <section className="py-28 bg-cream-dark">
        <div className="max-w-4xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">History</span>
            <h2>Past Seminars</h2>
            <p>A legacy of knowledge sharing spanning over a decade</p>
          </div>
          <div className="space-y-4">
            {[
              { year: "2025", topic: "Viddhakarma in Modern Practice — Evidence and Innovation" },
              { year: "2024", topic: "Agnikarma Standardization and Clinical Protocols" },
              { year: "2023", topic: "Integrating Traditional Shalya Tantra with Contemporary Surgery" },
              { year: "2022", topic: "Raktamokshana: Classical Techniques and Modern Evidence" },
            ].map((item, i) => (
              <div key={i} className="card-hover bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0d6662] to-[#14918b] rounded-2xl flex items-center justify-center text-white font-heading font-extrabold text-lg shrink-0 shadow-lg">
                  {item.year.slice(-2)}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0d6662] uppercase tracking-wider mb-0.5">{item.year}</p>
                  <p className="text-sm text-navy font-semibold">{item.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-gradient-to-br from-[#0d6662] via-[#0d6662] to-[#14918b] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#c2761c]/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Reserve Your Seat Today
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Join 500+ Ayurvedic professionals at the premier Agnikarma & Viddhakarma conference.
          </p>
          <Link href="/dashboard" className="btn-gold text-lg !py-4 !px-10">Register in Dashboard <ArrowRight size={20} /></Link>
        </div>
      </section>
    </div>
  );
}
