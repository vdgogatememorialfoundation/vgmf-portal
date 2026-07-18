"use client";
import { useState, useEffect } from "react";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  GraduationCap,
  BookOpen,
  Brain,
  FileText,
  Award,
  Clock,
  BarChart3,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    newUsersThisWeek: number;
    totalRegistrations: number;
    totalOrders: number;
    totalProducts: number;
    totalEvents: number;
    totalArticles: number;
    totalAnnouncements: number;
    totalCertificates: number;
    seminarRegsCount: number;
    fellowshipAppsCount: number;
    autismRegsCount: number;
    eventRegistrationsCount: number;
    formSubmissionsCount: number;
    pendingFellowships: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    pending: number;
  };
  ordersByStatus: Array<{ status: string; count: number }>;
  revenueByStatus: Array<{ status: string; total: number; count: number }>;
  eventPopularity: Array<{
    id: string;
    title: string;
    eventType: string;
    registrations: number;
    formSubmissions: number;
    total: number;
  }>;
  registrationTrend: Array<{ date: string; count: number }>;
  recentActivity: Array<{
    type: string;
    label: string;
    detail: string;
    status: string;
    date: string;
  }>;
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toFixed(0)}`;
}

const ACTIVITY_ICONS: Record<string, any> = {
  order: ShoppingBag,
  seminar: GraduationCap,
  fellowship: BookOpen,
  autism: Brain,
  event_reg: Calendar,
  form_sub: FileText,
};

const ACTIVITY_COLORS: Record<string, string> = {
  order: "text-blue-600 bg-blue-50",
  seminar: "text-gold bg-gold/10",
  fellowship: "text-teal bg-teal/10",
  autism: "text-maroon bg-maroon/10",
  event_reg: "text-violet-600 bg-violet-50",
  form_sub: "text-cyan-600 bg-cyan-50",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  PROCESSING: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  SHIPPED: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 ring-1 ring-red-200",
  SUBMITTED: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  REJECTED: "bg-red-50 text-red-700 ring-1 ring-red-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  REGISTERED: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
};

const REG_TYPE_COLORS: Record<string, string> = {
  Seminar: "from-gold/80 to-gold",
  Fellowship: "from-teal to-teal-light",
  Autism: "from-maroon to-red-700",
  Competition: "from-violet-500 to-purple-600",
  Workshop: "from-blue-500 to-blue-600",
  "Guest Lecture": "from-cyan-500 to-cyan-600",
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) throw new Error("Failed");
      const result = await res.json();
      setData(result);
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-navy">Analytics</h1>
            <p className="text-muted mt-1 text-sm">Platform performance overview</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse mb-3" />
              <div className="h-3 bg-slate-100 rounded animate-pulse mb-2 w-20" />
              <div className="h-7 bg-slate-100 rounded animate-pulse w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { overview, revenue, eventPopularity, registrationTrend, recentActivity, ordersByStatus } = data;
  const maxTrend = Math.max(...registrationTrend.map((t) => t.count), 1);
  const maxEvent = Math.max(...eventPopularity.map((e) => e.total), 1);

  const mainStats = [
    {
      icon: Users,
      label: "Total Users",
      value: overview.totalUsers.toLocaleString("en-IN"),
      sub: `+${overview.newUsersThisMonth} this month`,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Calendar,
      label: "Total Registrations",
      value: overview.totalRegistrations.toLocaleString("en-IN"),
      sub: `${overview.pendingFellowships} pending review`,
      color: "bg-violet-50 text-violet-600",
    },
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: overview.totalOrders.toLocaleString("en-IN"),
      sub: `${overview.totalProducts} products`,
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: formatCurrency(revenue.total),
      sub: `+${formatCurrency(revenue.thisMonth)} this month`,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  const regStats = [
    { label: "Seminar", count: overview.seminarRegsCount, color: "bg-gold", text: "text-gold", icon: GraduationCap },
    { label: "Fellowship", count: overview.fellowshipAppsCount, color: "bg-teal", text: "text-teal", icon: BookOpen },
    { label: "Autism", count: overview.autismRegsCount, color: "bg-maroon", text: "text-maroon", icon: Brain },
    { label: "Event Regs", count: overview.eventRegistrationsCount, color: "bg-violet-500", text: "text-violet-600", icon: FileText },
    { label: "Form Subs", count: overview.formSubmissionsCount, color: "bg-cyan-500", text: "text-cyan-600", icon: FileText },
  ];

  const maxRegStat = Math.max(...regStats.map((r) => r.count), 1);

  const orderStatusData = ordersByStatus.map((o) => ({
    ...o,
    color: STATUS_COLORS[o.status]?.includes("amber") ? "bg-amber-400"
      : STATUS_COLORS[o.status]?.includes("blue") ? "bg-blue-400"
      : STATUS_COLORS[o.status]?.includes("emerald") ? "bg-emerald-400"
      : STATUS_COLORS[o.status]?.includes("red") ? "bg-red-400"
      : STATUS_COLORS[o.status]?.includes("purple") ? "bg-purple-400"
      : STATUS_COLORS[o.status]?.includes("indigo") ? "bg-indigo-400"
      : "bg-slate-400",
  }));

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">Analytics</h1>
          <p className="text-muted mt-1 text-sm">Platform performance and insights</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-navy bg-white border border-slate-200 hover:bg-slate-50 hover:border-teal/30 transition-all duration-200 shadow-sm"
        >
          <TrendingUp size={16} />
          Refresh
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {mainStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-slate-200 p-4 lg:p-5 hover:shadow-lg hover:shadow-teal/[0.06] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">{stat.label}</p>
            <p className="font-heading text-2xl font-extrabold text-navy mt-0.5">{stat.value}</p>
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
              <ArrowUpRight size={12} className="text-emerald-500" />
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Registration Breakdown + Revenue */}
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Registration Types */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-base font-bold text-navy">Registrations by Type</h3>
            <span className="text-xs text-muted font-medium">{overview.totalRegistrations.toLocaleString("en-IN")} total</span>
          </div>
          <div className="space-y-4">
            {regStats.map((reg) => (
              <div key={reg.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg ${reg.color}/10 flex items-center justify-center`}>
                      <reg.icon size={14} className={reg.text} />
                    </div>
                    <span className="text-sm font-medium text-ink-soft">{reg.label}</span>
                  </div>
                  <span className="text-sm font-bold text-navy">{reg.count.toLocaleString("en-IN")}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${reg.color}`}
                    style={{ width: `${(reg.count / maxRegStat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick counts */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3">
            <MiniStat label="Events" value={overview.totalEvents} />
            <MiniStat label="Articles" value={overview.totalArticles} />
            <MiniStat label="Certificates" value={overview.totalCertificates} />
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-base font-bold text-navy">Revenue Overview</h3>
          </div>
          <div className="space-y-4">
            <RevenueCard label="Total Revenue" value={revenue.total} icon={DollarSign} color="text-emerald-600 bg-emerald-50" />
            <RevenueCard label="This Month" value={revenue.thisMonth} icon={TrendingUp} color="text-blue-600 bg-blue-50" />
            <RevenueCard label="Pending" value={revenue.pending} icon={Clock} color="text-amber-600 bg-amber-50" />
          </div>

          {/* Orders by Status */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Orders by Status</h4>
            {orderStatusData.length === 0 ? (
              <p className="text-xs text-muted text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-2">
                {orderStatusData.map((o) => (
                  <div key={o.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${o.color}`} />
                      <span className="text-xs font-medium text-ink-soft">{o.status}</span>
                    </div>
                    <span className="text-xs font-bold text-navy">{o.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Trend + Event Popularity */}
      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-base font-bold text-navy">7-Day Trend</h3>
          </div>
          <div className="space-y-3">
            {registrationTrend.map((t) => (
              <div key={t.date} className="flex items-center gap-3">
                <span className="text-[10px] text-muted w-16 shrink-0">
                  {new Date(t.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric" })}
                </span>
                <div className="flex-1 h-6 bg-slate-50 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-teal to-cyan-500 rounded-lg transition-all duration-700 ease-out"
                    style={{ width: `${(t.count / maxTrend) * 100}%`, minWidth: t.count > 0 ? "8px" : "0" }}
                  />
                </div>
                <span className="text-xs font-bold text-navy w-6 text-right">{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event Popularity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-base font-bold text-navy">Event Popularity</h3>
            <span className="text-xs text-muted font-medium">{eventPopularity.length} events</span>
          </div>
          {eventPopularity.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={32} className="mx-auto text-slate-200 mb-2" />
              <p className="text-sm text-muted">No events yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {eventPopularity.map((e, idx) => (
                <div key={e.id} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0 last:pb-0 first:pt-0">
                  <span className="text-xs font-bold text-muted w-5 shrink-0">#{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{e.title}</p>
                    <p className="text-[11px] text-muted">{e.eventType} · {e.registrations} regs · {e.formSubmissions} forms</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${REG_TYPE_COLORS[e.eventType] || "from-slate-400 to-slate-500"}`}
                        style={{ width: `${(e.total / maxEvent) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-navy w-6 text-right">{e.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-base font-bold text-navy">Recent Activity</h3>
          <Zap size={16} className="text-amber-500" />
        </div>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={32} className="mx-auto text-slate-200 mb-2" />
            <p className="text-sm text-muted">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((a, idx) => {
              const Icon = ACTIVITY_ICONS[a.type] || FileText;
              const colorClass = ACTIVITY_COLORS[a.type] || "text-slate-600 bg-slate-50";
              return (
                <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0 last:pb-0 first:pt-0">
                  <div className={`w-9 h-9 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy">{a.label}</p>
                    <p className="text-xs text-muted truncate">{a.detail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_COLORS[a.status] || "bg-slate-100 text-slate-600"}`}>
                      {a.status}
                    </span>
                    <p className="text-[10px] text-muted mt-1">
                      {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Platform Overview */}
      <div className="bg-gradient-to-r from-teal to-cyan-500 rounded-2xl p-5 lg:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-base font-bold">Platform Health</h3>
            <p className="text-white/70 text-sm mt-0.5">
              {overview.activeUsers} active users · {overview.totalEvents} events · {overview.totalArticles} articles · {overview.totalCertificates} certificates
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} />
            <span className="text-sm font-semibold">{formatCurrency(revenue.total)} total revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">{label}</p>
      <p className="font-heading text-lg font-extrabold text-navy">{value.toLocaleString("en-IN")}</p>
    </div>
  );
}

function RevenueCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-ink-soft">{label}</span>
      </div>
      <span className="font-heading text-lg font-extrabold text-navy">{formatCurrency(value)}</span>
    </div>
  );
}
