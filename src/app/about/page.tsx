import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Award, BookOpen, Heart, Users, Calendar, Star, GraduationCap, Stethoscope, Target, Eye } from "lucide-react";

export const metadata = { title: "About Us" };

export default async function AboutPage() {
  let siteContent: Record<string, string> = {};
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/content`, { cache: "no-store" });
    if (res.ok) {
      const items = await res.json();
      items.forEach((item: any) => { siteContent[item.key] = item.value; });
    }
  } catch {}

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#0891b2] via-[#06b6d4] to-[#22d3ee] py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <span className="text-white text-xs font-bold tracking-widest uppercase">Est. 1972</span>
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
            About the <span className="text-gold-light">Foundation</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {siteContent.about_hero || "Preserving the legacy of Vaidya R.B. Gogate through research, education, and community service rooted in authentic Ayurvedic tradition."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-gold text-base !py-3.5 !px-7">Get in Touch <ArrowRight size={18} /></Link>
            <Link href="/articles" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 hover:!border-white/50 text-base !py-3.5 !px-7">Our Articles</Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative -mt-10 z-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-xl shadow-teal/8 border border-gray-100">
            {[
              { n: "1972", l: "Founded", icon: Calendar },
              { n: "50+", l: "Years Legacy", icon: Star },
              { n: "5000+", l: "Patients Served", icon: Users },
              { n: "100+", l: "Vaidyas Trained", icon: GraduationCap },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-12 h-12 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-teal/20 transition-colors">
                  <s.icon size={20} className="text-[#0891b2]" />
                </div>
                <div className="font-heading text-2xl md:text-3xl font-extrabold text-navy">{s.n}</div>
                <div className="text-xs text-muted font-medium mt-1 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDATION HISTORY */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="animate-fade-up">
              <div className="section-heading !text-left !mb-8">
                <span className="badge">Our Story</span>
                <h2 className="!text-left">Foundation History</h2>
                <p className="!text-left !mx-0">A legacy spanning five generations of Ayurvedic excellence</p>
              </div>
              <div className="space-y-5 text-ink-soft leading-relaxed">
                <p>
                  {siteContent.about_history || "Vaidya Gogate Memorial Foundation is a platform with a sole motto: Propagation of knowledge. This is a platform to share our grandfather's, Vd. Ramchandra Ballal Gogate's work and carry forward his vision 'knowledge for all'. We are creating this platform as an authentic source of information."}
                </p>
                <p>
                  Our purpose is to ignite young minds through his writings and teachings. We plan to reach out to all vaidyas, students of Ayurveda as well as disseminating the knowledge across all pathies and common people.
                </p>
                <p>
                  Our family has been blessed with renowned vaidyas for many generations — starting from Vd. Mahadev (Bapu) Gogate who was the Rajavaidya to the king of Jawhar, to Vd. Vishnu Mahadev Gogate (Dravyaguna), Vd. Trimbak Mahadev Gogate (Panchakarma), and then Vd. Ramchandra Ballal Gogate (Shalya Tantra). This legacy still continues.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: Stethoscope, title: "Vd. Mahadev Gogate", desc: "Rajavaidya to the King of Jawhar — the patriarch who began our medical legacy.", color: "from-[#0891b2] to-[#06b6d4]" },
                { icon: BookOpen, title: "Vd. Vishnu & Trimbak Gogate", desc: "Specialists in Dravyaguna and Panchakarma who expanded Ayurvedic practice.", color: "from-[#0e7490] to-[#0891b2]" },
                { icon: Star, title: "Vd. R.B. Gogate", desc: "Pioneer in Shalya Tantra, Agnikarma, and Viddhakarma with global recognition.", color: "from-[#b45309] to-[#d97706]" },
                { icon: Heart, title: "The Next Generation", desc: "Continuing the tradition through VGMF — research, education, and community service.", color: "from-teal to-teal-light" },
              ].map((item, i) => (
                <div key={i} className="card-hover bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-navy text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-ink-soft leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-24 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Purpose</span>
            <h2>Mission & Vision</h2>
            <p>Guided by tradition, driven by impact</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card-hover bg-white rounded-3xl p-10 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0891b2] to-[#06b6d4] opacity-5 rounded-bl-[60px]" />
              <div className="w-16 h-16 bg-gradient-to-br from-[#0891b2] to-[#06b6d4] rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                <Target size={28} />
              </div>
              <h3 className="font-heading text-2xl font-extrabold text-navy mb-4">Our Mission</h3>
              <p className="text-ink-soft leading-relaxed">
                {siteContent.about_mission || "To propagate Ayurvedic knowledge by preserving and sharing the research and teachings of Vaidya R.B. Gogate. We aim to ignite young minds through authentic writings, support evidence-based research through fellowships, and serve communities through accessible healthcare programmes."}
              </p>
            </div>
            <div className="card-hover bg-white rounded-3xl p-10 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold to-gold-light opacity-5 rounded-bl-[60px]" />
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                <Eye size={28} />
              </div>
              <h3 className="font-heading text-2xl font-extrabold text-navy mb-4">Our Vision</h3>
              <p className="text-ink-soft leading-relaxed">
                {siteContent.about_vision || "To become a global centre for Ayurvedic research and education, recognised for advancing traditional knowledge through modern evidence. We envision a future where Viddhakarma and Agnikarma are universally acknowledged as effective parasurgical interventions."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Founder</span>
            <h2>Vaidya Ramchandra Ballal Gogate</h2>
            <p>A life devoted to Ayurvedic surgery and the pursuit of knowledge</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 card-hover">
                <h3 className="font-heading text-xl font-extrabold text-navy mb-4">Life & Legacy</h3>
                <p className="text-ink-soft leading-relaxed mb-4">
                  Vd. R.B. Gogate was born on <strong className="text-navy">4th February, 1933</strong> at Atkar gaon and passed away on <strong className="text-navy">28th September, 2015</strong> at Pune. He received his GFAM and AVP in Shalya-Shalakya from Pune.
                </p>
                <p className="text-ink-soft leading-relaxed">
                  He conducted extensive research on AIDS, cancer, Agnikarma, Viddhakarma, dhoopan chikitsa in vrana, cauterisation of corns by Ayurvedic method, and raktamokshan. He published various books covering subjects like AIDS, Viddha and Agnikarma, Bhagna and Asthi roga, Shalya tantra, and Hasti ayurved.
                </p>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 p-8 card-hover">
                <h3 className="font-heading text-xl font-extrabold text-navy mb-4">Professional Career</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Professor for Post Graduate Studies (Pune University)",
                    "Director — Research & Publication (Sane Guruji Arogya Kendra)",
                    "Principal (Tilak Ayurved Mahavidyalaya)",
                    "Hon. Surgeon & HOD (Seth Tarachand Ramnath Hospital)",
                    "C.M.O. (Matru Mandir Hospital, Devrukh)",
                    "Chief of AIDS Research Centre (STRC Hospital)",
                    "Chief of Cancer Project (Pethe Arogya Kendra, Belgaum)",
                  ].map((role, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gold rounded-full mt-2 shrink-0" />
                      <p className="text-sm text-ink-soft">{role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#0891b2] to-[#06b6d4] rounded-3xl p-8 text-white">
                <h3 className="font-heading text-lg font-extrabold text-gold mb-4">Books Published</h3>
                <div className="space-y-3">
                  {["AIDS", "Viddha and Agnikarma", "Bhagna and Asthi roga", "Shalya Tantra", "Hasti Ayurved"].map((book, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <BookOpen size={16} className="text-white/60 shrink-0" />
                      <span className="text-sm text-white/80">{book}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 p-8 card-hover">
                <h3 className="font-heading text-lg font-extrabold text-navy mb-4 flex items-center gap-2">
                  <Award size={20} className="text-gold" /> Awards & Honours
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Pandit Ramnarayan Sharma Award", detail: "Received by his son at the hands of President Shri Ramnath Kovind" },
                    { name: "Sushrut Puraskar", detail: "Khadiwale Vaidya Sanstha" },
                    { name: "Gayatri Pratishthan Puraskar", detail: "For work on AIDS" },
                    { name: "Legend Shalaki Karyabhushan Puraskar" },
                    { name: "Jivan Gaurav Puraskar", detail: "TAMV, RSM" },
                  ].map((award, i) => (
                    <div key={i} className="border-l-2 border-gold/30 pl-3">
                      <p className="text-sm font-bold text-navy">{award.name}</p>
                      {award.detail && <p className="text-xs text-muted mt-0.5">{award.detail}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DR. ANAGHA GOGATE */}
      <section className="py-24 bg-cream-dark">
        <div className="max-w-4xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">In Memoriam</span>
            <h2>Dr. Anagha Gogate</h2>
            <p>Unwavering support and strength to the Foundation</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-10 card-hover">
            <p className="text-ink-soft leading-relaxed mb-5">
              Born on <strong className="text-navy">7th November 1936</strong> in Panchgani, Satara district, Dr. Anagha Ramchandra Gogate was the most significant contributor in terms of unwavering support to Dr. R.B. Gogate.
            </p>
            <p className="text-ink-soft leading-relaxed mb-5">
              She pursued her BAMS at Tilak Ayurved Mahavidyalaya and married Dr. R.B. Gogate on <strong className="text-navy">21st May 1963</strong>. She received enormous appreciation as a professor in Tilak Ayurvedic Mahavidyalaya from 1970 onwards.
            </p>
            <p className="text-ink-soft leading-relaxed">
              We lost her on <strong className="text-navy">12th September 2019</strong>. She will always be remembered for being remarkably virtuous and dutiful with incomparable will to stand by her husband through any odds.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-heading">
            <span className="badge">Principles</span>
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: "Knowledge", desc: "Free and open sharing of Ayurvedic wisdom for practitioners, students, and society.", color: "from-[#0891b2] to-[#06b6d4]" },
              { icon: Award, title: "Excellence", desc: "Maintaining the highest standards in research, education, and clinical practice.", color: "from-gold to-gold-light" },
              { icon: Heart, title: "Compassion", desc: "Serving communities through free healthcare programmes and accessible therapy.", color: "from-rose-500 to-rose-400" },
              { icon: Users, title: "Collaboration", desc: "Bridging traditional Ayurveda with modern evidence through inclusive partnerships.", color: "from-teal to-teal-light" },
            ].map((value, i) => (
              <div key={i} className="card-hover bg-white rounded-3xl border border-gray-100 p-8 text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon size={28} />
                </div>
                <h3 className="font-heading text-xl font-extrabold text-navy mb-3">{value.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-24 bg-gradient-to-br from-[#0891b2] via-[#06b6d4] to-[#22d3ee] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Interested in Our Work?
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Whether you are a researcher, practitioner, student, or supporter — we would love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-gold text-lg !py-4 !px-10">Contact Us <ArrowRight size={20} /></Link>
            <Link href="/fellowship" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 hover:!border-white/50 text-lg !py-4 !px-10">Explore Fellowship</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
