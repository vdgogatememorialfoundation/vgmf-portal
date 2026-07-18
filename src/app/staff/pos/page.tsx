"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ShoppingCart, Calendar, MapPin, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Event {
  id: string;
  title: string;
  eventDate: string;
  location?: string;
  city?: string;
}

export default function StaffPOSHome() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ isPublished: "true" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/events?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const upcoming = (data.items || []).filter((e: Event) => new Date(e.eventDate) >= new Date(new Date().setHours(0, 0, 0, 0)));
      setEvents(upcoming);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-ink">Point of Sale</h1>
        <p className="text-muted mt-1">Select an event to start selling on-site</p>
      </div>

      <div className="relative max-w-md">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") fetchEvents(); }}
          placeholder="Search events..."
          className="input-field pl-10 w-full"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-muted" />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ShoppingCart size={40} className="mx-auto text-slate-200 mb-3" />
          <p className="text-muted font-medium">No upcoming events found</p>
          <p className="text-xs text-muted mt-1">Published events will appear here for POS access</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/staff/pos/${event.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink group-hover:text-[#0d6662] transition-colors truncate">{event.title}</h3>
                </div>
                <ArrowRight size={18} className="text-muted group-hover:text-[#0d6662] group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
              <div className="space-y-1.5 text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {new Date(event.eventDate).toLocaleDateString("en-IN", {
                    weekday: "short", day: "numeric", month: "short", year: "numeric",
                  })}
                </div>
                {(event.location || event.city) && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    {event.city || event.location}
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d6662]/10 text-[#0d6662] rounded-lg text-xs font-semibold">
                  <ShoppingCart size={12} /> Open POS
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
