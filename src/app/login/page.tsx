"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2, Stethoscope, GraduationCap, FlaskConical, Heart, Users, Building2 } from "lucide-react";
import toast from "react-hot-toast";

const categoryLinks = [
  { href: "/signup", label: "Doctor", icon: Stethoscope, color: "hover:border-teal hover:text-teal" },
  { href: "/signup", label: "Student", icon: GraduationCap, color: "hover:border-gold hover:text-gold" },
  { href: "/signup", label: "Researcher", icon: FlaskConical, color: "hover:border-maroon hover:text-maroon" },
  { href: "/signup", label: "Patient", icon: Heart, color: "hover:border-rose-500 hover:text-rose-500" },
  { href: "/signup", label: "General", icon: Users, color: "hover:border-indigo-500 hover:text-indigo-500" },
  { href: "/signup", label: "Institution", icon: Building2, color: "hover:border-purple-500 hover:text-purple-500" },
];

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-cream px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-ink/60 hover:text-ink mb-8 transition-colors text-sm font-medium">
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
          <p className="text-ink/60">Sign in to your VGMF account</p>
        </div>

        {justRegistered && (
          <div className="flex items-center gap-3 p-4 bg-teal/5 border border-teal/20 rounded-xl mb-6">
            <CheckCircle2 size={20} className="text-teal shrink-0" />
            <p className="text-sm text-teal font-medium">Account created! Please sign in.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-1.5">Email Address</label>
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
            <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-1.5">Password</label>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink transition-colors"
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
          <p className="text-sm text-ink/60">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-teal font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-ink/60 mb-4">Quick sign in</p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/login"
              className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium text-ink/60 hover:border-teal hover:text-teal transition-all"
            >
              Admin
            </Link>
            <Link
              href="/staff/login"
              className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium text-ink/60 hover:border-teal hover:text-teal transition-all"
            >
              Staff
            </Link>
            <Link
              href="/doctor/login"
              className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium text-ink/60 hover:border-teal hover:text-teal transition-all"
            >
              Doctor
            </Link>
            <Link
              href="/judge/login"
              className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium text-ink/60 hover:border-teal hover:text-teal transition-all"
            >
              Judge
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-ink/60 mb-4">Register as</p>
          <div className="grid grid-cols-3 gap-2">
            {categoryLinks.map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 border-2 border-gray-200 rounded-xl text-xs font-medium text-ink/60 transition-all ${cat.color}`}
              >
                <cat.icon size={16} />
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserLogin() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal via-cyan-500 to-teal-light">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold rounded-full blur-3xl" />
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
            Vaidya Go <span className="text-gold">Medical</span> Foundation
          </h1>
          <p className="text-white/70 text-lg max-w-md leading-relaxed">
            Empowering communities through healthcare, education, and social welfare initiatives since 1992.
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

      <Suspense fallback={<div className="w-full lg:w-1/2 flex items-center justify-center bg-cream"><Loader2 className="animate-spin text-teal" size={32} /></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
