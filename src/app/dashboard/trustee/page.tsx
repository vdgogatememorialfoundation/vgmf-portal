"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Users, GraduationCap, FlaskConical, Heart, TrendingUp, Clock, CheckCircle, ArrowRight, Loader2, Activity, DollarSign } from "lucide-react";

type ActivityItem = {
  id: string;
  type: "fellowship" | "seminar" | "autism";
  title: string;
  date: string;
  status: string;
};

type Metrics = {
  totalFellowships: number;
  activeFellowships: number;
  totalSeminars: number;
  verifiedSeminars: number;
  totalAutism: number;
  recentActivity: ActivityItem[];
};

export default function TrusteeDashboard() {
  const { data: session, status: authStatus } = useSession();
  const [metrics, setMetrics] = useState<Metrics>({
    totalFellowships: 0,
    activeFellowships: 0,
    totalSeminars: 0,
    verifiedSeminars: 0,
    totalAutism: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchMetrics();
    }
  }, [authStatus]);

  async function fetchMetrics() {
    setLoading(true);
    try {
      const [fellowshipsRes, seminarsRes, autismRes] = await Promise.all([
        fetch("/api/admin/fellowships"),
        fetch("/api/admin/seminars"),
        fetch("/api/admin/autism"),
      ]);
      const [fellowships, seminars, autism] = await Promise.all([
        fellowshipsRes.json(),
        seminarsRes.json(),
        autismRes.json(),
      ]);

      const apps = fellowships.items || [];
      const regs = seminars.items || [];
      const aut = autism.items || [];

      const activity: ActivityItem[] = [
        ...apps.slice(0, 5).map((f: any) => ({
          id: f.id,
          type: "fellowship" as const,
          title: `Fellowship ${f.trackingNumber} — ${f.areaOfInterest || "General"}`,
          date: f.createdAt,
          status: f.status,
        })),
        ...regs.slice(0, 5).map((s: any) => ({
          id: s.id,
          type: "seminar" as const,
          title: `Seminar registration ${s.ticketNumber}`,
          date: s.createdAt,
          status: s.isVerified ? "VERIFIED" : "PENDING",
        })),
        ...aut.slice(0, 5).map((a: any) => ({
          id: a.id,
          type: "autism" as const,
          title: `Autism — ${a.childName}`,
          date: a.createdAt,
          status: a.isFullyRegistered ? "REGISTERED" : "PRE-REGISTERED",
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

      setMetrics({
        totalFellowships: apps.length,
        activeFellowships: apps.filter((f: any) => !["REJECTED", "FUNDED"].includes(f.status)).length,
        totalSeminars: regs.length,
        verifiedSeminars: regs.filter((s: any) => s.isVerified).length,
        totalAutism: aut.length,
        recentActivity: activity,
      });
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }

  if (authStatus === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="text-[#0891b2] animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4">Please sign in to access the trustee dashboard.</p>
          <Link href="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  const iconForType = (type: string) => {
    switch (type) {
      case "fellowship": return FlaskConical;
      case "seminar": return GraduationCap;
      case "autism": return Heart;
      default: return Activity;
    }
  };

  const colorForType = (type: string) => {
    switch (type) {
      case "fellowship": return "bg-purple-50 text-purple-700";
      case "seminar": return "bg-teal/10 text-teal";
      case "autism": return "bg-rose-50 text-rose-600";
      default: return "bg-[#0891b2]/5 text-[#0891b2]";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-2">Trustee Dashboard</h1>
        <p className="text-muted">Welcome, {(session.user as any)?.name || "Trustee"}. Overview of all VGMF foundation activities.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: FlaskConical, label: "Total Fellowships", value: metrics.totalFellowships, color: "from-purple-500 to-violet-600" },
          { icon: GraduationCap, label: "Seminar Registrations", value: metrics.totalSeminars, color: "from-teal to-[#0a6666]" },
          { icon: Heart, label: "Autism Registrations", value: metrics.totalAutism, color: "from-rose-500 to-rose-600" },
          { icon: TrendingUp, label: "Active Applications", value: metrics.activeFellowships, color: "from-gold to-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-6 card-hover">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="font-heading text-2xl font-extrabold text-navy">{loading ? "—" : s.value}</p>
                <p className="text-xs text-muted font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overview Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        {/* Fellowship Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h3 className="font-heading text-lg font-extrabold text-navy mb-6 flex items-center gap-2">
            <FlaskConical size={18} className="text-purple-500" />
            Fellowship Overview
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-muted">Total Applications</span>
                <span className="font-heading font-extrabold text-navy">{metrics.totalFellowships}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-muted">Currently Active</span>
                <span className="font-heading font-extrabold text-teal">{metrics.activeFellowships}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-muted">Completed / Rejected</span>
                <span className="font-heading font-extrabold text-navy">{metrics.totalFellowships - metrics.activeFellowships}</span>
              </div>
              <Link href="/dashboard/admin?tab=fellowships" className="inline-flex items-center gap-1 text-sm font-bold text-navy hover:text-gold transition-colors mt-2">
                View Details <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Seminar & Autism Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h3 className="font-heading text-lg font-extrabold text-navy mb-6 flex items-center gap-2">
            <Building2 size={18} className="text-gold" />
            Programme Summary
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <GraduationCap size={14} className="text-teal" />
                  <span className="text-sm text-muted">Seminar Registrations</span>
                </div>
                <span className="font-heading font-extrabold text-navy">{metrics.totalSeminars}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span className="text-sm text-muted">Verified Seminar attendees</span>
                </div>
                <span className="font-heading font-extrabold text-emerald-600">{metrics.verifiedSeminars}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-rose-500" />
                  <span className="text-sm text-muted">Autism Registrations</span>
                </div>
                <span className="font-heading font-extrabold text-navy">{metrics.totalAutism}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-2">
          <Clock size={18} className="text-navy" />
          <h2 className="font-heading text-lg font-extrabold text-navy">Recent Activity</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={28} className="text-gold animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted">Loading activity...</p>
          </div>
        ) : metrics.recentActivity.length === 0 ? (
          <div className="p-12 text-center">
            <Activity size={40} className="text-muted/30 mx-auto mb-3" />
            <p className="text-sm text-muted font-medium">No recent activity</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {metrics.recentActivity.map((item) => {
              const Icon = iconForType(item.type);
              const colorCls = colorForType(item.type);
              return (
                <div key={item.id} className="flex items-center gap-4 px-8 py-4 hover:bg-cream-dark/30 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy truncate">{item.title}</p>
                    <p className="text-xs text-muted">{new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                    item.status === "VERIFIED" || item.status === "REGISTERED" || item.status === "FUNDED" || item.status === "SELECTED"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : item.status === "REJECTED"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}>
                    {item.status.replace("_", " ")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
