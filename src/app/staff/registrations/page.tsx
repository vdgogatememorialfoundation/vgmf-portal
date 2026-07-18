"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  X,
  RefreshCw,
  GraduationCap,
  FlaskConical,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";

interface SeminarReg {
  id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  institution?: string;
  designation?: string;
  createdAt: string;
  user?: { name: string; email: string };
}

interface FellowshipApp {
  id: string;
  trackingNumber: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  areaOfInterest?: string;
  institution?: string;
  status: string;
  submittedAt: string;
  user?: { name: string; email: string };
}

interface AutismReg {
  id: string;
  childName: string;
  childAge?: number;
  parentName?: string;
  email?: string;
  phoneNumber?: string;
  city?: string;
  eTicketNumber: string;
  isPreRegistered: boolean;
  isFullyRegistered: boolean;
  isVerified: boolean;
  registrationDate: string;
}

type UnifiedReg = {
  id: string;
  type: "Seminar" | "Fellowship" | "Autism";
  name: string;
  email: string;
  phone: string;
  detail1: string;
  detail1Label: string;
  detail2: string;
  detail2Label: string;
  status: string;
  statusStyle: string;
  date: string;
  raw: SeminarReg | FellowshipApp | AutismReg;
};

const FELLOWSHIP_STATUS_STYLES: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700 border border-blue-200",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 border border-amber-200",
  SHORTLISTED: "bg-violet-50 text-violet-700 border border-violet-200",
  INTERVIEW_SCHEDULED: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  SELECTED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border border-red-200",
  FUNDED: "bg-gold/15 text-amber-800 border border-gold/30",
};

const AUTISM_STATUS_STYLES: Record<string, string> = {
  registered: "bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/20",
  preRegistered: "bg-amber-50 text-amber-700 border border-amber-200",
  pending: "bg-slate-100 text-slate-600 border border-slate-200",
};

export default function StaffRegistrations() {
  const [seminarRegs, setSeminarRegs] = useState<SeminarReg[]>([]);
  const [fellowshipApps, setFellowshipApps] = useState<FellowshipApp[]>([]);
  const [autismRegs, setAutismRegs] = useState<AutismReg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showDetail, setShowDetail] = useState<UnifiedReg | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      const [seminarRes, fellowshipRes, autismRes] = await Promise.allSettled([
        fetch(`/api/admin/seminars${params}`),
        fetch(`/api/admin/fellowships${params}`),
        fetch(`/api/admin/autism${params}`),
      ]);

      if (seminarRes.status === "fulfilled" && seminarRes.value.ok) {
        const d = await seminarRes.value.json();
        setSeminarRegs(d.items || []);
      }
      if (fellowshipRes.status === "fulfilled" && fellowshipRes.value.ok) {
        const d = await fellowshipRes.value.json();
        setFellowshipApps(d.items || d.applications || []);
      }
      if (autismRes.status === "fulfilled" && autismRes.value.ok) {
        const d = await autismRes.value.json();
        setAutismRegs(d.items || []);
      }
    } catch {
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const unifyData = (): UnifiedReg[] => {
    const seminarUnified: UnifiedReg[] = seminarRegs.map(r => ({
      id: r.id,
      type: "Seminar" as const,
      name: r.fullName || r.user?.name || "—",
      email: r.email || r.user?.email || "—",
      phone: r.phoneNumber || "—",
      detail1: r.institution || "—",
      detail1Label: "Institution",
      detail2: r.designation || "—",
      detail2Label: "Designation",
      status: "Registered",
      statusStyle: "bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/20",
      date: r.createdAt,
      raw: r,
    }));

    const fellowshipUnified: UnifiedReg[] = fellowshipApps.map(a => ({
      id: a.id,
      type: "Fellowship" as const,
      name: a.fullName || a.user?.name || "—",
      email: a.email || a.user?.email || "—",
      phone: a.phoneNumber || "—",
      detail1: a.areaOfInterest || "—",
      detail1Label: "Research Area",
      detail2: a.institution || "—",
      detail2Label: "Institution",
      status: a.status.replace(/_/g, " "),
      statusStyle: FELLOWSHIP_STATUS_STYLES[a.status] || "bg-slate-100 text-slate-600 border border-slate-200",
      date: a.submittedAt,
      raw: a,
    }));

    const autismUnified: UnifiedReg[] = autismRegs.map(r => {
      let statusLabel = "Pending";
      let statusKey = "pending";
      if (r.isFullyRegistered) { statusLabel = "Registered"; statusKey = "registered"; }
      else if (r.isPreRegistered) { statusLabel = "Pre-Registered"; statusKey = "preRegistered"; }
      return {
        id: r.id,
        type: "Autism" as const,
        name: r.childName,
        email: r.email || "—",
        phone: r.phoneNumber || "—",
        detail1: r.parentName || "—",
        detail1Label: "Parent",
        detail2: r.city || "—",
        detail2Label: "City",
        status: statusLabel,
        statusStyle: AUTISM_STATUS_STYLES[statusKey],
        date: r.registrationDate,
        raw: r,
      };
    });

    return [...seminarUnified, ...fellowshipUnified, ...autismUnified];
  };

  const allRegs = unifyData();
  const filtered = allRegs.filter(r => {
    if (typeFilter && r.type !== typeFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const typeCounts = {
    Seminar: seminarRegs.length,
    Fellowship: fellowshipApps.length,
    Autism: autismRegs.length,
  };

  const typeConfig = {
    Seminar: { icon: GraduationCap, color: "text-gold bg-gold/10" },
    Fellowship: { icon: FlaskConical, color: "text-teal bg-teal/10" },
    Autism: { icon: Brain, typeKey: "text-maroon bg-maroon/10" },
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">Registrations</h1>
          <p className="text-muted mt-1">
            {(typeCounts.Seminar + typeCounts.Fellowship + typeCounts.Autism)} total registrations across all programs
          </p>
        </div>
        <button onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-cream-dark rounded-xl text-sm font-semibold text-navy hover:bg-cream/50 transition-colors">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {(["Seminar", "Fellowship", "Autism"] as const).map(type => {
          const cfg = typeConfig[type];
          const Icon = type === "Autism" ? Brain : type === "Fellowship" ? FlaskConical : GraduationCap;
          const colorClass = type === "Seminar" ? cfg.color : type === "Fellowship" ? cfg.color : (cfg as { typeKey: string }).typeKey;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? "" : type)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                typeFilter === type
                  ? "bg-navy text-white border-navy shadow-lg shadow-navy/20"
                  : "bg-white border-cream-dark hover:border-navy/20"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                typeFilter === type ? "bg-white/20" : colorClass
              }`}>
                <Icon size={20} />
              </div>
              <div className="text-left">
                <p className={`text-xs font-semibold uppercase tracking-wider ${
                  typeFilter === type ? "text-white/70" : "text-muted"
                }`}>{type}</p>
                <p className={`font-heading text-xl font-extrabold ${
                  typeFilter === type ? "text-white" : "text-navy"
                }`}>{typeCounts[type]}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchData(); }}
            placeholder="Search by name, email, or phone..."
            className="input-field pl-10 w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/60 border-b border-cream-dark">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Details</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-cream rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-muted">No registrations found</td></tr>
              ) : (
                filtered.map(reg => {
                  const typeColor = reg.type === "Seminar"
                    ? "bg-gold/10 text-gold"
                    : reg.type === "Fellowship"
                    ? "bg-teal/10 text-teal"
                    : "bg-maroon/10 text-maroon";
                  const TypeIcon = reg.type === "Seminar"
                    ? GraduationCap
                    : reg.type === "Fellowship"
                    ? FlaskConical
                    : Brain;

                  return (
                    <tr key={`${reg.type}-${reg.id}`} className="hover:bg-cream/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`w-8 h-8 rounded-lg ${typeColor} flex items-center justify-center`}>
                          <TypeIcon size={14} />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-ink">{reg.name}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-ink">{reg.email}</div>
                        <div className="text-xs text-muted">{reg.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted">
                        <span className="font-medium text-ink-soft">{reg.detail1Label}:</span> {reg.detail1}
                        <br />
                        <span className="font-medium text-ink-soft">{reg.detail2Label}:</span> {reg.detail2}
                      </td>
                      <td className="px-6 py-4 text-muted text-xs">
                        {new Date(reg.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${reg.statusStyle}`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setShowDetail(reg)}
                          className="p-2 hover:bg-teal/10 rounded-lg text-muted hover:text-teal transition-colors" title="View Details">
                          <Eye size={16} />
                        </button>
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
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-cream-dark max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-cream-dark sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    showDetail.type === "Seminar"
                      ? "bg-gold/10 text-gold"
                      : showDetail.type === "Fellowship"
                      ? "bg-teal/10 text-teal"
                      : "bg-maroon/10 text-maroon"
                  }`}>{showDetail.type}</span>
                  <h2 className="font-heading text-xl font-bold text-navy">{showDetail.name}</h2>
                </div>
                <p className="text-xs text-muted mt-0.5">{showDetail.email}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-2 hover:bg-cream rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6">
              {showDetail.type === "Seminar" && (() => {
                const raw = showDetail.raw as SeminarReg;
                return (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Full Name", value: showDetail.name },
                      { label: "Email", value: showDetail.email },
                      { label: "Phone", value: showDetail.phone },
                      { label: "Institution", value: raw.institution || "—" },
                      { label: "Designation", value: raw.designation || "—" },
                      { label: "Registration Date", value: new Date(showDetail.date).toLocaleDateString("en-IN", { dateStyle: "long" }) },
                    ].map((item, i) => (
                      <div key={i} className="bg-cream/50 rounded-xl p-3">
                        <p className="text-xs text-muted">{item.label}</p>
                        <p className="font-semibold text-ink text-sm mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {showDetail.type === "Fellowship" && (() => {
                const raw = showDetail.raw as FellowshipApp;
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Full Name", value: showDetail.name },
                        { label: "Email", value: showDetail.email },
                        { label: "Phone", value: showDetail.phone },
                        { label: "Institution", value: raw.institution || "—" },
                        { label: "Area of Interest", value: raw.areaOfInterest || "—" },
                        { label: "Tracking #", value: raw.trackingNumber },
                        { label: "Status", value: raw.status.replace(/_/g, " ") },
                        { label: "Submitted", value: new Date(showDetail.date).toLocaleDateString("en-IN", { dateStyle: "long" }) },
                      ].map((item, i) => (
                        <div key={i} className="bg-cream/50 rounded-xl p-3">
                          <p className="text-xs text-muted">{item.label}</p>
                          <p className="font-semibold text-ink text-sm mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {showDetail.type === "Autism" && (() => {
                const raw = showDetail.raw as AutismReg;
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Child Name", value: raw.childName },
                        { label: "Age", value: raw.childAge ? `${raw.childAge} years` : "—" },
                        { label: "Parent Name", value: raw.parentName || "—" },
                        { label: "Phone", value: showDetail.phone },
                        { label: "Email", value: showDetail.email },
                        { label: "City", value: raw.city || "—" },
                        { label: "E-Ticket", value: raw.eTicketNumber },
                        { label: "Verified", value: raw.isVerified ? "Yes" : "No" },
                      ].map((item, i) => (
                        <div key={i} className="bg-cream/50 rounded-xl p-3">
                          <p className="text-xs text-muted">{item.label}</p>
                          <p className="font-semibold text-ink text-sm mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="p-6 border-t border-cream-dark">
              <button onClick={() => setShowDetail(null)} className="btn-primary w-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
