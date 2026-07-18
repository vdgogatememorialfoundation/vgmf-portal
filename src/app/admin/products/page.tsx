"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, X, Save, Search, Package, ImageOff } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  isPublished: boolean;
  isFeatured: boolean;
  sku?: string;
  thumbnailUrl?: string;
  categoryId?: string;
  category?: { id: string; name: string };
  createdAt: string;
}

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  price: number;
  compareAtPrice: number;
  stockQuantity: number;
  isPublished: boolean;
  isFeatured: boolean;
  sku: string;
  categoryId: string;
}

const EMPTY_FORM: ProductForm = {
  name: "", slug: "", description: "", shortDesc: "", price: 0,
  compareAtPrice: 0, stockQuantity: 0, isPublished: true,
  isFeatured: false, sku: "", categoryId: "",
};

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "Product updated" : "Product created");
      closeForm();
      fetchItems();
    } catch {
      toast.error(editing ? "Failed to update product" : "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Product deleted");
      setDeleteId(null);
      fetchItems();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const togglePublished = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !product.isPublished }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(product.isPublished ? "Unpublished" : "Published");
      setItems(prev => prev.map(p => p.id === product.id ? { ...p, isPublished: !p.isPublished } : p));
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openEditor = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name, slug: product.slug || "",
      description: product.description || "", shortDesc: product.shortDesc || "",
      price: product.price, compareAtPrice: product.compareAtPrice || 0,
      stockQuantity: product.stockQuantity, isPublished: product.isPublished,
      isFeatured: product.isFeatured, sku: product.sku || "",
      categoryId: product.categoryId || "",
    });
    setShowForm(true);
  };

  const openCreator = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const setField = (field: keyof ProductForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-ink">Products</h1>
          <p className="text-muted mt-1">{items.length} products in catalog</p>
        </div>
        <button onClick={openCreator} className="btn-primary">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchItems(); }}
            placeholder="Search products by name or SKU..."
            className="input-field pl-10 w-full"
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={closeForm}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 my-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="font-heading text-xl font-bold text-ink">{editing ? "Edit" : "Add New"} Product</h2>
              <button onClick={closeForm} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-ink mb-1.5">Product Name *</label>
                  <input value={form.name} onChange={e => setField("name", e.target.value)} required placeholder="e.g. Viddhakarma Kit" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Price (₹) *</label>
                  <input type="number" value={form.price || ""} onChange={e => setField("price", Number(e.target.value))} required min={0} step={0.01} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Compare at Price (₹)</label>
                  <input type="number" value={form.compareAtPrice || ""} onChange={e => setField("compareAtPrice", Number(e.target.value))} min={0} step={0.01} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Stock Quantity *</label>
                  <input type="number" value={form.stockQuantity || ""} onChange={e => setField("stockQuantity", Number(e.target.value))} required min={0} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">SKU</label>
                  <input value={form.sku} onChange={e => setField("sku", e.target.value)} placeholder="e.g. VGMF-VK-001" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Slug</label>
                  <input value={form.slug} onChange={e => setField("slug", e.target.value)} placeholder="auto-generated" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Category ID</label>
                  <input value={form.categoryId} onChange={e => setField("categoryId", e.target.value)} placeholder="optional" className="input-field w-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Short Description</label>
                <input value={form.shortDesc} onChange={e => setField("shortDesc", e.target.value)} placeholder="Brief product summary" className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setField("description", e.target.value)} rows={4} placeholder="Full product description" className="input-field w-full resize-none" />
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
                <Save size={18} /> {saving ? "Saving..." : editing ? "Update Product" : "Create Product"}
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
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Stock</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-muted">No products found</td></tr>
              ) : (
                items.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.thumbnailUrl ? (
                          <img src={product.thumbnailUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-muted"><ImageOff size={16} /></div>
                        )}
                        <div>
                          <div className="font-semibold text-ink">{product.name}</div>
                          <div className="text-xs text-muted">{product.sku || product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-ink">₹{product.price.toLocaleString("en-IN")}</span>
                      {product.compareAtPrice ? <span className="text-xs text-muted line-through ml-1">₹{product.compareAtPrice.toLocaleString("en-IN")}</span> : null}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${product.stockQuantity <= 0 ? "text-danger" : product.stockQuantity <= 10 ? "text-amber-600" : "text-emerald-600"}`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => togglePublished(product)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${product.isPublished ? "bg-emerald-accent/10 text-emerald-accent" : "bg-slate-100 text-muted"}`}>
                        {product.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditor(product)} className="p-2 hover:bg-slate-100 rounded-lg text-muted transition-colors" title="Edit"><Edit size={16} /></button>
                      <button onClick={() => setDeleteId(product.id)} className="p-2 hover:bg-red-50 rounded-lg text-danger ml-1 transition-colors" title="Delete"><Trash2 size={16} /></button>
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
            <h3 className="font-heading text-lg font-bold text-ink text-center">Delete Product?</h3>
            <p className="text-muted text-sm text-center mt-2">This action cannot be undone. The product will be permanently removed.</p>
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
