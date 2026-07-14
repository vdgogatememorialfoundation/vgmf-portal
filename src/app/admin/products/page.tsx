import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

const products = [
  { id: "1", name: "Viddha and Agnikarma Chikitsa (English)", sku: "VGMF-BK-EN-001", price: 450, stock: 100, published: true },
  { id: "2", name: "Viddha and Agnikarma Chikitsa (Hindi)", sku: "VGMF-BK-HI-001", price: 400, stock: 80, published: true },
  { id: "3", name: "Viddha and Agnikarma Chikitsa (Marathi)", sku: "VGMF-BK-MR-001", price: 400, stock: 60, published: true },
];

export default function AdminProducts() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="font-heading text-3xl font-extrabold text-navy">Products</h1><p className="text-muted mt-1">Manage your product catalog</p></div>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light"><Plus size={18} /> Add Product</Link>
      </div>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr><th className="text-left px-6 py-4 font-semibold text-navy">Product</th><th className="text-left px-6 py-4 font-semibold text-navy">SKU</th><th className="text-left px-6 py-4 font-semibold text-navy">Price</th><th className="text-left px-6 py-4 font-semibold text-navy">Stock</th><th className="text-left px-6 py-4 font-semibold text-navy">Status</th><th className="text-right px-6 py-4 font-semibold text-navy">Actions</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-navy">{p.name}</td>
                <td className="px-6 py-4 text-muted">{p.sku}</td>
                <td className="px-6 py-4 font-semibold">₹{p.price}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${p.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{p.published ? "Published" : "Draft"}</span></td>
                <td className="px-6 py-4 text-right"><button className="p-2 hover:bg-gray-100 rounded-lg text-muted"><Edit size={16} /></button><button className="p-2 hover:bg-red-50 rounded-lg text-red-500 ml-1"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
