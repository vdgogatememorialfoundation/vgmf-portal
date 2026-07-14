"use client";
import { useState, useEffect } from "react";
import { Save, X, Edit, Eye, EyeOff, PencilLine } from "lucide-react";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  contentType: string;
}

export default function AdminContent() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [form, setForm] = useState({ key: "", value: "", contentType: "text" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/content");
    const data = await res.json();
    setItems(data.content || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/admin/content/${editing.id}` : "/api/admin/content";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    setEditing(null);
    setForm({ key: "", value: "", contentType: "text" });
    fetchItems();
  };

  const openEditor = (item: ContentItem) => {
    setEditing(item);
    setForm({ key: item.key, value: item.value, contentType: item.contentType });
    setShowForm(true);
  };

  const openCreator = () => {
    setEditing(null);
    setForm({ key: "", value: "", contentType: "text" });
    setShowForm(true);
  };

  const publishedCount = items.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">Content</h1>
          <p className="text-muted mt-1">Manage site content key-value pairs</p>
        </div>
        <button onClick={openCreator}
          className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light">
          <PencilLine size={18} /> Add Content
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white rounded-2xl border p-5">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3"><PencilLine size={20} /></div>
          <p className="text-2xl font-heading font-extrabold text-navy">{publishedCount}</p>
          <p className="text-xs text-muted mt-1">Total Content Blocks</p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-3"><Eye size={20} /></div>
          <p className="text-2xl font-heading font-extrabold text-navy">{publishedCount}</p>
          <p className="text-xs text-muted mt-1">Active Keys</p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 mb-3"><EyeOff size={20} /></div>
          <p className="text-2xl font-heading font-extrabold text-navy">0</p>
          <p className="text-xs text-muted mt-1">Archived</p>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-xl font-bold text-navy">{editing ? "Edit" : "Add"} Content</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Key</label>
                <input
                  value={form.key}
                  onChange={e => setForm({ ...form, key: e.target.value })}
                  placeholder="e.g. hero.title"
                  required
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Content Type</label>
                <select
                  value={form.contentType}
                  onChange={e => setForm({ ...form, contentType: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
                >
                  <option value="text">Text</option>
                  <option value="html">HTML</option>
                  <option value="image">Image URL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Value</label>
                {form.contentType === "html" ? (
                  <textarea
                    value={form.value}
                    onChange={e => setForm({ ...form, value: e.target.value })}
                    placeholder="Enter HTML content..."
                    rows={6}
                    required
                    className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20 font-mono"
                  />
                ) : (
                  <textarea
                    value={form.value}
                    onChange={e => setForm({ ...form, value: e.target.value })}
                    placeholder="Enter content value..."
                    rows={4}
                    required
                    className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
                  />
                )}
              </div>
              <button type="submit"
                className="w-full py-2.5 bg-navy text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-navy-light">
                <Save size={18} /> {editing ? "Update" : "Create"} Content
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Key</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Type</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Value</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-muted">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-muted">No content blocks found</td></tr>
            ) : (
              items.map(item => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy font-mono text-xs">{item.key}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 uppercase">{item.contentType}</span>
                  </td>
                  <td className="px-6 py-4 text-muted max-w-xs truncate">{item.value}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditor(item)} className="p-2 hover:bg-gray-100 rounded-lg text-muted" title="Edit"><Edit size={16} /></button>
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
