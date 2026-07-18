"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, X, Save, Search, Pin, Megaphone } from "lucide-react";
import toast from "react-hot-toast";

interface Announcement {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  imageUrl?: string;
  linkUrl?: string;
  priority: number;
  isActive: boolean;
  isPinned: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

interface AnnouncementForm {
  title: string;
  content: string;
  summary: string;
  priority: number;
  isActive: boolean;
  isPinned: boolean;
  imageUrl: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
}

const EMPTY_FORM: AnnouncementForm = {
  title: "", content: "", summary: "", priority: 0,
  isActive: true, isPinned: false, imageUrl: "", linkUrl: "",
  startDate: "", endDate: "",
};

const PRIORITY_LABELS: Record<number, { label: string; style: string }> = {
  0: { label: "Low", style: "bg-slate-100 text-slate-600" },
  1: { label: "Normal", style: "bg-blue-50 text-blue-700" },
  2: { label: "High", style: "bg-amber-50 text-amber-700" },
  3: { label: "Urgent", style: "bg-red-50 text-danger" },
};

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/announcements?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAnnouncements(data.items || []);
    } catch {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/admin/announcements/${editing.id}` : "/api/admin/announcements";
      const method = editing ? "PUT" : "POST";
      const payload = {
        ...form,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "Announcement updated" : "Announcement created");
      closeForm();
      fetchAnnouncements();
    } catch {
      toast.error(editing ? "Failed to update" : "Failed to create");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/announcements/${deleteId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Delete announcement failed:", res.status, data);
        throw new Error(data.error || "Failed");
      }
      toast.success("Announcement deleted");
      setDeleteId(null);
      fetchAnnouncements();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const openEditor = (ann: Announcement) => {
    setEditing(ann);
    setForm({
      title: ann.title, content: ann.content || "", summary: ann.summary || "",
      priority: ann.priority, isActive: ann.isActive, isPinned: ann.isPinned,
      imageUrl: ann.imageUrl || "", linkUrl: ann.linkUrl || "",
      startDate: ann.startDate ? ann.startDate.slice(0, 10) : "",
      endDate: ann.endDate ? ann.endDate.slice(0, 10) : "",
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); };
  const setField = (field: keyof AnnouncementForm, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const pinned = announcements.filter(a => a.isPinned);
  const unpinned = announcements.filter(a => !a.isPinned);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-ink">Announcements</h1>
          <p className="text-muted mt-1">{announcements.length} announcements {pinned.length > 0 ? `· ${pinned.length} pinned` : ""}</p>
        </div>
        <button onClick={() => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); }} className="btn-primary">
          <Plus size={18} /> Add Announcement
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === "Enter") fetchAnnouncements(); }}
            placeholder="Search announcements..." className="input-field pl-10 w-full" />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={closeForm}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 my-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="font-heading text-xl font-bold text-ink">{editing ? "Edit" : "New"} Announcement</h2>
              <button onClick={closeForm} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Title *</label>
                <input value={form.title} onChange={e => setField("title", e.target.value)} required placeholder="Announcement title" className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Summary</label>
                <input value={form.summary} onChange={e => setField("summary", e.target.value)} placeholder="Brief summary for cards" className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Content</label>
                <textarea value={form.content} onChange={e => setField("content", e.target.value)} rows={5} placeholder="Full announcement content" className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map(p => (
                    <button key={p} type="button" onClick={() => setField("priority", p)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${form.priority === p ? PRIORITY_LABELS[p].style + " ring-2 ring-offset-1 ring-navy/20" : "bg-slate-100 text-muted hover:bg-slate-200"}`}>
                      {PRIORITY_LABELS[p].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setField("startDate", e.target.value)} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setField("endDate", e.target.value)} className="input-field w-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Image URL</label>
                <input value={form.imageUrl} onChange={e => setField("imageUrl", e.target.value)} placeholder="https://..." className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Link URL</label>
                <input value={form.linkUrl} onChange={e => setField("linkUrl", e.target.value)} placeholder="https://..." className="input-field w-full" />
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div><label className="text-sm font-semibold text-ink">Active</label><p className="text-xs text-muted">Visible to users</p></div>
                  <button type="button" onClick={() => setField("isActive", !form.isActive)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.isActive ? "bg-emerald-accent" : "bg-slate-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div><label className="text-sm font-semibold text-ink">Pinned</label><p className="text-xs text-muted">Show at the top</p></div>
                  <button type="button" onClick={() => setField("isPinned", !form.isPinned)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.isPinned ? "bg-gold" : "bg-slate-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPinned ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full">
                <Save size={18} /> {saving ? "Saving..." : editing ? "Update Announcement" : "Create Announcement"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Announcement</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Priority</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Created</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Active</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Pinned</th>
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
              ) : announcements.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-muted">No announcements found</td></tr>
              ) : (
                [...pinned, ...unpinned].map(ann => (
                  <tr key={ann.id} className={`hover:bg-slate-50/50 transition-colors ${ann.isPinned ? "bg-gold/[0.03]" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {ann.isPinned && <Pin size={14} className="text-gold" />}
                        <div>
                          <div className="font-semibold text-ink">{ann.title}</div>
                          {ann.summary && <div className="text-xs text-muted mt-0.5 line-clamp-1">{ann.summary}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${PRIORITY_LABELS[ann.priority]?.style || PRIORITY_LABELS[0].style}`}>
                        {PRIORITY_LABELS[ann.priority]?.label || "Low"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">
                      {new Date(ann.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${ann.isActive ? "bg-emerald-accent/10 text-emerald-accent" : "bg-red-50 text-danger"}`}>
                        {ann.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${ann.isPinned ? "bg-gold/15 text-amber-800" : "bg-slate-100 text-muted"}`}>
                        {ann.isPinned ? "Pinned" : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditor(ann)} className="p-2 hover:bg-slate-100 rounded-lg text-muted transition-colors" title="Edit"><Edit size={16} /></button>
                      <button onClick={() => setDeleteId(ann.id)} className="p-2 hover:bg-red-50 rounded-lg text-danger ml-1 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-danger" /></div>
            <h3 className="font-heading text-lg font-bold text-ink text-center">Delete Announcement?</h3>
            <p className="text-muted text-sm text-center mt-2">This announcement will be permanently removed.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 bg-danger text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
