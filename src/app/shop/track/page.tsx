"use client";
import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, Calendar } from "lucide-react";

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

interface OrderData {
  orderNumber: string;
  status: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  items: { name: string; quantity: number; price: number }[];
}

export default function TrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const statusSteps = [
    { key: "PENDING", label: "Order Placed", icon: Clock, color: "bg-gray-400" },
    { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle, color: "bg-blue-500" },
    { key: "PROCESSING", label: "Processing", icon: Package, color: "bg-purple-500" },
    { key: "SHIPPED", label: "Shipped", icon: Truck, color: "bg-orange-500" },
    { key: "DELIVERED", label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
  ];

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError("Please enter an order number");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/orders/track?orderNumber=${orderNumber}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError("Order not found. Please check the order number.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return statusSteps.findIndex(s => s.key === order.status);
  };

  const getDaysUntilDelivery = () => {
    if (!order?.estimatedDelivery) return null;
    const delivery = new Date(order.estimatedDelivery);
    const now = new Date();
    const diff = Math.ceil((delivery.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-heading text-4xl font-extrabold text-navy mb-2">Track Your Order</h1>
        <p className="text-muted">Enter your order number to see real-time status</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleTrack} className="bg-white rounded-2xl border p-6 mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter order number (e.g., VGMF-20260714-XXXX)"
            className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light transition-colors disabled:opacity-50"
          >
            {loading ? "Tracking..." : "Track"}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      </form>

      {/* Tracking Result */}
      {order && (
        <div className="space-y-6">
          {/* Order Header */}
          <div className="bg-white rounded-2xl border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Order Number</p>
                <p className="font-heading text-2xl font-bold text-navy">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Status</p>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                  order.status === "DELIVERED" ? "bg-green-50 text-green-700" :
                  order.status === "SHIPPED" ? "bg-orange-50 text-orange-700" :
                  order.status === "PROCESSING" ? "bg-purple-50 text-purple-700" :
                  "bg-blue-50 text-blue-700"
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Estimated Delivery */}
            {order.status !== "DELIVERED" && (
              <div className="bg-gradient-to-r from-navy to-navy-light text-white rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <Calendar size={24} />
                  <div>
                    <p className="text-xs text-white/70 uppercase tracking-wider">Estimated Delivery</p>
                    <p className="font-bold text-lg">
                      {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                    {getDaysUntilDelivery() !== null && (
                      <p className="text-sm text-white/80">
                        {getDaysUntilDelivery() === 0 ? "Today" : `In ${getDaysUntilDelivery()} day${getDaysUntilDelivery() > 1 ? "s" : ""}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div className="mt-6">
              <h3 className="font-heading text-lg font-bold text-navy mb-4">Order Progress</h3>
              <div className="relative">
                {statusSteps.map((step, index) => {
                  const currentStep = getCurrentStepIndex();
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div key={step.key} className="flex gap-4 mb-6 last:mb-0">
                      {/* Icon */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? step.color : "bg-gray-200"
                        } ${isCurrent ? "ring-4 ring-offset-2 ring-navy/20" : ""}`}>
                          <step.icon size={20} className={isCompleted ? "text-white" : "text-gray-400"} />
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`w-0.5 h-12 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <p className={`font-semibold ${isCompleted ? "text-navy" : "text-gray-400"}`}>
                          {step.label}
                        </p>
                        {isCurrent && order.events[0] && (
                          <div className="mt-2 bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-ink-soft">{order.events[0].description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted">
                              <MapPin size={12} />
                              <span>{order.events[0].location}</span>
                              <span>•</span>
                              <span>{new Date(order.events[0].timestamp).toLocaleString("en-IN")}</span>
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

          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="font-heading text-lg font-bold text-navy mb-4">Customer Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">Name</p>
                  <p className="font-semibold text-ink">{order.customerName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-muted" />
                  <p className="text-sm text-ink-soft">{order.customerPhone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-muted" />
                  <p className="text-sm text-ink-soft">{order.customerEmail}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="font-heading text-lg font-bold text-navy mb-4">Shipping Address</h3>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-muted mt-1" />
                <p className="text-sm text-ink-soft">{order.shippingAddress}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-heading text-lg font-bold text-navy mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="text-sm text-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-navy">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking History */}
          {order.events.length > 0 && (
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="font-heading text-lg font-bold text-navy mb-4">Tracking History</h3>
              <div className="space-y-4">
                {order.events.map((event, index) => (
                  <div key={index} className="flex gap-3 pb-4 border-b last:border-0">
                    <div className="w-2 h-2 rounded-full bg-navy mt-2" />
                    <div className="flex-1">
                      <p className="font-semibold text-ink text-sm">{event.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                        <MapPin size={12} />
                        <span>{event.location}</span>
                        <span>•</span>
                        <span>{new Date(event.timestamp).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
