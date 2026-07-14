"use client";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const roleOptions = ["Customer", "Staff", "Admin"];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  const toggleActive = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    fetchUsers();
  };

  const changeRole = async (id: string, newRole: string) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-navy">Users</h1>
        <p className="text-muted mt-1">{users.length} registered users</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchUsers(); }}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Email</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Role</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-muted">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-muted">No users found</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{u.name}</td>
                  <td className="px-6 py-4 text-muted">{u.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={e => changeRole(u.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 outline-none cursor-pointer ${
                        u.role === "Admin" ? "bg-gold/20 text-navy" :
                        u.role === "Staff" ? "bg-blue-50 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {roleOptions.map(r => (<option key={r} value={r}>{r}</option>))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(u.id)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        u.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleActive(u.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${u.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
