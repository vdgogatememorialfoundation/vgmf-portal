import { Search, Eye, Download } from "lucide-react";

const orders = [
  { id: "VGMF-20260714-A1B2", customer: "Rahul Sharma", items: 3, total: 1250, status: "Processing", date: "14 Jul 2026", payment: "Paid" },
  { id: "VGMF-20260713-E5F6", customer: "Priya Patel", items: 1, total: 450, status: "Shipped", date: "13 Jul 2026", payment: "Paid" },
  { id: "VGMF-20260712-I9J0", customer: "Amit Deshmukh", items: 2, total: 850, status: "Delivered", date: "12 Jul 2026", payment: "Paid" },
  { id: "VGMF-20260711-K1L2", customer: "Sneha Joshi", items: 4, total: 1700, status: "Processing", date: "11 Jul 2026", payment: "Pending" },
  { id: "VGMF-20260710-M3N4", customer: "Vikram Singh", items: 1, total: 400, status: "Cancelled", date: "10 Jul 2026", payment: "Refunded" },
];

const statusColors: Record<string, string> = {
  Processing: "bg-blue-50 text-blue-700",
  Shipped: "bg-purple-50 text-purple-700",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function StaffOrders() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="font-heading text-3xl font-extrabold text-navy">Orders</h1><p className="text-muted mt-1">View and manage customer orders</p></div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-sm font-semibold text-navy hover:bg-gray-50"><Download size={18} /> Export</button>
      </div>

      <div className="bg-white rounded-2xl border p-4 mb-6">
        <div className="relative max-w-sm"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2.5 bg-cream rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-navy/20" /></div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Order ID</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Customer</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Items</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Total</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Date</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Payment</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-navy">{o.id}</td>
                <td className="px-6 py-4">{o.customer}</td>
                <td className="px-6 py-4">{o.items}</td>
                <td className="px-6 py-4 font-semibold">₹{o.total}</td>
                <td className="px-6 py-4 text-muted">{o.date}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${o.payment === "Paid" ? "bg-green-50 text-green-700" : o.payment === "Pending" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"}`}>{o.payment}</span></td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColors[o.status]}`}>{o.status}</span></td>
                <td className="px-6 py-4 text-right"><button className="p-2 hover:bg-gray-100 rounded-lg text-muted"><Eye size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
