import { Calendar, Users, DollarSign, CheckCircle, Search, Eye, Edit, XCircle } from "lucide-react";

const stats = [
  { icon: Calendar, label: "Total Seminars", value: "15", color: "text-blue-600 bg-blue-50" },
  { icon: Users, label: "Registrations", value: "487", color: "text-purple-600 bg-purple-50" },
  { icon: CheckCircle, label: "Confirmed", value: "412", color: "text-green-600 bg-green-50" },
  { icon: DollarSign, label: "Revenue", value: "₹7.3L", color: "text-gold bg-gold/10" },
];

const seminars = [
  { id: "sem1", name: "15th National Seminar on Agnikarma & Viddhakarma", date: "Dec 2026", venue: "Pune, Maharashtra", registrations: 210, capacity: 500, fee: 1500, status: "Active" },
  { id: "sem2", name: "14th National Seminar on Agnikarma & Viddhakarma", date: "Dec 2025", venue: "Pune, Maharashtra", registrations: 185, capacity: 450, fee: 1500, status: "Completed" },
  { id: "sem3", name: "13th National Seminar on Agnikarma & Viddhakarma", date: "Dec 2024", venue: "Pune, Maharashtra", registrations: 160, capacity: 400, fee: 1200, status: "Completed" },
  { id: "sem4", name: "Workshop: Basic Viddhakarma Techniques", date: "Mar 2027", venue: "Mumbai, Maharashtra", registrations: 45, capacity: 100, fee: 800, status: "Upcoming" },
];

const statusColors: Record<string, string> = {
  Active: "bg-blue-50 text-blue-700",
  Upcoming: "bg-purple-50 text-purple-700",
  Completed: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function AdminSeminars() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-navy">Seminars</h1>
        <p className="text-muted mt-1">Manage seminar events, registrations, and attendees</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}><s.icon size={20} /></div>
            <p className="text-xs text-muted uppercase tracking-wider">{s.label}</p>
            <p className="font-heading text-2xl font-extrabold text-navy mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border p-4 mb-6">
        <div className="relative max-w-sm"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input type="text" placeholder="Search seminars..." className="w-full pl-10 pr-4 py-2.5 bg-cream rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-navy/20" /></div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Seminar Name</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Date</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Venue</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Registrations</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Fee</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {seminars.map(s => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-navy">{s.name}</td>
                <td className="px-6 py-4 text-muted">{s.date}</td>
                <td className="px-6 py-4">{s.venue}</td>
                <td className="px-6 py-4">{s.registrations} / {s.capacity}</td>
                <td className="px-6 py-4 font-semibold">₹{s.fee}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColors[s.status]}`}>{s.status}</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-muted" title="View"><Eye size={16} /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-muted ml-1" title="Edit"><Edit size={16} /></button>
                  <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 ml-1" title="Cancel"><XCircle size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
