import { Brain, Users, ClipboardCheck, Activity, Search, Eye, CheckCircle2, Clock } from "lucide-react";

const stats = [
  { icon: Brain, label: "Total Registrations", value: "134", color: "text-purple-600 bg-purple-50" },
  { icon: CheckCircle2, label: "Enrolled", value: "98", color: "text-green-600 bg-green-50" },
  { icon: Clock, label: "Assessment Due", value: "21", color: "text-yellow-600 bg-yellow-50" },
  { icon: Activity, label: "Active Therapy", value: "67", color: "text-blue-600 bg-blue-50" },
];

const patients = [
  { id: "ASD-001", patientName: "Arjun Deshmukh", age: 8, guardian: "Smita Deshmukh", phone: "+91 98765 43210", registered: "05 Jun 2026", status: "Active Therapy", therapist: "Dr. Neha Patil" },
  { id: "ASD-002", patientName: "Ananya Joshi", age: 12, guardian: "Rajesh Joshi", phone: "+91 87654 32109", registered: "02 Jun 2026", status: "Enrolled", therapist: "Dr. Amit Kulkarni" },
  { id: "ASD-003", patientName: "Rohan Sharma", age: 6, guardian: "Priya Sharma", phone: "+91 76543 21098", registered: "28 May 2026", status: "Assessment Due", therapist: "Pending" },
  { id: "ASD-004", patientName: "Kavya Iyer", age: 15, guardian: "Lakshmi Iyer", phone: "+91 65432 10987", registered: "20 May 2026", status: "Active Therapy", therapist: "Dr. Neha Patil" },
  { id: "ASD-005", patientName: "Aditya Rao", age: 10, guardian: "Venkat Rao", phone: "+91 54321 09876", registered: "12 May 2026", status: "Completed", therapist: "Dr. Suresh Bapat" },
];

const statusColors: Record<string, string> = {
  "Active Therapy": "bg-blue-50 text-blue-700",
  Enrolled: "bg-purple-50 text-purple-700",
  "Assessment Due": "bg-yellow-50 text-yellow-700",
  Completed: "bg-green-50 text-green-700",
  Onboarded: "bg-green-50 text-green-700",
};

export default function AdminAutism() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-navy">Autism Programme</h1>
        <p className="text-muted mt-1">Manage Autism Awareness Programme registrations and therapy progress</p>
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
        <div className="relative max-w-sm"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input type="text" placeholder="Search patients..." className="w-full pl-10 pr-4 py-2.5 bg-cream rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-navy/20" /></div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Patient ID</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Patient Name</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Age</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Guardian</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Therapist</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Registered</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-navy">{p.id}</td>
                <td className="px-6 py-4">{p.patientName}</td>
                <td className="px-6 py-4">{p.age}</td>
                <td className="px-6 py-4 text-muted">{p.guardian}</td>
                <td className="px-6 py-4 text-muted">{p.therapist}</td>
                <td className="px-6 py-4 text-muted">{p.registered}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColors[p.status] || "bg-gray-100 text-gray-600"}`}>{p.status}</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-muted" title="View"><Eye size={16} /></button>
                  <button className="p-2 hover:bg-green-50 rounded-lg text-green-600 ml-1" title="Update Status"><CheckCircle2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
