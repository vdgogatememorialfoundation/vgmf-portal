"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardCheck, CheckCircle, XCircle, Clock, TrendingUp, FileText, Eye, Loader2, User, MapPin, BookOpen } from "lucide-react";

type Application = {
  id: string;
  trackingNumber: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  areaOfInterest: string | null;
  institution: string | null;
  status: string;
  createdAt: string;
  user: { name: string | null; email: string | null };
};

export default function ReviewerDashboard() {
  const { data: session, status: authStatus } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [stats, setStats] = useState({ pending: 0, reviewed: 0, approved: 0 });

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchApplications();
    }
  }, [authStatus]);

  async function fetchApplications() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/fellowships?status=SUBMITTED,UNDER_REVIEW");
      const data = await res.json();
      const allApps: Application[] = data.items || [];

      setApplications(allApps);
      setStats({
        pending: allApps.filter((a) => a.status === "SUBMITTED").length,
        reviewed: allApps.filter((a) => a.status === "UNDER_REVIEW").length,
        approved: allApps.filter((a) => ["SHORTLISTED", "SELECTED", "FUNDED"].includes(a.status)).length,
      });
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    setUpdatingId(id);
    const newStatus = action === "approve" ? "UNDER_REVIEW" : "REJECTED";
    try {
      await fetch("/api/admin/fellowships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchApplications();
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  if (authStatus === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="text-[#0891b2] animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4">Please sign in to access the reviewer dashboard.</p>
          <Link href="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
      UNDER_REVIEW: "bg-yellow-50 text-yellow-700 border-yellow-200",
      SHORTLISTED: "bg-purple-50 text-purple-700 border-purple-200",
      SELECTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      REJECTED: "bg-red-50 text-red-700 border-red-200",
    };
    return map[s] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy mb-2">Reviewer Dashboard</h1>
        <p className="text-muted">Welcome, {(session.user as any)?.name || "Reviewer"}. Review and assess fellowship applications below.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Clock, label: "Pending Review", value: stats.pending, color: "from-yellow-500 to-amber-500" },
          { icon: Eye, label: "Under Review", value: stats.reviewed, color: "from-blue-500 to-indigo-500" },
          { icon: CheckCircle, label: "Shortlisted", value: stats.approved, color: "from-emerald-500 to-green-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-6 card-hover">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-white shadow-md ring-0`}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="font-heading text-2xl font-extrabold text-navy">{loading ? "—" : s.value}</p>
                <p className="text-xs text-muted font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
          <FileText size={18} className="text-navy" />
          <h2 className="font-heading text-lg font-extrabold text-navy">Fellowship Applications</h2>
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <Loader2 size={32} className="text-gold animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-16 text-center">
            <ClipboardCheck size={40} className="text-muted/30 mx-auto mb-3" />
            <p className="text-sm text-muted font-medium">No pending applications to review</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-dark">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Applicant</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider hidden sm:table-cell">Tracking #</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider hidden md:table-cell">Area of Interest</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-cream-dark/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#0891b2]/5 rounded-xl flex items-center justify-center shrink-0">
                          <User size={14} className="text-navy" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-navy truncate">{app.fullName || app.user?.name || "Unknown"}</p>
                          <p className="text-xs text-muted truncate">{app.email || app.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="font-mono text-xs font-bold text-navy bg-gray-50 px-2 py-1 rounded">{app.trackingNumber}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-muted">{app.areaOfInterest || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusBadge(app.status)}`}>{app.status.replace("_", " ")}</span>
                    </td>
                    <td className="px-6 py-4">
                      {app.status === "SUBMITTED" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAction(app.id, "approve")}
                            disabled={updatingId === app.id}
                            className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle size={12} /> Review
                          </button>
                          <button
                            onClick={() => handleAction(app.id, "reject")}
                            disabled={updatingId === app.id}
                            className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        </div>
                      )}
                      {app.status === "UNDER_REVIEW" && (
                        <span className="text-xs text-yellow-600 font-semibold italic">In Progress</span>
                      )}
                      {["SHORTLISTED", "SELECTED", "FUNDED"].includes(app.status) && (
                        <span className="text-xs text-emerald-600 font-semibold">Completed</span>
                      )}
                      {app.status === "REJECTED" && (
                        <span className="text-xs text-red-500 font-semibold">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
