"use client";

import { useState, useCallback } from "react";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  amount: number;
  eventId?: string;
  registrationId?: string;
  orderId?: string;
  description?: string;
  eventTitle?: string;
  userEmail?: string;
  userName?: string;
  onSuccess?: (data: { receiptNumber?: string; orderId?: string }) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
}

export default function RazorpayButton({
  amount,
  eventId,
  registrationId,
  orderId,
  description,
  eventTitle,
  userEmail,
  userName,
  onSuccess,
  onError,
  className = "",
  disabled = false,
  label,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handlePayment = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway. Please check your connection.");
      }

      const receiptParts: string[] = [];
      if (registrationId) receiptParts.push(`reg_${registrationId.slice(0, 8)}`);
      if (orderId) receiptParts.push(`ord_${orderId.slice(0, 8)}`);
      if (!receiptParts.length) receiptParts.push(`pay_${Date.now()}`);
      const receipt = receiptParts.join("_");

      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          receipt,
          eventRegistrationId: registrationId,
          orderId,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create payment order");
      }
      if (!orderData.keyId) {
        throw new Error("Payment gateway not configured. Please contact support.");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VaidyaGo Medical Foundation",
        description: description || eventTitle || "Event Registration Payment",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            onSuccess?.({
              receiptNumber: verifyData.receiptNumber,
              orderId: orderData.orderId,
            });
          } catch (err: any) {
            setError(err.message || "Payment verification failed");
            onError?.(err.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: userName || "",
          email: userEmail || "",
          contact: "",
        },
        theme: {
          color: "#0d6662",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError("Payment was cancelled");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response: any) {
        const msg = response.error?.description || "Payment failed";
        setError(msg);
        onError?.(msg);
        setLoading(false);
      });
      razorpayInstance.open();
    } catch (err: any) {
      const msg = err.message || "Payment initialization failed";
      setError(msg);
      onError?.(msg);
      setLoading(false);
    }
  }, [amount, eventId, registrationId, orderId, description, userEmail, userName, loadRazorpayScript, onSuccess, onError]);

  const displayAmount = amount.toLocaleString("en-IN", { minimumFractionDigits: 0 });

  return (
    <div className="space-y-2">
      <button
        onClick={handlePayment}
        disabled={loading || disabled}
        className={`btn-gold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <CreditCard size={16} />
        )}
        {loading
          ? "Processing..."
          : label || `Pay ₹${displayAmount}`}
      </button>

      {error && (
        <p className="text-xs text-maroon flex items-center gap-1.5">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
