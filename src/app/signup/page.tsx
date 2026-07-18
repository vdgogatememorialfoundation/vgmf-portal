"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2,
  CheckCircle2, ArrowRight, Phone, RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp", email: form.email, name: form.name }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to send OTP"); }
      else {
        toast.success("OTP sent to your email");
        setStep(2);
        setResendCooldown(60);
      }
    } catch { toast.error("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resend-otp", email: form.email, name: form.name }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to resend OTP"); }
      else {
        toast.success("OTP resent to your email");
        setResendCooldown(60);
      }
    } catch { toast.error("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) { toast.error("Please enter a valid 6-digit code"); return; }
    if (!password || password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email: form.email,
          name: form.name,
          phone: form.phone || undefined,
          password,
          otp,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Verification failed"); }
      else {
        toast.success("Account created! Please sign in.");
        router.push("/login?registered=true");
      }
    } catch { toast.error("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const stepClass = (s: number) =>
    `flex items-center gap-2 ${step >= s ? "text-teal" : "text-ink/40"}`;

  const dotClass = (s: number) =>
    `w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
      step > s ? "bg-teal text-white" :
      step === s ? "bg-teal text-white shadow-md shadow-teal/30" :
      "bg-ink/10 text-ink/40"
    }`;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`;
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT: Teal gradient panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal via-[#0a5c58] to-teal">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-12 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="w-20 h-20 bg-white/15 border-2 border-white/25 rounded-2xl flex items-center justify-center mb-8">
            <span className="font-heading text-3xl font-extrabold text-white">VG</span>
          </div>
          <h1 className="font-heading text-4xl xl:text-5xl font-extrabold leading-tight mb-4">
            Join <span className="text-gold">VGMF</span> Today
          </h1>
          <p className="text-white/70 text-lg max-w-md leading-relaxed">
            Be part of a movement transforming healthcare access for underserved communities across India.
          </p>
          <div className="mt-12 space-y-4">
            {[
              "Access medical camps and health services",
              "Apply for educational scholarships",
              "Track your applications in real-time",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-gold shrink-0" />
                <span className="text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center bg-cream px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-ink/60 hover:text-ink mb-8 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-teal rounded-xl flex items-center justify-center">
              <span className="font-heading text-xl font-extrabold text-white">VG</span>
            </div>
            <span className="font-heading text-xl font-bold text-ink">VGMF</span>
          </div>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-extrabold text-ink mb-2">Create Account</h1>
            <p className="text-ink/60">Join the VGMF community</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={stepClass(1)}>
              <div className={dotClass(1)}>
                {step > 1 ? <CheckCircle2 size={16} /> : "1"}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Info</span>
            </div>
            <div className={`flex-1 h-0.5 transition-colors ${step >= 2 ? "bg-teal" : "bg-ink/10"}`} />
            <div className={stepClass(2)}>
              <div className={dotClass(2)}>
                {step > 2 ? <CheckCircle2 size={16} /> : "2"}
              </div>
              <span className="text-sm font-medium hidden sm:inline">OTP</span>
            </div>
            <div className={`flex-1 h-0.5 transition-colors ${step >= 3 ? "bg-teal" : "bg-ink/10"}`} />
            <div className={stepClass(3)}>
              <div className={dotClass(3)}>3</div>
              <span className="text-sm font-medium hidden sm:inline">Password</span>
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                  <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} required className="input-field has-icon" placeholder="Your full name" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                  <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} required className="input-field has-icon" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-1.5">Phone (optional)</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                  <input type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} className="input-field has-icon" placeholder="+91 98765 43210" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Sending OTP...</> : <><span>Send Verification Code</span> <ArrowRight size={18} /></>}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-teal/5 rounded-xl p-4 text-center border border-teal/10">
                <p className="text-sm text-ink/50">Verification code sent to</p>
                <p className="text-sm font-semibold text-teal">{form.email}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-1.5">Verification Code</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} required maxLength={6} className="input-field text-center tracking-[10px] font-bold text-xl" placeholder="000000" />
              </div>
              <button type="button" onClick={() => { setStep(3); }} disabled={otp.length !== 6} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                Verify & Set Password <ArrowRight size={18} />
              </button>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="flex items-center gap-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:text-ink/30 text-teal hover:text-teal/80"
                >
                  <RotateCcw size={14} className={loading ? "animate-spin" : ""} />
                  {resendCooldown > 0 ? `Resend in ${formatTime(resendCooldown)}` : "Resend OTP"}
                </button>
                <button type="button" onClick={() => { setStep(1); setOtp(""); setResendCooldown(0); }} className="text-sm text-ink/50 hover:text-teal font-medium transition-colors">
                  Change email
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-teal/5 rounded-xl p-4 text-center border border-teal/10">
                <p className="text-sm text-ink/50">Welcome, <span className="font-semibold text-ink">{form.name}</span></p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field has-icon pr-12" placeholder="Minimum 6 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                  <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="input-field has-icon" placeholder="Re-enter password" />
                </div>
              </div>
              <button type="button" onClick={handleVerify} disabled={loading} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Creating Account...</> : <><CheckCircle2 size={18} /> Create Account</>}
              </button>
              <button type="button" onClick={() => { setStep(2); }} className="w-full text-center text-sm text-ink/50 hover:text-teal font-medium transition-colors">
                &larr; Back to OTP
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-ink/50">
            Already have an account?{" "}
            <Link href="/login" className="text-teal font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
