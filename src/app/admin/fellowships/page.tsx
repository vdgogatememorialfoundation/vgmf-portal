import { FlaskConical, Users, FileCheck, TrendingUp, Search, Eye, CheckCircle2, XCircle } from "lucide-react";

const stats = [
  { icon: FlaskConical, label: "Applications", value: "47", color: "text-blue-600 bg-blue-50" },
  { icon: FileCheck, label: "Shortlisted", value: "18", color: "text-purple-600 bg-purple-50" },
  { icon: CheckCircle2, label: "Approved", value: "9", color: "text-green-600 bg-green-50" },
  { icon: TrendingUp, label: "Avg Score", value: "78%", color: "text-gold bg-gold/10" },
];

const applications = [
  { id: "FR2026-001", applicant: "Dr. Rajesh Kulkarni", area: "Agnikarma - Clinical Studies", mentor: "Dr. Anagha Gogate", score: 92, status: "Approved", date: "10 Jun 2026" },
  { id: "FR2026-002", applicant: "Dr. Snehal Patil", area: "Viddhakarma - Pain Management", mentor: "Dr. S.K. Sharma", score: 85, status: "Shortlisted", date: "12 Jun 2026" },
  { id: "FR2026-003", applicant: "Dr. Amit Thorat", area: "Shalya Tantra Integration", mentor: "Dr. Meera Bhojani", score: 78, status: "Shortlisted", date: "15 Jun 2026" },
  { id: "FR2026-004", applicant: "Dr. Priya Desai", area: "Panchakarma & Viddhakarma", mentor: "Dr. Rajeshwari", score: 65, status: "Under Review", date: "18 Jun 2026" },
  { id: "FR2026-005", applicant: "Dr. Vikas More", area: "Agnikarma - Burns Therapy", mentor: "Dr. K.M. Nair", score: 42, status: "Rejected", date: "20 Jun 2026" },
];

const statusColors: Record<string, string> = {
  Approved: "bg-green-50 text-green-700",
  Shortlisted: "bg-purple-50 text-purple-700",
  "Under Review": "bg-blue-50 text-blue-700",
  Rejected: "bg-red-50 text-red-700",
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

export default function AdminFellowships() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-navy">Fellowships</h1>
        <p className="text-muted mt-1">Manage Viddhakarma Research Fellowship applications and grants</p>
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
        <div className="relative max-w-sm"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input type="text" placeholder="Search applications..." className="w-full pl-10 pr-4 py-2.5 bg-cream rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-navy/20" /></div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Application ID</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Applicant</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Research Area</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Mentor</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Score</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(a => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-navy">{a.id}</td>
                <td className="px-6 py-4">{a.applicant}</td>
                <td className="px-6 py-4 text-muted">{a.area}</td>
                <td className="px-6 py-4 text-muted">{a.mentor}</td>
                <td className={`px-6 py-4 font-bold ${scoreColor(a.score)}`}>{a.score}%</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColors[a.status]}`}>{a.status}</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-muted" title="View Details"><Eye size={16} /></button>
                  <button className="p-2 hover:bg-green-50 rounded-lg text-green-600 ml-1" title="Approve"><CheckCircle2 size={16} /></button>
                  <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 ml-1" title="Reject"><XCircle size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
