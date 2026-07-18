"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Plus, Edit, Trash2, X, Save, Search, Calendar, MapPin, Users,
  FileText, GripVertical, ChevronUp, ChevronDown, Eye, EyeOff,
  CreditCard, Copy, List, Type, Mail, Phone, CalendarDays, AlignLeft,
  Upload, Hash, CheckSquare, ChevronRight, Settings, Layout,
  Clock, Trophy, Scale, Ticket, UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";

interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  eventDate: string;
  endDate?: string;
  location?: string;
  city?: string;
  address?: string;
  eventType: string;
  isPublished: boolean;
  isFeatured: boolean;
  maxAttendees?: number;
  ticketPrice?: number;
  bannerUrl?: string;
  imageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  restrictToDoctors: boolean;
  hasRegistrationForm?: boolean;
  allowMultipleRegistrations?: boolean;
  requiresPayment?: boolean;
  requiresIdentityVerification?: boolean;
  registrationStartDate?: string;
  registrationDeadline?: string;
  cancellationDeadline?: string;
  cancellationFee?: number;
  refundPercentage?: number;
  isCancellationEnabled?: boolean;
  isRegistrationOpen?: boolean;
  showCountdown?: boolean;
}

const EVENT_TYPES = ["Seminar", "Fellowship", "Autism", "Competition", "Workshop", "Guest Lecture"];

const TYPE_STYLES: Record<string, string> = {
  Seminar: "bg-blue-50 text-blue-700 border border-blue-200",
  Fellowship: "bg-violet-50 text-violet-700 border border-violet-200",
  Autism: "bg-pink-50 text-pink-700 border border-pink-200",
  Competition: "bg-amber-50 text-amber-700 border border-amber-200",
  Workshop: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Guest Lecture": "bg-cyan-50 text-cyan-700 border border-cyan-200",
};

interface EventForm {
  title: string; slug: string; description: string; shortDesc: string;
  eventDate: string; endDate: string; location: string; city: string;
  address: string; eventType: string; isPublished: boolean; isFeatured: boolean;
  maxAttendees: string; ticketPrice: string; bannerUrl: string; imageUrl: string;
  contactEmail: string; contactPhone: string; restrictToDoctors: boolean;
  requiresIdentityVerification: boolean;
  registrationStartDate: string; registrationDeadline: string;
  cancellationDeadline: string; cancellationFee: string; refundPercentage: string;
  isCancellationEnabled: boolean; isRegistrationOpen: boolean;
  showCountdown: boolean;
}

const EMPTY_FORM: EventForm = {
  title: "", slug: "", description: "", shortDesc: "", eventDate: "", endDate: "",
  location: "", city: "", address: "", eventType: "Seminar", isPublished: true,
  isFeatured: false, maxAttendees: "", ticketPrice: "", bannerUrl: "", imageUrl: "",
  contactEmail: "", contactPhone: "", restrictToDoctors: false, requiresIdentityVerification: false,
  registrationStartDate: "", registrationDeadline: "",
  cancellationDeadline: "", cancellationFee: "", refundPercentage: "",
  isCancellationEnabled: false, isRegistrationOpen: true, showCountdown: false,
};

const FIELD_TYPES = [
  { value: "text", label: "Text", icon: Type },
  { value: "email", label: "Email", icon: Mail },
  { value: "tel", label: "Phone", icon: Phone },
  { value: "date", label: "Date", icon: CalendarDays },
  { value: "select", label: "Select", icon: List },
  { value: "textarea", label: "Textarea", icon: AlignLeft },
  { value: "file", label: "File Upload", icon: Upload },
  { value: "number", label: "Number", icon: Hash },
  { value: "checkbox", label: "Checkbox", icon: CheckSquare },
] as const;

const SECTIONS = ["Personal Information", "Professional Details", "Address", "Documents", "Other"];

type FieldId = string;

interface FormField {
  id: FieldId;
  fieldName: string;
  fieldType: string;
  label: string;
  placeholder: string;
  required: boolean;
  options: string[];
  section: string;
}

interface RegistrationFormConfig {
  enabled: boolean;
  title: string;
  description: string;
  fields: FormField[];
  requiresPayment: boolean;
  ticketPrice: string;
  allowMultipleRegistrations: boolean;
}

const EMPTY_FIELD: () => FormField = () => ({
  id: crypto.randomUUID(),
  fieldName: "",
  fieldType: "text",
  label: "",
  placeholder: "",
  required: false,
  options: [],
  section: "Personal Information",
});

const EMPTY_REG_FORM: RegistrationFormConfig = {
  enabled: true,
  title: "",
  description: "",
  fields: [],
  requiresPayment: false,
  ticketPrice: "",
  allowMultipleRegistrations: false,
};

function getDefaultFields(eventType: string): FormField[] {
  const make = (fieldName: string, fieldType: string, label: string, opts: string[] = [], section = "Personal Information", required = true): FormField => ({
    id: crypto.randomUUID(), fieldName, fieldType, label, placeholder: "", required, options: opts, section,
  });

  switch (eventType) {
    case "Seminar":
      return [
        make("fname", "text", "First Name"),
        make("lname", "text", "Last Name"),
        make("email", "email", "Email Address"),
        make("phone", "tel", "Phone Number"),
        make("dob", "date", "Date of Birth"),
        make("address", "textarea", "Address", [], "Address"),
        make("qualification", "select", "Qualification", ["Practicing Vaidya", "Practitioner", "PG"], "Professional Details"),
        make("ncism_number", "text", "NCISM Registration Number", [], "Professional Details"),
        make("certificate", "file", "Certificate Upload", [], "Documents"),
      ];
    case "Fellowship":
      return [
        make("fname", "text", "First Name"),
        make("lname", "text", "Last Name"),
        make("email", "email", "Email Address"),
        make("phone", "tel", "Phone Number"),
        make("dob", "date", "Date of Birth"),
        make("gender", "select", "Gender", ["Male", "Female", "Other"]),
        make("address", "textarea", "Address", [], "Address"),
        make("bams_college", "text", "BAMS College", [], "Professional Details"),
        make("year_of_passing", "number", "Year of Passing", [], "Professional Details"),
        make("designation", "text", "Designation", [], "Professional Details"),
        make("institution", "text", "Institution", [], "Professional Details"),
        make("research_area", "text", "Research Area", [], "Professional Details"),
        make("proposal", "file", "Research Proposal Upload", [], "Documents"),
      ];
    case "Autism":
      return [
        make("parent_name", "text", "Parent / Guardian Name"),
        make("parent_gender", "select", "Parent Gender", ["Male", "Female", "Other"]),
        make("parent_dob", "date", "Parent Date of Birth"),
        make("child_name", "text", "Child Name", [], "Other"),
        make("child_gender", "select", "Child Gender", ["Male", "Female", "Other"], "Other"),
        make("child_dob", "date", "Child Date of Birth", [], "Other"),
        make("address", "textarea", "Address", [], "Address"),
        make("health_notes", "textarea", "Health Notes / Special Needs", [], "Other"),
      ];
    case "Competition":
      return [
        make("fname", "text", "First Name"),
        make("lname", "text", "Last Name"),
        make("email", "email", "Email Address"),
        make("phone", "tel", "Phone Number"),
        make("category", "select", "Competition Category", ["ART", "ESSAY", "VIDEO", "PRESENTATION", "OTHER"]),
        make("topic", "text", "Topic / Title"),
        make("description", "textarea", "Brief Description"),
        make("file_upload", "file", "Submission File", [], "Documents"),
      ];
    case "Workshop":
      return [
        make("fname", "text", "First Name"),
        make("lname", "text", "Last Name"),
        make("email", "email", "Email Address"),
        make("phone", "tel", "Phone Number"),
        make("organization", "text", "Organization / Institute", [], "Professional Details"),
        make("experience", "text", "Years of Experience", [], "Professional Details"),
        make("expectations", "textarea", "What do you expect from this workshop?", [], "Other"),
      ];
    case "Guest Lecture":
      return [
        make("fname", "text", "First Name"),
        make("lname", "text", "Last Name"),
        make("email", "email", "Email Address"),
        make("phone", "tel", "Phone Number"),
        make("institution", "text", "Institution", [], "Professional Details"),
        make("designation", "text", "Designation", [], "Professional Details"),
      ];
    default:
      return [
        make("fname", "text", "First Name"),
        make("lname", "text", "Last Name"),
        make("email", "email", "Email Address"),
        make("phone", "tel", "Phone Number"),
      ];
  }
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form builder state
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [formBuilderEvent, setFormBuilderEvent] = useState<Event | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleEvent, setScheduleEvent] = useState<Event | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [showJudges, setShowJudges] = useState(false);
  const [judgeEvent, setJudgeEvent] = useState<Event | null>(null);
  const [allJudges, setAllJudges] = useState<any[]>([]);
  const [assignedJudges, setAssignedJudges] = useState<string[]>([]);
  const [showETickets, setShowETickets] = useState(false);
  const [eticketEvent, setEticketEvent] = useState<Event | null>(null);
  const [eticketRegs, setEticketRegs] = useState<any[]>([]);
  const [regForm, setRegForm] = useState<RegistrationFormConfig>(EMPTY_REG_FORM);
  const [formSaving, setFormSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterType) params.set("eventType", filterType);
      const res = await fetch(`/api/admin/events?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setEvents(data.items || []);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [search, filterType]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : null,
        ticketPrice: form.ticketPrice ? parseFloat(form.ticketPrice) : null,
        requiresIdentityVerification: form.requiresIdentityVerification,
        registrationStartDate: form.registrationStartDate || null,
        registrationDeadline: form.registrationDeadline || null,
        cancellationDeadline: form.cancellationDeadline || null,
        cancellationFee: form.cancellationFee ? parseFloat(form.cancellationFee) : null,
        refundPercentage: form.refundPercentage ? parseInt(form.refundPercentage) : null,
        isCancellationEnabled: form.isCancellationEnabled,
        isRegistrationOpen: form.isRegistrationOpen,
        showCountdown: form.showCountdown,
      };
      const url = editing ? `/api/admin/events/${editing.id}` : "/api/admin/events";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "Event updated" : "Event created");
      closeForm();
      fetchEvents();
    } catch {
      toast.error(editing ? "Failed to update event" : "Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/events/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Event deleted");
      setDeleteId(null);
      fetchEvents();
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const openEditor = (event: Event) => {
    setEditing(event);
    setForm({
      title: event.title, slug: event.slug || "",
      description: event.description || "", shortDesc: event.shortDesc || "",
      eventDate: event.eventDate ? event.eventDate.slice(0, 10) : "",
      endDate: event.endDate ? event.endDate.slice(0, 10) : "",
      location: event.location || "", city: event.city || "",
      address: event.address || "", eventType: event.eventType,
      isPublished: event.isPublished, isFeatured: event.isFeatured,
      maxAttendees: event.maxAttendees ? String(event.maxAttendees) : "",
      ticketPrice: event.ticketPrice ? String(event.ticketPrice) : "",
      bannerUrl: event.bannerUrl || "", imageUrl: event.imageUrl || "",
      contactEmail: event.contactEmail || "", contactPhone: event.contactPhone || "",
      restrictToDoctors: event.restrictToDoctors,
      requiresIdentityVerification: event.requiresIdentityVerification || false,
      registrationStartDate: event.registrationStartDate ? event.registrationStartDate.slice(0, 16) : "",
      registrationDeadline: event.registrationDeadline ? event.registrationDeadline.slice(0, 16) : "",
      cancellationDeadline: event.cancellationDeadline ? event.cancellationDeadline.slice(0, 16) : "",
      cancellationFee: event.cancellationFee ? String(event.cancellationFee) : "",
      refundPercentage: event.refundPercentage ? String(event.refundPercentage) : "",
      isCancellationEnabled: event.isCancellationEnabled || false,
      isRegistrationOpen: event.isRegistrationOpen !== false,
      showCountdown: event.showCountdown || false,
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); };
  const setField = (field: keyof EventForm, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  // ─── Form Builder Handlers ────────────────────────────────────────────

  const openFormBuilder = (event: Event) => {
    setFormBuilderEvent(event);
    setPreviewMode(false);
    setActiveSection(null);
    if (event.hasRegistrationForm) {
      setRegForm({
        enabled: true,
        title: `${event.title} Registration`,
        description: `Register for ${event.title}`,
        fields: getDefaultFields(event.eventType),
        requiresPayment: event.requiresPayment || false,
        ticketPrice: event.ticketPrice ? String(event.ticketPrice) : "",
        allowMultipleRegistrations: event.allowMultipleRegistrations || false,
      });
    } else {
      const defaults = getDefaultFields(event.eventType);
      setRegForm({
        ...EMPTY_REG_FORM,
        enabled: true,
        title: `${event.title} Registration`,
        description: `Register for ${event.title}`,
        fields: defaults,
        ticketPrice: event.ticketPrice ? String(event.ticketPrice) : "",
      });
    }
    setShowFormBuilder(true);
  };

  const closeFormBuilder = () => { setShowFormBuilder(false); setFormBuilderEvent(null); setPreviewMode(false); };

  const addField = (afterIndex?: number) => {
    const newField = EMPTY_FIELD();
    setRegForm(prev => {
      const fields = [...prev.fields];
      if (afterIndex !== undefined) {
        fields.splice(afterIndex + 1, 0, newField);
      } else {
        fields.push(newField);
      }
      return { ...prev, fields };
    });
  };

  const updateField = (id: FieldId, updates: Partial<FormField>) => {
    setRegForm(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
  };

  const removeField = (id: FieldId) => {
    setRegForm(prev => ({ ...prev, fields: prev.fields.filter(f => f.id !== id) }));
  };

  const moveField = (id: FieldId, direction: "up" | "down") => {
    setRegForm(prev => {
      const fields = [...prev.fields];
      const idx = fields.findIndex(f => f.id === id);
      if (idx === -1) return prev;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= fields.length) return prev;
      [fields[idx], fields[target]] = [fields[target], fields[idx]];
      return { ...prev, fields };
    });
  };

  const saveFormConfig = async () => {
    if (!formBuilderEvent) return;
    setFormSaving(true);
    try {
      const res = await fetch(`/api/admin/events/${formBuilderEvent.id}/form`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hasRegistrationForm: regForm.enabled,
          formTitle: regForm.title,
          formDescription: regForm.description,
          fields: regForm.fields,
          requiresPayment: regForm.requiresPayment,
          ticketPrice: regForm.ticketPrice ? parseFloat(regForm.ticketPrice) : null,
          allowMultipleRegistrations: regForm.allowMultipleRegistrations,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Registration form saved");
      closeFormBuilder();
      fetchEvents();
    } catch {
      toast.error("Failed to save registration form");
    } finally {
      setFormSaving(false);
    }
  };

  const groupedFields = SECTIONS.reduce<Record<string, FormField[]>>((acc, sec) => {
    acc[sec] = regForm.fields.filter(f => f.section === sec);
    return acc;
  }, {});

  const sectionsWithFields = SECTIONS.filter(sec => groupedFields[sec]?.length > 0);

  // ─── Schedule Handlers ────────────────────────────────────────────────
  const openSchedule = async (event: Event) => {
    setScheduleEvent(event);
    setShowSchedule(true);
    try {
      const res = await fetch(`/api/admin/events/${event.id}/schedule`);
      if (res.ok) { const data = await res.json(); setSchedules(data.schedules || []); }
    } catch {}
  };

  const saveSchedule = async () => {
    if (!scheduleEvent) return;
    try {
      const res = await fetch(`/api/admin/events/${scheduleEvent.id}/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedules }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Schedule saved");
      setShowSchedule(false);
    } catch { toast.error("Failed to save schedule"); }
  };

  const addScheduleItem = () => {
    setSchedules(prev => [...prev, { id: crypto.randomUUID(), title: "", description: "", startTime: "", endTime: "", speaker: "", location: "", track: "Main Hall", sortOrder: prev.length }]);
  };

  const updateScheduleItem = (idx: number, updates: any) => {
    setSchedules(prev => prev.map((s, i) => i === idx ? { ...s, ...updates } : s));
  };

  const removeScheduleItem = (idx: number) => {
    setSchedules(prev => prev.filter((_, i) => i !== idx));
  };

  // ─── Judge Handlers ───────────────────────────────────────────────────
  const openJudges = async (event: Event) => {
    setJudgeEvent(event);
    setShowJudges(true);
    try {
      const res = await fetch(`/api/admin/events/${event.id}/judges`);
      if (res.ok) { const data = await res.json(); setAllJudges(data.allJudges || []); setAssignedJudges(data.assignedJudges || []); }
    } catch {}
  };

  const saveJudges = async () => {
    if (!judgeEvent) return;
    try {
      const res = await fetch(`/api/admin/events/${judgeEvent.id}/judges`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judgeIds: assignedJudges }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Judge assignments saved");
      setShowJudges(false);
    } catch { toast.error("Failed to save judge assignments"); }
  };

  const toggleJudge = (judgeId: string) => {
    setAssignedJudges(prev => prev.includes(judgeId) ? prev.filter(id => id !== judgeId) : [...prev, judgeId]);
  };

  // ─── E-Ticket Handlers ────────────────────────────────────────────────
  const openETickets = async (event: Event) => {
    setEticketEvent(event);
    setShowETickets(true);
    try {
      const res = await fetch(`/api/admin/events/${event.id}/etickets`);
      if (res.ok) { const data = await res.json(); setEticketRegs(data.registrations || []); }
    } catch {}
  };

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-ink">Events</h1>
          <p className="text-muted mt-1">{events.length} events total</p>
        </div>
        <button onClick={() => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); }} className="btn-primary">
          <Plus size={18} /> Add Event
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === "Enter") fetchEvents(); }}
            placeholder="Search events..." className="input-field pl-10 w-full" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input-field w-auto min-w-[140px]">
          <option value="">All Types</option>
          {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* ─── Event Create/Edit Modal ─── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={closeForm}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 my-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="font-heading text-xl font-bold text-ink">{editing ? "Edit" : "Create New"} Event</h2>
              <button onClick={closeForm} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-ink mb-1.5">Title *</label>
                  <input value={form.title} onChange={e => setField("title", e.target.value)} required placeholder="Event title" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Event Type *</label>
                  <select value={form.eventType} onChange={e => setField("eventType", e.target.value)} className="input-field w-full">
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Slug</label>
                  <input value={form.slug} onChange={e => setField("slug", e.target.value)} placeholder="auto-generated" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Event Date *</label>
                  <input type="date" value={form.eventDate} onChange={e => setField("eventDate", e.target.value)} required className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setField("endDate", e.target.value)} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Location</label>
                  <input value={form.location} onChange={e => setField("location", e.target.value)} placeholder="Venue name" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">City</label>
                  <input value={form.city} onChange={e => setField("city", e.target.value)} placeholder="City" className="input-field w-full" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-ink mb-1.5">Address</label>
                  <input value={form.address} onChange={e => setField("address", e.target.value)} placeholder="Full address" className="input-field w-full" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-ink mb-3">Content</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Short Description</label>
                    <textarea value={form.shortDesc} onChange={e => setField("shortDesc", e.target.value)} rows={2} placeholder="Brief summary" className="input-field w-full resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Full Description</label>
                    <textarea value={form.description} onChange={e => setField("description", e.target.value)} rows={4} placeholder="Full description" className="input-field w-full" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-ink mb-3">Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Max Attendees</label>
                    <input type="number" value={form.maxAttendees} onChange={e => setField("maxAttendees", e.target.value)} placeholder="e.g. 500" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Ticket Price (₹)</label>
                    <input type="number" value={form.ticketPrice} onChange={e => setField("ticketPrice", e.target.value)} placeholder="e.g. 500" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Contact Email</label>
                    <input type="email" value={form.contactEmail} onChange={e => setField("contactEmail", e.target.value)} placeholder="contact@example.com" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Contact Phone</label>
                    <input value={form.contactPhone} onChange={e => setField("contactPhone", e.target.value)} placeholder="+91 ..." className="input-field w-full" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div><label className="text-sm font-semibold text-ink">Published</label><p className="text-xs text-muted">Show on public pages</p></div>
                  <button type="button" onClick={() => setField("isPublished", !form.isPublished)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.isPublished ? "bg-emerald-accent" : "bg-slate-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublished ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div><label className="text-sm font-semibold text-ink">Featured</label><p className="text-xs text-muted">Highlight on homepage</p></div>
                  <button type="button" onClick={() => setField("isFeatured", !form.isFeatured)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.isFeatured ? "bg-gold" : "bg-slate-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isFeatured ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div><label className="text-sm font-semibold text-ink">Require Identity Verification</label><p className="text-xs text-muted">Users must verify identity before registering</p></div>
                  <button type="button" onClick={() => setField("requiresIdentityVerification", !form.requiresIdentityVerification)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.requiresIdentityVerification ? "bg-teal" : "bg-slate-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.requiresIdentityVerification ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div><label className="text-sm font-semibold text-ink">Show Countdown</label><p className="text-xs text-muted">Display countdown timer on homepage</p></div>
                  <button type="button" onClick={() => setField("showCountdown", !form.showCountdown)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.showCountdown ? "bg-teal" : "bg-slate-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.showCountdown ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div><label className="text-sm font-semibold text-ink">Registration Open</label><p className="text-xs text-muted">Allow users to register for this event</p></div>
                  <button type="button" onClick={() => setField("isRegistrationOpen", !form.isRegistrationOpen)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.isRegistrationOpen ? "bg-emerald-accent" : "bg-slate-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isRegistrationOpen ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
              </div>

              {/* Registration Dates */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-ink mb-3">Registration Period</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Registration Start Date</label>
                    <input type="datetime-local" value={form.registrationStartDate} onChange={e => setField("registrationStartDate", e.target.value)} className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Registration Deadline</label>
                    <input type="datetime-local" value={form.registrationDeadline} onChange={e => setField("registrationDeadline", e.target.value)} className="input-field w-full" />
                  </div>
                </div>
              </div>

              {/* Cancellation Settings */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div><h4 className="text-sm font-bold text-ink">Cancellation Policy</h4><p className="text-xs text-muted">Configure cancellation and refund rules for this event</p></div>
                  <button type="button" onClick={() => setField("isCancellationEnabled", !form.isCancellationEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.isCancellationEnabled ? "bg-teal" : "bg-slate-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isCancellationEnabled ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
                {form.isCancellationEnabled && (
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-1.5">Cancellation Deadline</label>
                      <input type="datetime-local" value={form.cancellationDeadline} onChange={e => setField("cancellationDeadline", e.target.value)} className="input-field w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-1.5">Cancellation Fee (₹)</label>
                      <input type="number" value={form.cancellationFee} onChange={e => setField("cancellationFee", e.target.value)} placeholder="0 for free cancellation" className="input-field w-full" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-ink mb-1.5">Refund Percentage ({form.refundPercentage || "0"}%)</label>
                      <input type="range" min="0" max="100" value={form.refundPercentage || "0"} onChange={e => setField("refundPercentage", e.target.value)} className="w-full" />
                      <div className="flex justify-between text-xs text-muted"><span>No refund</span><span>Full refund</span></div>
                    </div>
                    {form.eventType === "Free" || !form.ticketPrice || parseFloat(form.ticketPrice) === 0 ? (
                      <p className="col-span-2 text-xs text-emerald-600 bg-emerald-50 rounded-lg p-2">Free event — no cancellation fee applies</p>
                    ) : null}
                  </div>
                )}
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full">
                <Save size={18} /> {saving ? "Saving..." : editing ? "Update Event" : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── Events Table ─── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Event</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Location</th>
                <th className="text-left px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-ink text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-muted">No events found</td></tr>
              ) : (
                events.map(event => (
                  <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-ink">{event.title}</div>
                      <div className="flex gap-1.5 mt-1">
                        {event.isFeatured && <span className="px-1.5 py-0.5 bg-gold/10 text-gold text-[10px] font-bold rounded uppercase">Featured</span>}
                        {event.restrictToDoctors && <span className="px-1.5 py-0.5 bg-maroon/10 text-maroon text-[10px] font-bold rounded uppercase">Doctors</span>}
                        {event.hasRegistrationForm && <span className="px-1.5 py-0.5 bg-teal-50 text-[#0d6662] text-[10px] font-bold rounded uppercase border border-teal-200">Form</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${TYPE_STYLES[event.eventType] || "bg-slate-100 text-slate-600"}`}>
                        {event.eventType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">
                      {new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">
                      <div className="flex items-center gap-1"><MapPin size={12} />{event.city || event.location || "—"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${event.isPublished ? "bg-emerald-accent/10 text-emerald-accent" : "bg-slate-100 text-muted"}`}>
                        {event.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-1 justify-end flex-wrap">
                        <button onClick={() => openFormBuilder(event)} className="p-2 hover:bg-[#0d6662]/10 rounded-lg text-[#0d6662] transition-colors" title="Registration Form">
                          <FileText size={16} />
                        </button>
                        <button onClick={() => openSchedule(event)} className="p-2 hover:bg-gold/10 rounded-lg text-gold transition-colors" title="Event Schedule">
                          <Clock size={16} />
                        </button>
                        <button onClick={() => openJudges(event)} className="p-2 hover:bg-purple-50 rounded-lg text-purple-600 transition-colors" title="Assign Judges">
                          <Scale size={16} />
                        </button>
                        <button onClick={() => openETickets(event)} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors" title="E-Tickets">
                          <Ticket size={16} />
                        </button>
                        <button onClick={() => openEditor(event)} className="p-2 hover:bg-slate-100 rounded-lg text-muted transition-colors" title="Edit"><Edit size={16} /></button>
                        <button onClick={() => setDeleteId(event.id)} className="p-2 hover:bg-red-50 rounded-lg text-danger transition-colors" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Delete Confirmation Modal ─── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-danger" /></div>
            <h3 className="font-heading text-lg font-bold text-ink text-center">Delete Event?</h3>
            <p className="text-muted text-sm text-center mt-2">This action cannot be undone. All event data will be permanently removed.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Form Builder Modal ─── */}
      {showFormBuilder && formBuilderEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center p-4 overflow-y-auto" onClick={closeFormBuilder}>
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 my-4" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0d6662]/10 flex items-center justify-center">
                  <FileText size={20} className="text-[#0d6662]" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-ink">Registration Form Builder</h2>
                  <p className="text-xs text-muted mt-0.5">{formBuilderEvent.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPreviewMode(!previewMode)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 transition-colors text-ink">
                  {previewMode ? <><EyeOff size={14} /> Edit</> : <><Eye size={14} /> Preview</>}
                </button>
                <button onClick={closeFormBuilder} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
              </div>
            </div>

            {previewMode ? (
              /* ─── Preview Mode ─── */
              <div className="p-8 max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  {regForm.enabled ? (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-[#0d6662]/10 flex items-center justify-center mx-auto mb-4">
                        <FileText size={28} className="text-[#0d6662]" />
                      </div>
                      <h3 className="font-heading text-2xl font-extrabold text-ink">{regForm.title || "Registration Form"}</h3>
                      <p className="text-muted mt-2">{regForm.description || "Please fill out the form below."}</p>
                      {regForm.requiresPayment && (
                        <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-[#c2761c]/10 rounded-lg text-[#c2761c] text-xs font-semibold">
                          <CreditCard size={14} /> Payment Required: ₹{regForm.ticketPrice || "0"}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted text-lg">Registration is disabled for this event.</p>
                  )}
                </div>
                {regForm.enabled && sectionsWithFields.map(sec => (
                  <div key={sec} className="mb-6">
                    <h4 className="text-sm font-bold text-[#0d6662] uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">{sec}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {groupedFields[sec].map(field => (
                        <div key={field.id} className={field.fieldType === "textarea" || field.fieldType === "checkbox" ? "col-span-2" : ""}>
                          <label className="block text-sm font-semibold text-ink mb-1.5">
                            {field.label || field.fieldName || "Untitled"} {field.required && <span className="text-danger">*</span>}
                          </label>
                          {field.fieldType === "textarea" ? (
                            <div className="input-field bg-slate-50 min-h-[80px] text-sm text-muted">{field.placeholder || ""}</div>
                          ) : field.fieldType === "select" ? (
                            <select className="input-field w-full" disabled>
                              <option>{field.placeholder || "Select..."}</option>
                              {field.options.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                          ) : field.fieldType === "checkbox" ? (
                            <label className="flex items-center gap-2 text-sm text-muted">
                              <input type="checkbox" disabled className="rounded border-slate-300" /> {field.label}
                            </label>
                          ) : field.fieldType === "file" ? (
                            <div className="input-field bg-slate-50 text-sm text-muted flex items-center gap-2"><Upload size={14} /> Choose file...</div>
                          ) : (
                            <input type={field.fieldType === "tel" ? "tel" : field.fieldType} placeholder={field.placeholder} disabled className="input-field w-full bg-slate-50" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {regForm.enabled && (
                  <button className="btn-primary w-full mt-4" disabled>Register</button>
                )}
              </div>
            ) : (
              /* ─── Edit Mode ─── */
              <div className="flex">
                {/* Sidebar: Field list */}
                <div className="w-80 border-r border-slate-100 p-4 max-h-[70vh] overflow-y-auto flex-shrink-0">
                  <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3 px-1">Fields ({regForm.fields.length})</h4>
                  <div className="space-y-1.5">
                    {regForm.fields.map((field, idx) => {
                      const FTIcon = FIELD_TYPES.find(ft => ft.value === field.fieldType)?.icon || Type;
                      return (
                        <div key={field.id}
                          className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm ${
                            activeSection === field.id ? "bg-[#0d6662]/10 text-[#0d6662] border border-[#0d6662]/20" : "hover:bg-slate-50 text-ink border border-transparent"
                          }`}
                          onClick={() => setActiveSection(activeSection === field.id ? null : field.id)}>
                          <GripVertical size={14} className="text-slate-300 flex-shrink-0" />
                          <FTIcon size={14} className="flex-shrink-0 opacity-50" />
                          <span className="flex-1 truncate font-medium">{field.label || field.fieldName || "Untitled"}</span>
                          {field.required && <span className="text-danger text-xs">*</span>}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={e => { e.stopPropagation(); moveField(field.id, "up"); }} className="p-0.5 hover:bg-white rounded" disabled={idx === 0}>
                              <ChevronUp size={12} className={idx === 0 ? "text-slate-200" : "text-muted"} />
                            </button>
                            <button onClick={e => { e.stopPropagation(); moveField(field.id, "down"); }} className="p-0.5 hover:bg-white rounded" disabled={idx === regForm.fields.length - 1}>
                              <ChevronDown size={12} className={idx === regForm.fields.length - 1 ? "text-slate-200" : "text-muted"} />
                            </button>
                            <button onClick={e => { e.stopPropagation(); removeField(field.id); }} className="p-0.5 hover:bg-red-50 rounded text-danger">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => addField()} className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-dashed border-slate-200 rounded-lg text-xs font-semibold text-muted hover:border-[#0d6662] hover:text-[#0d6662] transition-colors">
                    <Plus size={14} /> Add Field
                  </button>
                </div>

                {/* Main: Settings + Field editor */}
                <div className="flex-1 max-h-[70vh] overflow-y-auto">
                  {/* Form-level settings */}
                  <div className="p-6 border-b border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-semibold text-ink">Registration Enabled</label>
                        <p className="text-xs text-muted">Allow users to register for this event</p>
                      </div>
                      <button type="button" onClick={() => setRegForm(p => ({ ...p, enabled: !p.enabled }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${regForm.enabled ? "bg-[#0d6662]" : "bg-slate-300"}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${regForm.enabled ? "left-6" : "left-0.5"}`} />
                      </button>
                    </div>

                    {regForm.enabled && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="block text-sm font-semibold text-ink mb-1.5">Form Title</label>
                            <input value={regForm.title} onChange={e => setRegForm(p => ({ ...p, title: e.target.value }))}
                              placeholder="Registration Form" className="input-field w-full" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-semibold text-ink mb-1.5">Form Description</label>
                            <textarea value={regForm.description} onChange={e => setRegForm(p => ({ ...p, description: e.target.value }))}
                              rows={2} placeholder="Describe what this form is for..." className="input-field w-full resize-none" />
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4 space-y-3">
                          <h4 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5"><Settings size={12} /> Options</h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-semibold text-ink">Requires Payment</label>
                              <p className="text-xs text-muted">Collect payment during registration</p>
                            </div>
                            <button type="button" onClick={() => setRegForm(p => ({ ...p, requiresPayment: !p.requiresPayment }))}
                              className={`relative w-12 h-6 rounded-full transition-colors ${regForm.requiresPayment ? "bg-[#c2761c]" : "bg-slate-300"}`}>
                              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${regForm.requiresPayment ? "left-6" : "left-0.5"}`} />
                            </button>
                          </div>
                          {regForm.requiresPayment && (
                            <div className="max-w-xs">
                              <label className="block text-sm font-semibold text-ink mb-1.5">Ticket Price (₹)</label>
                              <input type="number" value={regForm.ticketPrice} onChange={e => setRegForm(p => ({ ...p, ticketPrice: e.target.value }))}
                                placeholder="e.g. 500" className="input-field w-full" />
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-semibold text-ink">Allow Multiple Registrations</label>
                              <p className="text-xs text-muted">Let users submit more than one registration</p>
                            </div>
                            <button type="button" onClick={() => setRegForm(p => ({ ...p, allowMultipleRegistrations: !p.allowMultipleRegistrations }))}
                              className={`relative w-12 h-6 rounded-full transition-colors ${regForm.allowMultipleRegistrations ? "bg-[#0d6662]" : "bg-slate-300"}`}>
                              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${regForm.allowMultipleRegistrations ? "left-6" : "left-0.5"}`} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Field editor */}
                  {regForm.enabled && activeSection && (() => {
                    const field = regForm.fields.find(f => f.id === activeSection);
                    if (!field) return null;
                    return (
                      <div className="p-6 space-y-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-ink">Edit Field</h4>
                          <button onClick={() => setActiveSection(null)} className="p-1 hover:bg-white rounded-lg transition-colors text-muted">
                            <X size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1">Field Name (key)</label>
                            <input value={field.fieldName} onChange={e => updateField(field.id, { fieldName: e.target.value })}
                              placeholder="e.g. first_name" className="input-field w-full text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1">Label</label>
                            <input value={field.label} onChange={e => updateField(field.id, { label: e.target.value })}
                              placeholder="e.g. First Name" className="input-field w-full text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1">Field Type</label>
                            <select value={field.fieldType} onChange={e => {
                              const newType = e.target.value;
                              const updates: Partial<FormField> = { fieldType: newType };
                              if (newType === "select" && field.options.length === 0) updates.options = ["Option 1", "Option 2"];
                              updateField(field.id, updates);
                            }} className="input-field w-full text-sm">
                              {FIELD_TYPES.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1">Section</label>
                            <select value={field.section} onChange={e => updateField(field.id, { section: e.target.value })} className="input-field w-full text-sm">
                              {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          {field.fieldType !== "checkbox" && field.fieldType !== "file" && (
                            <div className="col-span-2">
                              <label className="block text-xs font-semibold text-muted mb-1">Placeholder</label>
                              <input value={field.placeholder} onChange={e => updateField(field.id, { placeholder: e.target.value })}
                                placeholder="Placeholder text" className="input-field w-full text-sm" />
                            </div>
                          )}
                        </div>
                        {field.fieldType === "select" && (
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1.5">Options (one per line)</label>
                            <textarea value={field.options.join("\n")}
                              onChange={e => updateField(field.id, { options: e.target.value.split("\n").filter(Boolean) })}
                              rows={4} placeholder={"Option 1\nOption 2\nOption 3"} className="input-field w-full text-sm resize-none" />
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-ink">Required</label>
                          <button type="button" onClick={() => updateField(field.id, { required: !field.required })}
                            className={`relative w-10 h-5 rounded-full transition-colors ${field.required ? "bg-danger" : "bg-slate-300"}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${field.required ? "left-5" : "left-0.5"}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {regForm.enabled && !activeSection && (
                    <div className="p-12 text-center text-muted">
                      <Layout size={40} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Select a field from the sidebar to edit it, or click &quot;Add Field&quot; to create a new one.</p>
                    </div>
                  )}

                  {/* Footer */}
                  {regForm.enabled && (
                    <div className="p-6 flex justify-end gap-3">
                      <button onClick={() => { setPreviewMode(true); }} className="btn-outline">
                        <Eye size={16} /> Preview
                      </button>
                      <button onClick={saveFormConfig} disabled={formSaving} className="btn-gold">
                        <Save size={16} /> {formSaving ? "Saving..." : "Save Form"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Schedule Builder Modal ─── */}
      {showSchedule && scheduleEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowSchedule(false)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 my-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center"><Clock size={20} className="text-gold" /></div>
                <div><h2 className="font-heading text-xl font-bold text-ink">Event Schedule</h2><p className="text-sm text-muted">{scheduleEvent.title}</p></div>
              </div>
              <button onClick={() => setShowSchedule(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {schedules.map((item, idx) => (
                <div key={item.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted uppercase">Session {idx + 1}</span>
                    <button onClick={() => removeScheduleItem(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={item.title} onChange={e => updateScheduleItem(idx, { title: e.target.value })} className="input-field" placeholder="Session title" />
                    <input value={item.speaker || ""} onChange={e => updateScheduleItem(idx, { speaker: e.target.value })} className="input-field" placeholder="Speaker name" />
                    <input type="datetime-local" value={item.startTime || ""} onChange={e => updateScheduleItem(idx, { startTime: e.target.value })} className="input-field" />
                    <input type="datetime-local" value={item.endTime || ""} onChange={e => updateScheduleItem(idx, { endTime: e.target.value })} className="input-field" />
                    <input value={item.location || ""} onChange={e => updateScheduleItem(idx, { location: e.target.value })} className="input-field" placeholder="Location/Room" />
                    <input value={item.track || ""} onChange={e => updateScheduleItem(idx, { track: e.target.value })} className="input-field" placeholder="Track (Main Hall, etc.)" />
                  </div>
                  <textarea value={item.description || ""} onChange={e => updateScheduleItem(idx, { description: e.target.value })} className="input-field" placeholder="Description (optional)" rows={2} />
                </div>
              ))}
              <button onClick={addScheduleItem} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-muted hover:border-gold hover:text-gold transition-colors"><Plus size={16} className="inline mr-1" /> Add Session</button>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowSchedule(false)} className="btn-outline">Cancel</button>
              <button onClick={saveSchedule} className="btn-primary"><Save size={16} /> Save Schedule</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Judge Assignment Modal ─── */}
      {showJudges && judgeEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowJudges(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 my-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><Scale size={20} className="text-purple-600" /></div>
                <div><h2 className="font-heading text-xl font-bold text-ink">Assign Judges</h2><p className="text-sm text-muted">{judgeEvent.title}</p></div>
              </div>
              <button onClick={() => setShowJudges(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6">
              {allJudges.length === 0 ? (
                <p className="text-center text-muted py-8">No judges/reviewers found. Create users with JUDGE or REVIEWER role first.</p>
              ) : (
                <div className="space-y-2">
                  {allJudges.map((judge: any) => (
                    <label key={judge.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${assignedJudges.includes(judge.id) ? "border-purple-400 bg-purple-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <input type="checkbox" checked={assignedJudges.includes(judge.id)} onChange={() => toggleJudge(judge.id)} className="w-4 h-4 rounded text-purple-600" />
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">{(judge.name || "J")[0]}</div>
                      <div><p className="text-sm font-semibold text-ink">{judge.name}</p><p className="text-xs text-muted">{judge.email} · {judge.role}</p></div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowJudges(false)} className="btn-outline">Cancel</button>
              <button onClick={saveJudges} className="btn-primary"><UserPlus size={16} /> Save Assignments</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── E-Tickets Modal ─── */}
      {showETickets && eticketEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowETickets(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 my-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Ticket size={20} className="text-emerald-600" /></div>
                <div><h2 className="font-heading text-xl font-bold text-ink">E-Tickets</h2><p className="text-sm text-muted">{eticketEvent.title} · {eticketRegs.length} registrations</p></div>
              </div>
              <button onClick={() => setShowETickets(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6">
              {eticketRegs.length === 0 ? (
                <p className="text-center text-muted py-8">No registrations yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted uppercase">Attendee</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted uppercase">Ticket #</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted uppercase">Status</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted uppercase">Payment</th>
                    </tr></thead>
                    <tbody>
                      {eticketRegs.map((reg: any) => (
                        <tr key={reg.id} className="border-b border-slate-100">
                          <td className="py-3 px-3"><p className="font-medium text-ink">{reg.user?.name || "—"}</p><p className="text-xs text-muted">{reg.user?.email}</p></td>
                          <td className="py-3 px-3 font-mono text-xs font-bold text-teal">{reg.ticketNumber}</td>
                          <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${reg.isVerified ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-muted"}`}>{reg.isVerified ? "Verified" : "Pending"}</span></td>
                          <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${reg.paymentStatus === "COMPLETED" ? "bg-emerald-50 text-emerald-700" : reg.paymentStatus === "PENDING" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-muted"}`}>{reg.paymentStatus || "N/A"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowETickets(false)} className="btn-outline">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
