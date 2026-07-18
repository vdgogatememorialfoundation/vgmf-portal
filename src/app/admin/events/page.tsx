"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, X, Save, Search, Calendar, MapPin, Users } from "lucide-react";
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
}

const EVENT_TYPES = ["Seminar", "Fellowship", "Autism"];

const TYPE_STYLES: Record<string, string> = {
  Seminar: "bg-blue-50 text-blue-700 border border-blue-200",
  Fellowship: "bg-violet-50 text-violet-700 border border-violet-200",
  Autism: "bg-pink-50 text-pink-700 border border-pink-200",
};

interface EventForm {
  title: string; slug: string; description: string; shortDesc: string;
  eventDate: string; endDate: string; location: string; city: string;
  address: string; eventType: string; isPublished: boolean; isFeatured: boolean;
  maxAttendees: string; ticketPrice: string; bannerUrl: string; imageUrl: string;
  contactEmail: string; contactPhone: string; restrictToDoctors: boolean;
}

const EMPTY_FORM: EventForm = {
  title: "", slug: "", description: "", shortDesc: "", eventDate: "", endDate: "",
  location: "", city: "", address: "", eventType: "Seminar", isPublished: true,
  isFeatured: false, maxAttendees: "", ticketPrice: "", bannerUrl: "", imageUrl: "",
  contactEmail: "", contactPhone: "", restrictToDoctors: false,
};

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
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); };
  const setField = (field: keyof EventForm, value: any) => setForm(prev => ({ ...prev, [field]: value }));

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
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full">
                <Save size={18} /> {saving ? "Saving..." : editing ? "Update Event" : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      )}

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
                      <button onClick={() => openEditor(event)} className="p-2 hover:bg-slate-100 rounded-lg text-muted transition-colors" title="Edit"><Edit size={16} /></button>
                      <button onClick={() => setDeleteId(event.id)} className="p-2 hover:bg-red-50 rounded-lg text-danger ml-1 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  );
}
