"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react";

const initialCart = [
  { id: "1", name: "Viddha and Agnikarma Chikitsa (English)", price: 450, qty: 2 },
  { id: "2", name: "Viddha and Agnikarma Chikitsa (Hindi)", price: 400, qty: 1 },
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <ShoppingCart size={64} className="mx-auto text-muted mb-6" />
      <h1 className="font-heading text-3xl font-extrabold text-navy mb-4">Your Cart is Empty</h1>
      <p className="text-muted mb-8">Looks like you haven&apos;t added any items yet.</p>
      <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-xl">&larr; Browse Products</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy mb-8"><ArrowLeft size={16} /> Continue Shopping</Link>
      <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-2">Shopping Cart</h1>
      <p className="text-muted mb-8">{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border p-5 flex gap-4 items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-navy/5 to-gold/10 rounded-xl flex items-center justify-center text-3xl shrink-0">&#x1F4DA;</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-navy text-sm">{item.name}</h3>
                <p className="font-heading font-bold text-navy mt-1">&#8377;{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50"><Minus size={14} /></button>
                <span className="w-8 text-center text-sm font-semibold text-navy">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50"><Plus size={14} /></button>
              </div>
              <p className="font-heading font-bold text-navy w-20 text-right">&#8377;{item.price * item.qty}</p>
              <button onClick={() => removeItem(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border p-6 h-fit space-y-4">
          <h3 className="font-heading text-lg font-bold text-navy">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="font-semibold text-navy">&#8377;{subtotal}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="font-semibold text-navy">{shipping === 0 ? <span className="text-green-600">Free</span> : <>&#8377;{shipping}</>}</span></div>
            {shipping > 0 && <p className="text-xs text-muted">Add &#8377;{500 - subtotal} more for free shipping</p>}
            <div className="border-t pt-2 flex justify-between"><span className="font-semibold text-navy">Total</span><span className="font-heading text-xl font-extrabold text-navy">&#8377;{total}</span></div>
          </div>
          <Link href="/shop/checkout" className="w-full py-3 bg-gold text-navy font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light transition-all">Proceed to Checkout <ArrowRight size={18} /></Link>
        </div>
      </div>
    </div>
  );
}
