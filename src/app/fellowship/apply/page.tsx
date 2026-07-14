"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [form, setForm] = useState({
    // Step 1: Personal Details
    fullName: "", email: "", phone: "", whatsappNumber: "", dateOfBirth: "", gender: "",
    address: "", city: "", state: "", pinCode: "",
    // Step 2: Professional Details
    qualification: "", institution: "", yearOfPassing: "", registrationNumber: "", registrationCouncil: "",
    currentPosition: "", organization: "", experienceYears: "", specializations: "",
    // Step 3: Research Proposal
    title: "", areaOfInterest: "", background: "", objectives: "", methodology: "",
    expectedOutcomes: "", timeline: "", budget: "",
    // Step 4: Documents & Declaration
    preferredMentor: "", termsAccepted: false
  });

  const update = (field: string, value: any) => setForm({ ...form, [field]: value });

  const handleSubmit = async () => {
    // Generate tracking number: VGMF-FEL-YYYYMMDD-XXXXXX
    const tn = `VGMF-FEL-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setTrackingNumber(tn);
    setSubmitted(true);
  };

  if (submitted)
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border p-10 shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Check className="text-green-600" size={36} />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-navy mb-2">Application Submitted!</h1>
          <p className="text-muted mb-6">Your fellowship application has been successfully submitted.</p>
          <div className="bg-navy/5 rounded-2xl p-6 mb-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Your Tracking Number</p>
            <p className="font-heading text-2xl font-extrabold text-navy tracking-wider">{trackingNumber}</p>
            <p className="text-sm text-muted mt-2">Save this number to track your application status.</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard" className="px-6 py-3 bg-navy text-white font-semibold rounded-xl">
              Go to Dashboard
            </Link>
            <Link href="/fellowship" className="px-6 py-3 border-2 border-navy text-navy font-semibold rounded-xl">
              Back to Fellowship
            </Link>
          </div>
        </div>
      </div>
    );

  const steps = [
    { num: 1, title: "Personal Details" },
    { num: 2, title: "Professional Details" },
    { num: 3, title: "Research Proposal" },
    { num: 4, title: "Declaration" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/fellowship" className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Fellowship
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy">Fellowship Application</h1>
        <p className="text-muted mt-2">Viddhakarma Research Fellowship 2026 — Grant up to ₹75,000</p>
      </div>

      {/* STEP INDICATOR */}
      <div className="flex gap-2 mb-10">
        {steps.map((s) => (
          <div key={s.num} className="flex-1 text-center">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                step >= s.num ? "bg-navy text-white" : "bg-gray-100 text-muted"
              }`}
            >
              {step > s.num ? <Check size={16} /> : s.num}
            </div>
            <p
              className={`text-xs font-semibold hidden sm:block ${
                step >= s.num ? "text-navy" : "text-muted"
              }`}
            >
              {s.title}
            </p>
          </div>
        ))}
      </div>

      {/* FORM CONTENT */}
      <div className="bg-white rounded-2xl border p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-navy mb-4">Personal Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: "fullName", label: "Full Name", required: true },
                { key: "email", label: "Email Address", type: "email", required: true },
                { key: "phone", label: "Phone Number", required: true },
                { key: "whatsappNumber", label: "WhatsApp Number", required: true },
                { key: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
                { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
                { key: "address", label: "Address", full: true },
                { key: "city", label: "City" },
                { key: "state", label: "State" },
                { key: "pinCode", label: "Pin Code" },
              ].map((f) => (
                <div key={f.key} className={f.full ? "md:col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                  {f.type === "select" ? (
                    <select
                      value={(form as any)[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                    >
                      <option value="">Select...</option>
                      {f.options?.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type || "text"}
                      value={(form as any)[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-navy mb-4">Professional Details</h2>
            <p className="text-sm text-muted mb-4">
              Applicants must hold a BAMS degree and have valid Ayurvedic Council registration.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: "qualification", label: "Highest Qualification (BAMS/MD/MS/PhD)", required: true },
                { key: "institution", label: "Institution / University", required: true },
                { key: "yearOfPassing", label: "Year of Passing", required: true },
                {
                  key: "registrationNumber",
                  label: "Ayurvedic Council Registration Number",
                  required: true,
                },
                {
                  key: "registrationCouncil",
                  label: "Registration Council (e.g., MCIM, MUHS)",
                  required: true,
                },
                { key: "currentPosition", label: "Current Position" },
                { key: "organization", label: "Organization / Clinic" },
                { key: "experienceYears", label: "Years of Clinical Experience", type: "number" },
                { key: "specializations", label: "Areas of Specialization", full: true },
              ].map((f) => (
                <div key={f.key} className={f.full ? "md:col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                  {f.key === "specializations" ? (
                    <textarea
                      rows={2}
                      value={(form as any)[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                      placeholder="e.g., Panchakarma, Agnikarma, Viddhakarma, Kayachikitsa"
                    />
                  ) : (
                    <input
                      type={f.type || "text"}
                      value={(form as any)[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-navy mb-4">Research Proposal</h2>
            <p className="text-sm text-muted mb-4">
              Describe your proposed research in detail. Research areas: Musculoskeletal disorders, Pain management,
              Neurological disorders, Comparative clinical studies, Mechanism-based research, Classical textual
              documentation.
            </p>
            {[
              { key: "title", label: "Research Title", required: true },
              {
                key: "areaOfInterest",
                label: "Primary Research Area",
                type: "select",
                required: true,
                options: [
                  "Musculoskeletal Disorders",
                  "Pain Management",
                  "Neurological Disorders",
                  "Comparative Clinical Studies",
                  "Mechanism-based Research",
                  "Classical Textual Documentation",
                  "Standardization & Protocol Development",
                ],
              },
              {
                key: "background",
                label: "Background & Rationale (500-1000 words)",
                type: "textarea",
                rows: 6,
                required: true,
              },
              {
                key: "objectives",
                label: "Research Objectives",
                type: "textarea",
                rows: 3,
                required: true,
              },
              {
                key: "methodology",
                label: "Methodology",
                type: "textarea",
                rows: 5,
                required: true,
              },
              {
                key: "expectedOutcomes",
                label: "Expected Outcomes & Significance",
                type: "textarea",
                rows: 3,
                required: true,
              },
              { key: "timeline", label: "Proposed Timeline (6-12 months)", required: true },
              { key: "budget", label: "Budget Estimate (up to ₹75,000)", type: "textarea", rows: 2 },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>
                {f.type === "select" ? (
                  <select
                    value={(form as any)[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  >
                    <option value="">Select...</option>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea
                    rows={f.rows || 4}
                    value={(form as any)[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                ) : (
                  <input
                    value={(form as any)[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-navy mb-4">Declaration & Submit</h2>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Preferred Mentor (if any)
              </label>
              <input
                value={form.preferredMentor}
                onChange={(e) => update("preferredMentor", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
              />
            </div>
            <div className="bg-navy/5 rounded-2xl p-6 space-y-3 text-sm text-ink-soft">
              <h3 className="font-heading font-bold text-navy">Important Information</h3>
              <ul className="list-disc pl-4 space-y-2">
                <li>Grant amount: Up to ₹75,000 with milestone-based disbursement (40/40/20)</li>
                <li>Duration: 6-12 months</li>
                <li>Selection involves screening, technical evaluation, interview, and board approval</li>
                <li>All research must follow ethical guidelines as per ICMR norms</li>
                <li>IP rights and publications will be governed by VGMF's IP policy</li>
              </ul>
            </div>
            <label className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(e) => update("termsAccepted", e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-ink-soft">
                I confirm that all information provided is true and accurate. I agree to the{" "}
                <Link href="/fellowship/terms" className="text-navy underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/fellowship/privacy" className="text-navy underline">
                  Privacy Policy
                </Link>{" "}
                of the VGMF Fellowship Programme.
              </span>
            </label>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border-2 border-gray-200 text-ink-soft font-semibold rounded-xl hover:border-navy transition-colors"
            >
              <ArrowLeft size={16} className="inline mr-2" /> Previous
            </button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light transition-colors"
            >
              Next <ArrowRight size={16} className="inline ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!form.termsAccepted}
              className="px-8 py-3 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} className="inline mr-2" /> Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
