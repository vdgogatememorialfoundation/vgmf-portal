"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Edit, Trash2, X, Save, ArrowLeft, Package, CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stockQty: number;
  isActive: boolean;
}

interface Event {
  id: string;
  title: string;
  eventDate: string;
}

export default function EventProductsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQty: "",
    isActive: true,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventRes, productsRes] = await Promise.all([
        fetch(`/api/admin/events/${eventId}`),
        fetch(`/api/admin/events/${eventId}/products`),
      ]);

      if (eventRes.ok) {
        const data = await eventRes.json();
        setEvent(data.event);
      }
      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing
        ? `/api/admin/events/${eventId}/products/${editing.id}`
        : `/api/admin/events/${eventId}/products`;
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "Product updated" : "Product created");
      closeForm();
      fetchData();
    } catch {
      toast.error(editing ? "Failed to update product" : "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/events/${eventId}/products/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Product deleted");
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const openEditor = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      stockQty: String(product.stockQty),
      isActive: product.isActive,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", description: "", price: "", stockQty: "", isActive: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft size={20} className="text-muted" />
        </Link>
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-extrabold text-ink">
            {event?.title || "Event"} — Products
          </h1>
          {event && (
            <p className="text-sm text-muted">
              {new Date(event.eventDate).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          )}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="h-5 bg-slate-100 rounded animate-pulse w-32 mb-3" />
              <div className="h-4 bg-slate-100 rounded animate-pulse w-20 mb-2" />
              <div className="h-4 bg-slate-100 rounded animate-pulse w-16" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package size={40} className="mx-auto text-slate-200 mb-3" />
          <p className="text-muted font-medium">No products yet</p>
          <p className="text-xs text-muted mt-1">Add books and products to sell at this event</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink truncate">{product.name}</h3>
                  {product.description && (
                    <p className="text-xs text-muted mt-1 line-clamp-2">{product.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEditor(product)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                    <Edit size={14} className="text-muted" />
                  </button>
                  <button onClick={() => setDeleteId(product.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} className="text-danger" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-[#0d6662]">₹{product.price.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-muted">Stock: {product.stockQty}</p>
                </div>
                {product.isActive ? (
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg">Active</span>
                ) : (
                  <span className="px-2 py-1 bg-slate-100 text-muted text-xs font-semibold rounded-lg">Inactive</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={closeForm}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 my-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="font-heading text-xl font-bold text-ink">{editing ? "Edit" : "Add"} Product</h2>
              <button onClick={closeForm} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Name *</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="Product name" className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} placeholder="Optional description" className="input-field w-full resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required placeholder="0" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Stock Qty</label>
                  <input type="number" value={form.stockQty} onChange={(e) => setForm((f) => ({ ...f, stockQty: e.target.value }))} placeholder="0" className="input-field w-full" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-ink">Active</label>
                  <p className="text-xs text-muted">Show in POS</p>
                </div>
                <button type="button" onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.isActive ? "bg-emerald-accent" : "bg-slate-300"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? "left-6" : "left-0.5"}`} />
                </button>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full">
                <Save size={18} /> {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-danger" /></div>
            <h3 className="font-heading text-lg font-bold text-ink text-center">Delete Product?</h3>
            <p className="text-muted text-sm text-center mt-2">This action cannot be undone.</p>
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
