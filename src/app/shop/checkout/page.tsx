"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Shield, CreditCard, Loader2, CheckCircle } from "lucide-react";
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

interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [form, setForm] = useState<ShippingForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        if (parsed.length === 0) {
          window.location.href = "/shop/cart";
          return;
        }
        setCart(parsed);
      } else {
        window.location.href = "/shop/cart";
      }
    } catch {
      window.location.href = "/shop/cart";
    }
    setHydrated(true);
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  const updateField = (key: keyof ShippingForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping: form,
          items: cart.map((i) => ({ productId: i.id, quantity: i.qty })),
          paymentMethod,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place order");
      }
      const data = await res.json();
      setOrderNumber(data.orderNumber || `VGMF-${Date.now()}`);
      setOrderPlaced(true);
      localStorage.removeItem(CART_KEY);
      toast.success("Order placed successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Loader2 size={40} className="text-gold animate-spin mx-auto" />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-ink/5 p-10 shadow-sm">
          <div className="w-20 h-20 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-teal" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-ink mb-4">
            Order Placed!
          </h1>
          <p className="text-muted mb-2">
            Your order number is{" "}
            <strong className="text-ink">{orderNumber}</strong>
          </p>
          <p className="text-muted mb-8">
            A confirmation email will be sent shortly. Track your order anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop/track" className="btn-primary">
              Track Order
            </Link>
            <Link href="/shop" className="btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <Link
        href="/shop/cart"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-ink mb-8">
        Checkout
      </h1>

      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-10">
        {["Shipping", "Payment"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > i + 1
                  ? "bg-teal text-white"
                  : step === i + 1
                  ? "bg-teal text-white shadow-lg shadow-teal/20"
                  : "bg-ink/5 text-muted"
              }`}
            >
              {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span
              className={`text-sm font-semibold ${
                step >= i + 1 ? "text-ink" : "text-muted"
              }`}
            >
              {label}
            </span>
            {i === 0 && <div className="w-12 h-px bg-ink/10 mx-2" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <form
          onSubmit={handleShippingSubmit}
          className="lg:col-span-2 bg-white rounded-2xl border border-ink/5 p-8 space-y-5"
        >
          {step === 1 && (
            <>
              <h3 className="font-heading text-lg font-bold text-ink mb-4">
                Shipping Address
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: "fullName" as const, label: "Full Name", type: "text" },
                  { key: "email" as const, label: "Email Address", type: "email" },
                  { key: "phone" as const, label: "Phone Number", type: "tel" },
                  { key: "address" as const, label: "Street Address", type: "text", full: true },
                  { key: "city" as const, label: "City", type: "text" },
                  { key: "state" as const, label: "State", type: "text" },
                  { key: "pincode" as const, label: "Pincode", type: "text" },
                ].map((f) => (
                  <div key={f.key} className={f.full ? "md:col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                      {f.label} <span className="text-maroon">*</span>
                    </label>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={(e) => updateField(f.key, e.target.value)}
                      required
                      className="input-field"
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="btn-primary w-full justify-center !py-3">
                Continue to Payment
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="font-heading text-lg font-bold text-ink mb-4">
                Payment Method
              </h3>

              <div className="space-y-3">
                {[
                  { value: "upi", label: "UPI (Google Pay / PhonePe)", icon: CreditCard },
                  { value: "card", label: "Credit / Debit Card", icon: CreditCard },
                  { value: "netbanking", label: "Net Banking", icon: Shield },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === opt.value
                        ? "border-teal bg-teal/5"
                        : "border-ink/5 hover:border-ink/10"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-teal"
                    />
                    <opt.icon size={20} className="text-ink" />
                    <span className="text-sm font-medium text-ink flex-1">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted pt-2">
                <Lock size={14} /> Payment is secure and encrypted via Razorpay
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-outline !py-3"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="btn-gold flex-1 justify-center !py-3 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Lock size={16} />
                  )}
                  Place Order &mdash; ₹{total.toLocaleString("en-IN")}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-2xl border border-ink/5 p-6 h-fit sticky top-24 space-y-5">
          <h3 className="font-heading text-lg font-bold text-ink">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 py-2 border-b border-ink/5 last:border-0"
              >
                <div className="w-12 h-12 bg-teal/5 rounded-lg flex items-center justify-center shrink-0">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-lg">&#x1F4DA;</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink text-xs truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted">Qty: {item.qty}</p>
                </div>
                <p className="font-semibold text-ink text-xs shrink-0">
                  ₹{(item.price * item.qty).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm border-t border-ink/5 pt-3">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold text-ink">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tax (18% GST)</span>
              <span className="font-semibold text-ink">
                ₹{tax.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="font-semibold">
                {shipping === 0 ? (
                  <span className="text-teal">Free</span>
                ) : (
                  <span className="text-ink">₹{shipping}</span>
                )}
              </span>
            </div>
            <div className="flex justify-between border-t border-ink/5 pt-2">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-heading text-xl font-extrabold text-ink">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
