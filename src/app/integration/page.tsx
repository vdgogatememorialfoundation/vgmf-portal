"use client";
import { useEffect, useState } from "react";
import { GraduationCap, FlaskConical, Heart, ExternalLink, ArrowRight, Zap, Shield, Globe, Users, BookOpen, Activity } from "lucide-react";
import Link from "next/link";

const PORTALS = [
  {
    name: "Seminar Portal",
    description: "Register for VGMF medical seminars and conferences across India.",
    icon: GraduationCap,
    href: "https://seminar.vaidyagogate.org",
    registerHref: "/seminar",
    color: "from-teal to-[#0a6666]",
    bgLight: "bg-teal/5",
    borderColor: "border-teal/20",
    dotColor: "bg-teal",
    statsPath: "/api/integration/seminar?path=/seminars",
    statsKey: "seminars",
    totalKey: "total",
    status: "Connected" as const,
  },
  {
    name: "Fellowship Portal",
    description: "Apply for research fellowships in Ayurveda and evidence-based medicine.",
    icon: FlaskConical,
    href: "https://fellowship.vaidyagogate.org",
    registerHref: "/fellowship",
    color: "from-[#6b21a8] to-[#9333ea]",
    bgLight: "bg-purple-50",
    borderColor: "border-purple-200",
    dotColor: "bg-purple-500",
    statsPath: "/api/integration/fellowship?path=/fellowships",
    statsKey: "fellowships",
    totalKey: "total",
    status: "Active" as const,
  },
  {
    name: "Autism Programme",
    description: "Register children for the VGMF autism support and research programme.",
    icon: Heart,
    href: "https://autism.vaidyagogate.org",
    registerHref: "/autism",
    color: "from-rose-500 to-rose-600",
    bgLight: "bg-rose-50",
    borderColor: "border-rose-200",
    dotColor: "bg-rose-500",
    statsPath: "/api/integration/autism?path=/registrations",
    statsKey: "registrations",
    totalKey: "total",
    status: "Connected" as const,
  },
];

const SSO_FEATURES = [
  { icon: Shield, title: "Single Sign-On", desc: "One VGMF account gives you access to all three portals" },
  { icon: Zap, title: "Instant Access", desc: "No need to re-register — your data is shared securely" },
  { icon: Globe, title: "Unified Profile", desc: "Keep your information updated across all programmes in one place" },
];

export default function IntegrationPage() {
  const [portalData, setPortalData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      PORTALS.map(async (p) => {
        try {
          const res = await fetch(p.statsPath);
          const json = await res.json();
          return { key: p.statsKey, count: json.total ?? json[p.statsKey]?.length ?? 0 };
        } catch {
          return { key: p.statsKey, count: 0 };
        }
      })
    )
      .then((results) => {
        const map: Record<string, number> = {};
        results.forEach((r) => (map[r.key] = r.count));
        setPortalData(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalCount = Object.values(portalData).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0891b2] via-[#06b6d4] to-[#22d3ee]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(212,168,67,0.1),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-white/80">All Systems Operational</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            VGMF <span className="text-gold">Integrated</span> Platform
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-body">
            Three portals, one unified experience. Manage your seminars, fellowships, and autism programme registrations from a single dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-6 py-3 rounded-xl hover:bg-gold/90 transition-colors">
              Go to Dashboard <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 bg-white/15 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 hover:bg-white/25 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Registrations", value: loading ? "—" : totalCount.toString() },
            { label: "Active Portals", value: "3" },
            { label: "SSO Enabled", value: "Yes" },
            { label: "Uptime", value: "99.9%" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-navy">{s.value}</p>
              <p className="text-xs text-muted font-medium uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portal Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">Our Portals</h2>
          <p className="text-muted max-w-xl mx-auto">Click into any portal to explore or register for VGMF programmes.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PORTALS.map((portal) => {
            const count = portalData[portal.statsKey] ?? 0;
            return (
              <div key={portal.name} className={`group relative bg-white rounded-2xl border ${portal.borderColor} p-8 transition-all duration-300 hover:shadow-xl hover:shadow-navy/5 hover:-translate-y-1`}>
                {/* Status indicator */}
                <div className="absolute top-6 right-6 flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${portal.dotColor} animate-pulse`} />
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{portal.status}</span>
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center text-white shadow-lg mb-6`}>
                  <portal.icon size={24} />
                </div>

                <h3 className="font-heading text-xl font-extrabold text-navy mb-2">{portal.name}</h3>
                <p className="text-sm text-muted mb-6 leading-relaxed">{portal.description}</p>

                {/* Stats */}
                <div className={`${portal.bgLight} rounded-xl p-4 mb-6`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Total Records</span>
                    <span className="font-heading text-xl font-extrabold text-navy">{loading ? "—" : count}</span>
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-3">
                  <a href={portal.href} target="_blank" rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r ${portal.color} text-white font-bold text-sm py-3 px-5 rounded-xl hover:opacity-90 transition-opacity shadow-md`}>
                    Open Portal <ExternalLink size={14} />
                  </a>
                  <Link href={portal.registerHref}
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-navy bg-gray-50 hover:bg-gray-100 py-3 px-5 rounded-xl transition-colors">
                    Quick Register <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SSO Section */}
      <section className="bg-gradient-to-br from-cream to-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">Single Sign-On</h2>
            <p className="text-muted max-w-xl mx-auto">One account. All portals. Your VGMF journey is unified.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {SSO_FEATURES.map((feat) => (
              <div key={feat.title} className="bg-white rounded-2xl border border-gray-100 p-8 text-center card-hover">
                <div className="w-14 h-14 bg-[#0891b2]/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <feat.icon size={24} className="text-navy" />
                </div>
                <h3 className="font-heading text-lg font-extrabold text-navy mb-2">{feat.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-4">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Create Account", desc: "Sign up on any VGMF portal with your email.", icon: Users },
            { step: "2", title: "Verify Email", desc: "Confirm your email to activate SSO access.", icon: Shield },
            { step: "3", title: "Explore Portals", desc: "Browse seminars, fellowships, and autism programmes.", icon: BookOpen },
            { step: "4", title: "Register", desc: "Register or apply from any portal — instantly.", icon: Activity },
          ].map((s) => (
            <div key={s.step} className="relative text-center">
              {s.step !== "4" && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200" />}
              <div className="w-16 h-16 bg-gradient-to-br from-[#0891b2] to-[#06b6d4] rounded-2xl flex items-center justify-center text-white font-heading font-extrabold text-xl mx-auto mb-5 relative z-10 shadow-lg">
                {s.step}
              </div>
              <h3 className="font-heading text-base font-extrabold text-navy mb-2">{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
