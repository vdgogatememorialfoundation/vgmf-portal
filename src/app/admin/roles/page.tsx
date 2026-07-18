"use client";
import { useState, useEffect, useCallback } from "react";
import { Shield, Edit, Save, X, Loader2, Check, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Role {
  id: string;
  roleName: string;
  description: string | null;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ALL_PERMISSIONS = [
  { resource: "users", actions: ["read", "write", "delete"] },
  { resource: "events", actions: ["read", "write", "delete"] },
  { resource: "registrations", actions: ["read", "write", "delete"] },
  { resource: "orders", actions: ["read", "write", "delete"] },
  { resource: "certificates", actions: ["read", "write", "delete"] },
  { resource: "reports", actions: ["read", "write", "delete"] },
  { resource: "settings", actions: ["read", "write", "delete"] },
  { resource: "announcements", actions: ["read", "write", "delete"] },
  { resource: "articles", actions: ["read", "write", "delete"] },
  { resource: "products", actions: ["read", "write", "delete"] },
  { resource: "chats", actions: ["read", "write", "delete"] },
  { resource: "reviews", actions: ["read", "write", "delete"] },
  { resource: "fellowships", actions: ["read", "write", "delete"] },
];

const SPECIAL_PERMISSIONS = ["write:scan", "write:scores", "write:reviews"];

export default function AdminRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/roles");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setRoles(data);
    } catch {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const startEdit = (role: Role) => {
    setEditingId(role.id);
    setEditPermissions([...role.permissions]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPermissions([]);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const role = roles.find(r => r.id === editingId);
      if (!role) throw new Error("Role not found");

      const res = await fetch("/api/admin/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          roleName: role.roleName,
          permissions: editPermissions,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Permissions updated successfully");
      setEditingId(null);
      setEditPermissions([]);
      fetchRoles();
    } catch {
      toast.error("Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (perm: string) => {
    if (editPermissions.includes(perm)) {
      setEditPermissions(editPermissions.filter(p => p !== perm));
    } else {
      setEditPermissions([...editPermissions, perm]);
    }
  };

  const hasPermission = (resource: string, action: string) => {
    return editPermissions.includes(`${action}:${resource}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-ink">Role Permissions</h1>
        <p className="text-muted mt-1">Manage role-based access control</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="text-teal animate-spin" />
          </div>
        ) : (
          roles.map((role) => {
            const isEditing = editingId === role.id;
            return (
              <div key={role.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role.roleName === "ADMIN" ? "bg-maroon/10 text-maroon" : "bg-teal/10 text-teal"}`}>
                        <Shield size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading text-lg font-bold text-ink">{role.roleName}</h3>
                          {!role.isActive && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-muted">Inactive</span>
                          )}
                        </div>
                        <p className="text-sm text-muted mt-0.5">{role.description || "No description"}</p>
                      </div>
                    </div>
                    {!isEditing && (
                      <button onClick={() => startEdit(role)} className="btn-outline !py-2 !px-4 text-sm">
                        <Edit size={14} /> Edit Permissions
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {ALL_PERMISSIONS.map(({ resource, actions }) => (
                          <div key={resource} className="border border-slate-200 rounded-xl p-3">
                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2 capitalize">{resource}</h4>
                            <div className="flex flex-wrap gap-2">
                              {actions.map((action) => {
                                const perm = `${action}:${resource}`;
                                const isGranted = editPermissions.includes(perm);
                                const isWriteAndRead = action === "write" && editPermissions.includes(`read:${resource}`);
                                return (
                                  <button
                                    key={perm}
                                    onClick={() => togglePermission(perm)}
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                                      isGranted
                                        ? "bg-teal text-white border-teal"
                                        : isWriteAndRead
                                        ? "bg-teal/20 text-teal border-teal/30"
                                        : "bg-slate-50 text-muted border-slate-200 hover:border-teal/30"
                                    }`}
                                  >
                                    {action}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        <div className="border border-slate-200 rounded-xl p-3">
                          <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Special</h4>
                          <div className="flex flex-wrap gap-2">
                            {SPECIAL_PERMISSIONS.map((perm) => {
                              const isGranted = editPermissions.includes(perm);
                              return (
                                <button
                                  key={perm}
                                  onClick={() => togglePermission(perm)}
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                                    isGranted
                                      ? "bg-teal text-white border-teal"
                                      : "bg-slate-50 text-muted border-slate-200 hover:border-teal/30"
                                  }`}
                                >
                                  {perm}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <p className="text-sm text-muted">
                          {editPermissions.length} permission{editPermissions.length !== 1 ? "s" : ""} selected
                        </p>
                        <div className="flex gap-2">
                          <button onClick={cancelEdit} className="btn-outline !py-2 !px-4 text-sm">
                            <X size={14} /> Cancel
                          </button>
                          <button onClick={saveEdit} disabled={saving} className="btn-primary !py-2 !px-4 text-sm">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.length === 0 ? (
                        <span className="text-sm text-muted italic">No specific permissions</span>
                      ) : (
                        role.permissions.map((perm) => (
                          <span key={perm} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal/10 text-teal border border-teal/20">
                            {perm}
                          </span>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
