"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Package, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface ProductImage {
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  isPublished: boolean;
  isFeatured: boolean;
  thumbnailUrl?: string;
  category: { id: string; name: string; slug: string };
  images: ProductImage[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  thumbnailUrl?: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
    loadCartCount();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      const published = (data.items || data.products || []).filter(
        (p: Product) => p.isPublished
      );
      setProducts(published);
      const catMap = new Map<string, { id: string; name: string; slug: string }>();
      published.forEach((p: Product) => {
        if (p.category) catMap.set(p.category.id, p.category);
      });
      setCategories(Array.from(catMap.values()));
    } catch {
      setError("Unable to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = () => {
    try {
      const raw = localStorage.getItem("vgmf_cart");
      if (raw) {
        const cart: CartItem[] = JSON.parse(raw);
        setCartCount(cart.reduce((sum, i) => sum + i.qty, 0));
      }
    } catch {}
  };

  const addToCart = (product: Product) => {
    try {
      const raw = localStorage.getItem("vgmf_cart");
      const cart: CartItem[] = raw ? JSON.parse(raw) : [];
      const existing = cart.find((i) => i.id === product.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          thumbnailUrl: product.thumbnailUrl,
        });
      }
      localStorage.setItem("vgmf_cart", JSON.stringify(cart));
      setCartCount(cart.reduce((sum, i) => sum + i.qty, 0));
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || p.category?.id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
          Shop
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-ink">
          Ayurvedic Books & Resources
        </h1>
        <p className="text-muted mt-3">
          Authentic publications by Vaidya R.B. Gogate
        </p>
      </div>

      {/* Search + Cart */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-3xl mx-auto">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3.5 text-muted" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="input-field !pl-10"
          />
        </div>
        <Link
          href="/shop/cart"
          className="btn-primary !py-3 relative"
        >
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-white text-xs font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            selectedCategory === "all"
              ? "bg-teal text-white shadow-lg shadow-teal/20"
              : "bg-white border border-ink/10 text-ink/60 hover:border-teal hover:text-teal"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === cat.id
                ? "bg-teal text-white shadow-lg shadow-teal/20"
                : "bg-white border border-ink/10 text-ink/60 hover:border-teal hover:text-teal"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={40} className="text-teal animate-spin mb-4" />
          <p className="text-muted font-medium">Loading products...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle size={40} className="text-maroon mb-4" />
          <p className="text-muted font-medium mb-4">{error}</p>
          <button onClick={fetchProducts} className="btn-primary text-sm">
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-muted mb-4" />
          <p className="text-muted font-medium">
            {searchQuery || selectedCategory !== "all"
              ? "No products match your filters."
              : "No products available yet."}
          </p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="card-hover bg-white rounded-2xl border border-ink/5 overflow-hidden"
            >
              <div className="h-52 bg-gradient-to-br from-ink/5 to-gold/10 flex items-center justify-center overflow-hidden">
                {product.thumbnailUrl || product.images?.[0]?.imageUrl ? (
                  <img
                    src={product.thumbnailUrl || product.images[0].imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={48} className="text-ink/15" />
                )}
              </div>
              <div className="p-5">
                {product.category && (
                  <span className="text-xs text-gold font-semibold uppercase tracking-wider">
                    {product.category.name}
                  </span>
                )}
                <h3 className="font-heading font-bold text-ink mt-1 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-muted mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-xl font-extrabold text-ink">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.compareAtPrice &&
                      product.compareAtPrice > product.price && (
                        <span className="text-sm text-muted line-through">
                          ₹{product.compareAtPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stockQuantity <= 0}
                    className="btn-primary !py-2 !px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={14} />
                    {product.stockQuantity > 0 ? "Add" : "Out of Stock"}
                  </button>
                </div>
                {product.stockQuantity > 0 &&
                  product.stockQuantity <= product.stockQuantity && (
                    <p className="text-xs text-muted mt-2">
                      {product.stockQuantity <= 5
                        ? `Only ${product.stockQuantity} left`
                        : "In stock"}
                    </p>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
