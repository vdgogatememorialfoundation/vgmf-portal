"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
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

      if (session?.user?.role !== "ADMIN") {
        await signIn("credentials", { email: "", password: "", redirect: false });
        toast.error("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      toast.success("Welcome, Admin!");
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-navy via-navy-light to-navy">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-maroon rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link href="/" className="inline-flex items-center gap-2 text-gold/80 hover:text-gold mb-12 transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="w-20 h-20 bg-gold/10 border-2 border-gold/30 rounded-2xl flex items-center justify-center mb-8">
            <Shield className="text-gold" size={36} />
          </div>
          <h1 className="font-heading text-4xl xl:text-5xl font-extrabold leading-tight mb-4">
            Admin <span className="text-gold">Portal</span>
          </h1>
          <p className="text-white/60 text-lg max-w-md leading-relaxed">
            Secure administrative access to manage the VGMF platform, users, and organizational settings.
          </p>
          <div className="mt-12 space-y-4">
            {[
              "Manage users and role assignments",
              "Configure platform settings",
              "View analytics and reports",
              "Oversee all foundation operations",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
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
              <Shield className="text-gold" size={22} />
            </div>
            <span className="font-heading text-xl font-bold text-navy">VGMF Admin</span>
          </div>

          <div className="mb-8">
            <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center mb-4">
              <Shield className="text-gold" size={28} />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-navy mb-2">Admin Login</h1>
            <p className="text-muted">VGMF Management Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="admin@vaidyagogate.org"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Password</label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy transition-colors"
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
                  Sign In as Admin
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Not an admin?{" "}
              <Link href="/login" className="text-navy font-semibold hover:underline">
                User Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
