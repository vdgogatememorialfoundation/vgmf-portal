"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); }
    else { router.push("/login?registered=true"); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-navy">Create Account</h1>
          <p className="text-muted mt-2">Join the VGMF community</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-8 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
          {["name","email","phone","password","confirm"].map(f => (
            <div key={f}>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 capitalize">{f === "confirm" ? "Confirm Password" : f}</label>
              <input type={f.includes("password") ? "password" : f === "email" ? "email" : "text"}
                value={(form as any)[f]} onChange={e => setForm({...form, [f]: e.target.value})} required
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                placeholder={f === "name" ? "Full Name" : f === "email" ? "you@example.com" : f === "phone" ? "+91 98765 43210" : f === "confirm" ? "••••••••" : "••••••••"} />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light transition-colors disabled:opacity-50">
            {loading ? "Creating..." : "Create Account"}
          </button>
          <p className="text-center text-sm text-muted">
            Already have an account? <Link href="/login" className="text-navy font-semibold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
