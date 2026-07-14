"use client";
import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";

const statusSteps = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function TrackOrderPage() {
  const [orderNum, setOrderNum] = useState("");
  const [tracking, setTracking] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTracking({ orderNumber: orderNum, status: "Processing", estimatedDelivery: "2026-07-20", items: [{ name: "Viddha and Agnikarma Chikitsa (English)", qty: 1, price: 450 }] });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <Truck className="mx-auto text-gold mb-4" size={48} />
        <h1 className="font-heading text-3xl font-extrabold text-navy">Track Your Order</h1>
        <p className="text-muted mt-2">Enter your order number to check delivery status</p>
      </div>
      <form onSubmit={handleTrack} className="flex gap-3 mb-8">
        <input value={orderNum} onChange={e => setOrderNum(e.target.value)} placeholder="e.g. VGMF-20260714-XXXXXXXX" required
          className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20" />
        <button type="submit" className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light flex items-center gap-2"><Search size={18} /> Track</button>
      </form>
      {tracking && (
        <div className="bg-white rounded-2xl border p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div><p className="text-xs text-muted uppercase tracking-wider">Order</p><p className="font-heading font-bold text-lg text-navy">{tracking.orderNumber}</p></div>
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-xl flex items-center gap-1"><Clock size={14} /> {tracking.status}</span>
          </div>
          <div className="flex items-center gap-2">
            {statusSteps.map((s, i) => (
              <div key={s} className="flex-1 text-center">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${statusSteps.indexOf(tracking.status) >= i ? "bg-navy text-white" : "bg-gray-100 text-muted"}`}>
                  {statusSteps.indexOf(tracking.status) > i ? <CheckCircle size={14} /> : i + 1}
                </div>
                <p className="text-[10px] mt-1 text-muted">{s}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-muted">Estimated Delivery: <span className="font-semibold text-navy">{tracking.estimatedDelivery}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
