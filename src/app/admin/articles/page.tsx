"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState({ title: "", category: "", isPublished: true });
  const [search, setSearch] = useState("");

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/articles?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setArticles(data.articles || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/admin/articles/${editing.id}` : "/api/admin/articles";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", category: "", isPublished: true });
    fetchArticles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    fetchArticles();
  };

  const openEditor = (article: Article) => {
    setEditing(article);
    setForm({ title: article.title, category: article.category, isPublished: article.isPublished });
    setShowForm(true);
  };

  const openCreator = () => {
    setEditing(null);
    setForm({ title: "", category: "", isPublished: true });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">Articles</h1>
          <p className="text-muted mt-1">{articles.length} articles</p>
        </div>
        <button onClick={openCreator}
          className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light">
          <Plus size={18} /> Add Article
        </button>
      </div>

      <div className="mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") fetchArticles(); }}
          placeholder="Search articles..."
          className="w-full max-w-md px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-xl font-bold text-navy">{editing ? "Edit" : "Add"} Article</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Article title"
                  required
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Category</label>
                <input
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Ayurveda, Research, News"
                  required
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="artPublished"
                  checked={form.isPublished}
                  onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded accent-navy"
                />
                <label htmlFor="artPublished" className="text-sm font-semibold text-navy">Published</label>
              </div>
              <button type="submit"
                className="w-full py-2.5 bg-navy text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-navy-light">
                <Save size={18} /> {editing ? "Update" : "Create"} Article
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
              <th className="text-left px-6 py-4 font-semibold text-navy">Category</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Created</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-muted">Loading...</td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-muted">No articles found</td></tr>
            ) : (
              articles.map(article => (
                <tr key={article.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{article.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600">{article.category}</span>
                  </td>
                  <td className="px-6 py-4 text-muted">{new Date(article.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${article.isPublished ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {article.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditor(article)} className="p-2 hover:bg-gray-100 rounded-lg text-muted" title="Edit"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(article.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 ml-1" title="Delete"><Trash2 size={16} /></button>
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
