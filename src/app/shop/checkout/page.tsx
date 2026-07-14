"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Shield, Lock } from "lucide-react";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", paymentMethod: "upi" });
  const [placed, setPlaced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (step === 1) { setStep(2); } else { setPlaced(true); } };

  if (placed) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl border p-10">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600 text-2xl">&check;</div>
        <h1 className="font-heading text-3xl font-extrabold text-navy mb-4">Order Placed!</h1>
        <p className="text-muted mb-2">Your order number is <strong className="text-navy">VGMF-{new Date().toISOString().slice(0,10).replace(/-/g,"")}-A1B2</strong></p>
        <p className="text-muted mb-6">A confirmation email has been sent. Track your order anytime.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop/track" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-xl">Track Order</Link>
          <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 border border-navy text-navy font-semibold rounded-xl">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/shop/cart" className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy mb-8"><ArrowLeft size={16} /> Back to Cart</Link>
      <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-8">Checkout</h1>

      <div className="flex items-center gap-4 mb-8">
        {["Shipping","Payment"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i ? "bg-green-500 text-white" : step === i + 1 ? "bg-navy text-white" : "bg-gray-100 text-muted"}`}>
              {step > i ? <>&check;</> : i + 1}
            </div>
            <span className={`text-sm font-semibold ${step >= i + 1 ? "text-navy" : "text-muted"}`}>{s}</span>
            {i === 0 && <div className="w-12 h-px bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl border p-8 space-y-5">
          {step === 1 && (
            <>
              <h3 className="font-heading text-lg font-bold text-navy mb-2">Shipping Address</h3>
              {[
                { key: "fullName", label: "Full Name", type: "text" },
                { key: "email", label: "Email Address", type: "email" },
                { key: "phone", label: "Phone Number", type: "tel" },
                { key: "address", label: "Address", type: "text" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} required className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: "city", label: "City" },
                  { key: "state", label: "State" },
                  { key: "pincode", label: "Pincode" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} required className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
                  </div>
                ))}
              </div>
              <button type="submit" className="w-full py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light">Continue to Payment</button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="font-heading text-lg font-bold text-navy mb-2">Payment Method</h3>
              {[
                { value: "upi", label: "UPI (Google Pay / PhonePe)", icon: <CreditCard size={20} /> },
                { value: "card", label: "Credit / Debit Card", icon: <CreditCard size={20} /> },
                { value: "netbanking", label: "Net Banking", icon: <Shield size={20} /> },
              ].map(opt => (
                <label key={opt.value} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${form.paymentMethod === opt.value ? "border-navy bg-navy/5" : "border-gray-100 hover:border-gray-200"}`}>
                  <input type="radio" name="paymentMethod" value={opt.value} checked={form.paymentMethod === opt.value} onChange={e => setForm({...form, paymentMethod: e.target.value})} className="accent-navy" />
                  <span className="text-navy">{opt.icon}</span>
                  <span className="text-sm font-medium flex-1">{opt.label}</span>
                </label>
              ))}
              <div className="flex items-center gap-2 text-xs text-muted pt-2">
                <Lock size={14} /> Your payment information is secure and encrypted
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-3 border rounded-xl text-sm font-semibold text-navy hover:bg-gray-50">Back</button>
                <button type="submit" className="flex-1 py-3 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light flex items-center justify-center gap-2"><Lock size={16} /> Place Order &mdash; &#8377;850</button>
              </div>
            </>
          )}
        </form>

        <div className="bg-white rounded-2xl border p-6 h-fit space-y-4">
          <h3 className="font-heading text-lg font-bold text-navy">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3 py-2 border-b">
              <div className="w-12 h-12 bg-navy/5 rounded-lg flex items-center justify-center shrink-0">&#x1F4DA;</div>
              <div><p className="font-medium text-navy">Viddha and Agnikarma Chikitsa (English)</p><p className="text-xs text-muted">Qty: 2</p></div>
              <p className="font-semibold ml-auto">&#8377;900</p>
            </div>
            <div className="flex gap-3 py-2 border-b">
              <div className="w-12 h-12 bg-navy/5 rounded-lg flex items-center justify-center shrink-0">&#x1F4DA;</div>
              <div><p className="font-medium text-navy">Viddha and Agnikarma Chikitsa (Hindi)</p><p className="text-xs text-muted">Qty: 1</p></div>
              <p className="font-semibold ml-auto">&#8377;400</p>
            </div>
          </div>
          <div className="space-y-2 text-sm border-t pt-3">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="font-semibold">&#8377;1,300</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="text-green-600 font-semibold">Free</span></div>
            <div className="flex justify-between border-t pt-2"><span className="font-semibold text-navy">Total</span><span className="font-heading text-xl font-extrabold text-navy">&#8377;1,300</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
