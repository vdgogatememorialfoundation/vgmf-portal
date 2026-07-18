"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, X, Save, Search, Edit, FileText, Code, Image, Bell, Trash2, Link2, Layout, Eye, EyeOff, Loader2, Shield, Users, Scale, ScanLine, Landmark, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  description?: string;
  contentType?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NoticeItem {
  id: string;
  title: string;
  content: string | null;
  noticeType: string;
  position: string;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Portal {
  id: string;
  portalName: string;
  urlPath: string;
  description: string | null;
  isActive: boolean;
  requiredRole: string | null;
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

const TYPE_ICONS: Record<string, React.ReactNode> = {
  text: <FileText size={14} />,
  html: <Code size={14} />,
  image: <Image size={14} />,
};

const TYPE_STYLES: Record<string, string> = {
  text: "bg-blue-50 text-blue-700",
  html: "bg-violet-50 text-violet-700",
  image: "bg-pink-50 text-pink-700",
};

const NOTICE_TYPES = ["info", "warning", "urgent", "promo"];
const NOTICE_POSITIONS = ["below-header", "above-hero", "popup"];
const NOTICE_TYPE_STYLES: Record<string, string> = {
  info: "bg-teal-50 text-teal-700 border-teal-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  urgent: "bg-red-50 text-red-700 border-red-200",
  promo: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function AdminContent() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [portals, setPortals] = useState<Portal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [editingPortal, setEditingPortal] = useState<Portal | null>(null);
  const [form, setForm] = useState({ key: "", value: "", description: "", contentType: "text" });
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: "",
    noticeType: "info",
    position: "below-header",
    isActive: true,
    startDate: "",
    endDate: "",
    sortOrder: 0,
  });
  const [portalForm, setPortalForm] = useState<Partial<Portal>>({});
  const [search, setSearch] = useState("");
  const [noticeSearch, setNoticeSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "notices" | "portals" | "homepage">("content");
  const [homeSections, setHomeSections] = useState<Record<string, boolean>>({
    whoWeServe: true,
    eventGallery: true,
    articles: true,
    reviews: true,
    stats: true,
    announcements: true,
  });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const allItems = Array.isArray(data) ? data : data.content || data.items || [];
      setItems(allItems);
    } catch {
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notices");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setNotices(data.items || []);
    } catch {
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPortals = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/portals");
      if (res.ok) {
        const data = await res.json();
        setPortals(data);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (activeTab === "content") {
      fetchItems();
    } else if (activeTab === "notices") {
      fetchNotices();
    } else if (activeTab === "portals") {
      fetchPortals();
    }
  }, [activeTab, fetchItems, fetchNotices, fetchPortals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "Content updated" : "Content saved");
      closeForm();
      fetchItems();
    } catch {
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...noticeForm,
        startDate: noticeForm.startDate ? new Date(noticeForm.startDate).toISOString() : null,
        endDate: noticeForm.endDate ? new Date(noticeForm.endDate).toISOString() : null,
      };
      const url = editingNotice ? `/api/admin/notices/${editingNotice.id}` : "/api/admin/notices";
      const method = editingNotice ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(editingNotice ? "Notice updated" : "Notice created");
      closeNoticeForm();
      fetchNotices();
    } catch {
      toast.error("Failed to save notice");
    } finally {
      setSaving(false);
    }
  };

  const openEditor = (item: ContentItem) => {
    setEditing(item);
    setForm({ key: item.key, value: item.value, description: item.description || "", contentType: item.contentType || "text" });
    setShowForm(true);
  };

  const openCreator = () => {
    setEditing(null);
    setForm({ key: "", value: "", description: "", contentType: "text" });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ key: "", value: "", description: "", contentType: "text" });
  };

  const openNoticeEditor = (notice: NoticeItem) => {
    setEditingNotice(notice);
    setNoticeForm({
      title: notice.title,
      content: notice.content || "",
      noticeType: notice.noticeType,
      position: notice.position,
      isActive: notice.isActive,
      startDate: notice.startDate ? notice.startDate.substring(0, 16) : "",
      endDate: notice.endDate ? notice.endDate.substring(0, 16) : "",
      sortOrder: notice.sortOrder,
    });
    setShowNoticeForm(true);
  };

  const openNoticeCreator = () => {
    setEditingNotice(null);
    setNoticeForm({
      title: "",
      content: "",
      noticeType: "info",
      position: "below-header",
      isActive: true,
      startDate: "",
      endDate: "",
      sortOrder: 0,
    });
    setShowNoticeForm(true);
  };

  const closeNoticeForm = () => {
    setShowNoticeForm(false);
    setEditingNotice(null);
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    try {
      const res = await fetch(`/api/admin/notices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Notice deleted");
      fetchNotices();
    } catch {
      toast.error("Failed to delete notice");
    }
  };

  const savePortal = async () => {
    if (!editingPortal || !portalForm.portalName) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/portals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPortal.id,
          portalName: portalForm.portalName,
          description: portalForm.description,
          isActive: portalForm.isActive,
          requiredRole: portalForm.requiredRole,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Portal updated");
      setEditingPortal(null);
      fetchPortals();
    } catch {
      toast.error("Failed to update portal");
    } finally {
      setSaving(false);
    }
  };

  const togglePortal = async (portal: Portal) => {
    try {
      const res = await fetch("/api/admin/portals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: portal.id, portalName: portal.portalName, isActive: !portal.isActive }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Portal ${!portal.isActive ? "enabled" : "disabled"}`);
      fetchPortals();
    } catch {
      toast.error("Failed to update portal");
    }
  };

  const toggleHomeSection = (section: string) => {
    setHomeSections(prev => ({ ...prev, [section]: !prev[section] }));
    toast.success(`Section ${homeSections[section as keyof typeof homeSections] ? "hidden" : "shown"} from homepage`);
  };

  const filteredItems = items.filter(item =>
    item.key.toLowerCase().includes(search.toLowerCase()) ||
    item.value.toLowerCase().includes(search.toLowerCase()) ||
    (item.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
    (notice.content || "").toLowerCase().includes(noticeSearch.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-ink">Site Content</h1>
          <p className="text-muted mt-1">Manage key-value content blocks and notices</p>
        </div>
        <button
          onClick={() => activeTab === "content" ? openCreator() : openNoticeCreator()}
          className="btn-primary"
        >
          <Plus size={18} /> Add {activeTab === "content" ? "Content" : "Notice"}
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "content"
              ? "border-teal text-teal"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <FileText size={14} className="inline mr-1.5" />
          Content
        </button>
        <button
          onClick={() => setActiveTab("notices")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "notices"
              ? "border-teal text-teal"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Bell size={14} className="inline mr-1.5" />
          Notices
        </button>
        <button
          onClick={() => setActiveTab("portals")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "portals"
              ? "border-teal text-teal"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Link2 size={14} className="inline mr-1.5" />
          Portal Links
        </button>
        <button
          onClick={() => setActiveTab("homepage")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "homepage"
              ? "border-teal text-teal"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Layout size={14} className="inline mr-1.5" />
          Home Sections
        </button>
      </div>

      {activeTab === "content" ? (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: FileText, label: "Total Keys", value: items.length, color: "bg-blue-50 text-blue-600" },
              { icon: Code, label: "HTML Blocks", value: items.filter(i => i.contentType === "html").length, color: "bg-violet-50 text-violet-600" },
              { icon: Image, label: "Image URLs", value: items.filter(i => i.contentType === "image").length, color: "bg-pink-50 text-pink-600" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}><s.icon size={20} /></div>
                <p className="text-2xl font-heading font-extrabold text-ink">{s.value}</p>
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter keys or values..." className="input-field pl-10 w-full" />
            </div>
          </div>
        </>
      ) : (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={noticeSearch} onChange={e => setNoticeSearch(e.target.value)} placeholder="Filter notices..." className="input-field pl-10 w-full" />
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeForm}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="font-heading text-xl font-bold text-ink">{editing ? "Edit" : "Add"} Content</h2>
              <button onClick={closeForm} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Key *</label>
                <input
                  value={form.key} onChange={e => setForm({ ...form, key: e.target.value })}
                  required placeholder="e.g. hero.title, footer.phone" disabled={!!editing}
                  className="input-field w-full font-mono text-xs disabled:bg-slate-50 disabled:text-muted"
                />
                {editing && <p className="text-xs text-muted mt-1">Key cannot be changed after creation</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Content Type</label>
                <div className="flex gap-2">
                  {["text", "html", "image"].map(t => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, contentType: t })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${form.contentType === t ? TYPE_STYLES[t] + " ring-2 ring-offset-1 ring-navy/20" : "bg-slate-100 text-muted hover:bg-slate-200"}`}>
                      {TYPE_ICONS[t]} {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of this content block" className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Value *</label>
                {form.contentType === "html" ? (
                  <textarea value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                    rows={8} required placeholder="Enter HTML content..." className="input-field w-full font-mono text-xs" />
                ) : (
                  <textarea value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                    rows={4} required placeholder="Enter content value..." className="input-field w-full" />
                )}
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full">
                <Save size={18} /> {saving ? "Saving..." : editing ? "Update Content" : "Save Content"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showNoticeForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeNoticeForm}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="font-heading text-xl font-bold text-ink">{editingNotice ? "Edit" : "Add"} Notice</h2>
              <button onClick={closeNoticeForm} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleNoticeSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Title *</label>
                <input
                  value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  required placeholder="Notice title" className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Content</label>
                <textarea
                  value={noticeForm.content} onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  rows={3} placeholder="Optional detailed content..." className="input-field w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Type</label>
                  <select
                    value={noticeForm.noticeType} onChange={e => setNoticeForm({ ...noticeForm, noticeType: e.target.value })}
                    className="input-field w-full"
                  >
                    {NOTICE_TYPES.map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Position</label>
                  <select
                    value={noticeForm.position} onChange={e => setNoticeForm({ ...noticeForm, position: e.target.value })}
                    className="input-field w-full"
                  >
                    {NOTICE_POSITIONS.map(p => (
                      <option key={p} value={p}>{p.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Sort Order</label>
                <input
                  type="number"
                  value={noticeForm.sortOrder} onChange={e => setNoticeForm({ ...noticeForm, sortOrder: parseInt(e.target.value) || 0 })}
                  className="input-field w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Start Date</label>
                  <input
                    type="datetime-local"
                    value={noticeForm.startDate} onChange={e => setNoticeForm({ ...noticeForm, startDate: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">End Date</label>
                  <input
                    type="datetime-local"
                    value={noticeForm.endDate} onChange={e => setNoticeForm({ ...noticeForm, endDate: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={noticeForm.isActive} onChange={e => setNoticeForm({ ...noticeForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-teal focus:ring-teal"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-ink">Active</label>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full">
                <Save size={18} /> {saving ? "Saving..." : editingNotice ? "Update Notice" : "Create Notice"}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "content" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Key</th>
                  <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Description</th>
                  <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Value</th>
                  <th className="text-right px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : filteredItems.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-16 text-muted">No content blocks found</td></tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-navy">{item.key}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${TYPE_STYLES[item.contentType || "text"]}`}>
                          {TYPE_ICONS[item.contentType || "text"]} {(item.contentType || "text").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted text-xs max-w-[200px] truncate">{item.description || "—"}</td>
                      <td className="px-6 py-4 text-muted text-xs max-w-xs truncate">{item.value}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEditor(item)} className="p-2 hover:bg-slate-100 rounded-lg text-muted transition-colors" title="Edit"><Edit size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="h-4 bg-slate-100 rounded animate-pulse w-1/3 mb-2" />
                <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
              </div>
            ))
          ) : filteredNotices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <Bell size={48} className="text-muted/30 mx-auto mb-4" />
              <p className="text-muted">No notices found</p>
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <Bell size={48} className="text-muted/30 mx-auto mb-4" />
              <p className="text-muted">No notices found</p>
            </div>
          ) : (
            filteredNotices.map(notice => (
              <div key={notice.id} className={`bg-white rounded-2xl border p-5 ${notice.isActive ? "border-slate-200" : "border-slate-200 opacity-60"}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notice.isActive ? NOTICE_TYPE_STYLES[notice.noticeType] : "bg-slate-100 text-slate-400"}`}>
                    <Bell size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold text-ink">{notice.title}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${notice.isActive ? NOTICE_TYPE_STYLES[notice.noticeType] : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                        {notice.noticeType}
                      </span>
                      <span className="text-[10px] text-muted px-2 py-0.5 bg-slate-100 rounded-full">
                        {notice.position.replace("-", " ")}
                      </span>
                      {!notice.isActive && (
                        <span className="text-[10px] text-muted px-2 py-0.5 bg-slate-100 rounded-full">Inactive</span>
                      )}
                    </div>
                    {notice.content && (
                      <p className="text-xs text-muted line-clamp-2">{notice.content}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted">
                      {notice.startDate && <span>From: {new Date(notice.startDate).toLocaleDateString()}</span>}
                      {notice.endDate && <span>Until: {new Date(notice.endDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openNoticeEditor(notice)} className="p-2 hover:bg-slate-100 rounded-lg text-muted transition-colors" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteNotice(notice.id)} className="p-2 hover:bg-red-50 rounded-lg text-muted hover:text-red-600 transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "portals" && (
        <div className="space-y-4">
          <p className="text-sm text-muted">Manage portal access. Disabled portals will show an error message to users attempting to log in.</p>
          {portals.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Link2 size={40} className="text-muted/30 mx-auto mb-3" />
              <p className="text-sm text-muted">No portals configured yet.</p>
            </div>
          ) : (
            portals.map(portal => {
              const Icon = PORTAL_ICONS[portal.portalName] || Link2;
              const isEditing = editingPortal?.id === portal.id;
              return (
                <div key={portal.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-muted mb-1">Portal Name</label>
                          <input value={portalForm.portalName || ""} disabled className="input-field w-full text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted mb-1">Required Role</label>
                          <select
                            value={portalForm.requiredRole || ""}
                            onChange={e => setPortalForm({ ...portalForm, requiredRole: e.target.value || null })}
                            className="input-field w-full text-sm"
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
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-muted mb-1">Description</label>
                          <input
                            value={portalForm.description || ""}
                            onChange={e => setPortalForm({ ...portalForm, description: e.target.value })}
                            className="input-field w-full text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-ink">Active</span>
                          <button onClick={() => setPortalForm({ ...portalForm, isActive: !portalForm.isActive })}
                            className={`relative w-10 h-5 rounded-full transition-colors ${portalForm.isActive ? "bg-emerald-accent" : "bg-slate-300"}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${portalForm.isActive ? "left-5" : "left-0.5"}`} />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingPortal(null)} className="btn-outline !py-1.5 !px-3 text-xs">Cancel</button>
                          <button onClick={savePortal} disabled={saving} className="btn-primary !py-1.5 !px-3 text-xs">
                            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${portal.isActive ? "bg-teal/10 text-teal" : "bg-slate-100 text-muted"}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-ink capitalize">{portal.portalName}</h3>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${portal.isActive ? "bg-emerald-accent/10 text-emerald-accent" : "bg-slate-100 text-muted"}`}>
                              {portal.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-xs text-muted">{portal.description || portal.urlPath}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => togglePortal(portal)} className={`p-2 rounded-lg transition-colors ${portal.isActive ? "hover:bg-red-50 text-muted" : "hover:bg-emerald-50 text-emerald-accent"}`}>
                          {portal.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button onClick={() => { setEditingPortal(portal); setPortalForm({ ...portal }); }} className="p-2 hover:bg-slate-100 rounded-lg text-muted">
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "homepage" && (
        <div className="space-y-4">
          <p className="text-sm text-muted">Enable or disable sections displayed on the homepage.</p>
          {[
            { key: "whoWeServe", label: "Who We Serve", desc: "Displays target audience and stakeholders" },
            { key: "eventGallery", label: "Event Gallery", desc: "Shows upcoming and past events" },
            { key: "articles", label: "Articles", desc: "Displays latest articles and blog posts" },
            { key: "reviews", label: "Reviews", desc: "Shows user testimonials and reviews" },
            { key: "stats", label: "Statistics", desc: "Displays platform statistics and metrics" },
            { key: "announcements", label: "Announcements", desc: "Shows latest announcements and notices" },
          ].map(section => (
            <div key={section.key} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-muted">
                  <Layout size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">{section.label}</h3>
                  <p className="text-xs text-muted">{section.desc}</p>
                </div>
              </div>
              <button
                onClick={() => toggleHomeSection(section.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${homeSections[section.key as keyof typeof homeSections] ? "bg-emerald-accent" : "bg-slate-300"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${homeSections[section.key as keyof typeof homeSections] ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
