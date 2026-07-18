"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, GraduationCap, FlaskConical, Heart, Package,
  ArrowRight, Ticket, LayoutDashboard, User, Loader2,
  Stethoscope, Users, Building2, BookOpen, Calendar,
  FileText, Award, Globe, ExternalLink, CheckCircle,
  AlertCircle, Bell,
} from "lucide-react";

type Tab = "overview" | "orders" | "registrations";

const categoryLabels: Record<string, string> = {
  DOCTOR: "Ayurvedic Practitioner",
  STUDENT: "Ayurveda Student",
  RESEARCHER: "Research Scholar",
  PATIENT: "Patient",
  GENERAL: "General Public",
  INSTITUTION: "Organization",
};

const categoryColors: Record<string, string> = {
  DOCTOR: "bg-teal/10 text-teal border-teal/20",
  STUDENT: "bg-gold/10 text-gold border-gold/20",
  RESEARCHER: "bg-maroon/10 text-maroon border-maroon/20",
  PATIENT: "bg-rose-50 text-rose-600 border-rose-200",
  GENERAL: "bg-indigo-50 text-indigo-600 border-indigo-200",
  INSTITUTION: "bg-purple-50 text-purple-600 border-purple-200",
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
    FUNDED: "bg-gold/10 text-gold border-gold/20",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    DRAFT: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return map[s] || "bg-gray-50 text-gray-600 border-gray-200";
};

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 card-hover">
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

function QuickAction({ href, label, icon: Icon, color }: { href: string; label: string; icon: any; color: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 card-hover group">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
        <Icon size={18} />
      </div>
      <span className="text-sm font-bold text-ink flex-1">{label}</span>
      <ArrowRight size={16} className="text-ink/30 group-hover:text-teal group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

function DashboardContent({ user, data, category }: { user: any; data: any; category: string }) {
  const orderCount = data?.orders?.length || 0;
  const seminarCount = data?.seminars?.length || 0;
  const fellowshipCount = data?.fellowships?.length || 0;
  const autismCount = data?.autism?.length || 0;
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag, count: orderCount },
    { id: "registrations", label: "Registrations", icon: Ticket, count: seminarCount + fellowshipCount + autismCount },
  ];

  const renderDoctorDashboard = () => (
    <div className="space-y-6">
      {/* Upcoming Seminars */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-teal" /> Upcoming Seminars
        </h3>
        {data?.events?.filter((e: any) => e.eventType === "Seminar" || !e.eventType).length > 0 ? (
          <div className="space-y-3">
            {data.events.filter((e: any) => e.eventType === "Seminar" || !e.eventType).slice(0, 3).map((e: any) => (
              <div key={e.id} className="flex items-center gap-4 p-3 bg-cream-dark rounded-xl">
                <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0"><GraduationCap size={16} className="text-teal" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{e.title}</p>
                  <p className="text-xs text-muted">{e.city ? `${e.city} · ` : ""}{new Date(e.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <Link href={`/seminar`} className="text-xs font-bold text-teal hover:underline shrink-0">View</Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No upcoming seminars</p>
        )}
      </div>

      {/* Latest Articles */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <FileText size={18} className="text-teal" /> Latest Articles
        </h3>
        <p className="text-sm text-muted mb-4">Stay updated with the latest Ayurvedic research and publications.</p>
        <Link href="/articles" className="btn-outline !py-2 !px-4 text-sm">Browse Articles <ArrowRight size={14} /></Link>
      </div>

      {/* Fellowship Opportunities */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <Award size={18} className="text-gold" /> Fellowship Opportunities
        </h3>
        {fellowshipCount > 0 ? (
          <div className="space-y-2">
            {data.fellowships.slice(0, 3).map((f: any) => (
              <div key={f.id} className="flex items-center gap-3 p-3 bg-cream-dark rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{f.trackingNumber}</p>
                  <p className="text-xs text-muted">{f.areaOfInterest || "Viddhakarma Research"}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(f.status)}`}>{f.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted mb-3">Apply for the Viddhakarma Research Fellowship (grants up to ₹75,000).</p>
            <Link href="/fellowship/apply" className="btn-primary !py-2 !px-4 text-sm">Apply Now <ArrowRight size={14} /></Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <QuickAction href="/seminar" label="Register for Seminar" icon={GraduationCap} color="bg-teal/10 text-teal" />
        <QuickAction href="/fellowship/apply" label="Apply for Fellowship" icon={FlaskConical} color="bg-gold/10 text-gold" />
        <QuickAction href="/articles" label="Read Research" icon={BookOpen} color="bg-maroon/10 text-maroon" />
        <QuickAction href="/contact" label="Contact Support" icon={User} color="bg-indigo-50 text-indigo-600" />
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-gold" /> Learning Resources
        </h3>
        <p className="text-sm text-muted mb-4">Access study materials, research papers, and educational content curated for Ayurveda students.</p>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/articles" className="flex items-center gap-2 p-3 bg-cream-dark rounded-xl text-sm font-bold text-ink hover:text-teal transition-colors"><FileText size={16} /> Articles</Link>
          <Link href="/seminar" className="flex items-center gap-2 p-3 bg-cream-dark rounded-xl text-sm font-bold text-ink hover:text-teal transition-colors"><GraduationCap size={16} /> Seminars</Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-teal" /> Upcoming Events
        </h3>
        {data?.events?.length > 0 ? (
          <div className="space-y-3">
            {data.events.slice(0, 3).map((e: any) => (
              <div key={e.id} className="flex items-center gap-4 p-3 bg-cream-dark rounded-xl">
                <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0"><Calendar size={16} className="text-teal" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{e.title}</p>
                  <p className="text-xs text-muted">{new Date(e.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No upcoming events</p>
        )}
      </div>

      <QuickAction href="/fellowship" label="Explore Fellowship Opportunities" icon={Award} color="bg-gold/10 text-gold" />
    </div>
  );

  const renderResearcherDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <FlaskConical size={18} className="text-maroon" /> Fellowship Applications
        </h3>
        {fellowshipCount > 0 ? (
          <div className="space-y-3">
            {data.fellowships.map((f: any) => (
              <div key={f.id} className="flex items-center gap-4 p-3 bg-cream-dark rounded-xl">
                <div className="w-10 h-10 bg-maroon/10 rounded-xl flex items-center justify-center shrink-0"><FlaskConical size={16} className="text-maroon" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{f.trackingNumber}</p>
                  <p className="text-xs text-muted">{f.areaOfInterest || "Research"}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(f.status)}`}>{f.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted mb-3">Submit your research proposal for the Viddhakarma Research Fellowship.</p>
            <Link href="/fellowship/apply" className="btn-primary !py-2 !px-4 text-sm">Apply for Fellowship <ArrowRight size={14} /></Link>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <FileText size={18} className="text-teal" /> Research Papers
        </h3>
        <p className="text-sm text-muted mb-4">Browse published research papers and contribute your findings.</p>
        <Link href="/articles" className="btn-outline !py-2 !px-4 text-sm">Browse Papers <ArrowRight size={14} /></Link>
      </div>

      <QuickAction href="/seminar" label="Academic Events & Conferences" icon={GraduationCap} color="bg-teal/10 text-teal" />
    </div>
  );

  const renderPatientDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <Heart size={18} className="text-rose-500" /> Autism Services
        </h3>
        {autismCount > 0 ? (
          <div className="space-y-3">
            {data.autism.map((a: any) => (
              <div key={a.id} className="flex items-center gap-4 p-3 bg-cream-dark rounded-xl">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0"><Heart size={16} className="text-rose-500" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{a.childName}</p>
                  <p className="text-xs text-muted">{a.eTicketNumber}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(a.isFullyRegistered ? "VERIFIED" : "PENDING")}`}>{a.isFullyRegistered ? "Registered" : "Pre-Registered"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted mb-3">Free awareness, therapy, and community support for families.</p>
        )}
        <Link href="/autism/register" className="btn-primary !py-2 !px-4 text-sm mt-3 inline-flex">Register for Programme <ArrowRight size={14} /></Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-teal" /> Health Resources
        </h3>
        <p className="text-sm text-muted mb-4">Access wellness articles and health information.</p>
        <Link href="/articles" className="btn-outline !py-2 !px-4 text-sm">Wellness Articles <ArrowRight size={14} /></Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <QuickAction href="/autism" label="Learn About Programme" icon={Heart} color="bg-rose-50 text-rose-500" />
        <QuickAction href="/contact" label="Book Appointment" icon={Calendar} color="bg-teal/10 text-teal" />
      </div>
    </div>
  );

  const renderGeneralDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <Globe size={18} className="text-teal" /> Our Programmes
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/seminar" className="flex items-center gap-3 p-4 bg-cream-dark rounded-xl card-hover group">
            <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center"><GraduationCap size={18} className="text-teal" /></div>
            <div><p className="text-sm font-bold text-ink">Seminars</p><p className="text-[10px] text-muted">Register for events</p></div>
          </Link>
          <Link href="/fellowship" className="flex items-center gap-3 p-4 bg-cream-dark rounded-xl card-hover group">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center"><FlaskConical size={18} className="text-gold" /></div>
            <div><p className="text-sm font-bold text-ink">Fellowship</p><p className="text-[10px] text-muted">Apply for research</p></div>
          </Link>
          <Link href="/autism" className="flex items-center gap-3 p-4 bg-cream-dark rounded-xl card-hover group">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center"><Heart size={18} className="text-rose-500" /></div>
            <div><p className="text-sm font-bold text-ink">Autism Programme</p><p className="text-[10px] text-muted">Community support</p></div>
          </Link>
          <Link href="/shop" className="flex items-center gap-3 p-4 bg-cream-dark rounded-xl card-hover group">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center"><ShoppingBag size={18} className="text-indigo-500" /></div>
            <div><p className="text-sm font-bold text-ink">Shop</p><p className="text-[10px] text-muted">Browse products</p></div>
          </Link>
        </div>
      </div>

      {/* Announcements */}
      {data?.announcements?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
            <Bell size={18} className="text-gold" /> Recent Announcements
          </h3>
          <div className="space-y-3">
            {data.announcements.slice(0, 3).map((a: any) => (
              <div key={a.id} className="flex items-start gap-3 p-3 bg-cream-dark rounded-xl">
                <AlertCircle size={14} className="text-teal mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-ink">{a.title}</p>
                  {a.summary && <p className="text-xs text-muted">{a.summary}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <QuickAction href="/about" label="Learn More About VGMF" icon={ExternalLink} color="bg-teal/10 text-teal" />
    </div>
  );

  const renderInstitutionDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <Building2 size={18} className="text-purple-500" /> Partnership & Bulk Registration
        </h3>
        <p className="text-sm text-muted mb-4">Register multiple students or practitioners for our programmes. Explore partnership opportunities with VGMF.</p>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/seminar" className="flex items-center gap-2 p-3 bg-cream-dark rounded-xl text-sm font-bold text-ink hover:text-teal transition-colors"><GraduationCap size={16} /> Bulk Seminar</Link>
          <Link href="/contact" className="flex items-center gap-2 p-3 bg-cream-dark rounded-xl text-sm font-bold text-ink hover:text-teal transition-colors"><Building2 size={16} /> Partnership</Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading text-lg font-extrabold text-ink mb-4 flex items-center gap-2">
          <Globe size={18} className="text-teal" /> Programme Overview
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-cream-dark rounded-xl">
            <span className="text-sm font-bold text-ink">Seminar Registrations</span>
            <span className="text-sm font-extrabold text-teal">{seminarCount}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-cream-dark rounded-xl">
            <span className="text-sm font-bold text-ink">Fellowship Applications</span>
            <span className="text-sm font-extrabold text-teal">{fellowshipCount}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-cream-dark rounded-xl">
            <span className="text-sm font-bold text-ink">Autism Registrations</span>
            <span className="text-sm font-extrabold text-teal">{autismCount}</span>
          </div>
        </div>
      </div>

      <QuickAction href="/about" label="View All Programmes" icon={ExternalLink} color="bg-teal/10 text-teal" />
    </div>
  );

  const categoryDashboard: Record<string, () => React.ReactNode> = {
    DOCTOR: renderDoctorDashboard,
    STUDENT: renderStudentDashboard,
    RESEARCHER: renderResearcherDashboard,
    PATIENT: renderPatientDashboard,
    GENERAL: renderGeneralDashboard,
    INSTITUTION: renderInstitutionDashboard,
  };

  const renderContent = categoryDashboard[category] || renderGeneralDashboard;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-teal to-cyan-500 rounded-2xl flex items-center justify-center text-white text-xl font-heading font-extrabold shadow-lg shadow-teal/20">
            {user.name?.[0] || "U"}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl font-extrabold text-ink">Welcome, {user.name || "User"}</h1>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${categoryColors[category] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                {categoryLabels[category] || category}
              </span>
            </div>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/shop" className="btn-outline !py-2 !px-4 text-sm">Shop <ArrowRight size={14} /></Link>
          <Link href="/fellowship" className="btn-primary !py-2 !px-4 text-sm">Fellowship</Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={ShoppingBag} label="Orders" value={orderCount} color="from-teal to-cyan-500" />
        <StatCard icon={GraduationCap} label="Seminars" value={seminarCount} color="from-teal to-teal-light" />
        <StatCard icon={FlaskConical} label="Fellowships" value={fellowshipCount} color="from-cyan-600 to-teal" />
        <StatCard icon={Heart} label="Autism" value={autismCount} color="from-gold to-gold-light" />
      </div>

      {/* TABS */}
      <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1.5 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id ? "bg-teal text-white shadow-md shadow-teal/20" : "text-ink-soft hover:bg-teal/5"}`}>
            <tab.icon size={16} />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-teal/5"}`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 p-8">
            <h3 className="font-heading text-xl font-extrabold text-ink mb-6">Account Details</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "Name", value: user.name || "Not set" },
                { label: "Email", value: user.email },
                { label: "Category", value: categoryLabels[category] || category },
                { label: "Phone", value: user.phone || "Not set" },
                { label: "City", value: user.city || "Not set" },
                { label: "Status", value: "Active" },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm text-ink font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {renderContent()}
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div>
          {orderCount === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
              <Package size={48} className="text-muted/30 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-ink mb-2">No Orders Yet</h3>
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
                        <td className="px-6 py-4 font-bold text-ink">{o.orderNumber}</td>
                        <td className="px-6 py-4 text-muted">{new Date(o.orderDate).toLocaleDateString("en-IN")}</td>
                        <td className="px-6 py-4 font-bold text-ink">₹{o.totalAmount}</td>
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
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <GraduationCap size={18} className="text-teal" />
              <h3 className="font-heading text-lg font-extrabold text-ink">Seminar Registrations</h3>
            </div>
            {seminarCount === 0 ? (
              <div className="p-10 text-center">
                <Ticket size={32} className="text-muted/30 mx-auto mb-3" />
                <p className="text-sm text-muted font-medium">No seminar registrations</p>
                <Link href="/seminar" className="text-sm font-bold text-ink mt-2 inline-block hover:text-teal transition-colors">View Seminars →</Link>
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
                        <td className="px-6 py-3 font-bold text-ink">{s.ticketNumber}</td>
                        <td className="px-6 py-3 text-muted">{new Date(s.registrationDate).toLocaleDateString("en-IN")}</td>
                        <td className="px-6 py-3"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(s.isVerified ? "VERIFIED" : "PENDING")}`}>{s.isVerified ? "Verified" : "Pending"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <FlaskConical size={18} className="text-maroon" />
              <h3 className="font-heading text-lg font-extrabold text-ink">Fellowship Applications</h3>
            </div>
            {fellowshipCount === 0 ? (
              <div className="p-10 text-center">
                <FlaskConical size={32} className="text-muted/30 mx-auto mb-3" />
                <p className="text-sm text-muted font-medium">No fellowship applications</p>
                <Link href="/fellowship" className="text-sm font-bold text-ink mt-2 inline-block hover:text-teal transition-colors">Apply for Fellowship →</Link>
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
                        <td className="px-6 py-3 font-bold text-ink">{f.trackingNumber}</td>
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

          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Heart size={18} className="text-rose-500" />
              <h3 className="font-heading text-lg font-extrabold text-ink">Autism Programme</h3>
            </div>
            {autismCount === 0 ? (
              <div className="p-10 text-center">
                <Heart size={32} className="text-muted/30 mx-auto mb-3" />
                <p className="text-sm text-muted font-medium">No autism registrations</p>
                <Link href="/autism" className="text-sm font-bold text-ink mt-2 inline-block hover:text-teal transition-colors">View Programme →</Link>
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
                        <td className="px-6 py-3 font-bold text-ink">{a.eTicketNumber}</td>
                        <td className="px-6 py-3 text-ink">{a.childName}</td>
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
          <Loader2 size={32} className="text-teal animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as any;
  const category = data?.category || user.category || "GENERAL";

  return <DashboardContent user={user} data={data} category={category} />;
}
