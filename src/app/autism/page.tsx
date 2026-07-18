import Link from "next/link";
import { ArrowRight, Heart, Users, BookOpen, Mic, Calendar, CheckCircle, HelpCircle, Presentation, GraduationCap } from "lucide-react";

export const metadata = { title: "Autism Awareness Programme" };

export default function AutismPage() {
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
            Autism Awareness Programme
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Expert guest lectures, awareness sessions, and community education on Autism Spectrum Disorder — empowering families, caregivers, and professionals with knowledge.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard" className="btn-gold text-lg !py-4 !px-10">Register in Dashboard <ArrowRight size={20} /></Link>
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
              { v: "Guest Lectures", l: "Format" },
              { v: "All Welcome", l: "Eligibility" },
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
                VGMF's Autism Awareness Programme organises expert guest lectures and educational sessions to raise awareness about Autism Spectrum Disorder. We bring together experienced physicians, educators, and specialists to share knowledge with families, caregivers, and the general public.
              </p>
            </div>
            <div className="card-hover bg-white rounded-3xl border border-ink/5 p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-teal to-[#0a5c58] rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg">
                <Users size={24} />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-ink mb-3">Who Can Attend</h3>
              <p className="text-sm text-ink/70 leading-relaxed">
                Parents, caregivers, special educators, medical professionals, and anyone interested in learning about ASD. Our sessions are open to all and designed to provide practical, evidence-based knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SESSIONS */}
      <section className="py-24 bg-[#f4f1ec]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Sessions</span>
            <h2>What We Offer</h2>
            <p>Knowledge-sharing sessions led by experienced professionals</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Mic, title: "Guest Lectures", desc: "Talks by Ayurvedic physicians, paediatricians, and ASD specialists on the latest approaches to autism care.", color: "from-teal to-[#0a5c58]" },
              { icon: BookOpen, title: "Awareness Workshops", desc: "Interactive sessions on understanding ASD, early signs, intervention strategies, and supportive care.", color: "from-rose-500 to-rose-400" },
              { icon: Presentation, title: "Parent Training", desc: "Practical guidance for parents and caregivers on managing daily challenges and supporting development.", color: "from-gold to-[#a86217]" },
              { icon: GraduationCap, title: "Professional Development", desc: "Educational sessions for teachers, therapists, and healthcare workers on inclusive practices.", color: "from-[#0a5c58] to-teal" },
              { icon: Users, title: "Community Forums", desc: "Open discussions connecting families, practitioners, and specialists to share experiences and resources.", color: "from-gold to-[#a86217]" },
              { icon: Heart, title: "Resource Sharing", desc: "Providing families with guides, contacts, and references for ongoing support and services.", color: "from-rose-400 to-pink-400" },
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
            <h2>How to Participate</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { s: "01", t: "Pre-Register", d: "Sign up through your dashboard to receive notifications about upcoming guest lectures and sessions." },
              { s: "02", t: "Attend Session", d: "Join the guest lecture or workshop — online or in-person — at the scheduled date and time." },
              { s: "03", t: "Learn & Connect", d: "Gain knowledge from experts, ask questions, and connect with other families and professionals." },
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
              { q: "Is the programme free?", a: "Yes, all guest lectures and awareness sessions are completely free of charge. They are organised by VGMF as a community service initiative." },
              { q: "What topics are covered?", a: "Sessions cover understanding ASD, early signs and intervention, Ayurvedic approaches to supportive care, inclusive education, parent training, and community resources." },
              { q: "Who are the speakers?", a: "Our guest lectures feature Ayurvedic physicians, paediatricians, special educators, and ASD specialists with extensive clinical and educational experience." },
              { q: "Can anyone attend?", a: "Yes, our sessions are open to parents, caregivers, educators, healthcare professionals, and anyone interested in learning about Autism Spectrum Disorder." },
              { q: "How do I get notified about upcoming sessions?", a: "Register through your VGMF dashboard and you'll receive email notifications whenever new guest lectures or workshops are announced." },
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
            Join Our Next Session
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Free awareness sessions and guest lectures on Autism Spectrum Disorder. Learn from experts, connect with the community.
          </p>
           <Link href="/dashboard" className="btn-gold text-lg !py-4 !px-10">Register in Dashboard <ArrowRight size={20} /></Link>
        </div>
      </section>
    </div>
  );
}
