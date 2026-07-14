"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Building2, Users, TrendingUp, FileText } from "lucide-react";

export default function TrusteeDashboard() {
  const { data: session } = useSession();
  if (!session) return <div className="p-10 text-center"><Link href="/login" className="text-navy font-semibold">Please sign in</Link></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-extrabold text-navy mb-2">Trustee Dashboard</h1>
      <p className="text-muted mb-8">Welcome, {session.user?.name || "Trustee"}</p>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FileText, label: "Total Fellowships", value: "24", color: "bg-purple-50 text-purple-700" },
          { icon: Users, label: "Total Registrations", value: "345", color: "bg-blue-50 text-blue-700" },
          { icon: Building2, label: "Programmes", value: "3", color: "bg-green-50 text-green-700" },
          { icon: TrendingUp, label: "Funds Disbursed", value: "₹5.2L", color: "bg-gold/10 text-gold" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}><s.icon size={20} /></div>
            <p className="text-xs text-muted uppercase">{s.label}</p>
            <p className="font-heading text-2xl font-extrabold text-navy mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-heading text-lg font-bold text-navy mb-4">Fellowship Overview</h3>
          <p className="text-sm text-muted">24 applications received, 8 funded, 12 under review</p>
        </div>
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-heading text-lg font-bold text-navy mb-4">Financial Summary</h3>
          <p className="text-sm text-muted">₹5.2L disbursed across 8 fellowships</p>
        </div>
      </div>
    </div>
  );
}
