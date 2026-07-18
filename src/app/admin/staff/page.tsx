"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, UserCog, Shield, UserCircle } from "lucide-react";
import toast from "react-hot-toast";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  image?: string;
  phone?: string;
  createdAt: string;
  _count?: { orders: number };
}

const STAFF_ROLES = ["STAFF", "ADMIN", "DOCTOR", "TRUSTEE", "REVIEWER"];

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-gold/15 text-amber-800 border border-gold/30",
  STAFF: "bg-blue-50 text-blue-700 border border-blue-200",
  DOCTOR: "bg-violet-50 text-violet-700 border border-violet-200",
  TRUSTEE: "bg-teal/10 text-teal border border-teal/20",
  REVIEWER: "bg-cyan-50 text-cyan-700 border border-cyan-200",
};

export default function AdminStaff() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const stats = {
    total: staff.length,
    admins: staff.filter(s => s.role === "ADMIN").length,
    active: staff.filter(s => s.isActive).length,
    inactive: staff.filter(s => !s.isActive).length,
  };

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const allUsers = data.items || [];
      setStaff(allUsers.filter((u: StaffUser) => STAFF_ROLES.includes(u.role)));
    } catch {
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const changeRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Role updated to ${newRole}`);
      setStaff(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch {
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleActive = async (user: StaffUser) => {
    setUpdatingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(user.isActive ? "Staff deactivated" : "Staff activated");
      setStaff(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-ink">Staff Management</h1>
        <p className="text-muted mt-1">Manage staff accounts, roles, and permissions</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: UserCog, label: "Total Staff", value: stats.total, color: "bg-blue-50 text-blue-600" },
          { icon: Shield, label: "Admins", value: stats.admins, color: "bg-gold/10 text-gold" },
          { icon: UserCircle, label: "Active", value: stats.active, color: "bg-emerald-accent/10 text-emerald-accent" },
          { icon: UserCog, label: "Inactive", value: stats.inactive, color: "bg-red-50 text-danger" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}><s.icon size={20} /></div>
            <p className="text-xs text-muted uppercase tracking-wider">{s.label}</p>
            <p className="font-heading text-2xl font-extrabold text-ink mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchStaff(); }}
            placeholder="Search staff by name or email..."
            className="input-field pl-10 w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Staff Member</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Joined</th>
                <th className="text-right px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : staff.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-muted">No staff members found</td></tr>
              ) : (
                staff.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {member.image ? (
                          <img src={member.image} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center"><UserCircle size={20} className="text-muted" /></div>
                        )}
                        <div>
                          <span className="font-semibold text-ink">{member.name || "Unnamed"}</span>
                          {member.phone && <div className="text-xs text-muted">{member.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted text-sm">{member.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={member.role}
                        onChange={e => changeRole(member.id, e.target.value)}
                        disabled={updatingId === member.id}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border-0 outline-none cursor-pointer transition-all ${ROLE_STYLES[member.role] || "bg-slate-100 text-slate-600"}`}
                      >
                        {STAFF_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${member.isActive ? "bg-emerald-accent/10 text-emerald-accent" : "bg-red-50 text-danger"}`}>
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">
                      {new Date(member.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleActive(member)}
                        disabled={updatingId === member.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${member.isActive ? "bg-red-50 text-danger hover:bg-red-100" : "bg-emerald-accent/10 text-emerald-accent hover:bg-emerald-accent/20"}`}
                      >
                        {member.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
