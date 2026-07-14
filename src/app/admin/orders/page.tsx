"use client";
import { useState, useEffect } from "react";
import { Search, X, Save } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  user?: { name: string; email: string };
}

const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

const statusColors: Record<string, string> = {
  Processing: "bg-blue-50 text-blue-700",
  Shipped: "bg-purple-50 text-purple-700",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDetail, setShowDetail] = useState<Order | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">Orders</h1>
          <p className="text-muted mt-1">{orders.length} orders</p>
        </div>
        <button onClick={() => { setSearch(""); fetchOrders(); }}
          className="px-4 py-2.5 bg-white border rounded-xl text-sm font-semibold text-navy hover:bg-gray-50">
          Refresh
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchOrders(); }}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Order #</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Customer</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Total</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Date</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-muted">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-muted">No orders found</td></tr>
            ) : (
              orders.map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-6 py-4">{o.user?.name || "—"}</td>
                  <td className="px-6 py-4 font-semibold">₹{o.totalAmount}</td>
                  <td className="px-6 py-4 text-muted">{new Date(o.orderDate).toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <select
                      value={o.status}
                      onChange={e => handleStatusUpdate(o.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 outline-none cursor-pointer ${statusColors[o.status] || "bg-gray-100"}`}
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setShowDetail(o)}
                      className="px-3 py-1.5 bg-navy/5 text-navy rounded-lg text-xs font-semibold hover:bg-navy/10">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDetail && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-xl font-bold text-navy">Order: {showDetail.orderNumber}</h2>
              <button onClick={() => setShowDetail(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted">Customer</span><span className="font-semibold text-navy">{showDetail.user?.name || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted">Email</span><span className="font-semibold text-navy">{showDetail.user?.email || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted">Total Amount</span><span className="font-semibold text-navy">₹{showDetail.totalAmount}</span></div>
              <div className="flex justify-between"><span className="text-muted">Order Date</span><span className="font-semibold text-navy">{new Date(showDetail.orderDate).toLocaleDateString("en-IN", { dateStyle: "long" })}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Status</span>
                <select
                  value={showDetail.status}
                  onChange={e => handleStatusUpdate(showDetail.id, e.target.value)}
                  className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 outline-none cursor-pointer ${statusColors[showDetail.status] || "bg-gray-100"}`}
                >
                  {statusOptions.map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
            </div>
            <button onClick={() => setShowDetail(null)}
              className="w-full mt-6 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
