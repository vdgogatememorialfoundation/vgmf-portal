"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  X,
  Shield,
  UserCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  UserCog,
  Eye,
  Edit3,
  Trash2,
  Key,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  ArrowRight,
  Check,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  category?: string;
  isActive: boolean;
  image?: string;
  loginMethod?: string;
  hasPassword?: boolean;
  password?: string;
  createdAt: string;
  registrationsCount?: number;
  _count?: {
    orders: number;
    seminarRegs: number;
    fellowshipApps: number;
    autismRegs: number;
    eventRegistrations: number;
    certificates: number;
  };
}

interface UserDetail extends UserItem {
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dob?: string;
  gender?: string;
  updatedAt?: string;
  orders?: Array<{ id: string; orderNumber: string; status: string; totalAmount: number; createdAt: string }>;
  seminarRegs?: Array<{ id: string; ticketNumber: string; isVerified: boolean; isCancelled: boolean; paymentStatus: string; registrationDate: string }>;
  fellowshipApps?: Array<{ id: string; trackingNumber: string; applicationId: string; status: string; areaOfInterest: string; submittedAt: string }>;
  autismRegs?: Array<{ id: string; childName: string; eTicketNumber: string; isFullyRegistered: boolean; registrationDate: string }>;
  eventRegistrations?: Array<{ id: string; ticketNumber: string; status: string; paymentStatus: string; event: { title: string }; registrationDate: string }>;
  certificates?: Array<{ id: string; title: string; certificateNumber: string; status: string; issuedDate: string }>;
}

const ROLES = ["USER", "STAFF", "ADMIN", "DOCTOR", "JUDGE", "REVIEWER", "TRUSTEE", "APPLICANT", "SCANNER"];
const STAFF_ROLES = ["STAFF", "ADMIN", "DOCTOR", "TRUSTEE", "REVIEWER", "JUDGE"];
const CATEGORIES = ["DOCTOR", "STUDENT", "RESEARCHER", "PATIENT", "INSTITUTION"];

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-gold/15 text-amber-800 border border-gold/30",
  STAFF: "bg-blue-50 text-blue-700 border border-blue-200",
  DOCTOR: "bg-violet-50 text-violet-700 border border-violet-200",
  TRUSTEE: "bg-teal/10 text-teal border border-teal/20",
  USER: "bg-slate-100 text-ink-soft border border-slate-200",
  JUDGE: "bg-purple-50 text-purple-700 border border-purple-200",
  REVIEWER: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  APPLICANT: "bg-amber-50 text-amber-700 border border-amber-200",
  SCANNER: "bg-pink-50 text-pink-700 border border-pink-200",
};

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  REJECTED: "bg-red-50 text-red-700 ring-1 ring-red-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  CANCELLED: "bg-red-50 text-red-700 ring-1 ring-red-200",
  SHORTLISTED: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  SELECTED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  FUNDED: "bg-green-50 text-green-700 ring-1 ring-green-200",
};

type Tab = "all" | "staff";

export default function AdminUsers() {
  const [tab, setTab] = useState<Tab>("all");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [detailUser, setDetailUser] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", phone: "", role: "USER", category: "", password: "" });
  const [creating, setCreating] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserDetail>>({});
  const [editing, setEditing] = useState(false);

  const [showResetPw, setShowResetPw] = useState(false);
  const [resetPwUserId, setResetPwUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  const STAFF_ROLES_FILTER = STAFF_ROLES;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (tab === "staff") {
        params.set("role", "STAFF");
      } else if (roleFilter) {
        params.set("role", roleFilter);
      }
      params.set("page", String(page));
      params.set("limit", "20");

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      let filtered = data.items || [];
      if (tab === "staff") {
        filtered = filtered.filter((u: UserItem) => STAFF_ROLES.includes(u.role));
      }

      setUsers(filtered);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page, tab]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openDetail = async (userId: string) => {
    setDetailLoading(true);
    setShowDetail(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setDetailUser(data);
    } catch {
      toast.error("Failed to load user details");
      setShowDetail(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleActive = async (user: UserItem) => {
    setUpdatingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(user.isActive ? "User deactivated" : "User activated");
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u)));
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
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Role updated to ${newRole}`);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch {
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.email) return toast.error("Email is required");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      toast.success("Account created successfully");
      setShowCreate(false);
      setCreateForm({ name: "", email: "", phone: "", role: "USER", category: "", password: "" });
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to create account");
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (user: UserItem) => {
    setEditForm(user);
    setShowEdit(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.id) return;
    setEditing(true);
    try {
      const res = await fetch(`/api/admin/users/${editForm.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("User updated");
      setShowEdit(false);
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    } finally {
      setEditing(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPwUserId || !newPassword) return;
    setResetting(true);
    try {
      const res = await fetch(`/api/admin/users/${resetPwUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetPassword: true, newPassword }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Password reset successfully");
      setShowResetPw(false);
      setNewPassword("");
    } catch {
      toast.error("Failed to reset password");
    } finally {
      setResetting(false);
    }
  };

  const stats = {
    total,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">User Management</h1>
          <p className="text-muted mt-1 text-sm">Manage all user accounts, roles, and permissions</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal to-cyan-500 hover:shadow-lg hover:shadow-teal/20 hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus size={16} />
          Create Account
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1 w-fit">
        {([
          { key: "all" as Tab, label: "All Users", icon: Users },
          { key: "staff" as Tab, label: "Staff", icon: UserCog },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === t.key
                ? "bg-teal text-white shadow-sm"
                : "text-muted hover:text-ink hover:bg-slate-50"
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: stats.total, color: "bg-blue-50 text-blue-600", icon: Users },
          { label: "Active", value: stats.active, color: "bg-emerald-50 text-emerald-600", icon: Shield },
          { label: "Inactive", value: stats.inactive, color: "bg-red-50 text-red-600", icon: AlertTriangle },
          { label: "Admins", value: stats.admins, color: "bg-gold/10 text-gold", icon: UserCog },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color} mb-2`}>
              <s.icon size={18} />
            </div>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">{s.label}</p>
            <p className="font-heading text-2xl font-extrabold text-navy mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); fetchUsers(); } }}
            placeholder="Search by name, email, or phone..."
            className="input-field pl-10 w-full"
          />
        </div>
        {tab === "all" && (
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="input-field w-auto min-w-[150px]"
          >
            <option value="">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider hidden lg:table-cell">Login</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider hidden xl:table-cell">Joined</th>
                <th className="text-right px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Users size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-muted font-medium">No users found</p>
                    <p className="text-xs text-muted mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center">
                            <UserCircle size={20} className="text-muted" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <button
                            onClick={() => openDetail(user.id)}
                            className="text-left hover:text-teal transition-colors"
                          >
                            <p className="font-semibold text-ink truncate">{user.name || "Unnamed"}</p>
                            <p className="text-xs text-muted truncate">{user.email}</p>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted text-sm hidden md:table-cell">{user.phone || "—"}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        disabled={updatingId === user.id}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 outline-none cursor-pointer transition-all ${ROLE_STYLES[user.role] || ROLE_STYLES.USER}`}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.loginMethod === "otp" ? "bg-violet-500" : "bg-teal"}`} />
                        <span className="text-xs text-muted capitalize">{user.loginMethod || "password"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs hidden xl:table-cell">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openDetail(user.id)}
                          className="p-1.5 rounded-lg text-muted hover:text-teal hover:bg-teal/5 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEdit(user)}
                          className="p-1.5 rounded-lg text-muted hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => { setResetPwUserId(user.id); setShowResetPw(true); }}
                          className="p-1.5 rounded-lg text-muted hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Reset Password"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => toggleActive(user)}
                          disabled={updatingId === user.id}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.isActive
                              ? "text-muted hover:text-red-600 hover:bg-red-50"
                              : "text-muted hover:text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={user.isActive ? "Deactivate" : "Activate"}
                        >
                          {user.isActive ? <Trash2 size={16} /> : <Check size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-xs text-muted">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-ink px-3">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Account Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="font-heading text-lg font-bold text-navy">Create Account</h3>
                <p className="text-xs text-muted mt-0.5">Admin creates account for applicant</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} className="text-muted" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Name</label>
                  <input
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="input-field w-full"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="input-field w-full"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Phone</label>
                  <input
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="input-field w-full"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="input-field w-full"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="">— None —</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Password</label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="input-field w-full"
                    placeholder="Leave blank for no password"
                  />
                  <p className="text-[11px] text-muted mt-1">If blank, user will only be able to login via OTP (if enabled)</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-outline px-4 py-2.5 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50">
                  {creating ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEdit && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="font-heading text-lg font-bold text-navy">Edit User</h3>
                <p className="text-xs text-muted mt-0.5">{editForm.email}</p>
              </div>
              <button onClick={() => setShowEdit(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} className="text-muted" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Name</label>
                  <input
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Phone</label>
                  <input
                    value={editForm.phone || ""}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Role</label>
                  <select
                    value={editForm.role || "USER"}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="input-field w-full"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={editForm.category || ""}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="">— None —</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">City</label>
                  <input
                    value={editForm.city || ""}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">State</label>
                  <input
                    value={editForm.state || ""}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Pincode</label>
                  <input
                    value={editForm.pincode || ""}
                    onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Address</label>
                  <input
                    value={editForm.address || ""}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowEdit(false)} className="btn-outline px-4 py-2.5 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={editing} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50">
                  {editing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="font-heading text-lg font-bold text-navy">Reset Password</h3>
                <p className="text-xs text-muted mt-0.5">Set a new password for this user</p>
              </div>
              <button onClick={() => setShowResetPw(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} className="text-muted" />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field w-full"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowResetPw(false)} className="btn-outline px-4 py-2.5 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={resetting} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50">
                  {resetting ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                {detailUser?.image ? (
                  <img src={detailUser.image} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                    <UserCircle size={22} className="text-muted" />
                  </div>
                )}
                <div>
                  <h3 className="font-heading text-lg font-bold text-navy">{detailUser?.name || "Unnamed"}</h3>
                  <p className="text-xs text-muted">{detailUser?.email}</p>
                </div>
              </div>
              <button onClick={() => setShowDetail(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} className="text-muted" />
              </button>
            </div>

            {detailLoading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted">Loading user details...</p>
              </div>
            ) : detailUser ? (
              <div className="p-6 space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoItem icon={Shield} label="Role" value={detailUser.role} />
                  <InfoItem icon={Tag} label="Category" value={detailUser.category || "—"} />
                  <InfoItem icon={Phone} label="Phone" value={detailUser.phone || "—"} />
                  <InfoItem icon={MapPin} label="Location" value={[detailUser.city, detailUser.state].filter(Boolean).join(", ") || "—"} />
                  <InfoItem icon={Calendar} label="Joined" value={new Date(detailUser.createdAt).toLocaleDateString("en-IN")} />
                  <InfoItem icon={Key} label="Login Method" value={detailUser.loginMethod || "password"} />
                  <InfoItem
                    icon={detailUser.isActive ? Shield : AlertTriangle}
                    label="Status"
                    value={detailUser.isActive ? "Active" : "Inactive"}
                    valueClass={detailUser.isActive ? "text-emerald-600" : "text-red-600"}
                  />
                  <InfoItem icon={Mail} label="Email Verified" value={detailUser.emailVerified ? "Yes" : "No"} />
                  <InfoItem icon={Users} label="Orders" value={String(detailUser._count?.orders || 0)} />
                </div>

                {/* Registrations Summary */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-heading text-sm font-bold text-navy mb-3">Activity Summary</h4>
                  <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                      { label: "Seminar Regs", count: detailUser._count?.seminarRegs || 0 },
                      { label: "Fellowships", count: detailUser._count?.fellowshipApps || 0 },
                      { label: "Autism Regs", count: detailUser._count?.autismRegs || 0 },
                      { label: "Event Regs", count: detailUser._count?.eventRegistrations || 0 },
                      { label: "Certificates", count: detailUser._count?.certificates || 0 },
                    ].map((s) => (
                      <div key={s.label} className="bg-white rounded-lg p-3 border border-slate-100">
                        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">{s.label}</p>
                        <p className="font-heading text-xl font-extrabold text-navy">{s.count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                {detailUser.orders && detailUser.orders.length > 0 && (
                  <Section title="Recent Orders">
                    <div className="space-y-2">
                      {detailUser.orders.map((o) => (
                        <div key={o.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-ink">{o.orderNumber}</p>
                            <p className="text-xs text-muted">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-ink">₹{o.totalAmount.toLocaleString("en-IN")}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_COLORS[o.status] || "bg-slate-100 text-slate-600"}`}>
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Fellowship Apps */}
                {detailUser.fellowshipApps && detailUser.fellowshipApps.length > 0 && (
                  <Section title="Fellowship Applications">
                    <div className="space-y-2">
                      {detailUser.fellowshipApps.map((f) => (
                        <div key={f.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-ink">{f.trackingNumber}</p>
                            <p className="text-xs text-muted">{f.areaOfInterest || "N/A"}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_COLORS[f.status] || "bg-slate-100 text-slate-600"}`}>
                            {f.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Event Registrations */}
                {detailUser.eventRegistrations && detailUser.eventRegistrations.length > 0 && (
                  <Section title="Event Registrations">
                    <div className="space-y-2">
                      {detailUser.eventRegistrations.map((r) => (
                        <div key={r.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-ink">{r.event?.title || "Event"}</p>
                            <p className="text-xs text-muted">{r.ticketNumber}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_COLORS[r.status] || "bg-slate-100 text-slate-600"}`}>
                            {r.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Certificates */}
                {detailUser.certificates && detailUser.certificates.length > 0 && (
                  <Section title="Certificates">
                    <div className="space-y-2">
                      {detailUser.certificates.map((c) => (
                        <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-ink">{c.title}</p>
                            <p className="text-xs text-muted font-mono">{c.certificateNumber}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_COLORS[c.status] || "bg-slate-100 text-slate-600"}`}>
                            {c.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => { setShowDetail(false); openEdit(detailUser); }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Edit3 size={14} /> Edit User
                  </button>
                  <button
                    onClick={() => { setShowDetail(false); setResetPwUserId(detailUser.id); setShowResetPw(true); }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    <Key size={14} /> Reset Password
                  </button>
                  <button
                    onClick={async () => { await toggleActive(detailUser); setShowDetail(false); }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      detailUser.isActive
                        ? "text-red-600 bg-red-50 hover:bg-red-100"
                        : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                    }`}
                  >
                    {detailUser.isActive ? <><Trash2 size={14} /> Deactivate</> : <><Check size={14} /> Activate</>}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  valueClass = "text-ink",
}: {
  icon: any;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={14} className="text-muted" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-medium ${valueClass} truncate`}>{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-heading text-sm font-bold text-navy mb-3">{title}</h4>
      {children}
    </div>
  );
}
