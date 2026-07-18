"use client";

import {
  Calendar,
  MapPin,
  Clock,
  User,
  Hash,
  CheckCircle,
  AlertCircle,
  XCircle,
  Ticket,
  Mic,
} from "lucide-react";

interface ScheduleItem {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime?: string | null;
  speaker?: string | null;
  location?: string | null;
  track?: string | null;
}

interface ETicketCardProps {
  eventTitle: string;
  eventDate: string;
  eventEndDate?: string | null;
  eventLocation?: string | null;
  eventCity?: string | null;
  eventType?: string | null;
  attendeeName: string;
  ticketNumber: string;
  ticketStatus: "VALID" | "SCANNED" | "CANCELLED";
  registrationDate?: string;
  paymentAmount?: number | null;
  schedule?: ScheduleItem[];
  className?: string;
}

function BarcodeDisplay({ code }: { code: string }) {
  const bars: React.ReactNode[] = [];
  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    const barCount = (charCode % 3) + 2;
    for (let j = 0; j < barCount; j++) {
      const isBlack = (charCode + j) % 2 === 0;
      const width = isBlack ? 2 : 1;
      bars.push(
        <div
          key={`${i}-${j}`}
          className="h-full"
          style={{
            width: `${width}px`,
            backgroundColor: isBlack ? "#1a1a2e" : "transparent",
          }}
        />
      );
    }
    bars.push(
      <div key={`${i}-s`} className="h-full" style={{ width: "1px" }} />
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-16 overflow-hidden">
      <div className="flex items-stretch h-full gap-px">{bars}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: "VALID" | "SCANNED" | "CANCELLED" }) {
  const config = {
    VALID: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: CheckCircle,
      label: "VALID",
    },
    SCANNED: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      icon: AlertCircle,
      label: "SCANNED",
    },
    CANCELLED: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: XCircle,
      label: "CANCELLED",
    },
  };

  const c = config[status];
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}
    >
      <Icon size={13} />
      {c.label}
    </span>
  );
}

export default function ETicketCard({
  eventTitle,
  eventDate,
  eventEndDate,
  eventLocation,
  eventCity,
  eventType,
  attendeeName,
  ticketNumber,
  ticketStatus,
  registrationDate,
  paymentAmount,
  schedule,
  className = "",
}: ETicketCardProps) {
  const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(eventDate).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const locationStr = [eventLocation, eventCity].filter(Boolean).join(", ");

  return (
    <div className={`eticket-card bg-white rounded-2xl border border-ink/5 overflow-hidden shadow-lg shadow-ink/5 ${className}`}>
      <style>{`
        @media print {
          .eticket-card {
            box-shadow: none !important;
            border: 2px solid #1a1a2e !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .eticket-no-print {
            display: none !important;
          }
          .eticket-print-only {
            display: block !important;
          }
        }
      `}</style>

      <div className="bg-gradient-to-r from-[#0d6662] to-[#0a5c58] px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <Ticket size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                VGMF E-Ticket
              </p>
              <h3 className="text-white font-heading text-lg font-extrabold leading-tight">
                {eventTitle}
              </h3>
            </div>
          </div>
          <StatusBadge status={ticketStatus} />
        </div>
      </div>

      <div className="px-6 py-5 border-b border-dashed border-ink/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-teal/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <Calendar size={16} className="text-teal" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
                Date
              </p>
              <p className="text-sm font-bold text-ink">{formattedDate}</p>
              <p className="text-xs text-muted">{formattedTime}</p>
            </div>
          </div>

          {locationStr && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-teal/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={16} className="text-teal" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
                  Venue
                </p>
                <p className="text-sm font-bold text-ink">{locationStr}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-teal/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <User size={16} className="text-teal" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
                Attendee
              </p>
              <p className="text-sm font-bold text-ink">{attendeeName}</p>
              {registrationDate && (
                <p className="text-xs text-muted">
                  Registered{" "}
                  {new Date(registrationDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>

          {eventType && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-teal/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Hash size={16} className="text-teal" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
                  Type
                </p>
                <p className="text-sm font-bold text-ink">{eventType}</p>
                {paymentAmount != null && (
                  <p className="text-xs text-muted">
                    ₹{paymentAmount.toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-6 border-b border-dashed border-ink/10">
        <p className="text-[10px] font-bold text-muted uppercase tracking-wider text-center mb-2">
          Ticket Number
        </p>
        <p className="text-center font-mono text-2xl font-extrabold text-ink tracking-wider">
          {ticketNumber}
        </p>

        <div className="mt-4 bg-cream rounded-xl p-4 border border-ink/5">
          <BarcodeDisplay code={ticketNumber} />
          <p className="text-center text-[10px] text-muted font-mono mt-2 tracking-wider">
            {ticketNumber}
          </p>
        </div>
      </div>

      {schedule && schedule.length > 0 && (
        <div className="px-6 py-5 border-b border-dashed border-ink/10">
          <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3">
            Event Schedule
          </h4>
          <div className="space-y-2.5">
            {schedule.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 bg-cream rounded-xl"
              >
                <div className="w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={14} className="text-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink">{item.title}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted mt-0.5">
                    <span>
                      {new Date(item.startTime).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {item.endTime &&
                        ` – ${new Date(item.endTime).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                    </span>
                    {item.speaker && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Mic size={10} />
                          {item.speaker}
                        </span>
                      </>
                    )}
                    {item.track && (
                      <>
                        <span>·</span>
                        <span>{item.track}</span>
                      </>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted/70 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-6 py-4 bg-cream/50">
        <p className="text-[10px] text-muted text-center">
          Present this ticket at the event entrance. A valid photo ID is
          required for entry.
        </p>
      </div>
    </div>
  );
}
