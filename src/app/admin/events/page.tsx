"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save, ChevronDown, ChevronUp } from "lucide-react";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  eventDate: string;
  endDate: string | null;
  location: string | null;
  city: string | null;
  address: string | null;
  eventType: string;
  isPublished: boolean;
  isFeatured: boolean;
  maxAttendees: number | null;
  ticketPrice: number | null;
  bannerUrl: string | null;
  imageUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  restrictToDoctors: boolean;
}

const EVENT_TYPES = ["Seminar", "Fellowship", "Autism"];

const typeColors: Record<string, string> = {
  Seminar: "bg-blue-50 text-blue-700",
  Fellowship: "bg-purple-50 text-purple-700",
  Autism: "bg-pink-50 text-pink-700",
};

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  shortDesc: "",
  eventDate: "",
  endDate: "",
  location: "",
  city: "",
  address: "",
  eventType: "Seminar",
  isPublished: true,
  isFeatured: false,
  maxAttendees: "",
  ticketPrice: "",
  bannerUrl: "",
  imageUrl: "",
  contactEmail: "",
  contactPhone: "",
  restrictToDoctors: false,
};

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterType) params.set("eventType", filterType);
    const res = await fetch(`/api/admin/events?${params.toString()}`);
    const data = await res.json();
    setEvents(data.items || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      ...form,
      maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees as string) : null,
      ticketPrice: form.ticketPrice ? parseFloat(form.ticketPrice as string) : null,
    };
    const url = editing ? `/api/admin/events/${editing.id}` : "/api/admin/events";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    closeForm();
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    fetchEvents();
  };

  const openEditor = (event: Event) => {
    setEditing(event);
    setForm({
      title: event.title,
      slug: event.slug || "",
      description: event.description || "",
      shortDesc: event.shortDesc || "",
      eventDate: event.eventDate ? event.eventDate.slice(0, 10) : "",
      endDate: event.endDate ? event.endDate.slice(0, 10) : "",
      location: event.location || "",
      city: event.city || "",
      address: event.address || "",
      eventType: event.eventType,
      isPublished: event.isPublished,
      isFeatured: event.isFeatured,
      maxAttendees: event.maxAttendees ? String(event.maxAttendees) : "",
      ticketPrice: event.ticketPrice ? String(event.ticketPrice) : "",
      bannerUrl: event.bannerUrl || "",
      imageUrl: event.imageUrl || "",
      contactEmail: event.contactEmail || "",
      contactPhone: event.contactPhone || "",
      restrictToDoctors: event.restrictToDoctors,
    });
    setShowForm(true);
  };

  const openCreator = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const setField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">Events</h1>
          <p className="text-muted mt-1">{events.length} events</p>
        </div>
        <button onClick={openCreator}
          className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light">
          <Plus size={18} /> Add Event
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") fetchEvents(); }}
          placeholder="Search events..."
          className="w-full max-w-md px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
        />
        <select
          value={filterType}
          onChange={e => { setFilterType(e.target.value); }}
          className="px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
        >
          <option value="">All Types</option>
          {EVENT_TYPES.map(t => (<option key={t} value={t}>{t}</option>))}
        </select>
        <button onClick={fetchEvents}
          className="px-4 py-2.5 bg-navy/5 text-navy rounded-xl text-sm font-semibold hover:bg-navy/10">
          Filter
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl my-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-xl font-bold text-navy">{editing ? "Edit" : "Add"} Event</h2>
              <button onClick={closeForm} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-navy mb-1">Title *</label>
                  <input value={form.title} onChange={e => setField("title", e.target.value)} placeholder="Event title" required
                    className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Slug</label>
                  <input value={form.slug} onChange={e => setField("slug", e.target.value)} placeholder="Auto-generated if empty"
                    className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Event Type *</label>
                  <select value={form.eventType} onChange={e => setField("eventType", e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20">
                    {EVENT_TYPES.map(t => (<option key={t} value={t}>{t}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Event Date *</label>
                  <input type="date" value={form.eventDate} onChange={e => setField("eventDate", e.target.value)} required
                    className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setField("endDate", e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Location</label>
                  <input value={form.location} onChange={e => setField("location", e.target.value)} placeholder="Venue name"
                    className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">City</label>
                  <input value={form.city} onChange={e => setField("city", e.target.value)} placeholder="City"
                    className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-navy mb-1">Address</label>
                  <input value={form.address} onChange={e => setField("address", e.target.value)} placeholder="Full address"
                    className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-bold text-navy mb-3">Content</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Short Description</label>
                    <textarea value={form.shortDesc} onChange={e => setField("shortDesc", e.target.value)} rows={2} placeholder="Brief summary"
                      className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Description</label>
                    <textarea value={form.description} onChange={e => setField("description", e.target.value)} rows={4} placeholder="Full description"
                      className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-bold text-navy mb-3">Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Max Attendees</label>
                    <input type="number" value={form.maxAttendees} onChange={e => setField("maxAttendees", e.target.value)} placeholder="e.g. 500"
                      className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Ticket Price (₹)</label>
                    <input type="number" value={form.ticketPrice} onChange={e => setField("ticketPrice", e.target.value)} placeholder="e.g. 500"
                      className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Contact Email</label>
                    <input type="email" value={form.contactEmail} onChange={e => setField("contactEmail", e.target.value)} placeholder="contact@example.com"
                      className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Contact Phone</label>
                    <input value={form.contactPhone} onChange={e => setField("contactPhone", e.target.value)} placeholder="+91 ..."
                      className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-bold text-navy mb-3">Media</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Banner URL</label>
                    <input value={form.bannerUrl} onChange={e => setField("bannerUrl", e.target.value)} placeholder="https://..."
                      className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Image URL</label>
                    <input value={form.imageUrl} onChange={e => setField("imageUrl", e.target.value)} placeholder="https://..."
                      className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-navy">Published</label>
                    <p className="text-xs text-muted">Show on public event pages</p>
                  </div>
                  <button type="button" onClick={() => setField("isPublished", !form.isPublished)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.isPublished ? "bg-green-500" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublished ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-navy">Featured</label>
                    <p className="text-xs text-muted">Highlight on homepage</p>
                  </div>
                  <button type="button" onClick={() => setField("isFeatured", !form.isFeatured)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.isFeatured ? "bg-gold" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isFeatured ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
                {(form.eventType === "Seminar" || form.eventType === "Fellowship") && (
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-navy">Restrict to Doctors Only</label>
                      <p className="text-xs text-muted">Only verified practitioners can register</p>
                    </div>
                    <button type="button" onClick={() => setField("restrictToDoctors", !form.restrictToDoctors)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${form.restrictToDoctors ? "bg-maroon" : "bg-gray-300"}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.restrictToDoctors ? "left-6" : "left-0.5"}`} />
                    </button>
                  </div>
                )}
              </div>

              <button type="submit"
                className="w-full py-2.5 bg-navy text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-navy-light">
                <Save size={18} /> {editing ? "Update" : "Create"} Event
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-navy/5">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-navy">Title</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Type</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Location</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Flags</th>
                <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted">Loading...</td></tr>
              ) : events.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted">No events found</td></tr>
              ) : (
                events.map(event => (
                  <>
                    <tr key={event.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-navy">{event.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${typeColors[event.eventType] || "bg-gray-100"}`}>
                          {event.eventType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted text-xs">
                        {new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {event.endDate && <> &ndash; {new Date(event.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</>}
                      </td>
                      <td className="px-6 py-4 text-muted text-xs">{event.city || event.location || "\u2014"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${event.isPublished ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {event.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {event.isFeatured && <span className="px-1.5 py-0.5 bg-gold/10 text-gold text-[10px] font-semibold rounded">Featured</span>}
                          {event.restrictToDoctors && <span className="px-1.5 py-0.5 bg-maroon/10 text-maroon text-[10px] font-semibold rounded">Doctors</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => toggleExpand(event.id)} className="p-2 hover:bg-gray-100 rounded-lg text-muted" title="More">
                          {expandedId === event.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button onClick={() => openEditor(event)} className="p-2 hover:bg-gray-100 rounded-lg text-muted" title="Edit"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(event.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 ml-1" title="Delete"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                    {expandedId === event.id && (
                      <tr key={`${event.id}-detail`} className="bg-gray-50 border-t">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            {event.shortDesc && <div><span className="font-semibold text-navy">Short:</span> <span className="text-muted">{event.shortDesc}</span></div>}
                            {event.maxAttendees && <div><span className="font-semibold text-navy">Max:</span> <span className="text-muted">{event.maxAttendees}</span></div>}
                            {event.ticketPrice && <div><span className="font-semibold text-navy">Price:</span> <span className="text-muted">₹{event.ticketPrice}</span></div>}
                            {event.contactEmail && <div><span className="font-semibold text-navy">Email:</span> <span className="text-muted">{event.contactEmail}</span></div>}
                            {event.contactPhone && <div><span className="font-semibold text-navy">Phone:</span> <span className="text-muted">{event.contactPhone}</span></div>}
                            {event.slug && <div><span className="font-semibold text-navy">Slug:</span> <span className="text-muted">{event.slug}</span></div>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
