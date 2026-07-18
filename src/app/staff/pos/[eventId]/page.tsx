"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Plus, Minus, Trash2, User, Phone, Mail, CreditCard,
  Banknote, Smartphone, Loader2, CheckCircle, Printer, X, ShoppingCart,
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
  location?: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  maxStock: number;
  subtotal: number;
}

interface SaleResult {
  sale: {
    id: string;
    receiptNumber: string;
    buyerName: string;
    totalAmount: number;
    itemsJson: any[];
    paymentMethod: string;
    soldAt: string;
  };
}

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "CARD", label: "Card", icon: CreditCard },
  { value: "UPI", label: "UPI", icon: Smartphone },
];

export default function EventPOSPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [saleResult, setSaleResult] = useState<SaleResult | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [buyer, setBuyer] = useState({ name: "", phone: "", email: "" });
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const fetchData = useCallback(async () => {
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
        setProducts(data.products?.filter((p: Product) => p.isActive && p.stockQty > 0) || []);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.qty >= product.stockQty) {
          toast.error("Not enough stock");
          return prev;
        }
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.price }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          maxStock: product.stockQty,
          subtotal: product.price,
        },
      ];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;
        const newQty = item.qty + delta;
        if (newQty <= 0) return item;
        if (newQty > item.maxStock) {
          toast.error("Not enough stock");
          return item;
        }
        return { ...item, qty: newQty, subtotal: newQty * item.price };
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCompleteSale = async () => {
    if (!buyer.name.trim()) {
      toast.error("Buyer name is required");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName: buyer.name.trim(),
          buyerPhone: buyer.phone.trim() || null,
          buyerEmail: buyer.email.trim() || null,
          items: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            qty: item.qty,
            subtotal: item.subtotal,
          })),
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to complete sale");
      }

      const result = await res.json();
      setSaleResult(result);
      setShowReceipt(true);
      setCart([]);
      setBuyer({ name: "", phone: "", email: "" });
      setPaymentMethod("CASH");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to complete sale");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - ${saleResult?.sale.receiptNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 300px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 16px; }
                .header h1 { margin: 0; font-size: 18px; }
                .header p { margin: 4px 0 0; font-size: 12px; color: #666; }
                .divider { border-top: 1px dashed #000; margin: 12px 0; }
                .row { display: flex; justify-content: space-between; margin: 4px 0; font-size: 14px; }
                .total { font-weight: bold; font-size: 16px; margin-top: 8px; }
                .footer { text-align: center; margin-top: 16px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-[#0d6662]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/staff/pos" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft size={20} className="text-muted" />
        </Link>
        <div className="flex-1">
          <h1 className="font-heading text-xl lg:text-2xl font-extrabold text-ink truncate">
            {event?.title || "POS"} — Point of Sale
          </h1>
          {event && (
            <p className="text-xs lg:text-sm text-muted">
              {new Date(event.eventDate).toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h2 className="font-semibold text-ink mb-3 text-sm uppercase tracking-wide">Products</h2>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted text-sm">No products available</p>
                <p className="text-xs text-muted mt-1">Add products in admin panel</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="text-left p-3 rounded-xl border border-slate-200 hover:border-[#0d6662] hover:bg-[#0d6662]/5 transition-all duration-150 active:scale-95"
                  >
                    <p className="font-medium text-ink text-sm truncate">{product.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[#0d6662] font-bold">₹{product.price.toLocaleString("en-IN")}</p>
                      <span className="text-xs text-muted">Stock: {product.stockQty}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); updateQty(product.id, -1); }}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">
                        {cart.find((c) => c.productId === product.id)?.qty || 0}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateQty(product.id, 1); }}
                        className="w-8 h-8 rounded-lg bg-[#0d6662] hover:bg-[#0d6662]/90 text-white flex items-center justify-center transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h2 className="font-semibold text-ink mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
              <ShoppingCart size={16} /> Cart ({cart.length})
            </h2>
            {cart.length === 0 ? (
              <p className="text-muted text-sm text-center py-6">Cart is empty</p>
            ) : (
              <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                      <p className="text-xs text-muted">₹{item.price} x {item.qty}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQty(item.productId, -1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.productId, 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors ml-1"
                      >
                        <Trash2 size={12} className="text-danger" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t border-slate-200 mt-3 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink">Total</span>
                <span className="text-xl font-bold text-[#0d6662]">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h2 className="font-semibold text-ink mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
              <User size={16} /> Buyer Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Name *</label>
                <input
                  value={buyer.name}
                  onChange={(e) => setBuyer((b) => ({ ...b, name: e.target.value }))}
                  placeholder="Buyer name"
                  className="input-field w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1 flex items-center gap-1">
                  <Phone size={10} /> Phone
                </label>
                <input
                  value={buyer.phone}
                  onChange={(e) => setBuyer((b) => ({ ...b, phone: e.target.value }))}
                  placeholder="Optional"
                  className="input-field w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1 flex items-center gap-1">
                  <Mail size={10} /> Email
                </label>
                <input
                  value={buyer.email}
                  onChange={(e) => setBuyer((b) => ({ ...b, email: e.target.value }))}
                  placeholder="Optional"
                  type="email"
                  className="input-field w-full text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h2 className="font-semibold text-ink mb-3 text-sm uppercase tracking-wide">Payment Method</h2>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === method.value
                      ? "border-[#0d6662] bg-[#0d6662]/5 text-[#0d6662]"
                      : "border-slate-200 hover:border-slate-300 text-muted"
                  }`}
                >
                  <method.icon size={20} />
                  <span className="text-xs font-semibold">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCompleteSale}
            disabled={submitting || cart.length === 0 || !buyer.name.trim()}
            className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Processing...
              </>
            ) : (
              <>
                <CheckCircle size={18} /> Complete Sale — ₹{total.toLocaleString("en-IN")}
              </>
            )}
          </button>
        </div>
      </div>

      {showReceipt && saleResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReceipt(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-heading text-lg font-bold text-ink">Receipt</h3>
              <div className="flex items-center gap-2">
                <button onClick={handlePrint} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Printer size={18} className="text-muted" />
                </button>
                <button onClick={() => setShowReceipt(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X size={18} className="text-muted" />
                </button>
              </div>
            </div>
            <div className="p-6" ref={receiptRef}>
              <div className="text-center mb-6">
                <h1 className="font-heading text-xl font-extrabold text-[#0d6662]">VGMF</h1>
                <p className="text-xs text-muted mt-1">Vaidya Go Medical Foundation</p>
                <p className="text-xs text-muted">On-Site Sale Receipt</p>
              </div>
              <div className="border-t border-b border-dashed border-slate-300 py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Receipt #</span>
                  <span className="font-mono font-semibold">{saleResult.sale.receiptNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Date</span>
                  <span>{new Date(saleResult.sale.soldAt).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Buyer</span>
                  <span className="font-semibold">{saleResult.sale.buyerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Payment</span>
                  <span className="font-semibold">{saleResult.sale.paymentMethod}</span>
                </div>
              </div>
              <div className="py-4 space-y-2">
                {(saleResult.sale.itemsJson as any[]).map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted">{item.name} x{item.qty}</span>
                    <span className="font-semibold">₹{item.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-slate-300 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-ink">Total</span>
                  <span className="text-xl font-extrabold text-[#0d6662]">₹{saleResult.sale.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="text-center mt-6">
                <CheckCircle size={40} className="mx-auto text-emerald-500 mb-2" />
                <p className="font-semibold text-emerald-700">Payment Successful</p>
              </div>
              <div className="text-center mt-4 text-xs text-muted">
                Thank you for your purchase!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
