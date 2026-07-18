"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CreditCard, Loader2, CheckCircle, AlertCircle, CalendarDays, MapPin } from "lucide-react";
import toast from "react-hot-toast";

interface RegistrationForm {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  designation: string;
  eventId: string;
  dietaryPreference: string;
  accommodation: string;
}

interface EventOption {
  id: string;
  title: string;
  eventDate: string;
  location: string;
  ticketPrice: number;
}

const DEMO_EVENTS: EventOption[] = [
  { id: "1", title: "National Seminar on Agnikarma & Viddhakarma", eventDate: "2026-12-15", location: "Pune, Maharashtra", ticketPrice: 1500 },
  { id: "2", title: "Workshop on Panchakarma Techniques", eventDate: "2026-09-20", location: "Mumbai, Maharashtra", ticketPrice: 800 },
];

export default function SeminarRegisterPage() {
  const [form, setForm] = useState<RegistrationForm>({
    fullName: "", email: "", phone: "", organization: "", designation: "",
    eventId: "", dietaryPreference: "", accommodation: "no",
  });
  const [events, setEvents] = useState<EventOption[]>(DEMO_EVENTS);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  const updateField = (key: keyof RegistrationForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedEvent = events.find((e) => e.id === form.eventId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.eventId) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/seminar/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
      const data = await res.json();
      setTicketNumber(data.ticketNumber || `VGMF-SEM-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
      toast.success("Registration confirmed!");
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
            Registration Confirmed!
          </h1>
          <p className="text-muted mb-6">
            You have successfully registered for the seminar. A confirmation
            email will be sent shortly.
          </p>
          {ticketNumber && (
            <div className="bg-teal/5 rounded-2xl p-5 mb-6 border border-teal/10">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                Ticket Number
              </p>
              <p className="font-heading text-xl font-extrabold text-ink">
                {ticketNumber}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/seminar" className="btn-primary">
              Back to Seminar
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
        href="/seminar"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to Seminar
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-ink">
          Seminar Registration
        </h1>
        <p className="text-muted mt-2">
          Register for an upcoming seminar or workshop
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-ink/5 p-8 space-y-5 shadow-sm">
        {/* Event Selection */}
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
            Select Event <span className="text-maroon">*</span>
          </label>
          <select
            value={form.eventId}
            onChange={(e) => updateField("eventId", e.target.value)}
            required
            className="input-field"
          >
            <option value="">Choose an event...</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} — ₹{evt.ticketPrice.toLocaleString("en-IN")}
              </option>
            ))}
          </select>
        </div>

        {/* Event Preview */}
        {selectedEvent && (
          <div className="bg-teal/5 rounded-xl p-4 border border-teal/10">
            <h3 className="font-heading font-bold text-ink mb-2">
              {selectedEvent.title}
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <div className="flex items-center gap-1.5">
                <CalendarDays size={14} />
                {new Date(selectedEvent.eventDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                {selectedEvent.location}
              </div>
            </div>
          </div>
        )}

        {/* Personal Info */}
        <div className="border-t border-ink/5 pt-5">
          <h3 className="font-heading font-bold text-ink text-lg mb-4">
            Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: "fullName" as const, label: "Full Name", type: "text", required: true },
              { key: "email" as const, label: "Email Address", type: "email", required: true },
              { key: "phone" as const, label: "Phone Number", type: "tel", required: true },
              { key: "organization" as const, label: "Institution / Organisation", type: "text" },
              { key: "designation" as const, label: "Designation", type: "text" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  {f.label}{" "}
                  {f.required && <span className="text-maroon">*</span>}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => updateField(f.key, e.target.value)}
                  required={f.required}
                  className="input-field"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="border-t border-ink/5 pt-5">
          <h3 className="font-heading font-bold text-ink text-lg mb-4">
            Preferences
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Dietary Preference
              </label>
              <select
                value={form.dietaryPreference}
                onChange={(e) => updateField("dietaryPreference", e.target.value)}
                className="input-field"
              >
                <option value="">Select preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="jain">Jain</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Accommodation Required
              </label>
              <div className="flex gap-4 mt-2">
                {["yes", "no"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="accommodation"
                      value={opt}
                      checked={form.accommodation === opt}
                      onChange={(e) => updateField("accommodation", e.target.value)}
                      className="accent-teal"
                    />
                    <span className="text-sm capitalize font-medium text-ink/70">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {selectedEvent && (
          <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex items-center gap-3">
            <CreditCard size={20} className="text-gold shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-ink">
                Registration Fee: ₹{selectedEvent.ticketPrice.toLocaleString("en-IN")}
              </p>
              <p className="text-muted text-xs">
                Payment will be processed after form submission via Razorpay
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-gold w-full justify-center !py-3 disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <CreditCard size={18} />
          )}
          {submitting
            ? "Processing..."
            : `Register & Pay ₹${(selectedEvent?.ticketPrice || 0).toLocaleString("en-IN")}`}
        </button>
      </form>
    </div>
  );
}
