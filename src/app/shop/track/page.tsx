"use client";
import { useState } from "react";
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, Calendar, Loader2, AlertCircle } from "lucide-react";

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

interface OrderData {
  orderNumber: string;
  status: string;
  estimatedDelivery: string | null;
  events: TrackingEvent[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  items: { name: string; quantity: number; price: number }[];
}

const STATUS_STEPS = [
  { key: "PENDING", label: "Order Placed", icon: Clock, color: "bg-gray-400" },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle, color: "bg-teal" },
  { key: "PROCESSING", label: "Processing", icon: Package, color: "bg-gold" },
  { key: "SHIPPED", label: "Shipped", icon: Truck, color: "bg-orange-500" },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
];

export default function TrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError("Please enter an order number");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);
    setHasSearched(true);

    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}`
      );
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
    } catch {
      setError("Order not found. Please check the order number and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return STATUS_STEPS.findIndex((s) => s.key === order.status);
  };

  const getDaysUntilDelivery = (): number | null => {
    if (!order?.estimatedDelivery) return null;
    try {
      const delivery = new Date(order.estimatedDelivery);
      if (isNaN(delivery.getTime())) return null;
      const now = new Date();
      const diff = Math.ceil(
        (delivery.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diff > 0 ? diff : 0;
    } catch {
      return null;
    }
  };

  const formatDeliveryDate = (dateStr: string | null): string => {
    if (!dateStr) return "Not available";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Not available";
      return date.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Not available";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
          Order Tracking
        </span>
        <h1 className="font-heading text-4xl font-extrabold text-ink mb-2">
          Track Your Order
        </h1>
        <p className="text-muted">
          Enter your order number to see real-time status
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleTrack} className="bg-white rounded-2xl border border-ink/5 p-6 mb-8 shadow-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter order number (e.g., VGMF-20260714-XXXX)"
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Package size={18} />
            )}
            {loading ? "Tracking..." : "Track"}
          </button>
        </div>
        {error && (
          <p className="text-maroon text-sm mt-3 flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
      </form>

      {/* Tracking Result */}
      {order && (
        <div className="space-y-6 animate-fade-up">
          {/* Order Header */}
          <div className="bg-white rounded-2xl border border-ink/5 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Order Number
                </p>
                <p className="font-heading text-2xl font-bold text-ink">
                  {order.orderNumber}
                </p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${
                  order.status === "DELIVERED"
                    ? "bg-teal/10 text-teal"
                    : order.status === "SHIPPED"
                    ? "bg-orange-50 text-orange-700"
                    : order.status === "PROCESSING"
                    ? "bg-gold/10 text-gold"
                    : order.status === "CANCELLED"
                    ? "bg-red-50 text-maroon"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Estimated Delivery */}
            {order.status !== "DELIVERED" && order.estimatedDelivery && (
              <div className="bg-gradient-to-r from-teal to-[#0a5c58] text-white rounded-xl p-5 mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">
                      Estimated Delivery
                    </p>
                    <p className="font-bold text-lg">
                      {formatDeliveryDate(order.estimatedDelivery)}
                    </p>
                    {(() => {
                      const days = getDaysUntilDelivery();
                      if (days === null) return null;
                      return (
                        <p className="text-sm text-white/80 mt-0.5">
                          {days === 0
                            ? "Arriving today"
                            : `In ${days} day${days !== 1 ? "s" : ""}`}
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div className="mt-6">
              <h3 className="font-heading text-lg font-bold text-ink mb-5">
                Order Progress
              </h3>
              <div className="relative">
                {STATUS_STEPS.map((step, index) => {
                  const currentStep = getCurrentStepIndex();
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div key={step.key} className="flex gap-4 mb-6 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCompleted ? step.color : "bg-ink/10"
                          } ${isCurrent ? "ring-4 ring-offset-2 ring-teal/20" : ""}`}
                        >
                          <step.icon
                            size={20}
                            className={isCompleted ? "text-white" : "text-muted"}
                          />
                        </div>
                        {index < STATUS_STEPS.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              isCompleted ? "bg-teal" : "bg-ink/10"
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1 pb-2">
                        <p
                          className={`font-semibold text-sm ${
                            isCompleted ? "text-ink" : "text-muted"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && order.events[0] && (
                          <div className="mt-2 bg-[#f4f1ec] rounded-xl p-3 border border-ink/5">
                            <p className="text-sm text-ink/70">
                              {order.events[0].description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted">
                              <MapPin size={12} />
                              <span>{order.events[0].location}</span>
                              <span>·</span>
                              <span>
                                {new Date(
                                  order.events[0].timestamp
                                ).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl border border-ink/5 p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-ink mb-4">
                Customer Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">
                    Name
                  </p>
                  <p className="font-semibold text-ink">
                    {order.customerName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-muted" />
                  <p className="text-sm text-ink/70">
                    {order.customerPhone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-muted" />
                  <p className="text-sm text-ink/70">
                    {order.customerEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-ink/5 p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-ink mb-4">
                Shipping Address
              </h3>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-muted mt-1 shrink-0" />
                <p className="text-sm text-ink/70 leading-relaxed">
                  {order.shippingAddress || "No address provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-ink/5 p-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-ink mb-4">
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-ink/5 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="text-sm text-muted">
                      Qty: {item.quantity} &times; ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="font-semibold text-ink">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking History */}
          {order.events.length > 0 && (
            <div className="bg-white rounded-2xl border border-ink/5 p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-ink mb-4">
                Tracking History
              </h3>
              <div className="space-y-4">
                {order.events.map((event, index) => (
                  <div
                    key={index}
                    className="flex gap-3 pb-4 border-b border-ink/5 last:border-0"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-teal mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-ink text-sm">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                        <MapPin size={12} />
                        <span>{event.location}</span>
                        <span>·</span>
                        <span>
                          {new Date(event.timestamp).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state after search with no result */}
      {!loading && hasSearched && !order && !error && (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-muted mb-4" />
          <p className="text-muted font-medium">
            No order found with this number.
          </p>
        </div>
      )}
    </div>
  );
}
