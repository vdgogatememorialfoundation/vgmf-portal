"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Send, Loader2, CheckCircle, Heart, User, MapPin, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";

interface AutismForm {
  childName: string;
  childAge: string;
  childGender: string;
  parentName: string;
  phoneNumber: string;
  alternatePhone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  diagnosisDetails: string;
  therapyHistory: string;
  specialRequirements: string;
}

const SECTIONS = [
  { num: 1, title: "Child Info", icon: Heart },
  { num: 2, title: "Parent Info", icon: User },
  { num: 3, title: "Address", icon: MapPin },
  { num: 4, title: "Medical Details", icon: Stethoscope },
];

export default function AutismRegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<AutismForm>({
    childName: "", childAge: "", childGender: "",
    parentName: "", phoneNumber: "", alternatePhone: "", email: "",
    address: "", city: "", state: "", pinCode: "",
    diagnosisDetails: "", therapyHistory: "", specialRequirements: "",
  });

  const updateField = (key: keyof AutismForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = (stepNum: number): boolean => {
    if (stepNum === 1) {
      if (!form.childName.trim()) {
        toast.error("Child name is required");
        return false;
      }
      if (!form.childAge.trim()) {
        toast.error("Child age is required");
        return false;
      }
      if (!form.childGender) {
        toast.error("Please select gender");
        return false;
      }
    }
    if (stepNum === 2) {
      if (!form.parentName.trim()) {
        toast.error("Parent/guardian name is required");
        return false;
      }
      if (!form.phoneNumber.trim()) {
        toast.error("Phone number is required");
        return false;
      }
      if (!/^\d{10}$/.test(form.phoneNumber)) {
        toast.error("Please enter a valid 10-digit phone number");
        return false;
      }
    }
    if (stepNum === 3) {
      if (!form.address.trim()) {
        toast.error("Address is required");
        return false;
      }
      if (!form.city.trim()) {
        toast.error("City is required");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!form.diagnosisDetails.trim()) {
      toast.error("Diagnosis details are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/autism/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
      setSubmitted(true);
      toast.success("Registration submitted successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-ink/5 p-10 shadow-sm">
          <div className="w-20 h-20 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-teal" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-ink mb-4">
            Pre-Registration Successful!
          </h1>
          <p className="text-muted mb-6 max-w-md mx-auto">
            Thank you for registering for the Autism Awareness Programme. Our
            team will contact you within 3-5 working days for the initial
            assessment.
          </p>
          <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-6 text-sm text-ink">
            <p className="font-semibold">This programme is completely free.</p>
            <p className="text-muted mt-1">
              No payment is required at any stage.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/autism" className="btn-primary">
              <ArrowLeft size={16} /> Back to Programme
            </Link>
            <Link href="/" className="btn-outline">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link
        href="/autism"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to Programme
      </Link>

      <div className="mb-4">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-ink">
          Pre-Registration
        </h1>
        <p className="text-muted mt-2">
          Autism Awareness Programme — Free Ayurvedic Support
        </p>
      </div>

      <div className="flex items-center gap-2 mb-8 p-3 bg-gold/10 border border-gold/20 rounded-xl text-sm text-ink">
        <Heart size={16} className="text-gold shrink-0" />
        <span>
          This programme is <strong>completely free</strong>. No payment is
          required at any stage.
        </span>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-10">
        {SECTIONS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  step >= s.num
                    ? "bg-teal text-white shadow-lg shadow-teal/20"
                    : "bg-ink/5 text-muted"
                }`}
              >
                {step > s.num ? (
                  <CheckCircle size={16} />
                ) : (
                  <Icon size={16} />
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-semibold hidden sm:block ${
                  step >= s.num ? "text-ink" : "text-muted"
                }`}
              >
                {s.title}
              </span>
              {i < SECTIONS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 rounded-full ${
                    step > s.num ? "bg-teal" : "bg-ink/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-ink/5 p-6 md:p-8 shadow-sm">
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                <Heart size={20} className="text-gold" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-ink">
                  Child Information
                </h2>
                <p className="text-xs text-muted">
                  Details about the child being registered
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Child&apos;s Full Name <span className="text-maroon">*</span>
              </label>
              <input
                value={form.childName}
                onChange={(e) => updateField("childName", e.target.value)}
                className="input-field"
                placeholder="Enter child's full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Age <span className="text-maroon">*</span>
                </label>
                <input
                  type="number"
                  value={form.childAge}
                  onChange={(e) => updateField("childAge", e.target.value)}
                  className="input-field"
                  placeholder="Years"
                  min={1}
                  max={25}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Gender <span className="text-maroon">*</span>
                </label>
                <select
                  value={form.childGender}
                  onChange={(e) => updateField("childGender", e.target.value)}
                  className="input-field"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                <User size={20} className="text-gold" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-ink">
                  Parent / Guardian Information
                </h2>
                <p className="text-xs text-muted">
                  Primary contact details
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Parent / Guardian Name <span className="text-maroon">*</span>
              </label>
              <input
                value={form.parentName}
                onChange={(e) => updateField("parentName", e.target.value)}
                className="input-field"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Phone Number <span className="text-maroon">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => updateField("phoneNumber", e.target.value)}
                  className="input-field"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  value={form.alternatePhone}
                  onChange={(e) => updateField("alternatePhone", e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                <MapPin size={20} className="text-gold" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-ink">
                  Address
                </h2>
                <p className="text-xs text-muted">
                  Residential address details
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Full Address <span className="text-maroon">*</span>
              </label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="input-field"
                placeholder="Street address, landmark, etc."
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  City <span className="text-maroon">*</span>
                </label>
                <input
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  State
                </label>
                <input
                  value={form.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Pin Code
                </label>
                <input
                  value={form.pinCode}
                  onChange={(e) => updateField("pinCode", e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                <Stethoscope size={20} className="text-gold" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-ink">
                  Medical Details
                </h2>
                <p className="text-xs text-muted">
                  Diagnosis and therapy information
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Diagnosis / Condition Details <span className="text-maroon">*</span>
              </label>
              <textarea
                rows={4}
                value={form.diagnosisDetails}
                onChange={(e) => updateField("diagnosisDetails", e.target.value)}
                className="input-field"
                placeholder="Describe the diagnosis, date of diagnosis, severity, and any observed symptoms"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Previous Therapy / Treatment History
              </label>
              <textarea
                rows={3}
                value={form.therapyHistory}
                onChange={(e) => updateField("therapyHistory", e.target.value)}
                className="input-field"
                placeholder="Describe any previous treatments, therapies, or interventions"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Special Requirements
              </label>
              <textarea
                rows={3}
                value={form.specialRequirements}
                onChange={(e) => updateField("specialRequirements", e.target.value)}
                className="input-field"
                placeholder="Dietary restrictions, mobility needs, communication preferences, etc."
              />
            </div>

            {/* Summary */}
            <div className="bg-teal/5 rounded-xl p-5 space-y-2 text-sm border border-teal/10">
              <h3 className="font-heading font-bold text-ink mb-3">
                Registration Summary
              </h3>
              <div className="grid grid-cols-2 gap-2 text-ink/70">
                <div>
                  <span className="text-muted">Child:</span>{" "}
                  <span className="font-medium">{form.childName}</span>
                </div>
                <div>
                  <span className="text-muted">Age:</span>{" "}
                  <span className="font-medium">{form.childAge} years</span>
                </div>
                <div>
                  <span className="text-muted">Parent:</span>{" "}
                  <span className="font-medium">{form.parentName}</span>
                </div>
                <div>
                  <span className="text-muted">Phone:</span>{" "}
                  <span className="font-medium">{form.phoneNumber}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted">Location:</span>{" "}
                  <span className="font-medium">
                    {form.city}
                    {form.state ? `, ${form.state}` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-ink/5">
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
              disabled={submitting}
              className="btn-gold disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              Submit Registration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
