"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, X, Shield, UserCircle, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface User {
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

const ROLES = ["USER", "STAFF", "ADMIN", "DOCTOR", "JUDGE", "REVIEWER", "TRUSTEE", "APPLICANT"];

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-gold/15 text-amber-800 border border-gold/30",
  STAFF: "bg-blue-50 text-blue-700 border border-blue-200",
  DOCTOR: "bg-violet-50 text-violet-700 border border-violet-200",
  TRUSTEE: "bg-teal/10 text-teal border border-teal/20",
  USER: "bg-slate-100 text-ink-soft border border-slate-200",
  JUDGE: "bg-purple-50 text-purple-700 border border-purple-200",
  REVIEWER: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  APPLICANT: "bg-amber-50 text-amber-700 border border-amber-200",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setUsers(data.items || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleActive = async (user: User) => {
    setUpdatingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(user.isActive ? "User deactivated" : "User activated");
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    } catch {
      toast.error("Failed to update user");
    } finally {
      setUpdatingId(null);
    }
  };

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
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch {
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-ink">Users</h1>
        <p className="text-muted mt-1">{users.length} registered users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchUsers(); }}
            placeholder="Search by name or email..."
            className="input-field pl-10 w-full"
          />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field w-auto min-w-[150px]">
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Joined</th>
                <th className="text-right px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-muted">No users found</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center"><UserCircle size={20} className="text-muted" /></div>
                        )}
                        <span className="font-semibold text-ink">{user.name || "Unnamed"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={e => changeRole(user.id, e.target.value)}
                        disabled={updatingId === user.id}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 outline-none cursor-pointer transition-all ${ROLE_STYLES[user.role] || ROLE_STYLES.USER}`}
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${user.isActive ? "bg-emerald-accent/10 text-emerald-accent" : "bg-red-50 text-danger"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleActive(user)}
                        disabled={updatingId === user.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${user.isActive ? "bg-red-50 text-danger hover:bg-red-100" : "bg-emerald-accent/10 text-emerald-accent hover:bg-emerald-accent/20"}`}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
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
