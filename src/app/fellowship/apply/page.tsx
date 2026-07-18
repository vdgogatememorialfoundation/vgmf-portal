"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Save, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface FellowshipForm {
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  qualification: string;
  institution: string;
  yearOfPassing: string;
  registrationNumber: string;
  registrationCouncil: string;
  currentPosition: string;
  organization: string;
  experienceYears: string;
  specializations: string;
  title: string;
  areaOfInterest: string;
  background: string;
  objectives: string;
  methodology: string;
  expectedOutcomes: string;
  timeline: string;
  budget: string;
  preferredMentor: string;
  termsAccepted: boolean;
}

const STEPS = [
  { num: 1, title: "Personal Details" },
  { num: 2, title: "Professional Details" },
  { num: 3, title: "Research Proposal" },
  { num: 4, title: "Declaration" },
];

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [form, setForm] = useState<FellowshipForm>({
    fullName: "", email: "", phone: "", whatsappNumber: "", dateOfBirth: "", gender: "",
    address: "", city: "", state: "", pinCode: "",
    qualification: "", institution: "", yearOfPassing: "", registrationNumber: "", registrationCouncil: "",
    currentPosition: "", organization: "", experienceYears: "", specializations: "",
    title: "", areaOfInterest: "", background: "", objectives: "", methodology: "",
    expectedOutcomes: "", timeline: "", budget: "",
    preferredMentor: "", termsAccepted: false,
  });

  const update = (field: keyof FellowshipForm, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validateStep = (stepNum: number): string[] => {
    const errs: string[] = [];
    if (stepNum === 1) {
      if (!form.fullName.trim()) errs.push("Full name is required");
      if (!form.email.trim()) errs.push("Email is required");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.push("Invalid email address");
      if (!form.phone.trim()) errs.push("Phone number is required");
    }
    if (stepNum === 2) {
      if (!form.qualification.trim()) errs.push("Qualification is required");
      if (!form.institution.trim()) errs.push("Institution is required");
      if (!form.registrationNumber.trim()) errs.push("Registration number is required");
    }
    if (stepNum === 3) {
      if (!form.title.trim()) errs.push("Research title is required");
      if (!form.areaOfInterest) errs.push("Research area is required");
      if (!form.background.trim()) errs.push("Background & rationale is required");
      if (!form.objectives.trim()) errs.push("Objectives are required");
      if (!form.methodology.trim()) errs.push("Methodology is required");
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (errs.length > 0) {
      setErrors(errs);
      errs.forEach((e) => toast.error(e));
      return;
    }
    setErrors([]);
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setErrors([]);
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!form.termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/fellowship/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit application");
      }
      const data = await res.json();
      setTrackingNumber(
        data.trackingNumber || `VGMF-FEL-${Date.now().toString(36).toUpperCase()}`
      );
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm">
          <div className="w-20 h-20 bg-[#166534]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Check className="text-[#166534]" size={36} />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-navy mb-2">
            Application Submitted!
          </h1>
          <p className="text-muted mb-6">
            Your fellowship application has been successfully submitted.
          </p>
          <div className="bg-[#0d6662]/5 rounded-2xl p-6 mb-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              Your Tracking Number
            </p>
            <p className="font-heading text-2xl font-extrabold text-navy tracking-wider">
              {trackingNumber}
            </p>
            <p className="text-sm text-muted mt-2">
              Save this number to track your application status.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/fellowship/track" className="btn-primary">
              Track Application
            </Link>
            <Link href="/fellowship" className="btn-outline">
              Back to Fellowship
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/fellowship"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to Fellowship
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy">
          Fellowship Application
        </h1>
        <p className="text-muted mt-2">
          Viddhakarma Research Fellowship 2026 — Grant up to ₹75,000
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex gap-2 mb-10">
        {STEPS.map((s) => (
          <div key={s.num} className="flex-1 text-center">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all ${
                step >= s.num
                  ? "bg-[#0d6662] text-white shadow-lg shadow-[#0d6662]/20"
                  : "bg-gray-100 text-muted"
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

      {/* Error Summary */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="text-[#991b1b] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#991b1b] mb-1">
                Please fix the following:
              </p>
              <ul className="text-sm text-[#991b1b]/80 list-disc pl-4 space-y-0.5">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-navy mb-4">
              Personal Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: "fullName" as const, label: "Full Name", required: true },
                { key: "email" as const, label: "Email Address", type: "email", required: true },
                { key: "phone" as const, label: "Phone Number", required: true },
                { key: "whatsappNumber" as const, label: "WhatsApp Number" },
                { key: "dateOfBirth" as const, label: "Date of Birth", type: "date" },
                { key: "gender" as const, label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
                { key: "address" as const, label: "Address", full: true },
                { key: "city" as const, label: "City" },
                { key: "state" as const, label: "State" },
                { key: "pinCode" as const, label: "Pin Code" },
              ].map((f) => (
                <div key={f.key} className={f.full ? "md:col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    {f.label}{" "}
                    {f.required && <span className="text-[#991b1b]">*</span>}
                  </label>
                  {f.type === "select" ? (
                    <select
                      value={String(form[f.key])}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="input-field"
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
                      value={String(form[f.key])}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="input-field"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-navy mb-4">
              Professional Details
            </h2>
            <p className="text-sm text-muted mb-4">
              Applicants must hold a BAMS degree and have valid Ayurvedic Council
              registration.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: "qualification" as const, label: "Highest Qualification (BAMS/MD/MS/PhD)", required: true },
                { key: "institution" as const, label: "Institution / University", required: true },
                { key: "yearOfPassing" as const, label: "Year of Passing" },
                { key: "registrationNumber" as const, label: "Ayurvedic Council Registration Number", required: true },
                { key: "registrationCouncil" as const, label: "Registration Council (e.g., MCIM, MUHS)" },
                { key: "currentPosition" as const, label: "Current Position" },
                { key: "organization" as const, label: "Organization / Clinic" },
                { key: "experienceYears" as const, label: "Years of Clinical Experience", type: "number" },
                { key: "specializations" as const, label: "Areas of Specialization", full: true },
              ].map((f) => (
                <div key={f.key} className={f.full ? "md:col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    {f.label}{" "}
                    {f.required && <span className="text-[#991b1b]">*</span>}
                  </label>
                  {f.key === "specializations" ? (
                    <textarea
                      rows={2}
                      value={String(form[f.key])}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="input-field"
                      placeholder="e.g., Panchakarma, Agnikarma, Viddhakarma, Kayachikitsa"
                    />
                  ) : (
                    <input
                      type={f.type || "text"}
                      value={String(form[f.key])}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="input-field"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-navy mb-4">
              Research Proposal
            </h2>
            <p className="text-sm text-muted mb-4">
              Describe your proposed research in detail.
            </p>
            {[
              { key: "title" as const, label: "Research Title", required: true },
              {
                key: "areaOfInterest" as const,
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
              { key: "background" as const, label: "Background & Rationale", type: "textarea", rows: 6, required: true },
              { key: "objectives" as const, label: "Research Objectives", type: "textarea", rows: 3, required: true },
              { key: "methodology" as const, label: "Methodology", type: "textarea", rows: 5, required: true },
              { key: "expectedOutcomes" as const, label: "Expected Outcomes & Significance", type: "textarea", rows: 3 },
              { key: "timeline" as const, label: "Proposed Timeline (6-12 months)" },
              { key: "budget" as const, label: "Budget Estimate (up to ₹75,000)", type: "textarea", rows: 2 },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  {f.label}{" "}
                  {f.required && <span className="text-[#991b1b]">*</span>}
                </label>
                {f.type === "select" ? (
                  <select
                    value={String(form[f.key])}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="input-field"
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
                    value={String(form[f.key])}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="input-field"
                  />
                ) : (
                  <input
                    value={String(form[f.key])}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="input-field"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-heading text-xl font-bold text-navy mb-4">
              Declaration & Submit
            </h2>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Preferred Mentor (if any)
              </label>
              <input
                value={form.preferredMentor}
                onChange={(e) => update("preferredMentor", e.target.value)}
                className="input-field"
              />
            </div>

            <div className="bg-[#0d6662]/5 rounded-2xl p-5 space-y-3 text-sm text-ink-soft">
              <h3 className="font-heading font-bold text-navy">
                Important Information
              </h3>
              <ul className="list-disc pl-4 space-y-2">
                <li>
                  Grant amount: Up to ₹75,000 with milestone-based disbursement
                  (40/40/20)
                </li>
                <li>Duration: 6-12 months</li>
                <li>
                  Selection involves screening, technical evaluation, interview,
                  and board approval
                </li>
                <li>
                  All research must follow ethical guidelines as per ICMR norms
                </li>
                <li>
                  IP rights and publications will be governed by VGMF&apos;s IP
                  policy
                </li>
              </ul>
            </div>

            <label className="flex items-start gap-3 p-4 bg-[#c2761c]/5 border border-[#c2761c]/20 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(e) => update("termsAccepted", e.target.checked)}
                className="mt-0.5 accent-[#0d6662]"
              />
              <span className="text-sm text-ink-soft">
                I confirm that all information provided is true and accurate. I
                agree to the{" "}
                <Link href="/fellowship/terms" className="text-navy underline">
                  Terms &amp; Conditions
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

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button onClick={handlePrev} className="btn-outline">
              <ArrowLeft size={16} /> Previous
            </button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button onClick={handleNext} className="btn-primary">
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!form.termsAccepted || submitting}
              className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
