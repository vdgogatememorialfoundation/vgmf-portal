"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const result = await signIn("credentials", { email, password, redirect: false });
    
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }
    
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    
    if (session?.user?.role && session.user.role !== "USER") {
      await signIn("credentials", { email: "", password: "", redirect: false });
      setError("This login is for registered users only. Please use the appropriate portal login.");
      setLoading(false);
      return;
    }
    
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-navy">Welcome Back</h1>
          <p className="text-muted mt-2">Sign in to your VGMF account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-8 space-y-5">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <LogIn size={18} /> {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-sm text-muted">
            Don&apos;t have an account? <Link href="/signup" className="text-navy font-semibold hover:underline">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
