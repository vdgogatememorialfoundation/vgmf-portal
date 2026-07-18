"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stethoscope, ArrowLeft, Eye, EyeOff, Loader2, Lock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [portalEnabled, setPortalEnabled] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/portals/doctor/status")
      .then(r => r.ok ? r.json() : { enabled: true })
      .then(data => setPortalEnabled(data.enabled))
      .catch(() => setPortalEnabled(true));
  }, []);

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

      if (session?.user?.role !== "DOCTOR") {
        await signIn("credentials", { email: "", password: "", redirect: false });
        toast.error("Access denied. Doctor privileges required.");
        setLoading(false);
        return;
      }

      toast.success("Welcome, Doctor!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (portalEnabled === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-maroon/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-maroon" />
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-ink mb-3">Portal Unavailable</h1>
          <p className="text-muted mb-6">This portal is currently unavailable. Please contact the administrator.</p>
          <Link href="/" className="btn-outline inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (portalEnabled === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <Loader2 size={32} className="text-teal animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0d6662] via-[#14918b] to-[#1a9e98]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#c2761c] rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-12 transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="w-20 h-20 bg-white/15 border-2 border-white/25 rounded-2xl flex items-center justify-center mb-8">
            <Stethoscope className="text-white" size={36} />
          </div>
          <h1 className="font-heading text-4xl xl:text-5xl font-extrabold leading-tight mb-4">
            Doctor <span className="text-[#c2761c]">Portal</span>
          </h1>
          <p className="text-white/70 text-lg max-w-md leading-relaxed">
            Access your medical dashboard to manage patient records, camp schedules, and healthcare delivery.
          </p>
          <div className="mt-12 space-y-4">
            {[
              "Manage patient consultations",
              "Schedule and conduct medical camps",
              "Prescribe and track treatments",
              "Access medical records securely",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c2761c] shrink-0" />
                <span className="text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#faf9f6] px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-[#1a1a2e]/60 hover:text-[#1a1a2e] mb-8 transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#0d6662] rounded-xl flex items-center justify-center">
              <Stethoscope className="text-white" size={22} />
            </div>
            <span className="font-heading text-xl font-bold text-[#1a1a2e]">VGMF Doctor</span>
          </div>

          <div className="mb-8">
            <div className="w-14 h-14 bg-[#0d6662] rounded-2xl flex items-center justify-center mb-4">
              <Stethoscope className="text-white" size={28} />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-[#1a1a2e] mb-2">Doctor Login</h1>
            <p className="text-[#1a1a2e]/60">VGMF Medical Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#1a1a2e]/60 uppercase tracking-wider mb-1.5">Doctor Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="doctor@vaidyagogate.org"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1a2e]/60 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a2e]/60 hover:text-[#1a1a2e] transition-colors"
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
                  Verifying...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Sign In as Doctor
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#1a1a2e]/60">
              Not a doctor?{" "}
              <Link href="/login" className="text-[#0d6662] font-semibold hover:underline">
                User Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
