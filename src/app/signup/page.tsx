"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<SignupForm>({ name: "", email: "", password: "", confirm: "" });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateForm = (field: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp", email: form.email, name: form.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to send OTP");
      } else {
        toast.success("OTP sent to your email");
        setStep(2);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    if (!form.password || form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, name: form.name, password: form.password, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Verification failed");
      } else {
        toast.success("Account created! Please sign in.");
        router.push("/login?registered=true");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-navy via-navy-light to-teal">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link href="/" className="inline-flex items-center gap-2 text-gold/80 hover:text-gold mb-12 transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="w-20 h-20 bg-gold/10 border-2 border-gold/30 rounded-2xl flex items-center justify-center mb-8">
            <span className="font-heading text-3xl font-extrabold text-gold">VG</span>
          </div>
          <h1 className="font-heading text-4xl xl:text-5xl font-extrabold leading-tight mb-4">
            Join <span className="text-gold">VGMF</span> Today
          </h1>
          <p className="text-white/60 text-lg max-w-md leading-relaxed">
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

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-cream px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-muted hover:text-navy mb-8 transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center">
              <span className="font-heading text-xl font-extrabold text-gold">VG</span>
            </div>
            <span className="font-heading text-xl font-bold text-navy">VGMF</span>
          </div>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-extrabold text-navy mb-2">Create Account</h1>
            <p className="text-muted">Join the VGMF community</p>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-navy" : "text-muted"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 1 ? "bg-navy text-white" : "bg-gray-200 text-muted"}`}>
                {step > 1 ? <CheckCircle2 size={16} /> : "1"}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Verify</span>
            </div>
            <div className={`flex-1 h-0.5 transition-colors ${step >= 2 ? "bg-navy" : "bg-gray-200"}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-navy" : "text-muted"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 2 ? "bg-navy text-white" : "bg-gray-200 text-muted"}`}>
                2
              </div>
              <span className="text-sm font-medium hidden sm:inline">Details</span>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    required
                    className="input-field pl-11"
                    placeholder="Your full name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    required
                    className="input-field pl-11"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="bg-navy/5 rounded-xl p-4 text-center">
                <p className="text-sm text-muted">Verification code sent to</p>
                <p className="text-sm font-semibold text-navy">{form.email}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  maxLength={6}
                  className="input-field text-center tracking-[10px] font-bold text-xl"
                  placeholder="000000"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                    required
                    className="input-field pl-11 pr-12"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={(e) => updateForm("confirm", e.target.value)}
                    required
                    className="input-field pl-11"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <CheckCircle2 size={18} />
                  </>
                )}
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(""); }}
                  className="flex-1 py-2.5 text-sm text-muted hover:text-navy font-medium transition-colors border-2 border-gray-200 rounded-xl hover:border-navy/20"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="flex-1 py-2.5 text-sm text-muted hover:text-navy font-medium transition-colors border-2 border-gray-200 rounded-xl hover:border-navy/20"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-navy font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
