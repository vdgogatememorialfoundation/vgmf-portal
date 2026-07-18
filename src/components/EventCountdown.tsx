"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

interface CountdownEvent {
  id: string;
  title: string;
  eventDate: string;
  location: string | null;
  isRegistrationOpen: boolean;
  slug: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(dateStr: string): TimeLeft | null {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 bg-[#0d6662]/10 rounded-xl flex items-center justify-center mb-1">
        <span className="font-heading text-xl font-extrabold text-[#0d6662]">{String(value).padStart(2, "0")}</span>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider text-[#7c7c8a]">{label}</span>
    </div>
  );
}

export default function EventCountdown({ events }: { events: CountdownEvent[] }) {
  const [times, setTimes] = useState<Record<string, TimeLeft | null>>({});

  useEffect(() => {
    function update() {
      const next: Record<string, TimeLeft | null> = {};
      for (const e of events) {
        next[e.id] = calculateTimeLeft(e.eventDate);
      }
      setTimes(next);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [events]);

  if (events.length === 0) return null;

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="section-heading">
          <span className="badge">Don&apos;t Miss Out</span>
          <h2>Upcoming Events</h2>
          <p>Mark your calendar and register before spots fill up</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {events.map((event) => {
            const t = times[event.id];
            const isPast = t === null;
            return (
              <div key={event.id} className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6 card-hover flex flex-col">
                <h3 className="font-heading text-base font-extrabold text-[#1a1a2e] mb-2 leading-snug">{event.title}</h3>
                <div className="flex items-center gap-3 text-[11px] text-[#7c7c8a] mb-4">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} className="text-[#0d6662]" />
                    {new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {event.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} className="text-[#c2761c]" />
                      {event.location}
                    </span>
                  )}
                </div>
                {isPast ? (
                  <div className="flex items-center gap-2 py-3 mb-4">
                    <Clock size={14} className="text-[#7c7c8a]" />
                    <span className="text-sm font-bold text-[#7c7c8a]">Event Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 py-3 mb-4 bg-[#faf9f6] rounded-xl">
                    <CountdownBlock value={t!.days} label="Days" />
                    <span className="text-[#0d6662]/30 font-bold text-lg mt-[-14px]">:</span>
                    <CountdownBlock value={t!.hours} label="Hours" />
                    <span className="text-[#0d6662]/30 font-bold text-lg mt-[-14px]">:</span>
                    <CountdownBlock value={t!.minutes} label="Min" />
                    <span className="text-[#0d6662]/30 font-bold text-lg mt-[-14px]">:</span>
                    <CountdownBlock value={t!.seconds} label="Sec" />
                  </div>
                )}
                <div className="mt-auto flex gap-2">
                  <Link
                    href={event.isRegistrationOpen ? "/dashboard" : `/events/${event.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors bg-[#0d6662] text-white hover:bg-[#0a5250]"
                  >
                    {event.isRegistrationOpen ? "Register Now" : "View Details"} <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
