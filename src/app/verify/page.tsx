"use client";
import { useState } from "react";
import { ShieldCheck, Search, Users, Award, Calendar, CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";

interface CertificateData {
  number: string;
  title: string;
  description: string | null;
  type: string;
  event: string | null;
  holderName: string;
  issuedDate: string;
  expiryDate: string | null;
  status: string;
}

interface CandidateData {
  applicationId: string | null;
  ticketNumber: string;
  name: string;
  registrationDate: string;
}

export default function VerifyPage() {
  const [tab, setTab] = useState<"certificate" | "candidates">("certificate");
  const [certCode, setCertCode] = useState("");
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(false);
  const [certResult, setCertResult] = useState<{ valid: boolean; certificate?: CertificateData; error?: string } | null>(null);
  const [candidatesResult, setCandidatesResult] = useState<{ event: { title: string; date: string } | null; candidates: CandidateData[]; total: number } | null>(null);

  const verifyCertificate = async () => {
    if (!certCode.trim()) return;
    setLoading(true);
    setCertResult(null);
    try {
      const res = await fetch(`/api/verify?type=certificate&code=${encodeURIComponent(certCode.trim())}`);
      const data = await res.json();
      setCertResult(data);
    } catch {
      setCertResult({ valid: false, error: "Failed to verify. Please try again." });
    }
    setLoading(false);
  };

  const fetchCandidates = async () => {
    if (!eventId.trim()) return;
    setLoading(true);
    setCandidatesResult(null);
    try {
      const res = await fetch(`/api/verify?type=candidates&eventId=${encodeURIComponent(eventId.trim())}`);
      const data = await res.json();
      setCandidatesResult(data);
    } catch {
      setCandidatesResult({ event: null, candidates: [], total: 0 });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0d6662] to-[#14918b] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white mb-2">Verification Portal</h1>
          <p className="text-white/70 text-sm md:text-base max-w-md mx-auto">
            Verify certificates or check candidate registration status for VGMF events
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6 pb-20 relative z-10">
        {/* Tab Toggle */}
        <div className="bg-white rounded-2xl p-1.5 shadow-lg border border-[#1a1a2e]/5 flex mb-8">
          <button
            onClick={() => { setTab("certificate"); setCertResult(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              tab === "certificate" ? "bg-[#0d6662] text-white shadow-md" : "text-[#7c7c8a] hover:text-[#1a1a2e]"
            }`}
          >
            <Award size={16} /> Verify Certificate
          </button>
          <button
            onClick={() => { setTab("candidates"); setCandidatesResult(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              tab === "candidates" ? "bg-[#0d6662] text-white shadow-md" : "text-[#7c7c8a] hover:text-[#1a1a2e]"
            }`}
          >
            <Users size={16} /> Candidate List
          </button>
        </div>

        {/* Certificate Verification */}
        {tab === "certificate" && (
          <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-8 shadow-sm">
            <h2 className="font-heading text-xl font-extrabold text-[#1a1a2e] mb-1">Certificate Verification</h2>
            <p className="text-sm text-[#7c7c8a] mb-6">Enter the verification code from your certificate to check its authenticity.</p>

            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={certCode}
                onChange={(e) => setCertCode(e.target.value)}
                placeholder="Enter verification code (e.g. VGF-CERT-XXXX)"
                className="input-field flex-1"
                onKeyDown={(e) => e.key === "Enter" && verifyCertificate()}
              />
              <button
                onClick={verifyCertificate}
                disabled={loading || !certCode.trim()}
                className="btn-primary !py-2.5 !px-5 disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><Search size={16} /> Verify</>}
              </button>
            </div>

            {certResult && (
              certResult.valid && certResult.certificate ? (
                <div className="bg-[#0d6662]/5 border border-[#0d6662]/15 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle size={20} className="text-[#0d6662]" />
                    <span className="font-heading font-bold text-[#0d6662]">Certificate Verified</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      { label: "Certificate Number", value: certResult.certificate.number },
                      { label: "Title", value: certResult.certificate.title },
                      { label: "Type", value: certResult.certificate.type },
                      { label: "Holder", value: certResult.certificate.holderName },
                      { label: "Event", value: certResult.certificate.event || "N/A" },
                      { label: "Status", value: certResult.certificate.status },
                      { label: "Issued", value: new Date(certResult.certificate.issuedDate).toLocaleDateString("en-IN") },
                      { label: "Expires", value: certResult.certificate.expiryDate ? new Date(certResult.certificate.expiryDate).toLocaleDateString("en-IN") : "Never" },
                    ].map((f, i) => (
                      <div key={i}>
                        <p className="text-[10px] text-[#7c7c8a] font-bold uppercase tracking-wider">{f.label}</p>
                        <p className="text-[#1a1a2e] font-medium">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#7c1d1d]/5 border border-[#7c1d1d]/15 rounded-xl p-5 flex items-center gap-3">
                  <XCircle size={20} className="text-[#7c1d1d] shrink-0" />
                  <div>
                    <p className="font-heading font-bold text-[#7c1d1d] text-sm">Certificate Not Found</p>
                    <p className="text-[#7c7c8a] text-xs">{certResult.error || "No certificate matches this verification code."}</p>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Candidate List */}
        {tab === "candidates" && (
          <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-8 shadow-sm">
            <h2 className="font-heading text-xl font-extrabold text-[#1a1a2e] mb-1">Candidate List</h2>
            <p className="text-sm text-[#7c7c8a] mb-6">Enter an event ID to view the list of approved candidates / registrations.</p>

            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                placeholder="Enter event ID"
                className="input-field flex-1"
                onKeyDown={(e) => e.key === "Enter" && fetchCandidates()}
              />
              <button
                onClick={fetchCandidates}
                disabled={loading || !eventId.trim()}
                className="btn-primary !py-2.5 !px-5 disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><Search size={16} /> Search</>}
              </button>
            </div>

            {candidatesResult && (
              <div>
                {candidatesResult.event && (
                  <div className="flex items-center gap-3 mb-4 p-4 bg-[#faf9f6] rounded-xl">
                    <Calendar size={16} className="text-[#0d6662] shrink-0" />
                    <div>
                      <p className="font-heading font-bold text-[#1a1a2e] text-sm">{candidatesResult.event.title}</p>
                      <p className="text-[#7c7c8a] text-xs">{new Date(candidatesResult.event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    <span className="ml-auto bg-[#0d6662]/10 text-[#0d6662] text-xs font-bold px-2.5 py-1 rounded-full">{candidatesResult.total} candidates</span>
                  </div>
                )}

                {candidatesResult.candidates.length === 0 ? (
                  <div className="text-center py-8">
                    <Users size={32} className="text-[#7c7c8a]/30 mx-auto mb-2" />
                    <p className="text-sm text-[#7c7c8a]">No approved candidates found for this event.</p>
                  </div>
                ) : (
                  <div className="border border-[#1a1a2e]/5 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#faf9f6] border-b border-[#1a1a2e]/5">
                          <th className="text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#7c7c8a]">#</th>
                          <th className="text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#7c7c8a]">Name</th>
                          <th className="text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#7c7c8a]">Application ID</th>
                          <th className="text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#7c7c8a] hidden sm:table-cell">Registered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidatesResult.candidates.map((c, i) => (
                          <tr key={i} className="border-b border-[#1a1a2e]/5 last:border-0 hover:bg-[#faf9f6] transition-colors">
                            <td className="px-4 py-2.5 text-[#7c7c8a]">{i + 1}</td>
                            <td className="px-4 py-2.5 font-medium text-[#1a1a2e]">{c.name}</td>
                            <td className="px-4 py-2.5 text-[#0d6662] font-mono text-xs">{c.applicationId || c.ticketNumber}</td>
                            <td className="px-4 py-2.5 text-[#7c7c8a] text-xs hidden sm:table-cell">
                              {new Date(c.registrationDate).toLocaleDateString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#0d6662] hover:gap-3 transition-all">
            Back to Home <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
