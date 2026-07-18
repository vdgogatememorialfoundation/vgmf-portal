"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, GraduationCap, FlaskConical, Heart, Package, Clock, CheckCircle, XCircle, ArrowRight, Ticket, ExternalLink, Globe, LayoutDashboard, User, Loader2, LogOut, Settings } from "lucide-react";

type Tab = "overview" | "orders" | "registrations";

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
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(d => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [session, status, router]);

  if (status === "loading" || (!session && status !== "unauthenticated")) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-gold animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as any;

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
      CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
      PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
      SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
      DELIVERED: "bg-emerald-accent/10 text-emerald-accent border-emerald-accent/20",
      CANCELLED: "bg-danger/10 text-danger border-danger/20",
      VERIFIED: "bg-emerald-accent/10 text-emerald-accent border-emerald-accent/20",
      SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
      UNDER_REVIEW: "bg-yellow-50 text-yellow-700 border-yellow-200",
      SHORTLISTED: "bg-purple-50 text-purple-700 border-purple-200",
      SELECTED: "bg-emerald-accent/10 text-emerald-accent border-emerald-accent/20",
      FUNDED: "bg-gold/10 text-gold border-gold/20",
      REJECTED: "bg-danger/10 text-danger border-danger/20",
    };
    return map[s] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  const orderCount = data?.orders?.length || 0;
  const seminarCount = data?.seminars?.length || 0;
  const fellowshipCount = data?.fellowships?.length || 0;
  const autismCount = data?.autism?.length || 0;

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag, count: orderCount },
    { id: "registrations", label: "Registrations", icon: Ticket, count: seminarCount + fellowshipCount + autismCount },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-navy to-navy-light rounded-2xl flex items-center justify-center text-gold text-xl font-heading font-extrabold shadow-lg">
            {user.name?.[0] || "U"}
          </div>
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-navy">Dashboard</h1>
            <p className="text-sm text-muted">Welcome back, {user.name || "User"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/shop" className="btn-outline !py-2 !px-4 text-sm">Shop <ArrowRight size={14} /></Link>
          <Link href="/fellowship" className="btn-primary !py-2 !px-4 text-sm">Fellowship</Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: ShoppingBag, label: "Orders", value: orderCount, color: "from-navy to-navy-light" },
          { icon: GraduationCap, label: "Seminars", value: seminarCount, color: "from-teal to-teal-light" },
          { icon: FlaskConical, label: "Fellowships", value: fellowshipCount, color: "from-maroon to-maroon-light" },
          { icon: Heart, label: "Autism", value: autismCount, color: "from-gold to-gold-light" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 card-hover">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="font-heading text-2xl font-extrabold text-navy">{s.value}</p>
                <p className="text-xs text-muted font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1.5 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id ? "bg-navy text-white shadow-md shadow-navy/20" : "text-ink-soft hover:bg-navy/5"}`}>
            <tab.icon size={16} />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-navy/5"}`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8">
            <h3 className="font-heading text-xl font-extrabold text-navy mb-6">Account Details</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "Name", value: user.name || "Not set" },
                { label: "Email", value: user.email },
                { label: "Role", value: user.role },
                { label: "Phone", value: user.phone || "Not set" },
                { label: "City", value: user.city || "Not set" },
                { label: "Status", value: "Active" },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm text-navy font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8">
            <h3 className="font-heading text-xl font-extrabold text-navy mb-6">Recent Activity</h3>
            {data?.orders?.length === 0 && data?.seminars?.length === 0 && data?.fellowships?.length === 0 && data?.autism?.length === 0 ? (
              <div className="text-center py-12">
                <Package size={40} className="text-muted/30 mx-auto mb-3" />
                <p className="text-sm text-muted font-medium">No recent activity</p>
                <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-bold text-navy mt-3 hover:text-gold transition-colors">Start Shopping <ArrowRight size={14} /></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.orders?.slice(0, 3).map((o: any) => (
                  <div key={o.id} className="flex items-center gap-4 p-4 bg-cream-dark rounded-xl">
                    <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center shrink-0"><ShoppingBag size={16} className="text-navy" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-navy truncate">Order {o.orderNumber}</p>
                      <p className="text-xs text-muted">{new Date(o.orderDate).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-navy">₹{o.totalAmount}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(o.status)}`}>{o.status}</span>
                    </div>
                  </div>
                ))}
                {data?.seminars?.slice(0, 2).map((s: any) => (
                  <div key={s.id} className="flex items-center gap-4 p-4 bg-cream-dark rounded-xl">
                    <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0"><GraduationCap size={16} className="text-teal" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-navy truncate">Seminar — {s.ticketNumber}</p>
                      <p className="text-xs text-muted">{new Date(s.registrationDate).toLocaleDateString("en-IN")}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(s.isVerified ? "VERIFIED" : "PENDING")}`}>{s.isVerified ? "Verified" : "Pending"}</span>
                  </div>
                ))}
                {data?.fellowships?.slice(0, 2).map((f: any) => (
                  <div key={f.id} className="flex items-center gap-4 p-4 bg-cream-dark rounded-xl">
                    <div className="w-10 h-10 bg-maroon/10 rounded-xl flex items-center justify-center shrink-0"><FlaskConical size={16} className="text-maroon" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-navy truncate">Fellowship — {f.trackingNumber}</p>
                      <p className="text-xs text-muted">{f.areaOfInterest || "Viddhakarma"}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(f.status)}`}>{f.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div>
          {orderCount === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
              <Package size={48} className="text-muted/30 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-navy mb-2">No Orders Yet</h3>
              <p className="text-sm text-muted mb-6">Start shopping to see your orders here.</p>
              <Link href="/shop" className="btn-primary">Visit Shop <ArrowRight size={16} /></Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-cream-dark">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Order #</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Amount</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.orders.map((o: any) => (
                      <tr key={o.id} className="hover:bg-cream-dark/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-navy">{o.orderNumber}</td>
                        <td className="px-6 py-4 text-muted">{new Date(o.orderDate).toLocaleDateString("en-IN")}</td>
                        <td className="px-6 py-4 font-bold text-navy">₹{o.totalAmount}</td>
                        <td className="px-6 py-4"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(o.status)}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* REGISTRATIONS TAB */}
      {activeTab === "registrations" && (
        <div className="space-y-6">
          {/* Seminars */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <GraduationCap size={18} className="text-teal" />
              <h3 className="font-heading text-lg font-extrabold text-navy">Seminar Registrations</h3>
            </div>
            {seminarCount === 0 ? (
              <div className="p-10 text-center">
                <Ticket size={32} className="text-muted/30 mx-auto mb-3" />
                <p className="text-sm text-muted font-medium">No seminar registrations</p>
                <Link href="/seminar" className="text-sm font-bold text-navy mt-2 inline-block hover:text-gold transition-colors">View Seminars →</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-cream-dark">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Ticket #</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.seminars.map((s: any) => (
                      <tr key={s.id} className="hover:bg-cream-dark/50 transition-colors">
                        <td className="px-6 py-3 font-bold text-navy">{s.ticketNumber}</td>
                        <td className="px-6 py-3 text-muted">{new Date(s.registrationDate).toLocaleDateString("en-IN")}</td>
                        <td className="px-6 py-3"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(s.isVerified ? "VERIFIED" : "PENDING")}`}>{s.isVerified ? "Verified" : "Pending"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Fellowships */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <FlaskConical size={18} className="text-maroon" />
              <h3 className="font-heading text-lg font-extrabold text-navy">Fellowship Applications</h3>
            </div>
            {fellowshipCount === 0 ? (
              <div className="p-10 text-center">
                <FlaskConical size={32} className="text-muted/30 mx-auto mb-3" />
                <p className="text-sm text-muted font-medium">No fellowship applications</p>
                <Link href="/fellowship" className="text-sm font-bold text-navy mt-2 inline-block hover:text-gold transition-colors">Apply for Fellowship →</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-cream-dark">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Tracking #</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Area</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.fellowships.map((f: any) => (
                      <tr key={f.id} className="hover:bg-cream-dark/50 transition-colors">
                        <td className="px-6 py-3 font-bold text-navy">{f.trackingNumber}</td>
                        <td className="px-6 py-3 text-muted">{f.areaOfInterest || "—"}</td>
                        <td className="px-6 py-3 text-muted">{new Date(f.createdAt).toLocaleDateString("en-IN")}</td>
                        <td className="px-6 py-3"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(f.status)}`}>{f.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Autism */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Heart size={18} className="text-pink-500" />
              <h3 className="font-heading text-lg font-extrabold text-navy">Autism Programme</h3>
            </div>
            {autismCount === 0 ? (
              <div className="p-10 text-center">
                <Heart size={32} className="text-muted/30 mx-auto mb-3" />
                <p className="text-sm text-muted font-medium">No autism registrations</p>
                <Link href="/autism" className="text-sm font-bold text-navy mt-2 inline-block hover:text-gold transition-colors">View Programme →</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-cream-dark">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">E-Ticket</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Child</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.autism.map((a: any) => (
                      <tr key={a.id} className="hover:bg-cream-dark/50 transition-colors">
                        <td className="px-6 py-3 font-bold text-navy">{a.eTicketNumber}</td>
                        <td className="px-6 py-3 text-navy">{a.childName}</td>
                        <td className="px-6 py-3 text-muted">{new Date(a.registrationDate).toLocaleDateString("en-IN")}</td>
                        <td className="px-6 py-3"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(a.isFullyRegistered ? "VERIFIED" : "PENDING")}`}>{a.isFullyRegistered ? "Registered" : "Pre-Registered"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
