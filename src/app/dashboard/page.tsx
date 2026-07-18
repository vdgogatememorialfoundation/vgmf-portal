"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  LayoutDashboard, User, Calendar, ClipboardList, Award, Trophy,
  ShoppingBag, Truck, MapPin, CreditCard, FileBadge, Ticket,
  Headphones, MessageCircle, ShieldCheck, RotateCcw, Wallet,
  Loader2, AlertCircle, CheckCircle, ChevronRight, ChevronDown,
  ChevronUp, Search, Bell, ArrowRight, ExternalLink, Globe,
  GraduationCap, FlaskConical, Heart, Package, BookOpen, Phone,
  Mail, MessageSquare, Clock, Pin, Download, Upload, Trash2,
  Edit3, Plus, X, Eye, EyeOff, QrCode, Hash, FileText,
  Send, CircleDot, Stethoscope, Users, Building2, Info,
} from "lucide-react";

type Tab =
  | "overview"
  | "my-profile"
  | "events"
  | "event-register"
  | "my-registrations"
  | "my-fellowships"
  | "my-competitions"
  | "my-orders"
  | "track-orders"
  | "my-address"
  | "payments"
  | "my-certificates"
  | "my-e-tickets"
  | "support"
  | "live-chat"
  | "identity-verification"
  | "returns-refunds"
  | "payment-methods";

interface NavItem {
  id: Tab;
  label: string;
  icon: any;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Main",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "my-profile", label: "My Profile", icon: User },
    ],
  },
  {
    title: "Events & Programmes",
    items: [
      { id: "events", label: "Events & Programmes", icon: Calendar },
      { id: "my-registrations", label: "My Registrations", icon: ClipboardList },
      { id: "my-fellowships", label: "My Fellowships", icon: Award },
      { id: "my-competitions", label: "My Competitions", icon: Trophy },
    ],
  },
  {
    title: "Shop & Orders",
    items: [
      { id: "my-orders", label: "My Orders", icon: ShoppingBag },
      { id: "track-orders", label: "Track Orders", icon: Truck },
      { id: "my-address", label: "My Address", icon: MapPin },
    ],
  },
  {
    title: "Payments & Certificates",
    items: [
      { id: "payments", label: "Payments", icon: CreditCard },
      { id: "my-certificates", label: "My Certificates", icon: FileBadge },
      { id: "my-e-tickets", label: "My E-Tickets", icon: Ticket },
    ],
  },
  {
    title: "Support",
    items: [
      { id: "support", label: "Support", icon: Headphones },
      { id: "live-chat", label: "Live Chat", icon: MessageCircle },
    ],
  },
  {
    title: "Account",
    items: [
      { id: "identity-verification", label: "Identity Verification", icon: ShieldCheck },
      { id: "returns-refunds", label: "Returns & Refunds", icon: RotateCcw },
      { id: "payment-methods", label: "Payment Methods", icon: Wallet },
    ],
  },
];

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
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REFUNDED: "bg-orange-50 text-orange-700 border-orange-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    OPEN: "bg-blue-50 text-blue-700 border-blue-200",
    IN_PROGRESS: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return map[s] || "bg-gray-50 text-gray-600 border-gray-200";
};

const eventTypeColor = (t: string) => {
  const map: Record<string, string> = {
    Seminar: "bg-[#0d6662]/10 text-[#0d6662] border-[#0d6662]/20",
    Fellowship: "bg-[#c2761c]/10 text-[#c2761c] border-[#c2761c]/20",
    Autism: "bg-[#7c1d1d]/10 text-[#7c1d1d] border-[#7c1d1d]/20",
    Competition: "bg-[#c2761c]/10 text-[#c2761c] border-[#c2761c]/20",
    Workshop: "bg-[#0d6662]/10 text-[#0d6662] border-[#0d6662]/20",
  };
  return map[t] || "bg-[#1a1a2e]/10 text-[#1a1a2e] border-[#1a1a2e]/20";
};

const eventTypeIcon = (t: string) => {
  const map: Record<string, any> = {
    Seminar: GraduationCap,
    Fellowship: FlaskConical,
    Autism: Heart,
    Competition: Trophy,
    Workshop: BookOpen,
  };
  return map[t] || Calendar;
};

const STATUS_STEPS = [
  { key: "PENDING", label: "Order Placed", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
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

function DashboardPageInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabParam = searchParams.get("tab") as Tab | null;
  const eventId = searchParams.get("id");
  const activeTab: Tab = tabParam || "overview";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session) {
      Promise.allSettled([
        fetch("/api/dashboard").then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        }),
        fetch("/api/dashboard/events").then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        }),
      ])
        .then(([dashboardRes, eventsRes]) => {
          if (dashboardRes.status === "fulfilled") setData(dashboardRes.value);
          if (eventsRes.status === "fulfilled") setEvents(eventsRes.value?.events || eventsRes.value || []);
          setLoading(false);
          setLoadingEvents(false);
        })
        .catch(() => {
          setLoading(false);
          setLoadingEvents(false);
        });
    }
  }, [session, status, router]);

  const navigateTab = useCallback(
    (tab: Tab, id?: string) => {
      const params = new URLSearchParams();
      params.set("tab", tab);
      if (id) params.set("id", id);
      router.push(`/dashboard?${params.toString()}`);
      setSidebarOpen(false);
    },
    [router]
  );

  if (status === "loading" || (!session && status !== "unauthenticated")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <Loader2 size={32} className="text-teal animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted font-medium">Loading dashboard...</p>
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

      <div className="flex min-h-screen">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed top-0 left-0 h-screen w-[280px] bg-white border-r border-ink/5 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-5 border-b border-ink/5">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal to-teal-light rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-heading font-extrabold">V</span>
                </div>
                <span className="font-heading text-sm font-extrabold text-ink">VGMF Dashboard</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-cream transition-colors"
              >
                <X size={16} className="text-muted" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-teal to-teal-light rounded-xl flex items-center justify-center text-white text-base font-heading font-extrabold shadow-md shadow-teal/20 shrink-0">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-sm font-extrabold text-ink truncate">{user.name || "User"}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-2.5">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${categoryColors[category] || "bg-ink/10 text-ink border-ink/20"}`}>
                {categoryLabels[category] || category}
              </span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-3 px-3">
            {navGroups.map((group) => (
              <div key={group.title} className="mb-4">
                <p className="px-3 mb-1.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateTab(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-teal text-white shadow-md shadow-teal/20"
                            : "text-muted hover:bg-teal/5 hover:text-ink"
                        }`}
                      >
                        <item.icon size={16} className="shrink-0" />
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive ? "bg-white/20 text-white" : "bg-teal/10 text-teal"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-ink/5 space-y-0.5">
            <Link
              href="/shop"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-muted hover:bg-cream transition-colors"
            >
              <ShoppingBag size={16} />
              <span>Visit Shop</span>
              <ExternalLink size={11} className="ml-auto" />
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-muted hover:bg-cream transition-colors"
            >
              <Globe size={16} />
              <span>Back to Website</span>
              <ExternalLink size={11} className="ml-auto" />
            </Link>
          </div>
        </aside>

        <main className="flex-1 lg:ml-[280px] min-h-screen">
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-ink/5 px-4 py-3 lg:hidden flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-cream transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-ink">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <span className="font-heading text-sm font-extrabold text-ink">Dashboard</span>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-8">
            {activeTab === "overview" && (
              <OverviewTab user={user} category={category} data={data} orderCount={orderCount} totalRegistrations={totalRegistrations} navigateTab={navigateTab} />
            )}
            {activeTab === "my-profile" && (
              <MyProfileTab user={user} category={category} />
            )}
            {activeTab === "events" && (
              <EventsTab events={events} loadingEvents={loadingEvents} navigateTab={navigateTab} />
            )}
            {activeTab === "event-register" && eventId && (
              <EventRegisterTab eventId={eventId} user={user} events={events} navigateTab={navigateTab} />
            )}
            {activeTab === "my-registrations" && (
              <MyRegistrationsTab data={data} />
            )}
            {activeTab === "my-fellowships" && (
              <MyFellowshipsTab data={data} />
            )}
            {activeTab === "my-competitions" && (
              <MyCompetitionsTab data={data} />
            )}
            {activeTab === "my-orders" && (
              <MyOrdersTab data={data} orderCount={orderCount} />
            )}
            {activeTab === "track-orders" && (
              <TrackOrdersTab />
            )}
            {activeTab === "my-address" && (
              <MyAddressTab user={user} />
            )}
            {activeTab === "payments" && (
              <PaymentsTab data={data} />
            )}
            {activeTab === "my-certificates" && (
              <MyCertificatesTab data={data} />
            )}
            {activeTab === "my-e-tickets" && (
              <MyETicketsTab data={data} />
            )}
            {activeTab === "support" && (
              <SupportTab user={user} />
            )}
            {activeTab === "live-chat" && (
              <LiveChatTab />
            )}
            {activeTab === "identity-verification" && (
              <IdentityVerificationTab user={user} />
            )}
            {activeTab === "returns-refunds" && (
              <ReturnsRefundsTab data={data} />
            )}
            {activeTab === "payment-methods" && (
              <PaymentMethodsTab user={user} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cream">
          <div className="text-center">
            <Loader2 size={32} className="text-teal animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted font-medium">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardPageInner />
    </Suspense>
  );
}

/* ================================================================
   SHARED COMPONENTS
   ================================================================ */

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-heading text-2xl font-extrabold text-ink">{title}</h2>
      {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-ink/5 ${className}`}>{children}</div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-ink/5 p-5 card-hover">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white shadow-md`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="font-heading text-2xl font-extrabold text-ink">{value}</p>
          <p className="text-xs text-muted font-medium uppercase tracking-wider">{label}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action }: { icon: any; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-ink/5 p-16 text-center">
      <Icon size={48} className="text-muted/30 mx-auto mb-4" />
      <h3 className="font-heading text-xl font-bold text-ink mb-2">{title}</h3>
      <p className="text-sm text-muted mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}

function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={size} className="text-teal animate-spin" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-center py-20">
      <AlertCircle size={32} className="text-muted/30 mx-auto mb-3" />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-ink/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-cream transition-colors"
      >
        <span className="text-sm font-bold text-ink pr-4">{faq.q}</span>
        {open ? (
          <ChevronUp size={16} className="text-teal shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-muted shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   OVERVIEW TAB
   ================================================================ */
function OverviewTab({ user, category, data, orderCount, totalRegistrations, navigateTab }: {
  user: any;
  category: string;
  data: any;
  orderCount: number;
  totalRegistrations: number;
  navigateTab: (tab: Tab, id?: string) => void;
}) {
  const pendingItems =
    (data?.orders?.filter((o: any) => o.status === "PENDING" || o.status === "PROCESSING").length || 0) +
    (data?.seminars?.filter((s: any) => !s.isVerified).length || 0);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-ink/5 p-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-teal to-teal-light rounded-2xl flex items-center justify-center text-white text-xl font-heading font-extrabold shadow-lg shadow-teal/20">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-heading text-2xl font-extrabold text-ink">
                Welcome, {user.name || "User"}
              </h1>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${categoryColors[category] || "bg-ink/10 text-ink border-ink/20"}`}>
                {categoryLabels[category] || category}
              </span>
            </div>
            <p className="text-sm text-muted mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Ticket} label="Registrations" value={totalRegistrations} color="from-teal to-teal-light" />
        <StatCard icon={ShoppingBag} label="Orders" value={orderCount} color="from-gold to-gold-light" />
        <StatCard icon={Clock} label="Pending Items" value={pendingItems} color="from-maroon to-[#5e1616]" />
      </div>

      <div>
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Browse Events", icon: Calendar, color: "teal", tab: "events" as Tab },
            { label: "Track Orders", icon: Truck, color: "gold", tab: "track-orders" as Tab },
            { label: "Visit Shop", icon: ShoppingBag, color: "maroon", href: "/shop" },
          ].map((action) =>
            action.href ? (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-ink/5 card-hover group"
              >
                <div className={`w-10 h-10 bg-${action.color}/10 rounded-xl flex items-center justify-center`}>
                  <action.icon size={18} className={`text-${action.color}`} />
                </div>
                <span className="text-sm font-bold text-ink flex-1">{action.label}</span>
                <ArrowRight size={16} className="text-muted group-hover:text-teal group-hover:translate-x-1 transition-all" />
              </Link>
            ) : (
              <button
                key={action.label}
                onClick={() => navigateTab(action.tab!)}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-ink/5 card-hover group text-left"
              >
                <div className={`w-10 h-10 bg-${action.color}/10 rounded-xl flex items-center justify-center`}>
                  <action.icon size={18} className={`text-${action.color}`} />
                </div>
                <span className="text-sm font-bold text-ink flex-1">{action.label}</span>
                <ArrowRight size={16} className="text-muted group-hover:text-teal group-hover:translate-x-1 transition-all" />
              </button>
            )
          )}
        </div>
      </div>

      {data?.announcements && data.announcements.length > 0 && (
        <Card className="p-6">
          <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
            <Bell size={18} className="text-gold" /> Latest Notices
          </h3>
          <div className="space-y-3">
            {data.announcements.map((a: any) => (
              <div
                key={a.id}
                className={`flex items-start gap-3 p-4 rounded-xl transition-all ${
                  a.isPinned ? "bg-teal/5 border border-teal/15" : "bg-cream border border-transparent"
                }`}
              >
                {a.isPinned ? (
                  <Pin size={14} className="text-teal mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={14} className="text-gold mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-ink">{a.title}</p>
                    {a.isPinned && (
                      <span className="text-[9px] bg-teal/10 text-teal px-1.5 py-0.5 rounded-full font-bold">Pinned</span>
                    )}
                  </div>
                  {a.summary && <p className="text-xs text-muted line-clamp-2">{a.summary}</p>}
                  <p className="text-[10px] text-muted mt-1.5 font-medium">
                    {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                {a.linkUrl && (
                  <a href={a.linkUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 mt-0.5">
                    <ChevronRight size={14} className="text-teal" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ================================================================
   MY PROFILE TAB
   ================================================================ */
function MyProfileTab({ user, category }: { user: any; category: string }) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : "",
    gender: user.gender || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    pincode: user.pincode || "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="My Profile" subtitle="View and manage your personal information." />
        <button
          onClick={() => setEditMode(!editMode)}
          className={editMode ? "btn-outline !py-2 !px-4 text-sm" : "btn-primary !py-2 !px-4 text-sm"}
        >
          {editMode ? (
            <><X size={14} /> Cancel</>
          ) : (
            <><Edit3 size={14} /> Edit Profile</>
          )}
        </button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-ink/5">
          <div className="w-16 h-16 bg-gradient-to-br from-teal to-teal-light rounded-2xl flex items-center justify-center text-white text-2xl font-heading font-extrabold shadow-lg shadow-teal/20">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-heading text-lg font-extrabold text-ink">{user.name || "User"}</p>
            <p className="text-sm text-muted">{user.email}</p>
            <span className={`mt-1 inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border ${categoryColors[category] || "bg-ink/10 text-ink border-ink/20"}`}>
              {categoryLabels[category] || category}
            </span>
          </div>
        </div>

        {editMode ? (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="input-field w-full bg-cream text-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field w-full"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Pincode</label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="input-field w-full"
                  placeholder="6-digit pincode"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="input-field w-full min-h-[80px] resize-y"
                placeholder="Street address"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="input-field w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditMode(false)} className="btn-outline !py-2 !px-4 text-sm">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary !py-2 !px-5 text-sm disabled:opacity-50">
                {saving ? (
                  <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Saving...</span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "Full Name", value: user.name },
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone || "—" },
              { label: "Date of Birth", value: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
              { label: "Gender", value: user.gender || "—" },
              { label: "Address", value: [user.address, user.city, user.state, user.pincode].filter(Boolean).join(", ") || "—" },
            ].map((field) => (
              <div key={field.label}>
                <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">{field.label}</p>
                <p className="text-sm font-semibold text-ink">{field.value}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ================================================================
   EVENTS & PROGRAMMES TAB
   ================================================================ */
function EventsTab({ events, loadingEvents, navigateTab }: {
  events: any[];
  loadingEvents: boolean;
  navigateTab: (tab: Tab, id?: string) => void;
}) {
  const [filter, setFilter] = useState("All");
  const types = ["All", "Seminar", "Fellowship", "Autism", "Competition", "Workshop"];

  if (loadingEvents) return <LoadingSpinner />;

  const filtered = filter === "All" ? events : events.filter((e) => e.eventType === filter);

  return (
    <div className="space-y-6">
      <SectionHeader title="Events & Programmes" subtitle="Browse published events and register directly from your dashboard." />

      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === type
                ? "bg-teal text-white shadow-md shadow-teal/20"
                : "bg-white border border-ink/10 text-muted hover:border-teal hover:text-teal"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events available yet"
          description="Events will appear here once the administrator creates and publishes them."
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map((event) => {
            const EventIcon = eventTypeIcon(event.eventType);
            return (
              <div key={event.id} className="bg-white rounded-2xl border border-ink/5 p-6 card-hover">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${eventTypeColor(event.eventType).split(" ").slice(0, 2).join(" ")}`}>
                    <EventIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-heading text-lg font-extrabold text-ink">{event.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${eventTypeColor(event.eventType)}`}>
                        {event.eventType}
                      </span>
                      {event.isFeatured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                          Featured
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted line-clamp-2 mb-3">{event.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          {event.location}{event.city ? `, ${event.city}` : ""}
                        </span>
                      )}
                      {event.ticketPrice !== null && event.ticketPrice !== undefined && (
                        <span className="flex items-center gap-1.5 font-bold text-ink">
                          ₹{event.ticketPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={() => navigateTab("event-register", event.id)}
                      className="btn-primary !py-2 !px-5 text-sm"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   EVENT REGISTER TAB (Dynamic Form)
   ================================================================ */
function EventRegisterTab({ eventId, user, events, navigateTab }: {
  eventId: string;
  user: any;
  events: any[];
  navigateTab: (tab: Tab, id?: string) => void;
}) {
  const event = events.find((e: any) => e.id === eventId);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formFields, setFormFields] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetch(`/api/dashboard/events/${eventId}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        const fields = d.formFields || d.event?.formFields || [];
        setFormFields(fields);
        const initial: Record<string, string> = {
          fullName: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        };
        fields.forEach((f: any) => {
          if (!initial[f.name]) initial[f.name] = "";
        });
        setForm(initial);
        setLoading(false);
      })
      .catch(() => {
        setFormFields([
          { name: "fullName", label: "Full Name", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Phone Number", type: "tel", required: true },
          { name: "organization", label: "Organization", type: "text", required: false },
          { name: "designation", label: "Designation", type: "text", required: false },
        ]);
        setForm({ fullName: user.name || "", email: user.email || "", phone: user.phone || "", organization: "", designation: "" });
        setLoading(false);
      });
  }, [eventId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/dashboard/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success(data.message || "Registration successful!");
      navigateTab("my-registrations");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      toast.error(err.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateTab("events")}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-cream transition-colors"
        >
          <ChevronRight size={18} className="text-muted rotate-180" />
        </button>
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-ink">
            Register: {event?.title || "Event"}
          </h2>
          <p className="text-sm text-muted mt-0.5">Fill in the form below to complete your registration.</p>
        </div>
      </div>

      {event && (
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${eventTypeColor(event.eventType).split(" ").slice(0, 2).join(" ")}`}>
              {(() => { const I = eventTypeIcon(event.eventType); return <I size={18} />; })()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading text-sm font-extrabold text-ink">{event.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${eventTypeColor(event.eventType)}`}>{event.eventType}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted mt-1">
                <span className="flex items-center gap-1"><Calendar size={12} />{new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                {event.location && <span className="flex items-center gap-1"><MapPin size={12} />{event.location}</span>}
                {event.ticketPrice != null && <span className="font-bold text-ink">₹{event.ticketPrice.toLocaleString("en-IN")}</span>}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formFields.map((field: any) => (
              <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">
                  {field.label} {field.required && <span className="text-maroon">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    required={field.required}
                    value={form[field.name] || ""}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="">Select...</option>
                    {(field.options || []).map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    required={field.required}
                    value={form[field.name] || ""}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    className="input-field w-full min-h-[100px] resize-y"
                    placeholder={field.placeholder || ""}
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    required={field.required}
                    value={form[field.name] || ""}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    className="input-field w-full"
                    placeholder={field.placeholder || ""}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-maroon bg-maroon/5 p-3 rounded-xl">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigateTab("events")} className="btn-outline !py-2 !px-4 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
              {submitting ? (
                <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Submitting...</span>
              ) : (
                "Submit Registration"
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

/* ================================================================
   MY REGISTRATIONS TAB
   ================================================================ */
function MyRegistrationsTab({ data }: { data: any }) {
  const seminars = data?.seminars || [];
  const autism = data?.autism || [];
  const total = seminars.length + autism.length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Registrations"
        subtitle={total > 0 ? `${total} registration${total !== 1 ? "s" : ""} found.` : "View all your event registrations."}
      />

      {total === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No registrations yet"
          description="You haven't registered for any events yet. Browse events to find something interesting."
          action={
            <p className="text-xs text-muted">Registrations will appear here after you sign up for an event.</p>
          }
        />
      ) : (
        <>
          {seminars.length > 0 && (
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-ink/5 flex items-center gap-2">
                <GraduationCap size={18} className="text-teal" />
                <h3 className="font-heading text-lg font-extrabold text-ink">Seminar Registrations</h3>
                <span className="ml-auto text-xs bg-teal/5 text-teal px-2 py-0.5 rounded-full font-bold">{seminars.length}</span>
              </div>
              <div className="divide-y divide-ink/5">
                {seminars.map((s: any) => (
                  <div key={s.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
                      <GraduationCap size={16} className="text-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-ink">{s.ticketNumber}</p>
                      <p className="text-xs text-muted">
                        Registered {new Date(s.registrationDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(s.isVerified ? "VERIFIED" : "PENDING")}`}>
                      {s.isVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {autism.length > 0 && (
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-ink/5 flex items-center gap-2">
                <Heart size={18} className="text-maroon" />
                <h3 className="font-heading text-lg font-extrabold text-ink">Autism Programme</h3>
                <span className="ml-auto text-xs bg-maroon/5 text-maroon px-2 py-0.5 rounded-full font-bold">{autism.length}</span>
              </div>
              <div className="divide-y divide-ink/5">
                {autism.map((a: any) => (
                  <div key={a.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-maroon/10 rounded-xl flex items-center justify-center shrink-0">
                      <Heart size={16} className="text-maroon" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-ink">{a.childName}</p>
                      <p className="text-xs text-muted">
                        {a.eTicketNumber} · {new Date(a.registrationDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(a.isFullyRegistered ? "VERIFIED" : "PENDING")}`}>
                      {a.isFullyRegistered ? "Registered" : "Pre-Registered"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

/* ================================================================
   MY FELLOWSHIPS TAB
   ================================================================ */
function MyFellowshipsTab({ data }: { data: any }) {
  const fellowships = data?.fellowships || [];

  const timelineSteps = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "SELECTED", "FUNDED"];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Fellowships"
        subtitle={fellowships.length > 0 ? `${fellowships.length} application${fellowships.length !== 1 ? "s" : ""} found.` : "Track your fellowship applications."}
      />

      {fellowships.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No fellowship applications yet"
          description="Apply for research fellowships through the Events & Programmes section."
        />
      ) : (
        <div className="space-y-4">
          {fellowships.map((f: any) => {
            const currentIdx = timelineSteps.indexOf(f.status);
            return (
              <Card key={f.id} className="p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                    <Award size={20} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-heading text-lg font-extrabold text-ink">{f.trackingNumber}</p>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(f.status)}`}>
                        {f.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-sm text-muted">
                      {f.areaOfInterest || "Research"} · Applied {new Date(f.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {timelineSteps.map((step, idx) => {
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div key={step} className="flex items-center gap-1 min-w-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isCompleted ? "bg-teal text-white" : "bg-ink/10 text-muted"
                          } ${isCurrent ? "ring-4 ring-teal/20" : ""}`}>
                            {isCompleted ? <CheckCircle size={12} /> : idx + 1}
                          </div>
                          <p className={`text-[9px] font-bold mt-1 whitespace-nowrap ${isCompleted ? "text-teal" : "text-muted"}`}>
                            {step.replace(/_/g, " ")}
                          </p>
                        </div>
                        {idx < timelineSteps.length - 1 && (
                          <div className={`w-6 h-0.5 mb-4 ${idx < currentIdx ? "bg-teal" : "bg-ink/10"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   MY COMPETITIONS TAB
   ================================================================ */
function MyCompetitionsTab({ data }: { data: any }) {
  const competitions = data?.competitions || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Competitions"
        subtitle={competitions.length > 0 ? `${competitions.length} submission${competitions.length !== 1 ? "s" : ""} found.` : "View your competition submissions."}
      />

      {competitions.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No competition entries yet"
          description="Participate in competitions through the Events & Programmes section."
        />
      ) : (
        <div className="space-y-4">
          {competitions.map((c: any) => (
            <Card key={c.id} className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                <Trophy size={20} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink">{c.title || c.trackingNumber || "Competition Entry"}</p>
                <p className="text-xs text-muted">
                  Submitted {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(c.status || "SUBMITTED")}`}>
                {(c.status || "SUBMITTED").replace(/_/g, " ")}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   MY ORDERS TAB
   ================================================================ */
function MyOrdersTab({ data, orderCount }: { data: any; orderCount: number }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Orders"
        subtitle={orderCount > 0 ? `${orderCount} order${orderCount !== 1 ? "s" : ""} found.` : "Track and manage your shop orders."}
      />

      {orderCount === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="No orders yet. Visit the Shop to browse products."
          action={<Link href="/shop" className="btn-primary">Visit Shop <ArrowRight size={16} /></Link>}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Order #</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Items</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {data.orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-ink">{o.orderNumber}</td>
                    <td className="px-6 py-4 text-muted">
                      {new Date(o.orderDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-muted">{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? "s" : ""}</td>
                    <td className="px-6 py-4 font-bold text-ink">₹{o.totalAmount.toLocaleString("en-IN")}</td>
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
        </Card>
      )}
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
      <SectionHeader title="Track Orders" subtitle="Enter your order number to see real-time status updates." />

      <Card className="p-6">
        <form onSubmit={handleTrack} className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => { setOrderNumber(e.target.value); setError(""); }}
              placeholder="Enter order number (e.g., VGMF-20260714-XXXX)"
              className="input-field w-full pl-10"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Truck size={18} />}
            {loading ? " Tracking..." : " Track"}
          </button>
        </form>
        {error && (
          <p className="text-maroon text-sm mt-3 flex items-center gap-2">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </Card>

      {order && (
        <div className="space-y-4 animate-fade-up">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Order Number</p>
                <p className="font-heading text-xl font-bold text-ink">{order.orderNumber}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-lg text-sm font-semibold border ${statusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            {order.status !== "DELIVERED" && order.estimatedDelivery && (
              <div className="bg-gradient-to-r from-teal to-[#0a5c58] text-white rounded-xl p-5 mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Calendar size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Estimated Delivery</p>
                    <p className="font-bold">
                      {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h4 className="font-heading text-sm font-extrabold text-ink mb-4">Order Progress</h4>
              <div className="space-y-4">
                {STATUS_STEPS.map((step, index) => {
                  const currentStep = getCurrentStepIndex();
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? "bg-teal text-white" : "bg-ink/10 text-muted"
                        } ${isCurrent ? "ring-4 ring-teal/20" : ""}`}>
                          <step.icon size={14} />
                        </div>
                        {index < STATUS_STEPS.length - 1 && (
                          <div className={`w-0.5 h-8 ${isCompleted ? "bg-teal" : "bg-ink/10"}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className={`font-semibold text-sm ${isCompleted ? "text-ink" : "text-muted"}`}>{step.label}</p>
                        {isCurrent && order.events[0] && (
                          <div className="mt-2 bg-cream rounded-xl p-3 border border-ink/5">
                            <p className="text-sm text-ink/70">{order.events[0].description}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted">
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
          </Card>

          {order.items.length > 0 && (
            <Card className="p-6">
              <h4 className="font-heading text-sm font-extrabold text-ink mb-3">Order Items</h4>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-ink/5 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.name}</p>
                      <p className="text-xs text-muted">Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <p className="text-sm font-bold text-ink">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {!loading && hasSearched && !order && !error && (
        <div className="text-center py-12">
          <Package size={40} className="mx-auto text-muted/30 mb-3" />
          <p className="text-sm text-muted">No order found with this number.</p>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   MY ADDRESS TAB
   ================================================================ */
function MyAddressTab({ user }: { user: any }) {
  const [addresses, setAddresses] = useState<any[]>(user.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    label: "Home",
    fullName: user.name || "",
    phone: user.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: true,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/dashboard/addresses/${editingId}` : "/api/dashboard/addresses";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save address");
      const saved = await res.json();
      if (editingId) {
        setAddresses((prev) => prev.map((a) => (a.id === editingId ? saved : a)));
      } else {
        setAddresses((prev) => [...prev, saved]);
      }
      toast.success(editingId ? "Address updated!" : "Address added!");
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch {
      toast.error("Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/dashboard/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address deleted.");
    } catch {
      toast.error("Failed to delete address.");
    }
  };

  const handleEdit = (addr: any) => {
    setForm({
      label: addr.label || "Home",
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      address: addr.address || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      isDefault: addr.isDefault || false,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ label: "Home", fullName: user.name || "", phone: user.phone || "", address: "", city: "", state: "", pincode: "", isDefault: false });
  };

  const savedAddress = [user.address, user.city, user.state, user.pincode].filter(Boolean).join(", ");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="My Address" subtitle="Manage your saved addresses." />
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm(); }}
          className={showForm ? "btn-outline !py-2 !px-4 text-sm" : "btn-primary !py-2 !px-4 text-sm"}
        >
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Address</>}
        </button>
      </div>

      {showForm && (
        <Card className="p-6 animate-fade-up">
          <h3 className="font-heading text-lg font-extrabold text-ink mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Label</label>
                <select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="input-field w-full">
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Full Name</label>
                <input type="text" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-field w-full" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Phone</label>
                <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field w-full" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Pincode</label>
                <input type="text" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="input-field w-full" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Address</label>
              <textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field w-full min-h-[80px] resize-y" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">City</label>
                <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field w-full" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">State</label>
                <input type="text" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field w-full" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="w-4 h-4 accent-teal" />
              <span className="text-sm font-semibold text-ink">Set as default address</span>
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-outline !py-2 !px-4 text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : editingId ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        </Card>
      )}

      {savedAddress && addresses.length === 0 && !showForm && (
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-teal" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-bold text-ink">Primary Address</p>
                <span className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded-full font-bold">Default</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{savedAddress}</p>
            </div>
          </div>
        </Card>
      )}

      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <Card key={addr.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-ink">{addr.label || "Address"}</p>
                    {addr.isDefault && (
                      <span className="text-[9px] bg-teal/10 text-teal px-1.5 py-0.5 rounded-full font-bold">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-muted">{[addr.address, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}</p>
                  {addr.phone && <p className="text-xs text-muted mt-1">{addr.phone}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleEdit(addr)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-cream transition-colors">
                    <Edit3 size={14} className="text-muted" />
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="text-maroon" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!savedAddress && addresses.length === 0 && !showForm && (
        <EmptyState
          icon={MapPin}
          title="No addresses saved"
          description="Add a shipping address for faster checkout."
        />
      )}
    </div>
  );
}

/* ================================================================
   PAYMENTS TAB
   ================================================================ */
function PaymentsTab({ data }: { data: any }) {
  const payments = data?.payments || data?.orders?.filter((o: any) => o.status === "DELIVERED" || o.status === "CONFIRMED") || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Payments" subtitle="View your payment history and receipts." />

      {payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payment history yet"
          description="Your payment receipts will appear here after your first transaction."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Receipt</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {payments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-ink">{p.orderNumber || p.receiptNumber || p.id}</td>
                    <td className="px-6 py-4 text-muted">
                      {new Date(p.paymentDate || p.orderDate || p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 font-bold text-ink">₹{(p.amount || p.totalAmount || 0).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(p.status || "CONFIRMED")}`}>
                        {(p.status || "CONFIRMED").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toast.success("Receipt download coming soon!")}
                        className="text-xs font-bold text-teal hover:underline flex items-center gap-1"
                      >
                        <Download size={12} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ================================================================
   MY CERTIFICATES TAB
   ================================================================ */
function MyCertificatesTab({ data }: { data: any }) {
  const certificates = data?.certificates || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="My Certificates" subtitle="Download your e-certificates for events and programmes." />

      {certificates.length === 0 ? (
        <EmptyState
          icon={FileBadge}
          title="No certificates yet"
          description="Certificates will appear here after you complete an event or programme."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((cert: any) => (
            <Card key={cert.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                  <FileBadge size={20} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{cert.title || cert.eventName || "Certificate"}</p>
                  <p className="text-xs text-muted mt-0.5">
                    Issued {new Date(cert.issuedAt || cert.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <button
                    onClick={() => {
                      if (cert.downloadUrl) {
                        window.open(cert.downloadUrl, "_blank");
                      } else {
                        toast.success("Certificate download coming soon!");
                      }
                    }}
                    className="mt-3 text-xs font-bold text-teal hover:underline flex items-center gap-1"
                  >
                    <Download size={12} /> Download Certificate
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   MY E-TICKETS TAB
   ================================================================ */
function MyETicketsTab({ data }: { data: any }) {
  const tickets = data?.eTickets || data?.seminars?.filter((s: any) => s.ticketNumber) || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="My E-Tickets" subtitle="View and manage your event e-tickets." />

      {tickets.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No e-tickets yet"
          description="E-tickets will appear here after you register for a paid event."
        />
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket: any) => (
            <Card key={ticket.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Ticket size={24} className="text-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-lg font-extrabold text-ink">{ticket.ticketNumber}</p>
                  <p className="text-sm text-muted mt-0.5">
                    {ticket.eventTitle || "Event"} · {ticket.registrationDate ? new Date(ticket.registrationDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                  </p>
                  <span className={`mt-2 inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(ticket.isVerified ? "VERIFIED" : "PENDING")}`}>
                    {ticket.isVerified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="w-20 h-20 bg-ink/5 rounded-xl flex items-center justify-center shrink-0">
                  <QrCode size={32} className="text-ink/30" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   SUPPORT TAB
   ================================================================ */
function SupportTab({ user }: { user: any }) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    category: "General Inquiry",
    priority: "Medium",
    description: "",
  });

  useEffect(() => {
    fetch("/api/dashboard/support")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => { setTickets(d.tickets || d || []); setLoadingTickets(false); })
      .catch(() => setLoadingTickets(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      const data = await res.json();
      setTickets((prev) => [data.ticket || data, ...prev]);
      toast.success("Support ticket created successfully!");
      setShowForm(false);
      setForm({ subject: "", category: "General Inquiry", priority: "Medium", description: "" });
    } catch {
      toast.error("Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Support" subtitle="Create and manage your support tickets." />
        <button
          onClick={() => setShowForm(!showForm)}
          className={showForm ? "btn-outline !py-2 !px-4 text-sm" : "btn-primary !py-2 !px-4 text-sm"}
        >
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Ticket</>}
        </button>
      </div>

      {showForm && (
        <Card className="p-6 animate-fade-up">
          <h3 className="font-heading text-lg font-extrabold text-ink mb-4">Create Support Ticket</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Subject *</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="input-field w-full"
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input-field w-full"
                >
                  <option>General Inquiry</option>
                  <option>Registration Issue</option>
                  <option>Payment Issue</option>
                  <option>Order Issue</option>
                  <option>Fellowship Inquiry</option>
                  <option>Technical Support</option>
                  <option>Refund Request</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="input-field w-full"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Description *</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field w-full min-h-[120px] resize-y"
                  placeholder="Describe your issue in detail..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline !py-2 !px-4 text-sm">Cancel</button>
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                {submitting ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : "Create Ticket"}
              </button>
            </div>
          </form>
        </Card>
      )}

      {loadingTickets ? (
        <LoadingSpinner />
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={Headphones}
          title="No support tickets"
          description="Create a ticket if you need help with your account, orders, or registrations."
        />
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket: any) => (
            <Card key={ticket.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
                  <Headphones size={16} className="text-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-bold text-ink">{ticket.subject}</p>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(ticket.status || "OPEN")}`}>
                      {(ticket.status || "OPEN").replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted mt-1">
                    <span>{ticket.category}</span>
                    <span>·</span>
                    <span>Priority: {ticket.priority}</span>
                    <span>·</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   LIVE CHAT TAB
   ================================================================ */
function LiveChatTab() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Live Chat" subtitle="Get instant help from our support team." />
      <EmptyState
        icon={MessageCircle}
        title="Live chat coming soon"
        description="For immediate assistance, create a support ticket and our team will respond within 24 hours."
        action={
          <div className="flex items-center gap-2 text-xs text-muted bg-cream px-4 py-2 rounded-full">
            <Headphones size={14} className="text-teal" />
            Support team available Mon–Sat, 9 AM – 6 PM IST
          </div>
        }
      />
    </div>
  );
}

/* ================================================================
   IDENTITY VERIFICATION TAB
   ================================================================ */
function IdentityVerificationTab({ user }: { user: any }) {
  const [uploading, setUploading] = useState(false);
  const [verifications, setVerifications] = useState<any[]>(user.verifications || []);
  const [form, setForm] = useState({
    documentType: "Aadhaar Card",
    documentNumber: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a document to upload.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("documentType", form.documentType);
      formData.append("documentNumber", form.documentNumber);
      formData.append("file", file);

      const res = await fetch("/api/dashboard/verification", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setVerifications((prev) => [data.verification || data, ...prev]);
      toast.success("Document submitted for verification!");
      setForm({ documentType: "Aadhaar Card", documentNumber: "" });
      setFile(null);
    } catch {
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Identity Verification" subtitle="Upload your identity documents for account verification." />

      <Card className="p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-teal" /> Upload Document
        </h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Document Type</label>
              <select
                value={form.documentType}
                onChange={(e) => setForm({ ...form, documentType: e.target.value })}
                className="input-field w-full"
              >
                <option>Aadhaar Card</option>
                <option>PAN Card</option>
                <option>Passport</option>
                <option>Voter ID</option>
                <option>Driving License</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Document Number</label>
              <input
                type="text"
                required
                value={form.documentNumber}
                onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
                className="input-field w-full"
                placeholder="Enter document number"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Upload File</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="input-field w-full file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-teal/10 file:text-teal hover:file:bg-teal/20 file:cursor-pointer"
                required
              />
            </div>
            {file && (
              <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
                <FileText size={12} /> {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={uploading} className="btn-primary disabled:opacity-50">
              {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : <><Upload size={14} /> Submit for Verification</>}
            </button>
          </div>
        </form>
      </Card>

      {verifications.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-heading text-sm font-extrabold text-ink">Previous Submissions</h3>
          {verifications.map((v: any) => (
            <Card key={v.id} className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck size={16} className="text-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink">{v.documentType} · ••••{v.documentNumber?.slice(-4) || "****"}</p>
                <p className="text-xs text-muted">
                  Submitted {new Date(v.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(v.status || "PENDING")}`}>
                {(v.status || "PENDING").replace(/_/g, " ")}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   RETURNS & REFUNDS TAB
   ================================================================ */
function ReturnsRefundsTab({ data }: { data: any }) {
  const orders = data?.orders || [];
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    orderId: "",
    type: "Return",
    reason: "",
    amount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: form.amount ? parseFloat(form.amount) : undefined }),
      });
      if (!res.ok) throw new Error("Failed to submit request");
      toast.success("Return/Refund request submitted!");
      setForm({ orderId: "", type: "Return", reason: "", amount: "" });
    } catch {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Returns & Refunds" subtitle="Request a return or refund for an order or event registration." />

      <Card className="p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <RotateCcw size={18} className="text-gold" /> New Request
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Order / Registration</label>
              <select
                required
                value={form.orderId}
                onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                className="input-field w-full"
              >
                <option value="">Select...</option>
                {orders.map((o: any) => (
                  <option key={o.id} value={o.id}>{o.orderNumber} — ₹{(o.totalAmount || 0).toLocaleString("en-IN")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Request Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field w-full"
              >
                <option>Return</option>
                <option>Refund</option>
                <option>Exchange</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Amount (₹)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="input-field w-full"
                placeholder="Optional"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Reason *</label>
            <textarea
              required
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="input-field w-full min-h-[100px] resize-y"
              placeholder="Describe the reason for your return/refund request..."
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : "Submit Request"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

/* ================================================================
   PAYMENT METHODS TAB
   ================================================================ */
function PaymentMethodsTab({ user }: { user: any }) {
  const [methods, setMethods] = useState<any[]>(user.paymentMethods || []);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "UPI",
    upiId: "",
    cardLast4: "",
    cardBrand: "",
    isDefault: false,
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add");
      const data = await res.json();
      setMethods((prev) => [...prev, data.method || data]);
      toast.success("Payment method added!");
      setShowForm(false);
      setForm({ type: "UPI", upiId: "", cardLast4: "", cardBrand: "", isDefault: false });
    } catch {
      toast.error("Failed to add payment method.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this payment method?")) return;
    try {
      await fetch(`/api/dashboard/payment-methods/${id}`, { method: "DELETE" });
      setMethods((prev) => prev.filter((m) => m.id !== id));
      toast.success("Payment method removed.");
    } catch {
      toast.error("Failed to remove payment method.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Payment Methods" subtitle="Manage your saved payment methods." />
        <button
          onClick={() => setShowForm(!showForm)}
          className={showForm ? "btn-outline !py-2 !px-4 text-sm" : "btn-primary !py-2 !px-4 text-sm"}
        >
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Method</>}
        </button>
      </div>

      {showForm && (
        <Card className="p-6 animate-fade-up">
          <h3 className="font-heading text-lg font-extrabold text-ink mb-4">Add Payment Method</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Method Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field w-full"
              >
                <option>UPI</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
              </select>
            </div>
            {form.type === "UPI" ? (
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">UPI ID</label>
                <input
                  type="text"
                  required
                  value={form.upiId}
                  onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                  className="input-field w-full"
                  placeholder="yourname@upi"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Card Brand</label>
                  <select value={form.cardBrand} onChange={(e) => setForm({ ...form, cardBrand: e.target.value })} className="input-field w-full">
                    <option>Visa</option>
                    <option>Mastercard</option>
                    <option>RuPay</option>
                    <option>Amex</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">Last 4 Digits</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    pattern="[0-9]{4}"
                    value={form.cardLast4}
                    onChange={(e) => setForm({ ...form, cardLast4: e.target.value })}
                    className="input-field w-full"
                    placeholder="1234"
                  />
                </div>
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="w-4 h-4 accent-teal" />
              <span className="text-sm font-semibold text-ink">Set as default</span>
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline !py-2 !px-4 text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : "Save Method"}
              </button>
            </div>
          </form>
        </Card>
      )}

      {methods.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No saved payment methods"
          description="Add a payment method for faster checkout."
        />
      ) : (
        <div className="space-y-3">
          {methods.map((method: any) => (
            <Card key={method.id} className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ink/5 rounded-xl flex items-center justify-center shrink-0">
                  {method.type === "UPI" ? (
                    <Wallet size={20} className="text-teal" />
                  ) : (
                    <CreditCard size={20} className="text-gold" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink">
                    {method.type === "UPI" ? `UPI: ${method.upiId}` : `${method.cardBrand || "Card"} •••• ${method.cardLast4 || "****"}`}
                  </p>
                  <p className="text-xs text-muted">{method.type}</p>
                </div>
                {method.isDefault && (
                  <span className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded-full font-bold">Default</span>
                )}
                <button
                  onClick={() => handleDelete(method.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 size={14} className="text-maroon" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
