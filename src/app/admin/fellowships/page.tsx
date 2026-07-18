"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, X, Eye, FlaskConical, FileCheck, TrendingUp, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface FellowshipApp {
  id: string;
  trackingNumber: string;
  status: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  areaOfInterest?: string;
  statementOfPurpose?: string;
  education?: string;
  institution?: string;
  experienceYears?: number;
  preferredMentor?: string;
  rejectionReason?: string;
  adminNotes?: string;
  submittedAt: string;
  user?: { id: string; name: string; email: string };
}

const STATUS_OPTIONS = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW_SCHEDULED", "SELECTED", "REJECTED", "FUNDED"];

const STATUS_STYLES: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700 border border-blue-200",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 border border-amber-200",
  SHORTLISTED: "bg-violet-50 text-violet-700 border border-violet-200",
  INTERVIEW_SCHEDULED: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  SELECTED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border border-red-200",
  FUNDED: "bg-gold/15 text-amber-800 border border-gold/30",
  DRAFT: "bg-slate-100 text-slate-600 border border-slate-200",
};

export default function AdminFellowships() {
  const [applications, setApplications] = useState<FellowshipApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDetail, setShowDetail] = useState<FellowshipApp | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const stats = {
    total: applications.length,
    submitted: applications.filter(a => a.status === "SUBMITTED").length,
    shortlisted: applications.filter(a => a.status === "SHORTLISTED" || a.status === "SELECTED").length,
    rejected: applications.filter(a => a.status === "REJECTED").length,
  };

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/fellowships?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setApplications(data.items || data.applications || []);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/fellowships/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Status updated to ${newStatus.replace(/_/g, " ").toLowerCase()}`);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      if (showDetail?.id === id) setShowDetail(prev => prev ? { ...prev, status: newStatus } : null);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = applications.filter(a => {
    if (!statusFilter) return true;
    return a.status === statusFilter;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-ink">Fellowships</h1>
        <p className="text-muted mt-1">Manage Viddhakarma Research Fellowship applications</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FlaskConical, label: "Total Apps", value: stats.total, color: "bg-blue-50 text-blue-600" },
          { icon: FileCheck, label: "Shortlisted", value: stats.shortlisted, color: "bg-violet-50 text-violet-600" },
          { icon: CheckCircle2, label: "Submitted", value: stats.submitted, color: "bg-emerald-accent/10 text-emerald-accent" },
          { icon: XCircle, label: "Rejected", value: stats.rejected, color: "bg-red-50 text-danger" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}><s.icon size={20} /></div>
            <p className="text-xs text-muted uppercase tracking-wider">{s.label}</p>
            <p className="font-heading text-2xl font-extrabold text-ink mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchApplications(); }}
            placeholder="Search by name or tracking #..." className="input-field pl-10 w-full" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto min-w-[170px]">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Tracking #</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Applicant</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Research Area</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Institution</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Date</th>
                <th className="text-right px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-muted">No applications found</td></tr>
              ) : (
                filtered.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-navy">{app.trackingNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink">{app.fullName || app.user?.name || "—"}</div>
                      <div className="text-xs text-muted">{app.email || app.user?.email || ""}</div>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs max-w-[200px] truncate">{app.areaOfInterest || "—"}</td>
                    <td className="px-6 py-4 text-muted text-xs">{app.institution || "—"}</td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={e => handleStatusUpdate(app.id, e.target.value)}
                        disabled={updatingId === app.id}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 outline-none cursor-pointer transition-all ${STATUS_STYLES[app.status] || STATUS_STYLES.SUBMITTED} ${updatingId === app.id ? "opacity-50" : ""}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">
                      {new Date(app.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setShowDetail(app)} className="p-2 hover:bg-slate-100 rounded-lg text-muted transition-colors" title="View Details"><Eye size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-heading text-xl font-bold text-ink">Application Details</h2>
                <p className="text-xs text-muted mt-0.5 font-mono">{showDetail.trackingNumber}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Full Name", value: showDetail.fullName || showDetail.user?.name || "—" },
                  { label: "Email", value: showDetail.email || showDetail.user?.email || "—" },
                  { label: "Phone", value: showDetail.phoneNumber || "—" },
                  { label: "Institution", value: showDetail.institution || "—" },
                  { label: "Education", value: showDetail.education || "—" },
                  { label: "Experience", value: showDetail.experienceYears ? `${showDetail.experienceYears} years` : "—" },
                  { label: "Research Area", value: showDetail.areaOfInterest || "—" },
                  { label: "Preferred Mentor", value: showDetail.preferredMentor || "—" },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-muted">{item.label}</p>
                    <p className="font-semibold text-ink text-sm mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              {showDetail.statementOfPurpose && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Statement of Purpose</p>
                  <p className="text-sm text-ink-soft leading-relaxed">{showDetail.statementOfPurpose}</p>
                </div>
              )}
              <div className="bg-slate-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-ink mb-1.5">Update Status</label>
                <select
                  value={showDetail.status}
                  onChange={e => handleStatusUpdate(showDetail.id, e.target.value)}
                  className={`w-full text-sm font-semibold px-3 py-2 rounded-xl border-0 outline-none cursor-pointer ${STATUS_STYLES[showDetail.status] || STATUS_STYLES.SUBMITTED}`}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100">
              <button onClick={() => setShowDetail(null)} className="btn-primary w-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
