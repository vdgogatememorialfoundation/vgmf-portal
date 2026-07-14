import Link from "next/link";
import { Users, UserCheck, Shield, Activity, Search, Mail, Edit, Ban, UserPlus } from "lucide-react";

const stats = [
  { icon: Users, label: "Total Staff", value: "12", color: "text-blue-600 bg-blue-50" },
  { icon: Shield, label: "Admins", value: "3", color: "text-gold bg-gold/10" },
  { icon: UserCheck, label: "Active Staff", value: "11", color: "text-green-600 bg-green-50" },
  { icon: Activity, label: "Departments", value: "5", color: "text-purple-600 bg-purple-50" },
];

const staff = [
  { id: "st1", name: "Dr. Anagha Gogate", email: "anagha@vgmf.org", role: "Admin", department: "Management", joined: "01 Jan 2020", active: true },
  { id: "st2", name: "Dr. Neha Patil", email: "neha@vgmf.org", role: "Staff", department: "Therapy", joined: "15 Mar 2021", active: true },
  { id: "st3", name: "Dr. Amit Kulkarni", email: "amit.k@vgmf.org", role: "Staff", department: "Therapy", joined: "10 Jun 2022", active: true },
  { id: "st4", name: "Sneha Joshi", email: "sneha@vgmf.org", role: "Admin", department: "Operations", joined: "01 Jan 2025", active: true },
  { id: "st5", name: "Ramesh More", email: "ramesh@vgmf.org", role: "Staff", department: "Accounts", joined: "05 Feb 2023", active: false },
  { id: "st6", name: "Dr. Suresh Bapat", email: "suresh@vgmf.org", role: "Staff", department: "Therapy", joined: "20 Aug 2022", active: true },
];

const roleColors: Record<string, string> = {
  Admin: "bg-gold/20 text-navy",
  Staff: "bg-blue-50 text-blue-700",
  Manager: "bg-purple-50 text-purple-700",
};

export default function AdminStaff() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="font-heading text-3xl font-extrabold text-navy">Staff</h1><p className="text-muted mt-1">Manage staff accounts, roles, and permissions</p></div>
        <Link href="/admin/staff/new" className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light"><UserPlus size={18} /> Add Staff</Link>
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
        <div className="relative max-w-sm"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input type="text" placeholder="Search staff..." className="w-full pl-10 pr-4 py-2.5 bg-cream rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-navy/20" /></div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Email</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Role</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Department</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Joined</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-navy">{s.name}</td>
                <td className="px-6 py-4 text-muted">{s.email}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${roleColors[s.role]}`}>{s.role}</span></td>
                <td className="px-6 py-4">{s.department}</td>
                <td className="px-6 py-4 text-muted">{s.joined}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${s.active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{s.active ? "Active" : "Inactive"}</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-muted" title="Send email"><Mail size={16} /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-muted ml-1" title="Edit"><Edit size={16} /></button>
                  <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 ml-1" title="Deactivate"><Ban size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
