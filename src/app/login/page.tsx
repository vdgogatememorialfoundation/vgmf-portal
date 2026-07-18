"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LogIn,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Mail,
  Lock,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

function LoginForm() {
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSentAt, setOtpSentAt] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        setLoading(false);
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      toast.success("Welcome back!");

      if (role === "ADMIN") router.push("/admin");
      else if (role === "STAFF") router.push("/staff");
      else router.push("/dashboard");

      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (isResend = false) => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    setOtpLoading(true);

    try {
      const res = await fetch("/api/auth/login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isResend ? "resend-otp" : "send-otp",
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send OTP");
        setOtpLoading(false);
        return;
      }

      toast.success("OTP sent to your email");
      setOtpSent(true);
      setResendDisabled(true);
      setOtpSentAt(Date.now());

      setTimeout(() => setResendDisabled(false), 60000);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    setOtpLoading(true);

    try {
      const verifyRes = await fetch("/api/auth/login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", email, otp: otpCode }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        toast.error(verifyData.error || "Invalid OTP");
        setOtpLoading(false);
        return;
      }

      setOtpVerified(true);
      toast.success("OTP verified! Signing you in...");

      const result = await signIn("credentials", {
        email,
        password: "otp-verified:" + email,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Login failed. Please try again.");
        setOtpLoading(false);
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      toast.success("Welcome back!");

      if (role === "ADMIN") router.push("/admin");
      else if (role === "STAFF") router.push("/staff");
      else router.push("/dashboard");

      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setOtpLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-cream px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="lg:hidden inline-flex items-center gap-2 text-ink/50 hover:text-ink mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-teal rounded-xl flex items-center justify-center">
            <span className="font-heading text-xl font-extrabold text-white">VG</span>
          </div>
          <span className="font-heading text-xl font-bold text-ink">VGMF</span>
        </div>

        <div className="mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-ink mb-2">Welcome Back</h1>
          <p className="text-ink/50">Sign in to your VGMF account</p>
        </div>

        {justRegistered && (
          <div className="flex items-center gap-3 p-4 bg-teal/5 border border-teal/20 rounded-xl mb-6">
            <CheckCircle2 size={20} className="text-teal shrink-0" />
            <p className="text-sm text-teal font-medium">Account created! Please sign in.</p>
          </div>
        )}

        <div className="flex bg-ink/5 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => { setMode("password"); setOtpSent(false); setOtpVerified(false); setOtpCode(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === "password"
                ? "bg-white text-ink shadow-sm"
                : "text-ink/50 hover:text-ink/70"
            }`}
          >
            <Lock size={16} />
            Password
          </button>
          <button
            type="button"
            onClick={() => setMode("otp")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === "otp"
                ? "bg-white text-ink shadow-sm"
                : "text-ink/50 hover:text-ink/70"
            }`}
          >
            <KeyRound size={16} />
            Email OTP
          </button>
        </div>

        {mode === "password" ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field has-icon"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field has-icon pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setOtpSent(false); setOtpVerified(false); }}
                  required
                  className="input-field has-icon"
                  placeholder="you@example.com"
                  disabled={otpSent && !otpVerified}
                />
              </div>
            </div>

            {!otpSent && (
              <button
                type="button"
                onClick={() => handleSendOtp(false)}
                disabled={otpLoading}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Send OTP
                  </>
                )}
              </button>
            )}

            {otpSent && !otpVerified && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-1.5">
                    Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                      className="input-field has-icon"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading}
                    className="btn-primary flex-1 justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Verify & Login
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendOtp(true)}
                    disabled={resendDisabled || otpLoading}
                    className="p-3 border-2 border-ink/10 rounded-xl text-ink/40 hover:border-teal hover:text-teal transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Resend OTP"
                  >
                    <RefreshCw size={18} className={otpLoading ? "animate-spin" : ""} />
                  </button>
                </div>

                {resendDisabled && (
                  <p className="text-xs text-ink/40 text-center">
                    Resend available in {Math.max(0, Math.ceil((60000 - (Date.now() - otpSentAt)) / 1000))}s
                  </p>
                )}
              </>
            )}

            {otpVerified && (
              <div className="flex items-center gap-3 p-4 bg-teal/5 border border-teal/20 rounded-xl">
                <CheckCircle2 size={20} className="text-teal shrink-0" />
                <p className="text-sm text-teal font-medium">OTP verified! Signing you in...</p>
              </div>
            )}

            {otpSent && (
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtpCode(""); setOtpVerified(false); }}
                className="w-full text-center text-sm text-ink/40 hover:text-teal transition-colors"
              >
                Use a different email
              </button>
            )}
          </div>
        )}
        <div className="mt-6 text-center">
          <p className="text-sm text-ink/50">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-teal font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function UserLogin() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal via-[#0a5c58] to-teal">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-12 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="w-20 h-20 bg-white/15 border-2 border-white/25 rounded-2xl flex items-center justify-center mb-8">
            <span className="font-heading text-3xl font-extrabold text-white">VG</span>
          </div>
          <h1 className="font-heading text-4xl xl:text-5xl font-extrabold leading-tight mb-4">
            Vaidya Go <span className="text-gold">Medical</span> Foundation
          </h1>
          <p className="text-white/70 text-lg max-w-md leading-relaxed">
            Empowering communities through healthcare, education, and social welfare
            initiatives since 1992.
          </p>
          <div className="mt-12 flex items-center gap-8 text-sm text-white/50">
            <div>
              <p className="text-gold font-heading text-2xl font-bold">25K+</p>
              <p>Lives Impacted</p>
            </div>
            <div className="w-px h-10 bg-white/15" />
            <div>
              <p className="text-gold font-heading text-2xl font-bold">150+</p>
              <p>Medical Camps</p>
            </div>
            <div className="w-px h-10 bg-white/15" />
            <div>
              <p className="text-gold font-heading text-2xl font-bold">30+</p>
              <p>Years of Service</p>
            </div>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-cream">
            <Loader2 className="animate-spin text-teal" size={32} />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
