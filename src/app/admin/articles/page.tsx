"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, X, Save, Search, BookOpen, Star } from "lucide-react";
import toast from "react-hot-toast";

interface Article {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  category?: string;
  authorName?: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
}

interface ArticleForm {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  authorName: string;
  isPublished: boolean;
  isFeatured: boolean;
}

const EMPTY_FORM: ArticleForm = {
  title: "", slug: "", content: "", excerpt: "",
  category: "", authorName: "", isPublished: true, isFeatured: false,
};

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/articles?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setArticles(data.items || []);
    } catch {
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/admin/articles/${editing.id}` : "/api/admin/articles";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "Article updated" : "Article created");
      closeForm();
      fetchArticles();
    } catch {
      toast.error(editing ? "Failed to update article" : "Failed to create article");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/articles/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Article deleted");
      setDeleteId(null);
      fetchArticles();
    } catch {
      toast.error("Failed to delete article");
    }
  };

  const openEditor = (article: Article) => {
    setEditing(article);
    setForm({
      title: article.title, slug: article.slug || "",
      content: article.content || "", excerpt: article.excerpt || "",
      category: article.category || "", authorName: article.authorName || "",
      isPublished: article.isPublished, isFeatured: article.isFeatured,
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); };
  const setField = (field: keyof ArticleForm, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-ink">Articles</h1>
          <p className="text-muted mt-1">{articles.length} articles published</p>
        </div>
        <button onClick={() => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); }} className="btn-primary">
          <Plus size={18} /> Add Article
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === "Enter") fetchArticles(); }}
            placeholder="Search articles..." className="input-field pl-10 w-full" />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={closeForm}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 my-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="font-heading text-xl font-bold text-ink">{editing ? "Edit" : "Write New"} Article</h2>
              <button onClick={closeForm} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-ink mb-1.5">Title *</label>
                  <input value={form.title} onChange={e => setField("title", e.target.value)} required placeholder="Article title" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Category</label>
                  <input value={form.category} onChange={e => setField("category", e.target.value)} placeholder="e.g. Ayurveda, Research, News" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Author Name</label>
                  <input value={form.authorName} onChange={e => setField("authorName", e.target.value)} placeholder="Author name" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Slug</label>
                  <input value={form.slug} onChange={e => setField("slug", e.target.value)} placeholder="auto-generated" className="input-field w-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Excerpt</label>
                <textarea value={form.excerpt} onChange={e => setField("excerpt", e.target.value)} rows={2} placeholder="Brief summary for cards and SEO" className="input-field w-full resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Content</label>
                <textarea value={form.content} onChange={e => setField("content", e.target.value)} rows={10} placeholder="Write article content here (supports HTML)..." className="input-field w-full font-mono text-xs" />
              </div>
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPublished} onChange={e => setField("isPublished", e.target.checked)} className="w-4 h-4 rounded accent-navy" />
                  <span className="text-sm font-semibold text-ink">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setField("isFeatured", e.target.checked)} className="w-4 h-4 rounded accent-navy" />
                  <span className="text-sm font-semibold text-ink">Featured</span>
                </label>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full">
                <Save size={18} /> {saving ? "Saving..." : editing ? "Update Article" : "Publish Article"}
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
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Article</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Author</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Created</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Status</th>
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
              ) : articles.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-muted">No articles found</td></tr>
              ) : (
                articles.map(article => (
                  <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-ink">{article.title}</div>
                        {article.isFeatured && <Star size={14} className="text-gold fill-gold" />}
                      </div>
                      <div className="text-xs text-muted mt-0.5">{article.viewCount} views</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-ink-soft">{article.category || "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-muted text-sm">{article.authorName || "—"}</td>
                    <td className="px-6 py-4 text-muted text-xs">
                      {new Date(article.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${article.isPublished ? "bg-emerald-accent/10 text-emerald-accent" : "bg-slate-100 text-muted"}`}>
                        {article.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditor(article)} className="p-2 hover:bg-slate-100 rounded-lg text-muted transition-colors" title="Edit"><Edit size={16} /></button>
                      <button onClick={() => setDeleteId(article.id)} className="p-2 hover:bg-red-50 rounded-lg text-danger ml-1 transition-colors" title="Delete"><Trash2 size={16} /></button>
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
            <h3 className="font-heading text-lg font-bold text-ink text-center">Delete Article?</h3>
            <p className="text-muted text-sm text-center mt-2">This article will be permanently removed. This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
