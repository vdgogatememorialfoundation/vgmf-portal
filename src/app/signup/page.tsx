"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) { setError("All fields are required"); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send-otp", email: form.email, name: form.name }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed to send OTP"); setLoading(false); }
    else { setStep(2); setLoading(false); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError("Please enter a valid 6-digit code"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify", email: form.email, name: form.name, phone: form.phone, password: form.password, otp }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Verification failed"); setLoading(false); }
    else { router.push("/login?registered=true"); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-navy">Create Account</h1>
          <p className="text-muted mt-2">Join the VGMF community</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 1 ? "bg-navy text-white" : "bg-gray-200 text-muted"}`}>1</div>
          <div className={`w-10 h-0.5 transition-colors ${step >= 2 ? "bg-navy" : "bg-gray-200"}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 2 ? "bg-navy text-white" : "bg-gray-200 text-muted"}`}>2</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" placeholder="Full Name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" placeholder="Minimum 6 characters" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Confirm Password</label>
                <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" placeholder="Re-enter password" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light transition-colors disabled:opacity-50">
                {loading ? "Sending..." : "Register"}
              </button>
              <p className="text-center text-sm text-muted">
                Already have an account? <Link href="/login" className="text-navy font-semibold hover:underline">Sign In</Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center pb-2">
                <p className="text-sm text-muted">We sent a verification code to</p>
                <p className="text-sm font-semibold text-navy">{form.email}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Verification Code</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} required maxLength={6}
                  className="w-full px-4 py-3 border rounded-xl text-sm text-center tracking-[8px] font-bold text-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" placeholder="000000" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light transition-colors disabled:opacity-50">
                {loading ? "Verifying..." : "Create Account"}
              </button>
              <button type="button" onClick={() => { setStep(1); setError(""); }}
                className="w-full py-2 text-sm text-muted hover:text-navy transition-colors">
                &larr; Back to details
              </button>
              <button type="button" onClick={handleSendOtp}
                className="w-full py-2 text-sm text-muted hover:text-navy transition-colors">
                Resend code
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
