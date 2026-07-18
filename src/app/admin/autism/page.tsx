"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Eye, X, CheckCircle2, Clock, UserCircle } from "lucide-react";
import toast from "react-hot-toast";

interface AutismReg {
  id: string;
  childName: string;
  childAge?: number;
  childGender?: string;
  parentName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  diagnosisDetails?: string;
  therapyHistory?: string;
  specialRequirements?: string;
  eTicketNumber: string;
  isPreRegistered: boolean;
  isFullyRegistered: boolean;
  isVerified: boolean;
  competitionCategory?: string;
  registrationDate: string;
}

export default function AdminAutism() {
  const [registrations, setRegistrations] = useState<AutismReg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDetail, setShowDetail] = useState<AutismReg | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const stats = {
    total: registrations.length,
    registered: registrations.filter(r => r.isFullyRegistered).length,
    preRegistered: registrations.filter(r => r.isPreRegistered && !r.isFullyRegistered).length,
    verified: registrations.filter(r => r.isVerified).length,
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/autism?search=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setRegistrations(data.items || []);
    } catch {
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getStatus = (r: AutismReg) => {
    if (r.isFullyRegistered) return { label: "Registered", style: "bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/20" };
    if (r.isPreRegistered) return { label: "Pre-Registered", style: "bg-amber-50 text-amber-700 border border-amber-200" };
    return { label: "Pending", style: "bg-slate-100 text-slate-600 border border-slate-200" };
  };

  const handleVerify = async (reg: AutismReg) => {
    setUpdatingId(reg.id);
    try {
      const res = await fetch(`/api/admin/autism/${reg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !reg.isVerified }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(reg.isVerified ? "Verification removed" : "Registration verified");
      setRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, isVerified: !r.isVerified } : r));
      if (showDetail?.id === reg.id) setShowDetail(prev => prev ? { ...prev, isVerified: !prev.isVerified } : null);
    } catch {
      toast.error("Failed to update verification");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRegister = async (reg: AutismReg) => {
    setUpdatingId(reg.id);
    try {
      const res = await fetch(`/api/admin/autism/${reg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFullyRegistered: true }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Marked as fully registered");
      setRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, isFullyRegistered: true } : r));
      if (showDetail?.id === reg.id) setShowDetail(prev => prev ? { ...prev, isFullyRegistered: true } : null);
    } catch {
      toast.error("Failed to update registration");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-ink">Autism Programme</h1>
        <p className="text-muted mt-1">Child registrations &amp; therapy management</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Registrations", value: stats.total, color: "bg-blue-50 text-blue-600" },
          { label: "Fully Registered", value: stats.registered, color: "bg-emerald-accent/10 text-emerald-accent" },
          { label: "Pre-Registered", value: stats.preRegistered, color: "bg-amber-50 text-amber-600" },
          { label: "Verified", value: stats.verified, color: "bg-violet-50 text-violet-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}>
              <UserCircle size={20} />
            </div>
            <p className="text-xs text-muted uppercase tracking-wider">{s.label}</p>
            <p className="font-heading text-2xl font-extrabold text-ink mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchData(); }}
            placeholder="Search by child or parent name..." className="input-field pl-10 w-full" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Child</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Age</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Parent</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">E-Ticket</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Verified</th>
                <th className="text-right px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : registrations.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-muted">No registrations found</td></tr>
              ) : (
                registrations.map(reg => {
                  const status = getStatus(reg);
                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-ink">{reg.childName}</td>
                      <td className="px-6 py-4 text-muted">{reg.childAge ?? "—"}</td>
                      <td className="px-6 py-4 text-muted text-sm">{reg.parentName || "—"}</td>
                      <td className="px-6 py-4 font-mono text-xs text-navy">{reg.eTicketNumber}</td>
                      <td className="px-6 py-4 text-muted text-xs">
                        {new Date(reg.registrationDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${status.style}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${reg.isVerified ? "bg-emerald-accent/10 text-emerald-accent" : "bg-slate-100 text-muted"}`}>
                          {reg.isVerified ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setShowDetail(reg)} className="p-2 hover:bg-slate-100 rounded-lg text-muted transition-colors" title="View Details"><Eye size={16} /></button>
                      </td>
                    </tr>
                  );
                })
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
                <h2 className="font-heading text-xl font-bold text-ink">{showDetail.childName}</h2>
                <p className="text-xs text-muted mt-0.5 font-mono">{showDetail.eTicketNumber}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Child Name", value: showDetail.childName },
                  { label: "Age", value: showDetail.childAge ? `${showDetail.childAge} years` : "—" },
                  { label: "Gender", value: showDetail.childGender || "—" },
                  { label: "Parent Name", value: showDetail.parentName || "—" },
                  { label: "Phone", value: showDetail.phoneNumber || "—" },
                  { label: "Email", value: showDetail.email || "—" },
                  { label: "City", value: showDetail.city || "—" },
                  { label: "State", value: showDetail.state || "—" },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-muted">{item.label}</p>
                    <p className="font-semibold text-ink text-sm mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              {showDetail.diagnosisDetails && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Diagnosis Details</p>
                  <p className="text-sm text-ink-soft">{showDetail.diagnosisDetails}</p>
                </div>
              )}
              {showDetail.therapyHistory && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Therapy History</p>
                  <p className="text-sm text-ink-soft">{showDetail.therapyHistory}</p>
                </div>
              )}
              {showDetail.specialRequirements && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Special Requirements</p>
                  <p className="text-sm text-ink-soft">{showDetail.specialRequirements}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button onClick={() => handleVerify(showDetail)} disabled={updatingId === showDetail.id}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${showDetail.isVerified ? "bg-slate-100 text-ink-soft hover:bg-slate-200" : "bg-emerald-accent text-white hover:bg-emerald-accent/90"}`}>
                <CheckCircle2 size={16} /> {showDetail.isVerified ? "Unverify" : "Verify"}
              </button>
              {!showDetail.isFullyRegistered && (
                <button onClick={() => handleRegister(showDetail)} disabled={updatingId === showDetail.id}
                  className="flex-1 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy/90 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Mark Registered
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
