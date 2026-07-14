import Link from "next/link";
import { Search, ShoppingCart, Truck } from "lucide-react";

const products = [
  { id:"1", slug:"viddha-agnikarma-english", name:"Viddha and Agnikarma Chikitsa (English)", price:450, category:"Books" },
  { id:"2", slug:"viddha-agnikarma-hindi", name:"Viddha and Agnikarma Chikitsa (Hindi)", price:400, category:"Books" },
  { id:"3", slug:"viddha-agnikarma-marathi", name:"Viddha and Agnikarma Chikitsa (Marathi)", price:400, category:"Books" },
];

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Shop</span>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-navy">Ayurvedic Books & Resources</h1>
        <p className="text-muted mt-3">Authentic publications by Vaidya R.B. Gogate</p>
      </div>
      
      {/* Search + Track */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-2xl mx-auto">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-muted" size={20} />
          <input placeholder="Search products..." className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20" />
        </div>
        <Link href="/shop/track" className="flex items-center gap-2 px-4 py-3 border-2 border-navy text-navy font-semibold rounded-xl hover:bg-navy hover:text-white transition-all">
          <Truck size={18} /> Track Order
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex justify-center gap-2 mb-8">
        {["All","Books","CDs","Publications"].map(c => (
          <button key={c} className="px-4 py-2 rounded-full text-sm font-medium border hover:bg-navy hover:text-white hover:border-navy transition-all">{c}</button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="card-hover bg-white rounded-2xl border overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-navy/5 to-gold/10 flex items-center justify-center text-4xl">📚</div>
            <div className="p-5">
              <span className="text-xs text-gold font-semibold uppercase tracking-wider">{p.category}</span>
              <h3 className="font-heading font-bold text-navy mt-1 mb-2">{p.name}</h3>
              <div className="flex justify-between items-center">
                <span className="font-heading text-xl font-extrabold text-navy">₹{p.price}</span>
                <button className="flex items-center gap-1 px-4 py-2 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-navy-light transition-colors"><ShoppingCart size={16} /> Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
