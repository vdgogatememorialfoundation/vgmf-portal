"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  isPublished: boolean;
}

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", price: 0, stockQuantity: 0, isPublished: true });
  const [search, setSearch] = useState("");

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/products?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", price: 0, stockQuantity: 0, isPublished: true });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const openEditor = (item: Product) => {
    setEditing(item);
    setForm({ name: item.name, price: item.price, stockQuantity: item.stockQuantity, isPublished: item.isPublished });
    setShowForm(true);
  };

  const openCreator = () => {
    setEditing(null);
    setForm({ name: "", price: 0, stockQuantity: 0, isPublished: true });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">Products</h1>
          <p className="text-muted mt-1">{items.length} products</p>
        </div>
        <button onClick={openCreator}
          className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="mb-6">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); }}
          onKeyDown={e => { if (e.key === "Enter") fetchItems(); }}
          placeholder="Search products..."
          className="w-full max-w-md px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-xl font-bold text-navy">{editing ? "Edit" : "Add"} Product</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Product Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                  placeholder="0"
                  required
                  min={0}
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={form.stockQuantity}
                  onChange={e => setForm({ ...form, stockQuantity: Number(e.target.value) })}
                  placeholder="0"
                  required
                  min={0}
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded accent-navy"
                />
                <label htmlFor="isPublished" className="text-sm font-semibold text-navy">Published</label>
              </div>
              <button type="submit"
                className="w-full py-2.5 bg-navy text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-navy-light">
                <Save size={18} /> {editing ? "Update" : "Create"} Product
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Price</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Stock</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-muted">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-muted">No products found</td></tr>
            ) : (
              items.map(item => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{item.name}</td>
                  <td className="px-6 py-4 font-semibold">₹{item.price}</td>
                  <td className="px-6 py-4">{item.stockQuantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${item.isPublished ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditor(item)} className="p-2 hover:bg-gray-100 rounded-lg text-muted" title="Edit"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 ml-1" title="Delete"><Trash2 size={16} /></button>
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
