"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, GraduationCap, FlaskConical, Heart, Package, Clock, CheckCircle, XCircle, ArrowRight, Ticket, ExternalLink, Globe } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portalData, setPortalData] = useState<{ seminars: any[]; fellowships: any[]; autism: any[] }>({ seminars: [], fellowships: [], autism: [] });

  useEffect(() => {
    if (session) {
      fetch("/api/dashboard").then(r => r.json()).then(d => { setData(d); setLoading(false); });
      Promise.all([
        fetch("/api/integration/seminar?path=/seminars").then(r => r.json()).catch(() => ({})),
        fetch("/api/integration/fellowship?path=/fellowships").then(r => r.json()).catch(() => ({})),
        fetch("/api/integration/autism?path=/registrations").then(r => r.json()).catch(() => ({})),
      ]).then(([s, f, a]) => {
        setPortalData({ seminars: s.seminars || [], fellowships: f.fellowships || [], autism: a.registrations || [] });
      });
    }
  }, [session]);

  if (!session) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><h1 className="font-heading text-3xl font-extrabold text-navy">Please sign in</h1><Link href="/login" className="inline-block mt-4 px-6 py-3 bg-navy text-white rounded-xl">Sign In</Link></div>;
  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted">Loading dashboard...</div>;

  const statusColor = (s: string) => ({ PENDING: "bg-yellow-50 text-yellow-700", CONFIRMED: "bg-blue-50 text-blue-700", PROCESSING: "bg-purple-50 text-purple-700", SHIPPED: "bg-indigo-50 text-indigo-700", DELIVERED: "bg-green-50 text-green-700", CANCELLED: "bg-red-50 text-red-700", VERIFIED: "bg-green-50 text-green-700", SUBMITTED: "bg-blue-50 text-blue-700", UNDER_REVIEW: "bg-yellow-50 text-yellow-700", SELECTED: "bg-green-50 text-green-700", FUNDED: "bg-gold/10 text-gold" }[s] || "bg-gray-50 text-gray-600");

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy">My Dashboard</h1>
        <p className="text-muted mt-2">Welcome back, {session.user?.name || "User"}</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: ShoppingBag, label: "Orders", value: data?.orders?.length || 0, href: "#orders" },
          { icon: GraduationCap, label: "Seminars", value: data?.seminars?.length || 0, href: "#seminars" },
          { icon: FlaskConical, label: "Fellowships", value: data?.fellowships?.length || 0, href: "#fellowships" },
          { icon: Heart, label: "Autism", value: data?.autism?.length || 0, href: "#autism" },
        ].map(s => (
          <a key={s.label} href={s.href} className="card-hover bg-white rounded-2xl border p-5 text-center">
            <s.icon className="mx-auto text-navy mb-2" size={24} />
            <p className="font-heading text-2xl font-extrabold text-navy">{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </a>
        ))}
      </div>

      {/* ORDERS */}
      <section id="orders" className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-heading text-2xl font-extrabold text-navy">Orders</h2>
          <Link href="/shop" className="text-sm text-navy font-semibold flex items-center gap-1">Shop <ArrowRight size={16} /></Link>
        </div>
        {data?.orders?.length > 0 ? (
          <div className="bg-white rounded-2xl border overflow-hidden">
            <table className="w-full text-sm"><thead className="bg-navy/5"><tr><th className="text-left px-6 py-3">Order #</th><th className="text-left px-6 py-3">Date</th><th className="text-left px-6 py-3">Amount</th><th className="text-left px-6 py-3">Status</th></tr></thead>
            <tbody>{data.orders.map((o: any) => (
              <tr key={o.id} className="border-t hover:bg-gray-50"><td className="px-6 py-3 font-medium">{o.orderNumber}</td><td className="px-6 py-3 text-muted">{new Date(o.orderDate).toLocaleDateString()}</td><td className="px-6 py-3">₹{o.totalAmount}</td><td className="px-6 py-3"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColor(o.status)}`}>{o.status}</span></td></tr>
            ))}</tbody></table>
          </div>
        ) : <div className="bg-white rounded-2xl border p-8 text-center text-muted"><Package size={32} className="mx-auto mb-3" /><p>No orders yet</p><Link href="/shop" className="text-navy font-semibold mt-2 inline-block">Start Shopping</Link></div>}
      </section>

      {/* SEMINARS */}
      <section id="seminars" className="mb-10">
        <div className="flex justify-between items-center mb-4"><h2 className="font-heading text-2xl font-extrabold text-navy">Seminar Registrations</h2><Link href="/seminar" className="text-sm text-navy font-semibold flex items-center gap-1">View Seminars <ArrowRight size={16} /></Link></div>
        {data?.seminars?.length > 0 ? (
          <div className="bg-white rounded-2xl border overflow-hidden"><table className="w-full text-sm"><thead className="bg-navy/5"><tr><th className="text-left px-6 py-3">Ticket #</th><th className="text-left px-6 py-3">Date</th><th className="text-left px-6 py-3">Status</th></tr></thead>
          <tbody>{data.seminars.map((s: any) => (
            <tr key={s.id} className="border-t"><td className="px-6 py-3 font-medium">{s.ticketNumber}</td><td className="px-6 py-3 text-muted">{new Date(s.registrationDate).toLocaleDateString()}</td><td className="px-6 py-3"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColor(s.isVerified ? "VERIFIED" : "PENDING")}`}>{s.isVerified ? "Verified" : "Pending"}</span></td></tr>
          ))}</tbody></table></div>
        ) : <div className="bg-white rounded-2xl border p-8 text-center text-muted"><Ticket size={32} className="mx-auto mb-3" /><p>No seminar registrations</p></div>}
      </section>

      {/* FELLOWSHIPS */}
      <section id="fellowships" className="mb-10">
        <div className="flex justify-between items-center mb-4"><h2 className="font-heading text-2xl font-extrabold text-navy">Fellowship Applications</h2><Link href="/fellowship" className="text-sm text-navy font-semibold flex items-center gap-1">View Fellowships <ArrowRight size={16} /></Link></div>
        {data?.fellowships?.length > 0 ? (
          <div className="bg-white rounded-2xl border overflow-hidden"><table className="w-full text-sm"><thead className="bg-navy/5"><tr><th className="text-left px-6 py-3">Tracking #</th><th className="text-left px-6 py-3">Area</th><th className="text-left px-6 py-3">Date</th><th className="text-left px-6 py-3">Status</th></tr></thead>
          <tbody>{data.fellowships.map((f: any) => (
            <tr key={f.id} className="border-t"><td className="px-6 py-3 font-medium">{f.trackingNumber}</td><td className="px-6 py-3 text-muted">{f.areaOfInterest}</td><td className="px-6 py-3 text-muted">{new Date(f.createdAt).toLocaleDateString()}</td><td className="px-6 py-3"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColor(f.status)}`}>{f.status}</span></td></tr>
          ))}</tbody></table></div>
        ) : <div className="bg-white rounded-2xl border p-8 text-center text-muted"><FlaskConical size={32} className="mx-auto mb-3" /><p>No fellowship applications</p></div>}
      </section>

      {/* AUTISM */}
      <section id="autism" className="mb-10">
        <div className="flex justify-between items-center mb-4"><h2 className="font-heading text-2xl font-extrabold text-navy">Autism Programme</h2><Link href="/autism" className="text-sm text-navy font-semibold flex items-center gap-1">View Programme <ArrowRight size={16} /></Link></div>
        {data?.autism?.length > 0 ? (
          <div className="bg-white rounded-2xl border overflow-hidden"><table className="w-full text-sm"><thead className="bg-navy/5"><tr><th className="text-left px-6 py-3">E-Ticket #</th><th className="text-left px-6 py-3">Child Name</th><th className="text-left px-6 py-3">Date</th><th className="text-left px-6 py-3">Status</th></tr></thead>
          <tbody>{data.autism.map((a: any) => (
            <tr key={a.id} className="border-t"><td className="px-6 py-3 font-medium">{a.eTicketNumber}</td><td className="px-6 py-3">{a.childName}</td><td className="px-6 py-3 text-muted">{new Date(a.registrationDate).toLocaleDateString()}</td><td className="px-6 py-3"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColor(a.isFullyRegistered ? "VERIFIED" : "PENDING")}`}>{a.isFullyRegistered ? "Registered" : "Pre-Registered"}</span></td></tr>
          ))}</tbody></table></div>
        ) : <div className="bg-white rounded-2xl border p-8 text-center text-muted"><Heart size={32} className="mx-auto mb-3" /><p>No autism registrations</p></div>}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Globe className="text-navy" size={24} />
            <h2 className="font-heading text-2xl font-extrabold text-navy">All Portals</h2>
          </div>
          <Link href="/integration" className="text-sm text-navy font-semibold flex items-center gap-1">Full View <ArrowRight size={16} /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><GraduationCap className="text-blue-600" size={16} /></div>
              <h3 className="font-heading font-bold text-navy text-sm">Seminars</h3>
            </div>
            {portalData.seminars.length > 0 ? (
              <div className="space-y-2">
                {portalData.seminars.slice(0, 2).map((s: any) => (
                  <div key={s.id} className="border-l-2 border-blue-500 pl-2">
                    <p className="font-semibold text-xs">{s.title}</p>
                    <p className="text-[10px] text-muted">{s.date}</p>
                  </div>
                ))}
                <a href="https://seminar.vaidyagogate.org" target="_blank" className="text-[10px] text-blue-600 flex items-center gap-1">Open Portal <ExternalLink size={10} /></a>
              </div>
            ) : <p className="text-xs text-muted">No data</p>}
          </div>

          <div className="bg-white rounded-2xl border p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center"><FlaskConical className="text-green-600" size={16} /></div>
              <h3 className="font-heading font-bold text-navy text-sm">Fellowships</h3>
            </div>
            {portalData.fellowships.length > 0 ? (
              <div className="space-y-2">
                {portalData.fellowships.slice(0, 2).map((f: any) => (
                  <div key={f.id} className="border-l-2 border-green-500 pl-2">
                    <p className="font-semibold text-xs">{f.title}</p>
                    <p className="text-[10px] text-muted">{f.status}</p>
                  </div>
                ))}
                <a href="https://fellowship.vaidyagogate.org" target="_blank" className="text-[10px] text-green-600 flex items-center gap-1">Open Portal <ExternalLink size={10} /></a>
              </div>
            ) : <p className="text-xs text-muted">No data</p>}
          </div>

          <div className="bg-white rounded-2xl border p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center"><Heart className="text-pink-600" size={16} /></div>
              <h3 className="font-heading font-bold text-navy text-sm">Autism Programme</h3>
            </div>
            {portalData.autism.length > 0 ? (
              <div className="space-y-2">
                {portalData.autism.slice(0, 2).map((a: any) => (
                  <div key={a.id} className="border-l-2 border-pink-500 pl-2">
                    <p className="font-semibold text-xs">{a.childName}</p>
                    <p className="text-[10px] text-muted">{a.status}</p>
                  </div>
                ))}
                <a href="https://autism.vaidyagogate.org" target="_blank" className="text-[10px] text-pink-600 flex items-center gap-1">Open Portal <ExternalLink size={10} /></a>
              </div>
            ) : <p className="text-xs text-muted">No data</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
