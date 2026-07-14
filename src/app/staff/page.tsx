import { ShoppingBag, ClipboardList, DollarSign, TrendingUp } from "lucide-react";

export default function StaffDashboard() {
  const stats = [
    { icon: ShoppingBag, label: "Total Orders", value: "48", change: "+8%", color: "text-blue-600 bg-blue-50" },
    { icon: DollarSign, label: "Revenue", value: "₹1.2L", change: "+5%", color: "text-green-600 bg-green-50" },
    { icon: ClipboardList, label: "Seminar Reg.", value: "45", change: "+12", color: "text-purple-600 bg-purple-50" },
    { icon: ClipboardList, label: "Autism Reg.", value: "89", change: "+6", color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-navy">Dashboard</h1>
        <p className="text-muted mt-1">Welcome back, Staff Member</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}><s.icon size={20} /></div>
            <p className="text-xs text-muted uppercase tracking-wider">{s.label}</p>
            <p className="font-heading text-2xl font-extrabold text-navy mt-1">{s.value}</p>
            <span className="text-xs text-green-600 flex items-center gap-1 mt-1"><TrendingUp size={12} /> {s.change}</span>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-heading text-lg font-bold text-navy mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {["VGMF-20260714-A1B2C3D4","VGMF-20260713-E5F6G7H8","VGMF-20260712-I9J0K1L2"].map(o => (
              <div key={o} className="flex justify-between items-center py-2 border-b last:border-0">
                <div><p className="text-sm font-medium text-navy">{o}</p><p className="text-xs text-muted">2 items · ₹850</p></div>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">Processing</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-heading text-lg font-bold text-navy mb-4">Registrations Overview</h3>
          <div className="space-y-4">
            {[{label:"Seminar", count:45},{label:"Fellowship", count:12},{label:"Autism", count:89}].map(r => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-sm text-ink-soft">{r.label}</span>
                <div className="flex items-center gap-3"><div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-navy rounded-full" style={{width:`${(r.count/89)*100}%`}} /></div><span className="text-sm font-semibold text-navy">{r.count}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
