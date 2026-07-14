"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ClipboardCheck, MessageSquare, TrendingUp } from "lucide-react";

export default function ReviewerDashboard() {
  const { data: session } = useSession();
  if (!session) return <div className="p-10 text-center"><Link href="/login" className="text-navy font-semibold">Please sign in</Link></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-extrabold text-navy mb-2">Reviewer Dashboard</h1>
      <p className="text-muted mb-8">Welcome, {session.user?.name || "Reviewer"}</p>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: ClipboardCheck, label: "Pending Reviews", value: "3", color: "bg-yellow-50 text-yellow-700" },
          { icon: MessageSquare, label: "Comments", value: "12", color: "bg-blue-50 text-blue-700" },
          { icon: TrendingUp, label: "Reviewed", value: "8", color: "bg-green-50 text-green-700" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}><s.icon size={20} /></div>
            <p className="text-xs text-muted uppercase">{s.label}</p>
            <p className="font-heading text-2xl font-extrabold text-navy mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border p-6">
        <h3 className="font-heading text-lg font-bold text-navy mb-4">Fellowship Applications to Review</h3>
        <p className="text-sm text-muted">No applications currently assigned for review.</p>
      </div>
    </div>
  );
}
