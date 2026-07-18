import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Heart, Brain, Users, ClipboardCheck, Calendar, MessageCircle, CheckCircle, Stethoscope, HandHeart, BookOpen, HelpCircle } from "lucide-react";

export const metadata = { title: "Autism Awareness Programme" };

export default async function AutismPage() {
  const event = await prisma.event.findFirst({ where: { eventType: "Autism" }, orderBy: { eventDate: "desc" } });

  if (!event || !event.isPublished) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <Heart size={48} className="text-muted/30 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-ink mb-2">Coming Soon</h2>
          <p className="text-sm text-muted mb-6">The Autism Awareness Programme is not available at this moment. Please check back later.</p>
          <Link href="/" className="btn-primary">Back to Home <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-rose-400 via-teal to-[#0d6662]">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] bg-rose-300/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <Heart size={14} className="text-white fill-white" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">Community Initiative</span>
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
            {event.title || "Autism Awareness Programme"}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            {event.shortDesc || "Free awareness, therapy, and support integrating Ayurvedic Panchakarma approaches with compassionate community care."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/autism/register" className="btn-gold text-lg !py-4 !px-10">Pre-Register Now <ArrowRight size={20} /></Link>
            <Link href="#about" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 hover:!border-white/50 text-lg !py-4 !px-10">Learn More</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative -mt-12 z-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-6 grid grid-cols-3 gap-4 shadow-xl border border-ink/5">
            {[
              { v: "Free", l: "Programme Fee" },
              { v: "Panchakarma", l: "Therapy Used" },
              { v: "All Ages", l: "Eligibility" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-heading text-xl font-extrabold text-ink">{s.v}</div>
                <div className="text-xs text-muted mt-1 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Programme</span>
            <h2>About the Programme</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card-hover bg-white rounded-3xl border border-ink/5 p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-400 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg">
                <Heart size={24} />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-ink mb-3">Our Mission</h3>
              <p className="text-sm text-ink/70 leading-relaxed">
                {event.description || "VGMF's Autism Awareness Programme is a community-driven initiative providing free consultation, therapy, and support to families affected by Autism Spectrum Disorder. We integrate Ayurvedic Panchakarma therapies with modern supportive care to improve quality of life for children and their caregivers."}
              </p>
            </div>
            <div className="card-hover bg-white rounded-3xl border border-ink/5 p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-teal to-[#0a5c58] rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg">
                <Users size={24} />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-ink mb-3">Who Can Join</h3>
              <p className="text-sm text-ink/70 leading-relaxed">
                Children and adults diagnosed with or showing signs of ASD. Parents, caregivers, and special educators are also welcome to attend our awareness workshops and training sessions conducted by experienced Ayurvedic physicians.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-[#f4f1ec]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Services</span>
            <h2>Services Offered</h2>
            <p>Holistic Ayurvedic therapies tailored to each individual</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Stethoscope, title: "Free Consultation", desc: "Initial Ayurvedic assessment and personalised consultation for each registrant.", color: "from-teal to-[#0a5c58]" },
              { icon: Brain, title: "Panchakarma Therapy", desc: "Abhyanga, Shirodhara, Nasya, and Basti therapies tailored to individual constitution.", color: "from-rose-500 to-rose-400" },
              { icon: HandHeart, title: "Family Support", desc: "Counselling, caregiver training, and awareness workshops for affected families.", color: "from-gold to-[#a86217]" },
              { icon: BookOpen, title: "Awareness Workshops", desc: "Educational sessions on ASD, early intervention, and Ayurvedic approaches.", color: "from-[#0a5c58] to-teal" },
              { icon: ClipboardCheck, title: "Ongoing Monitoring", desc: "Regular follow-ups, progress tracking, and therapy adjustments as needed.", color: "from-gold to-[#a86217]" },
              { icon: Users, title: "Community Building", desc: "Support groups connecting families, practitioners, and special educators.", color: "from-rose-400 to-pink-400" },
            ].map((service, i) => (
              <div key={i} className="card-hover bg-white rounded-3xl border border-ink/5 p-8 text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon size={28} />
                </div>
                <h3 className="font-heading text-xl font-extrabold text-ink mb-3">{service.title}</h3>
                <p className="text-sm text-ink/70 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Process</span>
            <h2>How It Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { s: "01", t: "Pre-Register", d: "Fill out the registration form with basic details about the child and family." },
              { s: "02", t: "Assessment", d: "Initial consultation and Ayurvedic assessment by our experienced physicians." },
              { s: "03", t: "Therapy Plan", d: "Personalised Panchakarma therapy schedule based on individual constitution." },
              { s: "04", t: "Ongoing Support", d: "Regular follow-ups, progress tracking, and caregiver guidance." },
            ].map((step, i) => (
              <div key={i} className="card-hover bg-white rounded-3xl border border-ink/5 p-8 relative group">
                <div className="font-heading text-6xl font-extrabold text-ink/5 absolute top-4 right-4">{step.s}</div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal to-[#0a5c58] rounded-xl flex items-center justify-center text-white text-sm font-heading font-extrabold mb-4 shadow-md">
                    {step.s}
                  </div>
                  <h3 className="font-heading text-lg font-extrabold text-ink mb-2">{step.t}</h3>
                  <p className="text-sm text-ink/70 leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#f4f1ec]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is the programme really free?", a: "Yes, the Autism Awareness Programme is completely free of charge. It is funded by VGMF as a community service initiative rooted in the Foundation's commitment to accessible healthcare." },
              { q: "What therapies are provided?", a: "We offer Ayurvedic Panchakarma therapies including Abhyanga (oil massage), Shirodhara (oil pouring), Nasya (nasal therapy), and Basti (medicated enema), all tailored to each individual's needs." },
              { q: "How long is the therapy programme?", a: "The duration varies based on individual assessment. Typical therapy cycles run for 7 to 21 days with periodic follow-ups. Our physicians adjust the plan based on progress." },
              { q: "Can adults register for the programme?", a: "Yes, the programme is open to individuals of all ages diagnosed with or showing signs of Autism Spectrum Disorder. Caregivers and family members are also welcome." },
              { q: "How do I track my registration?", a: "After pre-registering, you will receive an e-ticket number. You can use this to track your registration status from your dashboard." },
            ].map((faq, i) => (
              <details key={i} className="card-hover bg-white rounded-2xl border border-ink/5 p-6 group">
                <summary className="font-heading font-bold text-ink cursor-pointer list-none flex justify-between items-center text-base">
                  {faq.q}
                  <HelpCircle size={20} className="text-gold shrink-0 ml-4" />
                </summary>
                <p className="text-sm text-ink/70 mt-4 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-rose-400 via-teal to-[#0d6662]">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-300/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Heart size={40} className="text-white mx-auto mb-6" />
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Join the Programme Today
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Free Ayurvedic support for families affected by Autism Spectrum Disorder. Every child deserves compassionate care.
          </p>
          <Link href="/autism/register" className="btn-gold text-lg !py-4 !px-10">Pre-Register Now <ArrowRight size={20} /></Link>
        </div>
      </section>
    </div>
  );
}
