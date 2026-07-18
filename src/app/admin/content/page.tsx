"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, X, Save, Search, Edit, FileText, Code, Image } from "lucide-react";
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

export default function AdminContent() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [form, setForm] = useState({ key: "", value: "", description: "", contentType: "text" });
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

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

  useEffect(() => { fetchItems(); }, [fetchItems]);

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

  const filteredItems = items.filter(item =>
    item.key.toLowerCase().includes(search.toLowerCase()) ||
    item.value.toLowerCase().includes(search.toLowerCase()) ||
    (item.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-ink">Site Content</h1>
          <p className="text-muted mt-1">Manage key-value content blocks for the site</p>
        </div>
        <button onClick={openCreator} className="btn-primary">
          <Plus size={18} /> Add Content
        </button>
      </div>

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
    </div>
  );
}
