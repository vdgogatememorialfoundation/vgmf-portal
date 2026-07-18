"use client";
import { useState, useEffect, useCallback } from "react";
import { FileText, Edit, Save, X, Plus, Trash2, Loader2, Eye, EyeOff, Link2 } from "lucide-react";
import toast from "react-hot-toast";

interface Page {
  id: string;
  path: string;
  title: string;
  description: string | null;
  isEnabled: boolean;
  requiredRoles: string[];
  showInMenu: boolean;
  menuLabel: string | null;
  menuIcon: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const AVAILABLE_ROLES = ["ADMIN", "STAFF", "JUDGE", "REVIEWER", "TRUSTEE", "DOCTOR", "SCANNER", "USER"];

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState<Partial<Page>>({
    isEnabled: true,
    showInMenu: true,
    requiredRoles: [],
    sortOrder: 0,
  });
  const [saving, setSaving] = useState(false);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setPages(data);
    } catch {
      toast.error("Failed to load pages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const openCreator = () => {
    setEditing(null);
    setForm({
      path: "",
      title: "",
      description: "",
      isEnabled: true,
      showInMenu: true,
      requiredRoles: [],
      menuLabel: "",
      menuIcon: "",
      sortOrder: 0,
    });
    setShowForm(true);
  };

  const openEditor = (page: Page) => {
    setEditing(page);
    setForm({ ...page });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({});
  };

  const handleSave = async () => {
    if (!form.path || !form.title) {
      toast.error("Path and title are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "Page updated" : "Page created");
      closeForm();
      fetchPages();
    } catch {
      toast.error("Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page configuration?")) return;
    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Page deleted");
      fetchPages();
    } catch {
      toast.error("Failed to delete page");
    }
  };

  const toggleEnabled = async (page: Page) => {
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...page, isEnabled: !page.isEnabled }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Page ${!page.isEnabled ? "enabled" : "disabled"}`);
      fetchPages();
    } catch {
      toast.error("Failed to update page");
    }
  };

  const toggleMenu = async (page: Page) => {
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...page, showInMenu: !page.showInMenu }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Page ${!page.showInMenu ? "shown in menu" : "hidden from menu"}`);
      fetchPages();
    } catch {
      toast.error("Failed to update page");
    }
  };

  const toggleRole = (role: string) => {
    const current = form.requiredRoles || [];
    if (current.includes(role)) {
      setForm({ ...form, requiredRoles: current.filter(r => r !== role) });
    } else {
      setForm({ ...form, requiredRoles: [...current, role] });
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-ink">Page Configuration</h1>
          <p className="text-muted mt-1">Manage page access and menu visibility</p>
        </div>
        <button onClick={openCreator} className="btn-primary">
          <Plus size={18} /> Add Page
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={closeForm}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 my-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="font-heading text-xl font-bold text-ink">{editing ? "Edit" : "Add"} Page</h2>
              <button onClick={closeForm} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Path *</label>
                <input
                  value={form.path || ""}
                  onChange={(e) => setForm({ ...form, path: e.target.value })}
                  placeholder="/example-page"
                  className="input-field w-full font-mono text-sm"
                  disabled={!!editing}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Title *</label>
                <input
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Example Page"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Page description"
                  className="input-field w-full"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Menu Label</label>
                <input
                  value={form.menuLabel || ""}
                  onChange={(e) => setForm({ ...form, menuLabel: e.target.value })}
                  placeholder="Label in navigation"
                  className="input-field w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder || 0}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                    className="input-field w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-3">Required Roles</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_ROLES.map((role) => {
                    const isSelected = (form.requiredRoles || []).includes(role);
                    return (
                      <button
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                          isSelected ? "bg-teal text-white border-teal" : "bg-slate-50 text-muted border-slate-200 hover:border-teal/30"
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink">Enabled</span>
                  <button
                    onClick={() => setForm({ ...form, isEnabled: !form.isEnabled })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.isEnabled ? "bg-emerald-accent" : "bg-slate-300"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isEnabled ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink">Show in Menu</span>
                  <button
                    onClick={() => setForm({ ...form, showInMenu: !form.showInMenu })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.showInMenu ? "bg-emerald-accent" : "bg-slate-300"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.showInMenu ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
              <button onClick={handleSave} disabled={saving} className="btn-primary w-full mt-4">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} {saving ? "Saving..." : "Save Page"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Page</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Required Roles</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Menu</th>
                <th className="text-right px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <Loader2 size={32} className="text-teal animate-spin mx-auto" />
                  </td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-muted">No page configurations found</td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-muted" />
                        <div>
                          <p className="font-semibold text-ink">{page.title}</p>
                          <p className="text-xs text-muted font-mono">{page.path}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {page.requiredRoles.length === 0 ? (
                          <span className="text-xs text-muted">All roles</span>
                        ) : (
                          page.requiredRoles.map((role) => (
                            <span key={role} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-muted">
                              {role}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleEnabled(page)}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                          page.isEnabled ? "bg-emerald-accent/10 text-emerald-accent hover:bg-emerald-accent/20" : "bg-slate-100 text-muted hover:bg-slate-200"
                        }`}
                      >
                        {page.isEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
                        {page.isEnabled ? "Enabled" : "Disabled"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleMenu(page)}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                          page.showInMenu ? "bg-teal/10 text-teal hover:bg-teal/20" : "bg-slate-100 text-muted hover:bg-slate-200"
                        }`}
                      >
                        <Link2 size={12} />
                        {page.showInMenu ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEditor(page)} className="p-2 hover:bg-slate-100 rounded-lg text-muted transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(page.id)} className="p-2 hover:bg-red-50 rounded-lg text-danger transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
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
