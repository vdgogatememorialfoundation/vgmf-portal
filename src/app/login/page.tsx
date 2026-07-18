"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      else if (role === "DOCTOR") router.push("/dashboard");
      else if (role === "JUDGE" || role === "REVIEWER") router.push("/dashboard");
      else if (role === "TRUSTEE") router.push("/dashboard");
      else router.push("/dashboard");

      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0891b2] via-cyan-500 to-teal-300">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#d97706] rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-12 transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="w-20 h-20 bg-white/15 border-2 border-white/25 rounded-2xl flex items-center justify-center mb-8">
            <span className="font-heading text-3xl font-extrabold text-white">VG</span>
          </div>
          <h1 className="font-heading text-4xl xl:text-5xl font-extrabold leading-tight mb-4">
            Vaidya Go <span className="text-[#d97706]">Medical</span> Foundation
          </h1>
          <p className="text-white/70 text-lg max-w-md leading-relaxed">
            Empowering communities through healthcare, education, and social welfare initiatives since 1992.
          </p>
          <div className="mt-12 flex items-center gap-8 text-sm text-white/50">
            <div>
              <p className="text-[#d97706] font-heading text-2xl font-bold">25K+</p>
              <p>Lives Impacted</p>
            </div>
            <div className="w-px h-10 bg-white/15" />
            <div>
              <p className="text-[#d97706] font-heading text-2xl font-bold">150+</p>
              <p>Medical Camps</p>
            </div>
            <div className="w-px h-10 bg-white/15" />
            <div>
              <p className="text-[#d97706] font-heading text-2xl font-bold">30+</p>
              <p>Years of Service</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f8fafc] px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-[#1e293b]/60 hover:text-[#1e293b] mb-8 transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#0891b2] rounded-xl flex items-center justify-center">
              <span className="font-heading text-xl font-extrabold text-white">VG</span>
            </div>
            <span className="font-heading text-xl font-bold text-[#1e293b]">VGMF</span>
          </div>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-extrabold text-[#1e293b] mb-2">Welcome Back</h1>
            <p className="text-[#1e293b]/60">Sign in to your VGMF account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#1e293b]/60 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e293b]/60 uppercase tracking-wider mb-1.5">Password</label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1e293b]/60 hover:text-[#1e293b] transition-colors"
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

          <div className="mt-6 text-center">
            <p className="text-sm text-[#1e293b]/60">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#0891b2] font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-[#1e293b]/60 mb-4">Or sign in as</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium text-[#1e293b]/60 hover:border-[#0891b2] hover:text-[#0891b2] transition-all"
              >
                Admin
              </Link>
              <Link
                href="/staff/login"
                className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium text-[#1e293b]/60 hover:border-[#0891b2] hover:text-[#0891b2] transition-all"
              >
                Staff
              </Link>
              <Link
                href="/doctor/login"
                className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium text-[#1e293b]/60 hover:border-emerald-500 hover:text-emerald-500 transition-all"
              >
                Doctor
              </Link>
              <Link
                href="/judge/login"
                className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium text-[#1e293b]/60 hover:border-[#0891b2] hover:text-[#0891b2] transition-all"
              >
                Judge
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
