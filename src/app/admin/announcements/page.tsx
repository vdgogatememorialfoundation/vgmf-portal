"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save, Pin } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  isActive: boolean;
  isPinned: boolean;
  createdAt: string;
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ title: "", isActive: true, isPinned: false });
  const [search, setSearch] = useState("");

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/announcements?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setAnnouncements(data.items || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/admin/announcements/${editing.id}` : "/api/admin/announcements";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", isActive: true, isPinned: false });
    fetchAnnouncements();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    fetchAnnouncements();
  };

  const openEditor = (announcement: Announcement) => {
    setEditing(announcement);
    setForm({ title: announcement.title, isActive: announcement.isActive, isPinned: announcement.isPinned });
    setShowForm(true);
  };

  const openCreator = () => {
    setEditing(null);
    setForm({ title: "", isActive: true, isPinned: false });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">Announcements</h1>
          <p className="text-muted mt-1">{announcements.length} announcements</p>
        </div>
        <button onClick={openCreator}
          className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light">
          <Plus size={18} /> Add Announcement
        </button>
      </div>

      <div className="mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") fetchAnnouncements(); }}
          placeholder="Search announcements..."
          className="w-full max-w-md px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-xl font-bold text-navy">{editing ? "Edit" : "Add"} Announcement</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Announcement title"
                  required
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="annActive"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded accent-navy"
                />
                <label htmlFor="annActive" className="text-sm font-semibold text-navy">Active</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="annPinned"
                  checked={form.isPinned}
                  onChange={e => setForm({ ...form, isPinned: e.target.checked })}
                  className="w-4 h-4 rounded accent-navy"
                />
                <label htmlFor="annPinned" className="text-sm font-semibold text-navy">Pinned</label>
              </div>
              <button type="submit"
                className="w-full py-2.5 bg-navy text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-navy-light">
                <Save size={18} /> {editing ? "Update" : "Create"} Announcement
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Title</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Created</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Active</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Pinned</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-muted">Loading...</td></tr>
            ) : announcements.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-muted">No announcements found</td></tr>
            ) : (
              announcements.map(ann => (
                <tr key={ann.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy flex items-center gap-2">
                    {ann.isPinned && <Pin size={14} className="text-gold" />}
                    {ann.title}
                  </td>
                  <td className="px-6 py-4 text-muted">{new Date(ann.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${ann.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {ann.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${ann.isPinned ? "bg-gold/20 text-navy" : "bg-gray-100 text-gray-500"}`}>
                      {ann.isPinned ? "Pinned" : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditor(ann)} className="p-2 hover:bg-gray-100 rounded-lg text-muted" title="Edit"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(ann.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 ml-1" title="Delete"><Trash2 size={16} /></button>
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
