"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, GraduationCap, FlaskConical, Heart, Package,
  ArrowRight, Ticket, LayoutDashboard, User, Loader2,
  Stethoscope, Users, Building2, BookOpen, Calendar,
  FileText, Award, Globe, ExternalLink, CheckCircle,
  AlertCircle, Bell, Pin, ChevronRight, MapPin, CreditCard,
  HelpCircle, Phone, Mail, MessageSquare, Clock,
  ChevronDown, ChevronUp, Search,
} from "lucide-react";

type Tab =
  | "overview"
  | "register-events"
  | "my-registrations"
  | "my-orders"
  | "track-orders"
  | "my-address"
  | "payments"
  | "help-support";

const categoryLabels: Record<string, string> = {
  DOCTOR: "Ayurvedic Practitioner",
  STUDENT: "Ayurveda Student",
  RESEARCHER: "Research Scholar",
  PATIENT: "Patient",
  GENERAL: "General Public",
  INSTITUTION: "Organization",
};

const categoryColors: Record<string, string> = {
  DOCTOR: "bg-[#0d6662]/10 text-[#0d6662] border-[#0d6662]/20",
  STUDENT: "bg-[#c2761c]/10 text-[#c2761c] border-[#c2761c]/20",
  RESEARCHER: "bg-[#7c1d1d]/10 text-[#7c1d1d] border-[#7c1d1d]/20",
  PATIENT: "bg-[#7c1d1d]/10 text-[#7c1d1d] border-[#7c1d1d]/20",
  GENERAL: "bg-[#1a1a2e]/10 text-[#1a1a2e] border-[#1a1a2e]/20",
  INSTITUTION: "bg-[#c2761c]/10 text-[#c2761c] border-[#c2761c]/20",
};

const statusColor = (s: string) => {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
    SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
    UNDER_REVIEW: "bg-yellow-50 text-yellow-700 border-yellow-200",
    SHORTLISTED: "bg-purple-50 text-purple-700 border-purple-200",
    SELECTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    FUNDED: "bg-[#c2761c]/10 text-[#c2761c] border-[#c2761c]/20",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    DRAFT: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return map[s] || "bg-gray-50 text-gray-600 border-gray-200";
};

const eventTypeColor = (t: string) => {
  const map: Record<string, string> = {
    Seminar: "bg-[#0d6662]/10 text-[#0d6662] border-[#0d6662]/20",
    Fellowship: "bg-[#c2761c]/10 text-[#c2761c] border-[#c2761c]/20",
    Autism: "bg-[#7c1d1d]/10 text-[#7c1d1d] border-[#7c1d1d]/20",
  };
  return map[t] || "bg-[#1a1a2e]/10 text-[#1a1a2e] border-[#1a1a2e]/20";
};

const eventTypeIcon = (t: string) => {
  const map: Record<string, any> = {
    Seminar: GraduationCap,
    Fellowship: FlaskConical,
    Autism: Heart,
  };
  return map[t] || Calendar;
};

const sidebarItems: { id: Tab; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "register-events", label: "Register for Events", icon: Calendar },
  { id: "my-registrations", label: "My Registrations", icon: Ticket },
  { id: "my-orders", label: "My Orders", icon: ShoppingBag },
  { id: "track-orders", label: "Track Orders", icon: Package },
  { id: "my-address", label: "My Address", icon: MapPin },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "help-support", label: "Help & Support", icon: HelpCircle },
];

const faqs = [
  {
    q: "How do I register for a seminar?",
    a: "Go to the 'Register for Events' tab in your dashboard, find the seminar you want to attend, and click the Register button. Fill in your details and submit.",
  },
  {
    q: "How do I track my order?",
    a: "Navigate to the 'Track Orders' tab and enter your order number. You will see real-time status updates including shipping and delivery information.",
  },
  {
    q: "What is the Viddhakarma Research Fellowship?",
    a: "It is a research fellowship providing grants up to ₹75,000 for Ayurvedic research. You can apply through the 'Register for Events' tab by selecting a Fellowship event.",
  },
  {
    q: "How do I update my profile information?",
    a: "Contact our support team via email or phone, and we will help you update your profile details.",
  },
  {
    q: "Can I cancel my registration?",
    a: "Yes, please contact our support team with your ticket number and we will process the cancellation.",
  },
];

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

interface OrderData {
  orderNumber: string;
  status: string;
  estimatedDelivery: string | null;
  events: TrackingEvent[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  items: { name: string; quantity: number; price: number }[];
}

const STATUS_STEPS = [
  { key: "PENDING", label: "Order Placed", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Package },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#1a1a2e]/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#faf9f6] transition-colors"
      >
        <span className="text-sm font-bold text-[#1a1a2e] pr-4">{faq.q}</span>
        {open ? (
          <ChevronUp size={16} className="text-[#0d6662] shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-[#7c7c8a] shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-[#7c7c8a] leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session) {
      fetch("/api/dashboard")
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then((d) => {
          setData(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session, status, router]);

  if (status === "loading" || (!session && status !== "unauthenticated")) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-[#0d6662] animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#7c7c8a] font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as any;
  const category = data?.category || user.category || "GENERAL";

  const orderCount = data?.orders?.length || 0;
  const seminarCount = data?.seminars?.length || 0;
  const fellowshipCount = data?.fellowships?.length || 0;
  const autismCount = data?.autism?.length || 0;
  const totalRegistrations = seminarCount + fellowshipCount + autismCount;

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDEBAR */}
      <aside className="w-72 bg-white border-r border-[#1a1a2e]/5 flex flex-col sticky top-0 h-screen">
        {/* User Info */}
        <div className="p-6 border-b border-[#1a1a2e]/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0d6662] to-[#0a8480] rounded-xl flex items-center justify-center text-white text-lg font-heading font-extrabold shadow-md shadow-[#0d6662]/20">
              {user.name?.[0] || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-sm font-extrabold text-[#1a1a2e] truncate">{user.name || "User"}</p>
              <p className="text-xs text-[#7c7c8a] truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${categoryColors[category] || "bg-[#1a1a2e]/10 text-[#1a1a2e] border-[#1a1a2e]/20"}`}>
              {categoryLabels[category] || category}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#0d6662] text-white shadow-md shadow-[#0d6662]/20"
                      : "text-[#7c7c8a] hover:bg-[#0d6662]/5 hover:text-[#1a1a2e]"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1a1a2e]/5">
          <Link
            href="/shop"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#7c7c8a] hover:bg-[#faf9f6] transition-colors"
          >
            <ShoppingBag size={16} />
            <span>Visit Shop</span>
            <ExternalLink size={12} className="ml-auto" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#7c7c8a] hover:bg-[#faf9f6] transition-colors"
          >
            <Globe size={16} />
            <span>Back to Website</span>
            <ExternalLink size={12} className="ml-auto" />
          </Link>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1 bg-[#faf9f6] min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-10">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <OverviewTab user={user} category={category} data={data} orderCount={orderCount} totalRegistrations={totalRegistrations} />
          )}

          {/* REGISTER FOR EVENTS */}
          {activeTab === "register-events" && (
            <RegisterEventsTab user={user} />
          )}

          {/* MY REGISTRATIONS */}
          {activeTab === "my-registrations" && (
            <MyRegistrationsTab data={data} />
          )}

          {/* MY ORDERS */}
          {activeTab === "my-orders" && (
            <MyOrdersTab data={data} orderCount={orderCount} />
          )}

          {/* TRACK ORDERS */}
          {activeTab === "track-orders" && (
            <TrackOrdersTab />
          )}

          {/* MY ADDRESS */}
          {activeTab === "my-address" && (
            <MyAddressTab user={user} />
          )}

          {/* PAYMENTS */}
          {activeTab === "payments" && (
            <PaymentsTab />
          )}

          {/* HELP & SUPPORT */}
          {activeTab === "help-support" && (
            <HelpSupportTab />
          )}
        </div>
      </main>
    </div>
  );
}

/* ================================================================
   OVERVIEW TAB
   ================================================================ */
function OverviewTab({ user, category, data, orderCount, totalRegistrations }: {
  user: any;
  category: string;
  data: any;
  orderCount: number;
  totalRegistrations: number;
}) {
  const pendingItems = (data?.orders?.filter((o: any) => o.status === "PENDING" || o.status === "PROCESSING").length || 0)
    + (data?.seminars?.filter((s: any) => !s.isVerified).length || 0);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#0d6662] to-[#0a8480] rounded-2xl flex items-center justify-center text-white text-xl font-heading font-extrabold shadow-lg shadow-[#0d6662]/20">
            {user.name?.[0] || "U"}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-heading text-2xl font-extrabold text-[#1a1a2e]">
                Welcome, {user.name || "User"}
              </h1>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${categoryColors[category] || "bg-[#1a1a2e]/10 text-[#1a1a2e] border-[#1a1a2e]/20"}`}>
                {categoryLabels[category] || category}
              </span>
            </div>
            <p className="text-sm text-[#7c7c8a] mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={Ticket}
          label="Registrations"
          value={totalRegistrations}
          color="from-[#0d6662] to-[#0a8480]"
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={orderCount}
          color="from-[#c2761c] to-[#a86318]"
        />
        <StatCard
          icon={Clock}
          label="Pending Items"
          value={pendingItems}
          color="from-[#7c1d1d] to-[#5e1616]"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="#"
            onClick={(e) => { e.preventDefault(); }}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#1a1a2e]/5 card-hover group"
          >
            <div className="w-10 h-10 bg-[#0d6662]/10 rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-[#0d6662]" />
            </div>
            <span className="text-sm font-bold text-[#1a1a2e] flex-1">Register for Events</span>
            <ArrowRight size={16} className="text-[#7c7c8a] group-hover:text-[#0d6662] group-hover:translate-x-1 transition-all" />
          </Link>
          <Link
            href="#"
            onClick={(e) => { e.preventDefault(); }}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#1a1a2e]/5 card-hover group"
          >
            <div className="w-10 h-10 bg-[#c2761c]/10 rounded-xl flex items-center justify-center">
              <Package size={18} className="text-[#c2761c]" />
            </div>
            <span className="text-sm font-bold text-[#1a1a2e] flex-1">Track Orders</span>
            <ArrowRight size={16} className="text-[#7c7c8a] group-hover:text-[#c2761c] group-hover:translate-x-1 transition-all" />
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#1a1a2e]/5 card-hover group"
          >
            <div className="w-10 h-10 bg-[#7c1d1d]/10 rounded-xl flex items-center justify-center">
              <ShoppingBag size={18} className="text-[#7c1d1d]" />
            </div>
            <span className="text-sm font-bold text-[#1a1a2e] flex-1">Visit Shop</span>
            <ArrowRight size={16} className="text-[#7c7c8a] group-hover:text-[#7c1d1d] group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      {/* Latest Announcements */}
      {data?.announcements && data.announcements.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
          <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
            <Bell size={18} className="text-[#c2761c]" /> Latest Notices
          </h3>
          <div className="space-y-3">
            {data.announcements.map((a: any) => (
              <div
                key={a.id}
                className={`flex items-start gap-3 p-4 rounded-xl transition-all ${
                  a.isPinned
                    ? "bg-[#0d6662]/5 border border-[#0d6662]/15"
                    : "bg-[#faf9f6] border border-transparent"
                }`}
              >
                {a.isPinned ? (
                  <Pin size={14} className="text-[#0d6662] mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={14} className="text-[#c2761c] mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-[#1a1a2e]">{a.title}</p>
                    {a.isPinned && (
                      <span className="text-[9px] bg-[#0d6662]/10 text-[#0d6662] px-1.5 py-0.5 rounded-full font-bold">
                        Pinned
                      </span>
                    )}
                  </div>
                  {a.summary && (
                    <p className="text-xs text-[#7c7c8a] line-clamp-2">{a.summary}</p>
                  )}
                  <p className="text-[10px] text-[#7c7c8a] mt-1.5 font-medium">
                    {new Date(a.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {a.linkUrl && (
                  <a href={a.linkUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 mt-0.5">
                    <ChevronRight size={14} className="text-[#0d6662]" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   REGISTER FOR EVENTS TAB
   ================================================================ */
function RegisterEventsTab({ user }: { user: any }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventError, setEventError] = useState("");
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events/public")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setEvents(d.events || []);
        setLoadingEvents(false);
      })
      .catch(() => {
        setEventError("Failed to load events");
        setLoadingEvents(false);
      });
  }, []);

  if (loadingEvents) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="text-[#0d6662] animate-spin" />
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={32} className="text-[#7c7c8a]/30 mx-auto mb-3" />
        <p className="text-sm text-[#7c7c8a]">{eventError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-[#1a1a2e]">Register for Events</h2>
        <p className="text-sm text-[#7c7c8a] mt-1">Browse published events and register directly from your dashboard.</p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-16 text-center">
          <Calendar size={48} className="text-[#7c7c8a]/30 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-[#1a1a2e] mb-2">No Events Available</h3>
          <p className="text-sm text-[#7c7c8a]">Check back soon for upcoming events.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              user={user}
              registeringId={registeringId}
              setRegisteringId={setRegisteringId}
              regSuccess={regSuccess}
              setRegSuccess={setRegSuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ event, user, registeringId, setRegisteringId, regSuccess, setRegSuccess }: {
  event: any;
  user: any;
  registeringId: string | null;
  setRegisteringId: (id: string | null) => void;
  regSuccess: string | null;
  setRegSuccess: (msg: string | null) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    phoneNumber: user.phone || "",
    organization: "",
    designation: "",
  });

  const EventIcon = eventTypeIcon(event.eventType);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    if (event.eventType === "Fellowship") {
      window.location.href = "/fellowship/apply";
      return;
    }
    if (event.eventType === "Autism") {
      window.location.href = "/autism/register";
      return;
    }

    try {
      const res = await fetch("/api/seminar/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: form.phoneNumber,
          organization: form.organization,
          designation: form.designation,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setRegSuccess(`Registration successful! Your ticket number is ${data.ticketNumber}.`);
      setShowForm(false);
      setRegisteringId(null);
    } catch (err: any) {
      setFormError(err.message || "Registration failed. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 overflow-hidden">
      {regSuccess && (
        <div className="bg-emerald-50 border-b border-emerald-200 p-4 flex items-center gap-3">
          <CheckCircle size={18} className="text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-700 font-medium">{regSuccess}</p>
          <button onClick={() => setRegSuccess(null)} className="ml-auto text-emerald-600 hover:text-emerald-800">
            <span className="text-xs font-bold">Dismiss</span>
          </button>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${eventTypeColor(event.eventType).split(" ").slice(0, 2).join(" ")}`}>
            <EventIcon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e]">{event.title}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${eventTypeColor(event.eventType)}`}>
                {event.eventType}
              </span>
              {event.isFeatured && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c2761c]/10 text-[#c2761c] border border-[#c2761c]/20">
                  Featured
                </span>
              )}
            </div>

            {event.description && (
              <p className="text-sm text-[#7c7c8a] line-clamp-2 mb-3">{event.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#7c7c8a]">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {new Date(event.eventDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {event.location}{event.city ? `, ${event.city}` : ""}
                </span>
              )}
              {event.ticketPrice !== null && event.ticketPrice !== undefined && (
                <span className="flex items-center gap-1.5 font-bold text-[#1a1a2e]">
                  ₹{event.ticketPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            {event.eventType === "Seminar" ? (
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setRegisteringId(showForm ? null : event.id);
                  setFormError("");
                }}
                className="btn-primary !py-2 !px-5 text-sm"
              >
                {showForm ? "Cancel" : "Register"}
              </button>
            ) : event.eventType === "Fellowship" ? (
              <Link href="/fellowship/apply" className="btn-primary !py-2 !px-5 text-sm inline-flex">
                Apply <ArrowRight size={14} />
              </Link>
            ) : (
              <Link href="/autism/register" className="btn-primary !py-2 !px-5 text-sm inline-flex">
                Register <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Inline Registration Form */}
        {showForm && event.eventType === "Seminar" && (
          <form onSubmit={handleRegister} className="mt-6 pt-6 border-t border-[#1a1a2e]/5">
            <h4 className="font-heading text-sm font-extrabold text-[#1a1a2e] mb-4">Seminar Registration</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#7c7c8a] uppercase tracking-wider block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={user.name || ""}
                  disabled
                  className="input-field w-full bg-[#faf9f6] text-[#7c7c8a] cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#7c7c8a] uppercase tracking-wider block mb-1.5">Email</label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="input-field w-full bg-[#faf9f6] text-[#7c7c8a] cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#7c7c8a] uppercase tracking-wider block mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  className="input-field w-full"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#7c7c8a] uppercase tracking-wider block mb-1.5">Organization</label>
                <input
                  type="text"
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  className="input-field w-full"
                  placeholder="Hospital / College / Company"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#7c7c8a] uppercase tracking-wider block mb-1.5">Designation</label>
                <input
                  type="text"
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  className="input-field w-full"
                  placeholder="Doctor / Student / Researcher"
                />
              </div>
            </div>

            {formError && (
              <div className="flex items-center gap-2 mt-3 text-sm text-[#7c1d1d]">
                <AlertCircle size={14} />
                {formError}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setRegisteringId(null);
                  setFormError("");
                }}
                className="btn-outline !py-2 !px-4 text-sm"
              >
                Cancel
              </button>
              <button type="submit" disabled={formLoading} className="btn-primary !py-2 !px-5 text-sm disabled:opacity-50">
                {formLoading ? (
                  <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Registering...</span>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   MY REGISTRATIONS TAB
   ================================================================ */
function MyRegistrationsTab({ data }: { data: any }) {
  const seminars = data?.seminars || [];
  const fellowships = data?.fellowships || [];
  const autism = data?.autism || [];
  const total = seminars.length + fellowships.length + autism.length;

  if (total === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-[#1a1a2e]">My Registrations</h2>
          <p className="text-sm text-[#7c7c8a] mt-1">View all your event registrations and applications.</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-16 text-center">
          <Ticket size={48} className="text-[#7c7c8a]/30 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-[#1a1a2e] mb-2">No Registrations Yet</h3>
          <p className="text-sm text-[#7c7c8a] mb-6">Browse events and register to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-[#1a1a2e]">My Registrations</h2>
        <p className="text-sm text-[#7c7c8a] mt-1">{total} registration{total !== 1 ? "s" : ""} found.</p>
      </div>

      {/* Seminar Registrations */}
      {seminars.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1a1a2e]/5 flex items-center gap-2">
            <GraduationCap size={18} className="text-[#0d6662]" />
            <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e]">Seminar Registrations</h3>
            <span className="ml-auto text-xs bg-[#0d6662]/5 text-[#0d6662] px-2 py-0.5 rounded-full font-bold">{seminars.length}</span>
          </div>
          <div className="divide-y divide-[#1a1a2e]/5">
            {seminars.map((s: any) => (
              <div key={s.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#0d6662]/10 rounded-xl flex items-center justify-center shrink-0">
                  <GraduationCap size={16} className="text-[#0d6662]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1a2e]">{s.ticketNumber}</p>
                  <p className="text-xs text-[#7c7c8a]">
                    Registered {new Date(s.registrationDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(s.isVerified ? "VERIFIED" : "PENDING")}`}>
                  {s.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fellowship Applications */}
      {fellowships.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1a1a2e]/5 flex items-center gap-2">
            <FlaskConical size={18} className="text-[#c2761c]" />
            <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e]">Fellowship Applications</h3>
            <span className="ml-auto text-xs bg-[#c2761c]/5 text-[#c2761c] px-2 py-0.5 rounded-full font-bold">{fellowships.length}</span>
          </div>
          <div className="divide-y divide-[#1a1a2e]/5">
            {fellowships.map((f: any) => (
              <div key={f.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#c2761c]/10 rounded-xl flex items-center justify-center shrink-0">
                  <FlaskConical size={16} className="text-[#c2761c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1a2e]">{f.trackingNumber}</p>
                  <p className="text-xs text-[#7c7c8a]">
                    {f.areaOfInterest || "Research"} · Applied {new Date(f.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(f.status)}`}>
                  {f.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Autism Registrations */}
      {autism.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1a1a2e]/5 flex items-center gap-2">
            <Heart size={18} className="text-[#7c1d1d]" />
            <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e]">Autism Programme</h3>
            <span className="ml-auto text-xs bg-[#7c1d1d]/5 text-[#7c1d1d] px-2 py-0.5 rounded-full font-bold">{autism.length}</span>
          </div>
          <div className="divide-y divide-[#1a1a2e]/5">
            {autism.map((a: any) => (
              <div key={a.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#7c1d1d]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Heart size={16} className="text-[#7c1d1d]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1a2e]">{a.childName}</p>
                  <p className="text-xs text-[#7c7c8a]">
                    {a.eTicketNumber} · {new Date(a.registrationDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(a.isFullyRegistered ? "VERIFIED" : "PENDING")}`}>
                  {a.isFullyRegistered ? "Registered" : "Pre-Registered"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   MY ORDERS TAB
   ================================================================ */
function MyOrdersTab({ data, orderCount }: { data: any; orderCount: number }) {
  if (orderCount === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-[#1a1a2e]">My Orders</h2>
          <p className="text-sm text-[#7c7c8a] mt-1">Track and manage your shop orders.</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-16 text-center">
          <Package size={48} className="text-[#7c7c8a]/30 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-[#1a1a2e] mb-2">No Orders Yet</h3>
          <p className="text-sm text-[#7c7c8a] mb-6">Start shopping to see your orders here.</p>
          <Link href="/shop" className="btn-primary">Visit Shop <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-[#1a1a2e]">My Orders</h2>
        <p className="text-sm text-[#7c7c8a] mt-1">{orderCount} order{orderCount !== 1 ? "s" : ""} found.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#faf9f6]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Order #</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Items</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a2e]/5">
              {data.orders.map((o: any) => (
                <tr key={o.id} className="hover:bg-[#faf9f6]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1a1a2e]">{o.orderNumber}</td>
                  <td className="px-6 py-4 text-[#7c7c8a]">
                    {new Date(o.orderDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-[#7c7c8a]">{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? "s" : ""}</td>
                  <td className="px-6 py-4 font-bold text-[#1a1a2e]">₹{o.totalAmount.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TRACK ORDERS TAB
   ================================================================ */
function TrackOrdersTab() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError("Please enter an order number");
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
    } catch {
      setError("Order not found. Please check the order number and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return STATUS_STEPS.findIndex((s) => s.key === order.status);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-[#1a1a2e]">Track Orders</h2>
        <p className="text-sm text-[#7c7c8a] mt-1">Enter your order number to see real-time status updates.</p>
      </div>

      <form onSubmit={handleTrack} className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7c8a]" />
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order number (e.g., VGMF-20260714-XXXX)"
              className="input-field w-full pl-10"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Package size={18} />}
            {loading ? " Tracking..." : " Track"}
          </button>
        </div>
        {error && (
          <p className="text-[#7c1d1d] text-sm mt-3 flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
      </form>

      {order && (
        <div className="space-y-4 animate-fade-up">
          <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <p className="text-xs text-[#7c7c8a] uppercase tracking-wider mb-1">Order Number</p>
                <p className="font-heading text-xl font-bold text-[#1a1a2e]">{order.orderNumber}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${statusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            {order.status !== "DELIVERED" && order.estimatedDelivery && (
              <div className="bg-gradient-to-r from-[#0d6662] to-[#0a5c58] text-white rounded-xl p-5 mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Calendar size={20} className="text-[#c2761c]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Estimated Delivery</p>
                    <p className="font-bold">
                      {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h4 className="font-heading text-sm font-extrabold text-[#1a1a2e] mb-4">Order Progress</h4>
              <div className="space-y-4">
                {STATUS_STEPS.map((step, index) => {
                  const currentStep = getCurrentStepIndex();
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? "bg-[#0d6662] text-white" : "bg-[#1a1a2e]/10 text-[#7c7c8a]"
                        } ${isCurrent ? "ring-4 ring-[#0d6662]/20" : ""}`}>
                          <step.icon size={14} />
                        </div>
                        {index < STATUS_STEPS.length - 1 && (
                          <div className={`w-0.5 h-8 ${isCompleted ? "bg-[#0d6662]" : "bg-[#1a1a2e]/10"}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className={`font-semibold text-sm ${isCompleted ? "text-[#1a1a2e]" : "text-[#7c7c8a]"}`}>
                          {step.label}
                        </p>
                        {isCurrent && order.events[0] && (
                          <div className="mt-2 bg-[#faf9f6] rounded-xl p-3 border border-[#1a1a2e]/5">
                            <p className="text-sm text-[#1a1a2e]/70">{order.events[0].description}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-[#7c7c8a]">
                              <MapPin size={12} />
                              <span>{order.events[0].location}</span>
                              <span>·</span>
                              <span>{new Date(order.events[0].timestamp).toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {order.items.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
              <h4 className="font-heading text-sm font-extrabold text-[#1a1a2e] mb-3">Order Items</h4>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-[#1a1a2e]/5 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a2e]">{item.name}</p>
                      <p className="text-xs text-[#7c7c8a]">Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <p className="text-sm font-bold text-[#1a1a2e]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && hasSearched && !order && !error && (
        <div className="text-center py-12">
          <Package size={40} className="mx-auto text-[#7c7c8a]/30 mb-3" />
          <p className="text-sm text-[#7c7c8a]">No order found with this number.</p>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   MY ADDRESS TAB
   ================================================================ */
function MyAddressTab({ user }: { user: any }) {
  const savedAddress = [user.address, user.city, user.state, user.pincode].filter(Boolean).join(", ");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-[#1a1a2e]">My Address</h2>
          <p className="text-sm text-[#7c7c8a] mt-1">Manage your saved addresses.</p>
        </div>
        <button className="btn-outline !py-2 !px-4 text-sm opacity-50 cursor-not-allowed" disabled>
          + Add Address
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#0d6662]/10 rounded-xl flex items-center justify-center shrink-0">
            <MapPin size={20} className="text-[#0d6662]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-bold text-[#1a1a2e]">Primary Address</p>
              <span className="text-[10px] bg-[#0d6662]/10 text-[#0d6662] px-2 py-0.5 rounded-full font-bold">Default</span>
            </div>
            {savedAddress ? (
              <p className="text-sm text-[#7c7c8a] leading-relaxed">{savedAddress}</p>
            ) : (
              <p className="text-sm text-[#7c7c8a] italic">No address saved yet. Update your profile to add one.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-10 text-center opacity-60">
        <MapPin size={32} className="text-[#7c7c8a]/30 mx-auto mb-3" />
        <p className="text-sm text-[#7c7c8a] font-medium">Additional address slots coming soon.</p>
      </div>
    </div>
  );
}

/* ================================================================
   PAYMENTS TAB
   ================================================================ */
function PaymentsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-[#1a1a2e]">Payments</h2>
        <p className="text-sm text-[#7c7c8a] mt-1">View your payment history and invoices.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-16 text-center">
        <CreditCard size={48} className="text-[#7c7c8a]/30 mx-auto mb-4" />
        <h3 className="font-heading text-xl font-bold text-[#1a1a2e] mb-2">Payment History</h3>
        <p className="text-sm text-[#7c7c8a] mb-6">Your payment history will appear here after your first transaction.</p>
        <div className="inline-flex items-center gap-2 text-xs text-[#7c7c8a] bg-[#faf9f6] px-4 py-2 rounded-full">
          <Clock size={14} />
          Coming soon — payment history integration in progress
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   HELP & SUPPORT TAB
   ================================================================ */
function HelpSupportTab() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (!res.ok) throw new Error("Failed to send");
      setContactSuccess(true);
      setContactForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setContactError("Failed to send message. Please try again.");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-[#1a1a2e]">Help & Support</h2>
        <p className="text-sm text-[#7c7c8a] mt-1">Find answers to common questions or reach out to our team.</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/about" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#1a1a2e]/5 card-hover">
          <div className="w-10 h-10 bg-[#0d6662]/10 rounded-xl flex items-center justify-center">
            <Globe size={18} className="text-[#0d6662]" />
          </div>
          <span className="text-sm font-bold text-[#1a1a2e]">About VGMF</span>
        </Link>
        <Link href="/articles" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#1a1a2e]/5 card-hover">
          <div className="w-10 h-10 bg-[#c2761c]/10 rounded-xl flex items-center justify-center">
            <BookOpen size={18} className="text-[#c2761c]" />
          </div>
          <span className="text-sm font-bold text-[#1a1a2e]">Articles</span>
        </Link>
        <Link href="/shop" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#1a1a2e]/5 card-hover">
          <div className="w-10 h-10 bg-[#7c1d1d]/10 rounded-xl flex items-center justify-center">
            <ShoppingBag size={18} className="text-[#7c1d1d]" />
          </div>
          <span className="text-sm font-bold text-[#1a1a2e]">Shop</span>
        </Link>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <HelpCircle size={18} className="text-[#0d6662]" /> Frequently Asked Questions
        </h3>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <FaqItem key={i} faq={faq} />
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <Phone size={18} className="text-[#c2761c]" /> Contact Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-[#faf9f6] rounded-xl">
            <div className="w-10 h-10 bg-[#0d6662]/10 rounded-xl flex items-center justify-center shrink-0">
              <Phone size={16} className="text-[#0d6662]" />
            </div>
            <div>
              <p className="text-xs text-[#7c7c8a] uppercase tracking-wider font-bold">Phone</p>
              <p className="text-sm font-bold text-[#1a1a2e]">+91 91727 68412</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-[#faf9f6] rounded-xl">
            <div className="w-10 h-10 bg-[#c2761c]/10 rounded-xl flex items-center justify-center shrink-0">
              <Mail size={16} className="text-[#c2761c]" />
            </div>
            <div>
              <p className="text-xs text-[#7c7c8a] uppercase tracking-wider font-bold">Email</p>
              <p className="text-sm font-bold text-[#1a1a2e]">info@vgmf.org</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <MessageSquare size={18} className="text-[#7c1d1d]" /> Send Us a Message
        </h3>

        {contactSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
            <CheckCircle size={32} className="text-emerald-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-emerald-700">Message sent successfully!</p>
            <p className="text-xs text-emerald-600 mt-1">We will get back to you within 24-48 hours.</p>
            <button
              onClick={() => setContactSuccess(false)}
              className="mt-4 text-sm font-bold text-emerald-700 underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleContact}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#7c7c8a] uppercase tracking-wider block mb-1.5">Name *</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="input-field w-full"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#7c7c8a] uppercase tracking-wider block mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="input-field w-full"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#7c7c8a] uppercase tracking-wider block mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="input-field w-full"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#7c7c8a] uppercase tracking-wider block mb-1.5">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="input-field w-full"
                  placeholder="How can we help?"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-bold text-[#7c7c8a] uppercase tracking-wider block mb-1.5">Message *</label>
              <textarea
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="input-field w-full min-h-[120px] resize-y"
                placeholder="Describe your question or issue..."
              />
            </div>

            {contactError && (
              <p className="text-[#7c1d1d] text-sm mt-3 flex items-center gap-2">
                <AlertCircle size={14} />
                {contactError}
              </p>
            )}

            <div className="flex justify-end mt-5">
              <button type="submit" disabled={contactLoading} className="btn-primary disabled:opacity-50">
                {contactLoading ? (
                  <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Sending...</span>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   STAT CARD COMPONENT
   ================================================================ */
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-5 card-hover">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white shadow-md`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="font-heading text-2xl font-extrabold text-[#1a1a2e]">{value}</p>
          <p className="text-xs text-[#7c7c8a] font-medium uppercase tracking-wider">{label}</p>
        </div>
      </div>
    </div>
  );
}
