"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  X,
  RefreshCw,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  createdAt: string;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  user?: { id: string; name: string; email: string };
  items?: { id: string; productName: string; quantity: number; price: number }[];
  _count?: { items: number };
}

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border border-blue-200",
  PROCESSING: "bg-violet-50 text-violet-700 border border-violet-200",
  SHIPPED: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border border-red-200",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock size={14} />,
  CONFIRMED: <CheckCircle2 size={14} />,
  PROCESSING: <Package size={14} />,
  SHIPPED: <Truck size={14} />,
  DELIVERED: <CheckCircle2 size={14} />,
  CANCELLED: <XCircle size={14} />,
};

export default function StaffOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDetail, setShowDetail] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOrders(data.items || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(`Status updated to ${newStatus.toLowerCase()}`);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      if (showDetail?.id === id) setShowDetail(prev => prev ? { ...prev, status: newStatus } : null);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">Orders</h1>
          <p className="text-muted mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-cream-dark rounded-xl text-sm font-semibold text-navy hover:bg-cream/50 transition-colors">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchOrders(); }}
            placeholder="Search by order # or customer..."
            className="input-field pl-10 w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input-field w-auto min-w-[160px]"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/60 border-b border-cream-dark">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Order #</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-cream rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-muted">No orders found</td></tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-navy">{o.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink">{o.shippingName || o.user?.name || "—"}</div>
                      <div className="text-xs text-muted">{o.user?.email || ""}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-ink">₹{o.totalAmount.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-muted text-xs">
                      {new Date(o.orderDate || o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={o.status}
                        onChange={e => handleStatusUpdate(o.id, e.target.value)}
                        disabled={updatingId === o.id}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border-0 outline-none cursor-pointer transition-all ${STATUS_STYLES[o.status] || "bg-slate-100 text-slate-600"} ${updatingId === o.id ? "opacity-50" : ""}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setShowDetail(o)}
                        className="p-2 hover:bg-teal/10 rounded-lg text-muted hover:text-teal transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-cream-dark" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-cream-dark">
              <div>
                <h2 className="font-heading text-xl font-bold text-navy">Order Details</h2>
                <p className="text-xs text-muted mt-0.5 font-mono">{showDetail.orderNumber}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-2 hover:bg-cream rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-cream/50 rounded-xl p-3">
                  <p className="text-xs text-muted">Customer</p>
                  <p className="font-semibold text-ink text-sm mt-0.5">{showDetail.shippingName || showDetail.user?.name || "—"}</p>
                </div>
                <div className="bg-cream/50 rounded-xl p-3">
                  <p className="text-xs text-muted">Email</p>
                  <p className="font-semibold text-ink text-sm mt-0.5">{showDetail.user?.email || "—"}</p>
                </div>
                <div className="bg-cream/50 rounded-xl p-3">
                  <p className="text-xs text-muted">Total Amount</p>
                  <p className="font-bold text-ink text-lg mt-0.5">₹{showDetail.totalAmount.toLocaleString("en-IN")}</p>
                </div>
                <div className="bg-cream/50 rounded-xl p-3">
                  <p className="text-xs text-muted">Order Date</p>
                  <p className="font-semibold text-ink text-sm mt-0.5">
                    {new Date(showDetail.orderDate || showDetail.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                  </p>
                </div>
                <div className="bg-cream/50 rounded-xl p-3">
                  <p className="text-xs text-muted">Items</p>
                  <p className="font-semibold text-ink text-sm mt-0.5">{showDetail._count?.items ?? "—"} items</p>
                </div>
                <div className="bg-cream/50 rounded-xl p-3">
                  <p className="text-xs text-muted">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {STATUS_ICONS[showDetail.status]}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${STATUS_STYLES[showDetail.status] || "bg-slate-100 text-slate-600"}`}>
                      {showDetail.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
              {showDetail.items && showDetail.items.length > 0 && (
                <div className="bg-cream/50 rounded-xl p-4">
                  <p className="text-xs text-muted mb-2">Order Items</p>
                  <div className="space-y-2">
                    {showDetail.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-ink">{item.productName} × {item.quantity}</span>
                        <span className="font-semibold text-navy">₹{item.price.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-cream-dark">
              <button onClick={() => setShowDetail(null)} className="btn-primary w-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
