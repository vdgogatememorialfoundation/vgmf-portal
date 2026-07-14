"use client";
import { useState } from "react";
import { Search, CheckCircle } from "lucide-react";

const statusFlow = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "SELECTED",
  "FUNDED",
];

export default function TrackFellowship() {
  const [trackingNum, setTrackingNum] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setResult({
      trackingNumber: trackingNum,
      status: "UNDER_REVIEW",
      fullName: "Applicant",
      areaOfInterest: "Pain Management",
      submittedAt: "2026-07-10",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-heading text-3xl font-extrabold text-navy text-center mb-2">
        Track Application
      </h1>
      <p className="text-muted text-center mb-8">Enter your 12-digit tracking number</p>
      <form onSubmit={handleTrack} className="flex gap-3 mb-8">
        <input
          value={trackingNum}
          onChange={(e) => setTrackingNum(e.target.value)}
          placeholder="VGMF-FEL-..."
          className="flex-1 px-4 py-3 border rounded-xl"
        />
        <button type="submit" className="px-6 py-3 bg-navy text-white rounded-xl">
          <Search size={18} />
        </button>
      </form>
      {result && (
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-xs text-muted uppercase">Tracking #</p>
              <p className="font-bold text-navy">{result.trackingNumber}</p>
            </div>
            <span className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-xl text-sm font-semibold">
              {result.status}
            </span>
          </div>
          <div className="flex gap-2 mb-6">
            {statusFlow.map((s, i) => (
              <div key={s} className="flex-1 text-center">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs ${
                    statusFlow.indexOf(result.status) >= i
                      ? "bg-navy text-white"
                      : "bg-gray-100 text-muted"
                  }`}
                >
                  {statusFlow.indexOf(result.status) > i ? (
                    <CheckCircle size={14} />
                  ) : (
                    i + 1
                  )}
                </div>
                <p className="text-[10px] mt-1 text-muted">{s.replace("_", " ")}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 text-sm text-muted">
            Submitted: {result.submittedAt} | Area: {result.areaOfInterest}
          </div>
        </div>
      )}
    </div>
  );
}
