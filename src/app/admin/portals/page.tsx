"use client";
import { useState, useEffect, useCallback } from "react";
import { Link2, Edit, Save, X, Shield, Users, Scale, ScanLine, Landmark, Stethoscope, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Portal {
  id: string;
  portalName: string;
  urlPath: string;
  description: string | null;
  isActive: boolean;
  requiredRole: string | null;
  createdAt: string;
  updatedAt: string;
}

const PORTAL_ICONS: Record<string, any> = {
  admin: Shield,
  staff: Users,
  judge: Scale,
  scanner: ScanLine,
  trustee: Landmark,
  reviewer: Scale,
  doctor: Stethoscope,
};

export default function AdminPortals() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Portal>>({});
  const [saving, setSaving] = useState(false);

  const fetchPortals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/portals");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setPortals(data);
    } catch {
      toast.error("Failed to load portals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPortals(); }, [fetchPortals]);

  const startEdit = (portal: Portal) => {
    setEditingId(portal.id);
    setEditForm({ ...portal });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId || !editForm.portalName) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/portals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          portalName: editForm.portalName,
          urlPath: editForm.urlPath,
          description: editForm.description,
          isActive: editForm.isActive,
          requiredRole: editForm.requiredRole,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Portal updated successfully");
      setEditingId(null);
      setEditForm({});
      fetchPortals();
    } catch {
      toast.error("Failed to update portal");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (portal: Portal) => {
    try {
      const res = await fetch("/api/admin/portals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: portal.id,
          portalName: portal.portalName,
          isActive: !portal.isActive,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Portal ${!portal.isActive ? "enabled" : "disabled"}`);
      fetchPortals();
    } catch {
      toast.error("Failed to update portal");
    }
  };

  const getIcon = (name: string) => {
    const Icon = PORTAL_ICONS[name.toLowerCase()] || Link2;
    return <Icon size={18} />;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-ink">Portal Links</h1>
        <p className="text-muted mt-1">Manage portal access and visibility</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="text-teal animate-spin" />
          </div>
        ) : (
          portals.map((portal) => {
            const isEditing = editingId === portal.id;
            return (
              <div key={portal.id} className="bg-white rounded-2xl border border-slate-200 p-6 card-hover">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Portal Name</label>
                        <input
                          value={editForm.portalName || ""}
                          onChange={(e) => setEditForm({ ...editForm, portalName: e.target.value })}
                          className="input-field w-full"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">URL Path</label>
                        <input
                          value={editForm.urlPath || ""}
                          onChange={(e) => setEditForm({ ...editForm, urlPath: e.target.value })}
                          className="input-field w-full"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Description</label>
                        <input
                          value={editForm.description || ""}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="input-field w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Required Role</label>
                        <select
                          value={editForm.requiredRole || ""}
                          onChange={(e) => setEditForm({ ...editForm, requiredRole: e.target.value || null })}
                          className="input-field w-full"
                        >
                          <option value="">Any Role</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="STAFF">STAFF</option>
                          <option value="JUDGE">JUDGE</option>
                          <option value="REVIEWER">REVIEWER</option>
                          <option value="TRUSTEE">TRUSTEE</option>
                          <option value="DOCTOR">DOCTOR</option>
                          <option value="SCANNER">SCANNER</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-ink">Active</span>
                        <button
                          type="button"
                          onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${editForm.isActive ? "bg-emerald-accent" : "bg-slate-300"}`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editForm.isActive ? "left-6" : "left-0.5"}`} />
                        </button>
                      </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${portal.isActive ? "bg-teal/10 text-teal" : "bg-slate-100 text-muted"}`}>
                        {getIcon(portal.portalName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading text-lg font-bold text-ink capitalize">{portal.portalName}</h3>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${portal.isActive ? "bg-emerald-accent/10 text-emerald-accent" : "bg-slate-100 text-muted"}`}>
                            {portal.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-sm text-muted mt-0.5">{portal.description || portal.urlPath}</p>
                        <p className="text-xs text-muted mt-1">Path: <span className="font-mono">{portal.urlPath}</span></p>
                        {portal.requiredRole && (
                          <p className="text-xs text-muted">Required role: <span className="font-bold text-ink">{portal.requiredRole}</span></p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(portal)}
                        className={`p-2.5 rounded-xl transition-colors ${portal.isActive ? "hover:bg-red-50 text-muted" : "hover:bg-emerald-50 text-emerald-accent"}`}
                        title={portal.isActive ? "Disable Portal" : "Enable Portal"}
                      >
                        {portal.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => startEdit(portal)}
                        className="p-2.5 hover:bg-slate-100 rounded-xl text-muted transition-colors"
                        title="Edit Portal"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
