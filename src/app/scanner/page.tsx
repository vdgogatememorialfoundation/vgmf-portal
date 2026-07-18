"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ScanLine,
  Camera,
  Keyboard,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  LogOut,
  Clock,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface Event {
  id: string;
  title: string;
  eventDate: string;
  eventType: string;
  _count?: { registrations: number };
}

interface ScanResult {
  status: "VALID" | "ALREADY_SCANNED" | "INVALID" | "CANCELLED";
  message: string;
  scannedAt?: string;
  attendee?: { name: string; email: string; phone?: string };
  event?: string;
  ticketNumber?: string;
}

interface ScanHistoryEntry {
  id: string;
  ticketNumber: string;
  status: string;
  scannedAt: string;
  attendeeName: string;
  eventTitle: string;
}

interface Stats {
  totalScanned: number;
  valid: number;
  alreadyScanned: number;
  invalid: number;
  totalRegistrations: number;
}

export default function ScannerPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [ticketInput, setTicketInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [portalEnabled, setPortalEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/portals/scanner/status")
      .then(r => r.ok ? r.json() : { enabled: true })
      .then(data => setPortalEnabled(data.enabled))
      .catch(() => setPortalEnabled(true));
  }, []);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/staff/login");
    }
  }, [authStatus, router]);

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const res = await fetch("/api/dashboard/events?limit=50");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      toast.error("Failed to load events");
    } finally {
      setEventsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    if (!selectedEventId) return;
    try {
      const res = await fetch(`/api/scanner/stats?eventId=${selectedEventId}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // silent
    }
  }, [selectedEventId]);

  const fetchHistory = useCallback(async () => {
    if (!selectedEventId) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/scanner/history?eventId=${selectedEventId}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.items || []);
      }
    } catch {
      // silent
    } finally {
      setHistoryLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (selectedEventId) {
      fetchStats();
      fetchHistory();
    }
  }, [selectedEventId, fetchStats, fetchHistory]);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setResult(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [result, selectedEventId]);

  const handleScan = async () => {
    const ticket = ticketInput.trim();
    if (!ticket || !selectedEventId || scanning) return;

    setScanning(true);
    setResult(null);

    try {
      const res = await fetch("/api/scanner/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketNumber: ticket, eventId: selectedEventId }),
      });

      const data = await res.json();
      if (!res.ok && data.error) {
        toast.error(data.error);
        return;
      }

      setResult(data);
      setTicketInput("");
      fetchStats();
      fetchHistory();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setScanning(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleScan();
    }
  };

  if (authStatus === "loading" || portalEnabled === null) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <RefreshCw size={32} className="text-teal animate-spin" />
      </div>
    );
  }

  if (authStatus === "unauthenticated") return null;

  if (portalEnabled === false) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-maroon/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-white mb-3">Portal Unavailable</h1>
          <p className="text-white/60 mb-6">This portal is currently unavailable. Please contact the administrator.</p>
          <button onClick={() => router.push("/")} className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const totalReg = stats?.totalRegistrations || 0;
  const checkedIn = stats?.valid || 0;
  const checkInPct = totalReg > 0 ? Math.round((checkedIn / totalReg) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* Header */}
      <header className="bg-[#12121f] border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-teal-light flex items-center justify-center shadow-lg shadow-teal/30">
              <ScanLine size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold leading-tight">VGMF Event Scanner</h1>
              <p className="text-[11px] text-white/40 uppercase tracking-widest">
                {(session?.user as any)?.role || "Staff"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.createElement("a");
              el.href = "/api/auth/signout";
              el.click();
            }}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <LogOut size={16} className="text-white/50" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Event Selector */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-1.5 block">
            Select Event
          </label>
          <div className="relative">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              disabled={eventsLoading}
              className="w-full appearance-none bg-[#242440] border border-white/10 rounded-xl px-4 py-3 text-white text-base font-medium focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/30 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <option value="">
                {eventsLoading ? "Loading events..." : "Choose an event"}
              </option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
          </div>
        </div>

        {/* Stats Row */}
        {selectedEventId && stats && (
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Total", value: stats.totalScanned, color: "bg-white/5 text-white/70" },
              { label: "Valid", value: stats.valid, color: "bg-[#16a34a]/20 text-[#4ade80]" },
              { label: "Duplicate", value: stats.alreadyScanned, color: "bg-[#eab308]/20 text-[#facc15]" },
              { label: "Invalid", value: stats.invalid, color: "bg-[#dc2626]/20 text-[#f87171]" },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.color} rounded-xl px-3 py-2.5 text-center`}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                  {s.label}
                </p>
                <p className="text-2xl font-heading font-extrabold mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Check-in Progress */}
        {selectedEventId && stats && totalReg > 0 && (
          <div className="bg-[#242440] rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                Check-in Progress
              </span>
              <span className="text-sm font-bold text-teal-light">
                {checkedIn}/{totalReg} ({checkInPct}%)
              </span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal to-teal-light rounded-full transition-all duration-500"
                style={{ width: `${checkInPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Scan Input Area */}
        {selectedEventId && (
          <div className="bg-[#242440] rounded-2xl p-5 space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/40 block">
              Enter or Paste Ticket Number
            </label>
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="VGMF-XXXX"
                disabled={scanning}
                autoFocus
                className="flex-1 bg-[#1a1a2e] border-2 border-white/10 rounded-xl px-5 py-4 text-2xl font-mono font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-teal transition-colors disabled:opacity-50 tracking-wider"
              />
              <button
                onClick={handleScan}
                disabled={!ticketInput.trim() || scanning}
                className="px-8 py-4 bg-gradient-to-br from-teal to-teal-light rounded-xl text-white font-heading font-bold text-xl tracking-wide shadow-lg shadow-teal/30 hover:shadow-teal/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {scanning ? (
                  <RefreshCw size={22} className="animate-spin" />
                ) : (
                  <>
                    <ScanLine size={22} />
                    SCAN
                  </>
                )}
              </button>
            </div>

            {/* Camera Placeholder */}
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-dashed border-white/10 text-white/25 text-sm font-medium cursor-not-allowed"
            >
              <Camera size={20} />
              Camera scanning coming soon
            </button>
          </div>
        )}

        {/* Scan Result */}
        {result && (
          <div
            className={`rounded-2xl p-6 border-2 animate-scale-in ${
              result.status === "VALID"
                ? "bg-[#16a34a]/10 border-[#16a34a]/40"
                : result.status === "ALREADY_SCANNED"
                ? "bg-[#eab308]/10 border-[#eab308]/40"
                : result.status === "CANCELLED"
                ? "bg-[#dc2626]/10 border-[#dc2626]/40"
                : "bg-[#dc2626]/10 border-[#dc2626]/40"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  result.status === "VALID"
                    ? "bg-[#16a34a]/20"
                    : result.status === "ALREADY_SCANNED"
                    ? "bg-[#eab308]/20"
                    : "bg-[#dc2626]/20"
                }`}
              >
                {result.status === "VALID" ? (
                  <CheckCircle2 size={32} className="text-[#4ade80]" />
                ) : result.status === "ALREADY_SCANNED" ? (
                  <AlertTriangle size={32} className="text-[#facc15]" />
                ) : (
                  <XCircle size={32} className="text-[#f87171]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2
                    className={`font-heading text-2xl font-extrabold ${
                      result.status === "VALID"
                        ? "text-[#4ade80]"
                        : result.status === "ALREADY_SCANNED"
                        ? "text-[#facc15]"
                        : "text-[#f87171]"
                    }`}
                  >
                    {result.status === "VALID"
                      ? "ENTRY VERIFIED"
                      : result.status === "ALREADY_SCANNED"
                      ? "ALREADY SCANNED"
                      : result.status === "CANCELLED"
                      ? "TICKET CANCELLED"
                      : "INVALID TICKET"}
                  </h2>
                </div>

                {result.attendee && (
                  <div className="mt-2 space-y-1">
                    <p className="text-white text-xl font-bold">{result.attendee.name}</p>
                    {result.attendee.phone && (
                      <p className="text-white/50 text-sm">{result.attendee.phone}</p>
                    )}
                  </div>
                )}

                {result.ticketNumber && (
                  <p className="text-white/40 text-sm font-mono mt-2">
                    #{result.ticketNumber}
                  </p>
                )}

                {result.status === "ALREADY_SCANNED" && result.scannedAt && (
                  <div className="flex items-center gap-1.5 mt-2 text-[#facc15]/70 text-sm">
                    <Clock size={14} />
                    <span>
                      Originally scanned at{" "}
                      {new Date(result.scannedAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No Event Selected State */}
        {!selectedEventId && !eventsLoading && (
          <div className="text-center py-16">
            <ScanLine size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/30 text-lg font-heading font-bold">Select an event to start scanning</p>
            <p className="text-white/15 text-sm mt-1">Choose from the dropdown above</p>
          </div>
        )}

        {/* Scan History */}
        {selectedEventId && (
          <div className="bg-[#242440] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                Recent Scans
              </h3>
              <button
                onClick={fetchHistory}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <RefreshCw size={14} className={historyLoading ? "animate-spin" : ""} />
              </button>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8">
                <Keyboard size={28} className="mx-auto text-white/10 mb-2" />
                <p className="text-white/25 text-sm">No scans yet for this event</p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
                {history.map((entry) => {
                  const statusColor =
                    entry.status === "VALID"
                      ? "bg-[#16a34a]"
                      : entry.status === "ALREADY_SCANNED"
                      ? "bg-[#eab308]"
                      : "bg-[#dc2626]";
                  const statusText =
                    entry.status === "VALID"
                      ? "text-[#4ade80]"
                      : entry.status === "ALREADY_SCANNED"
                      ? "text-[#facc15]"
                      : "text-[#f87171]";

                  return (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white/90 text-sm font-medium truncate">
                          {entry.attendeeName}
                        </p>
                        <p className="text-white/30 text-xs font-mono truncate">
                          #{entry.ticketNumber}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-[11px] font-bold uppercase ${statusText}`}>
                          {entry.status === "ALREADY_SCANNED" ? "Dup" : entry.status}
                        </p>
                        <p className="text-white/25 text-[10px]">
                          {new Date(entry.scannedAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
