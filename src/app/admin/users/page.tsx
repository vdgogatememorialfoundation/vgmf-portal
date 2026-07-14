import { Search, Mail, Ban, Shield } from "lucide-react";

const users = [
  { id: "u1", name: "Rahul Sharma", email: "rahul@email.com", role: "Customer", orders: 5, joined: "12 Jun 2026", active: true },
  { id: "u2", name: "Priya Patel", email: "priya@email.com", role: "Customer", orders: 3, joined: "02 Jul 2026", active: true },
  { id: "u3", name: "Dr. Mehta", email: "drmehta@vgmf.org", role: "Staff", orders: 0, joined: "15 Jan 2026", active: true },
  { id: "u4", name: "Amit Deshmukh", email: "amit@email.com", role: "Customer", orders: 8, joined: "20 Mar 2026", active: false },
  { id: "u5", name: "Sneha Joshi", email: "sneha@vgmf.org", role: "Admin", orders: 0, joined: "01 Jan 2025", active: true },
];

export default function AdminUsers() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-navy">Users</h1>
        <p className="text-muted mt-1">Manage registered users and staff</p>
      </div>

      <div className="bg-white rounded-2xl border p-4 mb-6">
        <div className="relative max-w-sm"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 bg-cream rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-navy/20" /></div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Email</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Role</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Orders</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Joined</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-navy">{u.name}</td>
                <td className="px-6 py-4 text-muted">{u.email}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${u.role === "Admin" ? "bg-gold/20 text-navy" : u.role === "Staff" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{u.role}</span></td>
                <td className="px-6 py-4">{u.orders}</td>
                <td className="px-6 py-4 text-muted">{u.joined}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${u.active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{u.active ? "Active" : "Inactive"}</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-muted" title="Send email"><Mail size={16} /></button>
                  <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 ml-1" title="Ban user"><Ban size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
