"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, CheckCircle, ArrowLeft, Loader2, AlertCircle, Clock, FileText, Users, Award, Banknote } from "lucide-react";

const STATUS_FLOW = [
  { key: "SUBMITTED", label: "Submitted", icon: FileText },
  { key: "UNDER_REVIEW", label: "Under Review", icon: Search },
  { key: "SHORTLISTED", label: "Shortlisted", icon: Users },
  { key: "INTERVIEW_SCHEDULED", label: "Interview", icon: Clock },
  { key: "SELECTED", label: "Selected", icon: Award },
  { key: "FUNDED", label: "Funded", icon: Banknote },
];

interface TrackResult {
  trackingNumber: string;
  status: string;
  fullName: string;
  areaOfInterest: string;
  submittedAt: string;
  updatedAt?: string;
  rejectionReason?: string;
}

export default function TrackFellowship() {
  const [trackingNum, setTrackingNum] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNum.trim()) {
      setError("Please enter your tracking number");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setHasSearched(true);

    try {
      const res = await fetch(
        `/api/fellowship/track?trackingNumber=${encodeURIComponent(trackingNum.trim())}`
      );
      if (!res.ok) {
        if (res.status === 404) throw new Error("Application not found");
        throw new Error("Failed to fetch status");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Application not found";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SELECTED":
      case "FUNDED":
        return "bg-emerald-accent/10 text-emerald-accent";
      case "REJECTED":
        return "bg-red-50 text-danger";
      case "SHORTLISTED":
      case "INTERVIEW_SCHEDULED":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gold/10 text-gold";
    }
  };

  const currentStatusIndex = result
    ? STATUS_FLOW.findIndex((s) => s.key === result.status)
    : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link
        href="/fellowship"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to Fellowship
      </Link>

      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
          Application Status
        </span>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-2">
          Track Application
        </h1>
        <p className="text-muted">
          Enter your tracking number to view your application status
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleTrack} className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
        <div className="flex gap-3">
          <input
            value={trackingNum}
            onChange={(e) => setTrackingNum(e.target.value)}
            placeholder="VGMF-FEL-..."
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
            {loading ? "Searching..." : "Track"}
          </button>
        </div>
        {error && (
          <p className="text-danger text-sm mt-3 flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
      </form>

      {/* Result */}
      {result && (
        <div className="space-y-6 animate-fade-up">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Tracking Number
                </p>
                <p className="font-heading text-xl font-bold text-navy">
                  {result.trackingNumber}
                </p>
                {result.fullName && (
                  <p className="text-sm text-muted mt-1">
                    Applicant: {result.fullName}
                  </p>
                )}
              </div>
              <span
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${getStatusColor(
                  result.status
                )}`}
              >
                {result.status.replace(/_/g, " ")}
              </span>
            </div>

            {/* Progress Steps */}
            <div className="flex gap-1 sm:gap-2 mb-6 overflow-x-auto pb-2">
              {STATUS_FLOW.map((s, i) => {
                const isActive = currentStatusIndex >= i;
                const isCurrent = currentStatusIndex === i;
                return (
                  <div key={s.key} className="flex-1 text-center min-w-[60px]">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                        isActive
                          ? "bg-navy text-white shadow-lg shadow-navy/20"
                          : "bg-gray-100 text-muted"
                      } ${isCurrent ? "ring-4 ring-offset-2 ring-navy/20" : ""}`}
                    >
                      {isActive ? (
                        <CheckCircle size={16} />
                      ) : (
                        <s.icon size={16} />
                      )}
                    </div>
                    <p
                      className={`text-[10px] sm:text-xs font-semibold leading-tight ${
                        isActive ? "text-navy" : "text-muted"
                      }`}
                    >
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Rejection Reason */}
            {result.status === "REJECTED" && result.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                <p className="text-sm font-semibold text-danger mb-1">
                  Feedback
                </p>
                <p className="text-sm text-danger/80">
                  {result.rejectionReason}
                </p>
              </div>
            )}

            {/* Details */}
            <div className="border-t border-gray-100 pt-4 mt-4 text-sm text-muted space-y-1">
              <p>
                <span className="font-medium text-ink">Submitted:</span>{" "}
                {result.submittedAt}
              </p>
              {result.areaOfInterest && (
                <p>
                  <span className="font-medium text-ink">Research Area:</span>{" "}
                  {result.areaOfInterest}
                </p>
              )}
              {result.updatedAt && (
                <p>
                  <span className="font-medium text-ink">Last Updated:</span>{" "}
                  {result.updatedAt}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty after search */}
      {!loading && hasSearched && !result && !error && (
        <div className="text-center py-16">
          <FileText size={48} className="mx-auto text-muted mb-4" />
          <p className="text-muted font-medium">
            No application found with this tracking number.
          </p>
        </div>
      )}
    </div>
  );
}
