"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Trash2, Minus, Plus, ArrowRight, Package } from "lucide-react";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  thumbnailUrl?: string;
}

const CART_KEY = "vgmf_cart";
const TAX_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  const persistCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
  };

  const updateQty = (id: string, delta: number) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    persistCart(updated);
  };

  const removeItem = (id: string) => {
    const item = cart.find((i) => i.id === id);
    persistCart(cart.filter((i) => i.id !== id));
    if (item) toast.success(`${item.name} removed`);
  };

  const clearCart = () => {
    persistCart([]);
    toast.success("Cart cleared");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  if (!hydrated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-gray-100 p-12 shadow-sm">
          <div className="w-20 h-20 bg-[#0891b2]/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={36} className="text-muted" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-navy mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-muted mb-8 max-w-sm mx-auto">
            Looks like you haven&apos;t added any items yet. Browse our collection of
            Ayurvedic books and resources.
          </p>
          <Link href="/shop" className="btn-primary">
            <ArrowLeft size={18} />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Continue Shopping
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy">
            Shopping Cart
          </h1>
          <p className="text-muted mt-1">
            {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-danger font-medium hover:text-danger/80 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 items-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-navy/5 to-gold/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={28} className="text-navy/20" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-navy text-sm truncate">
                  {item.name}
                </h3>
                <p className="font-heading font-bold text-navy mt-1">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item.id, -1)}
                  disabled={item.qty <= 1}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-bold text-navy">
                  {item.qty}
                </span>
                <button
                  onClick={() => updateQty(item.id, 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <p className="font-heading font-bold text-navy w-24 text-right">
                ₹{(item.price * item.qty).toLocaleString("en-IN")}
              </p>

              <button
                onClick={() => removeItem(item.id)}
                className="p-2 hover:bg-red-50 rounded-lg text-danger transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24 space-y-5">
          <h3 className="font-heading text-lg font-bold text-navy">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold text-navy">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tax (18% GST)</span>
              <span className="font-semibold text-navy">
                ₹{tax.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="font-semibold">
                {shipping === 0 ? (
                  <span className="text-emerald-accent">Free</span>
                ) : (
                  <span className="text-navy">
                    ₹{shipping}
                  </span>
                )}
              </span>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-muted bg-gold/10 rounded-lg p-2">
                Add ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("en-IN")} more
                for free shipping
              </p>
            )}

            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="font-semibold text-navy">Total</span>
              <span className="font-heading text-xl font-extrabold text-navy">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <Link
            href="/shop/checkout"
            className="btn-gold w-full justify-center !py-3"
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/shop"
            className="btn-outline w-full justify-center !py-3 text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
