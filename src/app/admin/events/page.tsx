"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";

interface Event {
  id: string;
  title: string;
  eventType: string;
  eventDate: string;
  location: string;
  isPublished: boolean;
}

const eventTypes = ["seminar", "fellowship", "autism"];

const typeColors: Record<string, string> = {
  seminar: "bg-blue-50 text-blue-700",
  fellowship: "bg-purple-50 text-purple-700",
  autism: "bg-pink-50 text-pink-700",
};

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({ title: "", eventType: "seminar", eventDate: "", location: "", isPublished: true });
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterType) params.set("eventType", filterType);
    const res = await fetch(`/api/admin/events?${params.toString()}`);
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/admin/events/${editing.id}` : "/api/admin/events";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", eventType: "seminar", eventDate: "", location: "", isPublished: true });
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
      eventType: event.eventType,
      eventDate: event.eventDate ? event.eventDate.slice(0, 10) : "",
      location: event.location,
      isPublished: event.isPublished,
    });
    setShowForm(true);
  };

  const openCreator = () => {
    setEditing(null);
    setForm({ title: "", eventType: "seminar", eventDate: "", location: "", isPublished: true });
    setShowForm(true);
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
          {eventTypes.map(t => (<option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>))}
        </select>
        <button onClick={fetchEvents}
          className="px-4 py-2.5 bg-navy/5 text-navy rounded-xl text-sm font-semibold hover:bg-navy/10">
          Filter
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-xl font-bold text-navy">{editing ? "Edit" : "Add"} Event</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Event title"
                  required
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Event Type</label>
                <select
                  value={form.eventType}
                  onChange={e => setForm({ ...form, eventType: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
                >
                  {eventTypes.map(t => (<option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Date</label>
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={e => setForm({ ...form, eventDate: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Location</label>
                <input
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="Event location"
                  required
                  className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="evtPublished"
                  checked={form.isPublished}
                  onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded accent-navy"
                />
                <label htmlFor="evtPublished" className="text-sm font-semibold text-navy">Published</label>
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
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Title</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Type</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Date</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Location</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-muted">Loading...</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-muted">No events found</td></tr>
            ) : (
              events.map(event => (
                <tr key={event.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{event.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${typeColors[event.eventType] || "bg-gray-100"}`}>
                      {event.eventType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted">{new Date(event.eventDate).toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-4 text-muted">{event.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${event.isPublished ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {event.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditor(event)} className="p-2 hover:bg-gray-100 rounded-lg text-muted" title="Edit"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(event.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 ml-1" title="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
