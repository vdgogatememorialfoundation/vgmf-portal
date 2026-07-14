import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Users, Video, Award, Mic, Presentation } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function SeminarPage() {
  const session = await auth();
  const event = await prisma.event.findFirst({
    where: { eventType: "Seminar" },
    orderBy: { eventDate: "desc" },
  });

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <Presentation size={48} className="mx-auto text-muted mb-4" />
          <h2 className="font-heading text-2xl font-bold text-navy mb-2">Coming Soon</h2>
          <p className="text-muted">The National Seminar is not scheduled at this moment.</p>
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-navy mt-4 hover:underline">Back to Home <ArrowRight size={14} /></Link>
        </div>
      </div>
    );
  }

  if (!event.isPublished) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <Presentation size={48} className="mx-auto text-muted mb-4" />
          <h2 className="font-heading text-2xl font-bold text-navy mb-2">Currently Unavailable</h2>
          <p className="text-muted">The National Seminar page is currently unavailable. Please check back later.</p>
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-navy mt-4 hover:underline">Back to Home <ArrowRight size={14} /></Link>
        </div>
      </div>
    );
  }

  if (event.restrictToDoctors && !session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <Presentation size={48} className="mx-auto text-maroon mb-4" />
          <h2 className="font-heading text-2xl font-bold text-navy mb-2">Medical Practitioners Only</h2>
          <p className="text-muted mb-4">This event is for registered medical practitioners only.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light">
            Log In to Continue <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "December 2026";

  const location = event.city || "Pune, Maharashtra";

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold-light text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Annual Event</span>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white mb-4">{event.title}</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">{event.shortDesc || "Bringing together Ayurvedic practitioners, researchers, and students from across India"}</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="flex items-center gap-1 text-white/80 text-sm"><Calendar size={16} /> {eventDate}</span>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1 text-white/80 text-sm"><MapPin size={16} /> {location}</span>
          </div>
          <Link href="/seminar/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-all text-lg shadow-xl shadow-gold/20">Register Now <ArrowRight size={20} /></Link>
        </div>
      </section>

      {/* STATS */}
      <section className="relative -mt-10 z-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="glass rounded-2xl p-6 grid grid-cols-3 gap-4 shadow-lg">
            {[{v:"15th",l:"Edition"},{v:"500+",l:"Attendees"},{v:"2 Days",l:"Duration"}].map((s,i) => (
              <div key={i} className="text-center"><div className="font-heading text-xl font-extrabold text-navy">{s.v}</div><div className="text-xs text-muted mt-1 uppercase tracking-wider">{s.l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT THE SEMINAR */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">About</span><h2 className="font-heading text-3xl font-extrabold text-navy">About the Seminar</h2></div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card-hover bg-white rounded-2xl border p-8">
              <h3 className="font-heading text-xl font-bold text-navy mb-3">Our Legacy</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{event.description || "Since its inception, the National Seminar on Agnikarma and Viddhakarma has been a cornerstone event for Ayurvedic professionals. Founded to honour Vaidya R.B. Gogate's pioneering work, the seminar has grown into a premier platform for knowledge exchange, live demonstrations, and research presentations."}</p>
            </div>
            <div className="card-hover bg-white rounded-2xl border p-8">
              <h3 className="font-heading text-xl font-bold text-navy mb-3">Who Should Attend</h3>
              <p className="text-sm text-ink-soft leading-relaxed">Ayurvedic practitioners, researchers, BAMS students, and healthcare professionals interested in Shalya Tantra. The seminar offers CME credits and provides hands-on exposure to traditional techniques validated by modern evidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Event</span><h2 className="font-heading text-3xl font-extrabold text-navy">Event Highlights</h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {i:Mic,t:"Keynote Lectures",d:"Eminent speakers from leading Ayurvedic institutions"},
              {i:Video,t:"Live Demonstrations",d:"Hands-on Agnikarma and Viddhakarma technique sessions"},
              {i:Award,t:"Paper Presentations",d:"Research paper submissions with awards for best papers"},
            ].map((c,i) => (
              <div key={i} className="card-hover bg-white rounded-2xl border p-6"><div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center text-navy mb-4"><c.i size={24} /></div><h3 className="font-heading text-lg font-bold text-navy mb-2">{c.t}</h3><p className="text-sm text-ink-soft">{c.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* SPEAKERS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Faculty</span><h2 className="font-heading text-3xl font-extrabold text-navy">Eminent Speakers</h2></div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {name:"Dr. Anagha Gogate",role:"Chief Patron",org:"VGMF, Pune"},
              {name:"Dr. S. K. Sharma",role:"Keynote Speaker",org:"AIIA, New Delhi"},
              {name:"Dr. Meera Bhojani",role:"Session Chair",org:"Tilak Ayurved, Pune"},
            ].map((s,i) => (
              <div key={i} className="card-hover bg-white rounded-2xl border p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-navy/10 to-gold/10 rounded-full mx-auto mb-4 flex items-center justify-center"><Users size={32} className="text-navy/40" /></div>
                <h3 className="font-heading text-lg font-bold text-navy">{s.name}</h3>
                <p className="text-sm text-gold font-semibold">{s.role}</p>
                <p className="text-xs text-muted mt-1">{s.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-navy to-navy-light text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-extrabold text-white mb-4">Reserve Your Seat Today</h2>
          <p className="text-white/70 mb-8">Join 500+ Ayurvedic professionals at the premier Agnikarma & Viddhakarma conference</p>
          <Link href="/seminar/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-all">Register Now <ArrowRight size={20} /></Link>
        </div>
      </section>
    </div>
  );
}
