"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  Package,
  Users,
  Activity,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingName?: string;
  user?: { name: string; email: string };
  _count?: { items: number };
}

interface DashboardData {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  recentOrders: Order[];
  autismCount: number;
  fellowshipCount: number;
  seminarCount: number;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  PROCESSING: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  SHIPPED: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export default function StaffDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, autismRes, fellowshipRes, seminarRes] = await Promise.allSettled([
        fetch("/api/admin/orders"),
        fetch("/api/admin/autism"),
        fetch("/api/admin/fellowships"),
        fetch("/api/admin/seminars"),
      ]);

      const ordersData = ordersRes.status === "fulfilled" && ordersRes.value.ok
        ? await ordersRes.value.json()
        : { items: [] };
      const autismData = autismRes.status === "fulfilled" && autismRes.value.ok
        ? await autismRes.value.json()
        : { items: [] };
      const fellowshipData = fellowshipRes.status === "fulfilled" && fellowshipRes.value.ok
        ? await fellowshipRes.value.json()
        : { items: [], applications: [] };
      const seminarData = seminarRes.status === "fulfilled" && seminarRes.value.ok
        ? await seminarRes.value.json()
        : { items: [] };

      const orders: Order[] = ordersData.items || [];
      const autismItems = autismData.items || [];
      const fellowshipItems = fellowshipData.items || fellowshipData.applications || [];
      const seminarItems = seminarData.items || [];

      const pendingOrders = orders.filter(o => o.status === "PENDING").length;
      const processingOrders = orders.filter(o =>
        o.status === "PROCESSING" || o.status === "CONFIRMED"
      ).length;

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayOrders = orders.filter(o => new Date(o.createdAt) >= todayStart).length;

      setData({
        totalOrders: orders.length,
        pendingOrders,
        processingOrders,
        recentOrders: orders.slice(0, 8),
        autismCount: autismItems.length,
        fellowshipCount: fellowshipItems.length,
        seminarCount: seminarItems.length,
      });
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalRegistrations = data
    ? data.autismCount + data.fellowshipCount + data.seminarCount
    : 0;
  const maxReg = data
    ? Math.max(data.autismCount, data.fellowshipCount, data.seminarCount, 1)
    : 1;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl xl:text-4xl font-extrabold text-navy">
            Dashboard
          </h1>
          <p className="text-muted mt-1 text-sm">
            Welcome back. Here&apos;s today&apos;s overview.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-navy bg-white border border-cream-dark hover:bg-cream/50 hover:border-navy/10 transition-all duration-200 shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-cream-dark p-5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse mb-3" />
              <div className="h-3 bg-slate-100 rounded animate-pulse w-20 mb-2" />
              <div className="h-7 bg-slate-100 rounded animate-pulse w-16" />
            </div>
          ))
        ) : data ? (
          [
            {
              icon: Clock,
              label: "Pending Orders",
              value: data.pendingOrders,
              color: "bg-amber-50",
              iconColor: "text-amber-600",
            },
            {
              icon: Package,
              label: "Processing",
              value: data.processingOrders,
              color: "bg-violet-50",
              iconColor: "text-violet-600",
            },
            {
              icon: Users,
              label: "Registrations",
              value: totalRegistrations,
              color: "bg-teal/10",
              iconColor: "text-teal",
            },
            {
              icon: Activity,
              label: "Today's Orders",
              value: data.totalOrders,
              color: "bg-blue-50",
              iconColor: "text-blue-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-cream-dark p-4 lg:p-5 hover:shadow-lg hover:shadow-navy/[0.04] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon size={20} className={stat.iconColor} />
              </div>
              <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="font-heading text-2xl font-extrabold text-navy mt-0.5">
                {stat.value.toLocaleString("en-IN")}
              </p>
            </div>
          ))
        ) : null}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white rounded-2xl border border-cream-dark p-5 lg:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-base font-bold text-navy">Recent Orders</h3>
            <Link
              href="/staff/orders"
              className="text-xs font-semibold text-teal hover:text-teal-light transition-colors flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-cream-dark last:border-0">
                  <div className="flex-1">
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-32 mb-2" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-24" />
                  </div>
                  <div className="h-6 bg-slate-100 rounded-lg animate-pulse w-20" />
                </div>
              ))}
            </div>
          ) : data && data.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2.5 border-b border-cream-dark last:border-0 last:pb-0 first:pt-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy font-mono text-xs truncate">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {order.shippingName || order.user?.name || "Guest"} &middot; ₹{order.totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span
                    className={`ml-3 flex-shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wide ${
                      STATUS_STYLES[order.status] || "bg-gray-50 text-gray-700 ring-1 ring-gray-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag size={32} className="mx-auto text-cream-dark mb-2" />
              <p className="text-sm text-muted">No orders yet</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-cream-dark p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-base font-bold text-navy">Registrations</h3>
            <Link
              href="/staff/registrations"
              className="text-xs font-semibold text-teal hover:text-teal-light transition-colors flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-24 mb-2" />
                  <div className="w-full h-2 bg-slate-100 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          ) : data ? (
            <div className="space-y-4">
              {[
                { label: "Seminar", count: data.seminarCount, color: "bg-gold" },
                { label: "Fellowship", count: data.fellowshipCount, color: "bg-teal" },
                { label: "Autism", count: data.autismCount, color: "bg-maroon" },
              ].map((reg) => (
                <div key={reg.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-ink-soft">{reg.label}</span>
                    <span className="text-sm font-bold text-navy">
                      {reg.count.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${reg.color}`}
                      style={{ width: `${(reg.count / maxReg) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-cream-dark mt-4">
                <div className="bg-cream/50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                    Total Registrations
                  </p>
                  <p className="font-heading text-lg font-extrabold text-navy">
                    {totalRegistrations.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/staff/orders"
          className="group bg-white rounded-2xl border border-cream-dark p-5 hover:shadow-lg hover:shadow-navy/[0.04] hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
              <ShoppingBag size={22} className="text-teal" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-heading text-sm font-bold text-navy">Manage Orders</h4>
              <p className="text-xs text-muted mt-0.5">View and update order statuses</p>
            </div>
            <ArrowRight size={16} className="text-muted group-hover:text-teal group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </Link>

        <Link
          href="/staff/registrations"
          className="group bg-white rounded-2xl border border-cream-dark p-5 hover:shadow-lg hover:shadow-navy/[0.04] hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
              <Users size={22} className="text-teal" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-heading text-sm font-bold text-navy">View Registrations</h4>
              <p className="text-xs text-muted mt-0.5">Seminar, fellowship, and autism registrations</p>
            </div>
            <ArrowRight size={16} className="text-muted group-hover:text-teal group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </Link>
      </div>
    </div>
  );
}
