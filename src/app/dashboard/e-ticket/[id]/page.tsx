"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Printer, Share2, Copy, AlertCircle, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ETicketCard from "@/components/ETicketCard";

interface TicketData {
  id: string;
  ticketNumber: string;
  eTicketNumber?: string | null;
  status: "VALID" | "SCANNED" | "CANCELLED";
  rawStatus: string;
  paymentStatus?: string | null;
  paymentAmount?: number | null;
  isVerified: boolean;
  registrationDate: string;
  event: {
    id: string;
    title: string;
    slug?: string;
    eventDate: string;
    endDate?: string | null;
    location?: string | null;
    city?: string | null;
    address?: string | null;
    eventType?: string | null;
    bannerUrl?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    schedules?: {
      id: string;
      title: string;
      description?: string | null;
      startTime: string;
      endTime?: string | null;
      speaker?: string | null;
      location?: string | null;
      track?: string | null;
    }[];
  };
  attendee: {
    name: string;
    email: string;
    phone?: string | null;
  };
  qrData: string;
}

export default function ETicketPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push(`/login?callbackUrl=/dashboard/e-ticket/${ticketId}`);
    }
  }, [authStatus, router, ticketId]);

  useEffect(() => {
    if (!session || !ticketId) return;

    fetch(`/api/dashboard/e-tickets/${ticketId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Ticket not found");
        return r.json();
      })
      .then((data) => {
        setTicket(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load e-ticket");
        setLoading(false);
      });
  }, [session, ticketId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/dashboard/e-ticket/${ticketId}`;
    const shareData = {
      title: `E-Ticket: ${ticket?.event?.title || "Event"}`,
      text: `My e-ticket for ${ticket?.event?.title} – Ticket #${ticket?.ticketNumber}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="text-center">
          <Loader2 size={32} className="text-[#0d6662] animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#8a8a8a] font-medium">Loading e-ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="text-center max-w-sm mx-auto px-4">
          <AlertCircle size={48} className="text-[#8a8a8a]/30 mx-auto mb-4" />
          <h2 className="font-[var(--font-heading)] text-xl font-bold text-[#1a1a2e] mb-2">
            E-Ticket Not Found
          </h2>
          <p className="text-sm text-[#8a8a8a] mb-6">
            {error || "The requested e-ticket could not be found."}
          </p>
          <Link
            href="/dashboard?tab=my-e-tickets"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d6662] text-white rounded-xl text-sm font-bold hover:bg-[#0a5c58] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#fff",
            color: "#1a1a2e",
            fontSize: "14px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid #e5e5e0",
          },
          success: { iconTheme: { primary: "#0d6662", secondary: "#fff" } },
          error: { iconTheme: { primary: "#7c1d1d", secondary: "#fff" } },
        }}
      />

      <div className="min-h-screen bg-[#faf9f6]">
        <div className="eticket-no-print bg-white border-b border-[#1a1a2e]/5 px-4 py-3 sticky top-0 z-30">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Link
              href="/dashboard?tab=my-e-tickets"
              className="flex items-center gap-2 text-sm font-bold text-[#8a8a8a] hover:text-[#0d6662] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-[#0d6662] bg-[#0d6662]/10 rounded-xl hover:bg-[#0d6662]/20 transition-colors"
              >
                {copied ? (
                  <CheckCircle size={14} />
                ) : (
                  <Share2 size={14} />
                )}
                {copied ? "Copied!" : "Share"}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-white bg-[#0d6662] rounded-xl hover:bg-[#0a5c58] transition-colors"
              >
                <Printer size={14} />
                Print
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-8">
          <ETicketCard
            eventTitle={ticket.event.title}
            eventDate={ticket.event.eventDate}
            eventEndDate={ticket.event.endDate}
            eventLocation={ticket.event.location}
            eventCity={ticket.event.city}
            eventType={ticket.event.eventType}
            attendeeName={ticket.attendee.name}
            ticketNumber={ticket.ticketNumber}
            ticketStatus={ticket.status}
            registrationDate={ticket.registrationDate}
            paymentAmount={ticket.paymentAmount}
            schedule={ticket.event.schedules}
          />

          <div className="eticket-no-print mt-6 text-center">
            <p className="text-xs text-[#8a8a8a]">
              Present this ticket at the event entrance along with a valid photo ID.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0d6662] text-white rounded-xl text-sm font-bold hover:bg-[#0a5c58] transition-colors"
              >
                <Printer size={16} />
                Print E-Ticket
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#1a1a2e]/10 text-[#1a1a2e] rounded-xl text-sm font-bold hover:bg-[#faf9f6] transition-colors"
              >
                <Share2 size={16} />
                Share Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
