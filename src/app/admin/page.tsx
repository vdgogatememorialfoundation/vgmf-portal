import Link from "next/link";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  Calendar,
  BookOpen,
  Megaphone,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  GraduationCap,
  Brain,
  UserPlus,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toFixed(0)}`;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  PROCESSING: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  SHIPPED: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export default async function AdminDashboard() {
  const [
    usersCount,
    ordersCount,
    productsCount,
    eventsCount,
    articlesCount,
    announcementsCount,
    seminarRegsCount,
    fellowshipAppsCount,
    autismRegsCount,
    revenueAgg,
    recentOrders,
    recentSeminarRegs,
    recentFellowshipApps,
    recentAutismRegs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count(),
    prisma.event.count(),
    prisma.article.count(),
    prisma.announcement.count(),
    prisma.seminarRegistration.count(),
    prisma.fellowshipApplication.count(),
    prisma.autismRegistration.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.seminarRegistration.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.fellowshipApplication.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.autismRegistration.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.totalAmount ?? 0;

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: usersCount.toLocaleString("en-IN"),
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: ordersCount.toLocaleString("en-IN"),
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: DollarSign,
      label: "Revenue",
      value: formatCurrency(totalRevenue),
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: Package,
      label: "Products",
      value: productsCount.toLocaleString("en-IN"),
      color: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      icon: Calendar,
      label: "Events",
      value: eventsCount.toLocaleString("en-IN"),
      color: "from-rose-500 to-rose-600",
      bg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      icon: BookOpen,
      label: "Articles",
      value: articlesCount.toLocaleString("en-IN"),
      color: "from-teal-500 to-teal-600",
      bg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
  ];

  const registrationStats = [
    { label: "Seminar", count: seminarRegsCount, icon: GraduationCap, color: "bg-gold" },
    { label: "Fellowship", count: fellowshipAppsCount, icon: BookOpen, color: "bg-teal" },
    { label: "Autism", count: autismRegsCount, icon: Brain, color: "bg-maroon" },
  ];

  const maxReg = Math.max(seminarRegsCount, fellowshipAppsCount, autismRegsCount, 1);

  const quickActions = [
    { label: "Add Product", href: "/admin/products", icon: Package, color: "bg-amber-50 text-amber-700 hover:bg-amber-100 ring-1 ring-amber-200" },
    { label: "Create Event", href: "/admin/events", icon: Calendar, color: "bg-rose-50 text-rose-700 hover:bg-rose-100 ring-1 ring-rose-200" },
    { label: "New Announcement", href: "/admin/announcements", icon: Megaphone, color: "bg-blue-50 text-blue-700 hover:bg-blue-100 ring-1 ring-blue-200" },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl xl:text-4xl font-extrabold text-navy">
            Dashboard
          </h1>
          <p className="text-muted mt-1 text-sm">
            Welcome back. Here&apos;s an overview of your platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-navy bg-white border border-cream-dark hover:bg-cream/50 hover:border-navy/10 transition-all duration-200 shadow-sm"
          >
            <ShoppingBag size={16} />
            View Orders
          </Link>
          <Link
            href="/admin/announcements"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-navy to-navy-light hover:shadow-lg hover:shadow-navy/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={16} />
            New Post
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-cream-dark p-4 lg:p-5 hover:shadow-lg hover:shadow-navy/[0.04] hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.iconColor} />
            </div>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="font-heading text-2xl font-extrabold text-navy mt-0.5">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-cream-dark p-5 lg:p-6">
        <h3 className="font-heading text-base font-bold text-navy mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${action.color}`}
            >
              <action.icon size={16} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Registrations Overview + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Registration Breakdown */}
        <div className="bg-white rounded-2xl border border-cream-dark p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-base font-bold text-navy">Registrations</h3>
            <span className="text-xs text-muted font-medium">
              {(seminarRegsCount + fellowshipAppsCount + autismRegsCount).toLocaleString("en-IN")} total
            </span>
          </div>
          <div className="space-y-4">
            {registrationStats.map((reg) => (
              <div key={reg.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg ${reg.color}/10 flex items-center justify-center`}>
                      <reg.icon size={14} className={`${reg.color === "bg-gold" ? "text-gold" : reg.color === "bg-teal" ? "text-teal" : "text-maroon"}`} />
                    </div>
                    <span className="text-sm font-medium text-ink-soft">{reg.label}</span>
                  </div>
                  <span className="text-sm font-bold text-navy">{reg.count.toLocaleString("en-IN")}</span>
                </div>
                <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      reg.color
                    }`}
                    style={{ width: `${(reg.count / maxReg) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Sub-stats */}
          <div className="mt-6 pt-4 border-t border-cream-dark grid grid-cols-2 gap-3">
            <div className="bg-cream/50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Announcements</p>
              <p className="font-heading text-lg font-extrabold text-navy">{announcementsCount}</p>
            </div>
            <div className="bg-cream/50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Total Registrations</p>
              <p className="font-heading text-lg font-extrabold text-navy">
                {(seminarRegsCount + fellowshipAppsCount + autismRegsCount).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-cream-dark p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-base font-bold text-navy">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-gold hover:text-gold-light transition-colors flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag size={32} className="mx-auto text-cream-dark mb-2" />
              <p className="text-sm text-muted">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2.5 border-b border-cream-dark last:border-0 last:pb-0 first:pt-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy font-mono text-xs truncate">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {order.user?.name || "Guest"} &middot; ₹{order.totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span
                    className={`ml-3 flex-shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wide ${
                      statusColors[order.status] || "bg-gray-50 text-gray-700 ring-1 ring-gray-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-2xl border border-cream-dark p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-base font-bold text-navy">Recent Registrations</h3>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-gold hover:text-gold-light transition-colors flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {recentSeminarRegs.length === 0 &&
          recentFellowshipApps.length === 0 &&
          recentAutismRegs.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus size={32} className="mx-auto text-cream-dark mb-2" />
              <p className="text-sm text-muted">No registrations yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...recentSeminarRegs.map((r) => ({
                id: r.id,
                name: r.user?.name || "User",
                type: "Seminar",
                date: r.createdAt,
                icon: GraduationCap,
                accent: "text-gold bg-gold/10",
              })),
              ...recentFellowshipApps.map((r) => ({
                id: r.id,
                name: r.user?.name || "User",
                type: "Fellowship",
                date: r.createdAt,
                icon: BookOpen,
                accent: "text-teal bg-teal/10",
              })),
              ...recentAutismRegs.map((r) => ({
                id: r.id,
                name: r.childName || r.parentName || "Registrant",
                type: "Autism",
                date: r.createdAt,
                icon: Brain,
                accent: "text-maroon bg-maroon/10",
              }))]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center gap-3 py-2 border-b border-cream-dark last:border-0 last:pb-0 first:pt-0"
                  >
                    <div className={`w-8 h-8 rounded-lg ${reg.accent} flex items-center justify-center flex-shrink-0`}>
                      <reg.icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-navy truncate">{reg.name}</p>
                      <p className="text-xs text-muted">
                        {reg.type} &middot;{" "}
                        {new Date(reg.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* System Overview Bar */}
      <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-5 lg:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-base font-bold">Platform Overview</h3>
            <p className="text-white/50 text-sm mt-0.5">
              {usersCount.toLocaleString("en-IN")} users &middot;{" "}
              {productsCount.toLocaleString("en-IN")} products &middot;{" "}
              {eventsCount.toLocaleString("en-IN")} events &middot;{" "}
              {articlesCount.toLocaleString("en-IN")} articles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-gold" />
            <span className="text-sm font-semibold text-gold">
              {formatCurrency(totalRevenue)} revenue
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
