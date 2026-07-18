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
  AlertCircle, Bell, Pin, ChevronRight,
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

function QuickAction({ href, label, icon: Icon, color }: { href: string; label: string; icon: any; color: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#1a1a2e]/5 card-hover group">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
        <Icon size={18} />
      </div>
      <span className="text-sm font-bold text-[#1a1a2e] flex-1">{label}</span>
      <ArrowRight size={16} className="text-[#7c7c8a] group-hover:text-[#0d6662] group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

function NoticesSection({ announcements }: { announcements: any[] }) {
  if (!announcements || announcements.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
      <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
        <Bell size={18} className="text-[#c2761c]" /> Latest Notices
      </h3>
      <div className="space-y-3">
        {announcements.map((a: any) => (
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
                  <span className="text-[9px] bg-[#0d6662]/10 text-[#0d6662] px-1.5 py-0.5 rounded-full font-bold">Pinned</span>
                )}
              </div>
              {a.summary && <p className="text-xs text-[#7c7c8a] line-clamp-2">{a.summary}</p>}
              <p className="text-[10px] text-[#7c7c8a] mt-1.5 font-medium">
                {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-[#0d6662]" /> Upcoming Seminars
        </h3>
        {data?.events?.filter((e: any) => e.eventType === "Seminar" || !e.eventType).length > 0 ? (
          <div className="space-y-3">
            {data.events.filter((e: any) => e.eventType === "Seminar" || !e.eventType).slice(0, 3).map((e: any) => (
              <div key={e.id} className="flex items-center gap-4 p-3 bg-[#faf9f6] rounded-xl">
                <div className="w-10 h-10 bg-[#0d6662]/10 rounded-xl flex items-center justify-center shrink-0"><GraduationCap size={16} className="text-[#0d6662]" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1a2e] truncate">{e.title}</p>
                  <p className="text-xs text-[#7c7c8a]">{e.city ? `${e.city} · ` : ""}{new Date(e.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <Link href={`/seminar`} className="text-xs font-bold text-[#0d6662] hover:underline shrink-0">View</Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#7c7c8a]">No upcoming seminars</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <FileText size={18} className="text-[#0d6662]" /> Latest Articles
        </h3>
        <p className="text-sm text-[#7c7c8a] mb-4">Stay updated with the latest Ayurvedic research and publications.</p>
        <Link href="/articles" className="btn-outline !py-2 !px-4 text-sm">Browse Articles <ArrowRight size={14} /></Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <Award size={18} className="text-[#c2761c]" /> Fellowship Opportunities
        </h3>
        {fellowshipCount > 0 ? (
          <div className="space-y-2">
            {data.fellowships.slice(0, 3).map((f: any) => (
              <div key={f.id} className="flex items-center gap-3 p-3 bg-[#faf9f6] rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1a2e] truncate">{f.trackingNumber}</p>
                  <p className="text-xs text-[#7c7c8a]">{f.areaOfInterest || "Viddhakarma Research"}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(f.status)}`}>{f.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm text-[#7c7c8a] mb-3">Apply for the Viddhakarma Research Fellowship (grants up to ₹75,000).</p>
            <Link href="/fellowship/apply" className="btn-primary !py-2 !px-4 text-sm">Apply Now <ArrowRight size={14} /></Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <QuickAction href="/seminar" label="Register for Seminar" icon={GraduationCap} color="bg-[#0d6662]/10 text-[#0d6662]" />
        <QuickAction href="/fellowship/apply" label="Apply for Fellowship" icon={FlaskConical} color="bg-[#c2761c]/10 text-[#c2761c]" />
        <QuickAction href="/articles" label="Read Research" icon={BookOpen} color="bg-[#7c1d1d]/10 text-[#7c1d1d]" />
        <QuickAction href="/contact" label="Contact Support" icon={User} color="bg-[#1a1a2e]/10 text-[#1a1a2e]" />
      </div>

      <NoticesSection announcements={data?.announcements} />
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-[#c2761c]" /> Learning Resources
        </h3>
        <p className="text-sm text-[#7c7c8a] mb-4">Access study materials, research papers, and educational content curated for Ayurveda students.</p>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/articles" className="flex items-center gap-2 p-3 bg-[#faf9f6] rounded-xl text-sm font-bold text-[#1a1a2e] hover:text-[#0d6662] transition-colors"><FileText size={16} /> Articles</Link>
          <Link href="/seminar" className="flex items-center gap-2 p-3 bg-[#faf9f6] rounded-xl text-sm font-bold text-[#1a1a2e] hover:text-[#0d6662] transition-colors"><GraduationCap size={16} /> Seminars</Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-[#0d6662]" /> Upcoming Events
        </h3>
        {data?.events?.length > 0 ? (
          <div className="space-y-3">
            {data.events.slice(0, 3).map((e: any) => (
              <div key={e.id} className="flex items-center gap-4 p-3 bg-[#faf9f6] rounded-xl">
                <div className="w-10 h-10 bg-[#0d6662]/10 rounded-xl flex items-center justify-center shrink-0"><Calendar size={16} className="text-[#0d6662]" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1a2e] truncate">{e.title}</p>
                  <p className="text-xs text-[#7c7c8a]">{new Date(e.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#7c7c8a]">No upcoming events</p>
        )}
      </div>

      <QuickAction href="/fellowship" label="Explore Fellowship Opportunities" icon={Award} color="bg-[#c2761c]/10 text-[#c2761c]" />

      <NoticesSection announcements={data?.announcements} />
    </div>
  );

  const renderResearcherDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <FlaskConical size={18} className="text-[#7c1d1d]" /> Fellowship Applications
        </h3>
        {fellowshipCount > 0 ? (
          <div className="space-y-3">
            {data.fellowships.map((f: any) => (
              <div key={f.id} className="flex items-center gap-4 p-3 bg-[#faf9f6] rounded-xl">
                <div className="w-10 h-10 bg-[#7c1d1d]/10 rounded-xl flex items-center justify-center shrink-0"><FlaskConical size={16} className="text-[#7c1d1d]" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1a2e] truncate">{f.trackingNumber}</p>
                  <p className="text-xs text-[#7c7c8a]">{f.areaOfInterest || "Research"}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(f.status)}`}>{f.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm text-[#7c7c8a] mb-3">Submit your research proposal for the Viddhakarma Research Fellowship.</p>
            <Link href="/fellowship/apply" className="btn-primary !py-2 !px-4 text-sm">Apply for Fellowship <ArrowRight size={14} /></Link>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <FileText size={18} className="text-[#0d6662]" /> Research Papers
        </h3>
        <p className="text-sm text-[#7c7c8a] mb-4">Browse published research papers and contribute your findings.</p>
        <Link href="/articles" className="btn-outline !py-2 !px-4 text-sm">Browse Papers <ArrowRight size={14} /></Link>
      </div>

      <QuickAction href="/seminar" label="Academic Events & Conferences" icon={GraduationCap} color="bg-[#0d6662]/10 text-[#0d6662]" />

      <NoticesSection announcements={data?.announcements} />
    </div>
  );

  const renderPatientDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <Heart size={18} className="text-[#7c1d1d]" /> Autism Services
        </h3>
        {autismCount > 0 ? (
          <div className="space-y-3">
            {data.autism.map((a: any) => (
              <div key={a.id} className="flex items-center gap-4 p-3 bg-[#faf9f6] rounded-xl">
                <div className="w-10 h-10 bg-[#7c1d1d]/10 rounded-xl flex items-center justify-center shrink-0"><Heart size={16} className="text-[#7c1d1d]" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1a2e] truncate">{a.childName}</p>
                  <p className="text-xs text-[#7c7c8a]">{a.eTicketNumber}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(a.isFullyRegistered ? "VERIFIED" : "PENDING")}`}>{a.isFullyRegistered ? "Registered" : "Pre-Registered"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#7c7c8a] mb-3">Free awareness, therapy, and community support for families.</p>
        )}
        <Link href="/autism/register" className="btn-primary !py-2 !px-4 text-sm mt-3 inline-flex">Register for Programme <ArrowRight size={14} /></Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-[#0d6662]" /> Health Resources
        </h3>
        <p className="text-sm text-[#7c7c8a] mb-4">Access wellness articles and health information.</p>
        <Link href="/articles" className="btn-outline !py-2 !px-4 text-sm">Wellness Articles <ArrowRight size={14} /></Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <QuickAction href="/autism" label="Learn About Programme" icon={Heart} color="bg-[#7c1d1d]/10 text-[#7c1d1d]" />
        <QuickAction href="/contact" label="Book Appointment" icon={Calendar} color="bg-[#0d6662]/10 text-[#0d6662]" />
      </div>

      <NoticesSection announcements={data?.announcements} />
    </div>
  );

  const renderGeneralDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <Globe size={18} className="text-[#0d6662]" /> Our Programmes
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/seminar" className="flex items-center gap-3 p-4 bg-[#faf9f6] rounded-xl card-hover group">
            <div className="w-10 h-10 bg-[#0d6662]/10 rounded-xl flex items-center justify-center"><GraduationCap size={18} className="text-[#0d6662]" /></div>
            <div><p className="text-sm font-bold text-[#1a1a2e]">Seminars</p><p className="text-[10px] text-[#7c7c8a]">Register for events</p></div>
          </Link>
          <Link href="/fellowship" className="flex items-center gap-3 p-4 bg-[#faf9f6] rounded-xl card-hover group">
            <div className="w-10 h-10 bg-[#c2761c]/10 rounded-xl flex items-center justify-center"><FlaskConical size={18} className="text-[#c2761c]" /></div>
            <div><p className="text-sm font-bold text-[#1a1a2e]">Fellowship</p><p className="text-[10px] text-[#7c7c8a]">Apply for research</p></div>
          </Link>
          <Link href="/autism" className="flex items-center gap-3 p-4 bg-[#faf9f6] rounded-xl card-hover group">
            <div className="w-10 h-10 bg-[#7c1d1d]/10 rounded-xl flex items-center justify-center"><Heart size={18} className="text-[#7c1d1d]" /></div>
            <div><p className="text-sm font-bold text-[#1a1a2e]">Autism Programme</p><p className="text-[10px] text-[#7c7c8a]">Community support</p></div>
          </Link>
          <Link href="/shop" className="flex items-center gap-3 p-4 bg-[#faf9f6] rounded-xl card-hover group">
            <div className="w-10 h-10 bg-[#1a1a2e]/10 rounded-xl flex items-center justify-center"><ShoppingBag size={18} className="text-[#1a1a2e]" /></div>
            <div><p className="text-sm font-bold text-[#1a1a2e]">Shop</p><p className="text-[10px] text-[#7c7c8a]">Browse products</p></div>
          </Link>
        </div>
      </div>

      <NoticesSection announcements={data?.announcements} />

      <QuickAction href="/about" label="Learn More About VGMF" icon={ExternalLink} color="bg-[#0d6662]/10 text-[#0d6662]" />
    </div>
  );

  const renderInstitutionDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <Building2 size={18} className="text-[#c2761c]" /> Partnership & Bulk Registration
        </h3>
        <p className="text-sm text-[#7c7c8a] mb-4">Register multiple students or practitioners for our programmes. Explore partnership opportunities with VGMF.</p>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/seminar" className="flex items-center gap-2 p-3 bg-[#faf9f6] rounded-xl text-sm font-bold text-[#1a1a2e] hover:text-[#0d6662] transition-colors"><GraduationCap size={16} /> Bulk Seminar</Link>
          <Link href="/contact" className="flex items-center gap-2 p-3 bg-[#faf9f6] rounded-xl text-sm font-bold text-[#1a1a2e] hover:text-[#0d6662] transition-colors"><Building2 size={16} /> Partnership</Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a2e]/5 p-6">
        <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <Globe size={18} className="text-[#0d6662]" /> Programme Overview
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#faf9f6] rounded-xl">
            <span className="text-sm font-bold text-[#1a1a2e]">Seminar Registrations</span>
            <span className="text-sm font-extrabold text-[#0d6662]">{seminarCount}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#faf9f6] rounded-xl">
            <span className="text-sm font-bold text-[#1a1a2e]">Fellowship Applications</span>
            <span className="text-sm font-extrabold text-[#0d6662]">{fellowshipCount}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#faf9f6] rounded-xl">
            <span className="text-sm font-bold text-[#1a1a2e]">Autism Registrations</span>
            <span className="text-sm font-extrabold text-[#0d6662]">{autismCount}</span>
          </div>
        </div>
      </div>

      <NoticesSection announcements={data?.announcements} />

      <QuickAction href="/about" label="View All Programmes" icon={ExternalLink} color="bg-[#0d6662]/10 text-[#0d6662]" />
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
          <div className="w-14 h-14 bg-gradient-to-br from-[#0d6662] to-[#0a8480] rounded-2xl flex items-center justify-center text-white text-xl font-heading font-extrabold shadow-lg shadow-[#0d6662]/20">
            {user.name?.[0] || "U"}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl font-extrabold text-[#1a1a2e]">Welcome, {user.name || "User"}</h1>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${categoryColors[category] || "bg-[#1a1a2e]/10 text-[#1a1a2e] border-[#1a1a2e]/20"}`}>
                {categoryLabels[category] || category}
              </span>
            </div>
            <p className="text-sm text-[#7c7c8a]">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/shop" className="btn-outline !py-2 !px-4 text-sm">Shop <ArrowRight size={14} /></Link>
          <Link href="/fellowship" className="btn-primary !py-2 !px-4 text-sm">Fellowship</Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={ShoppingBag} label="Orders" value={orderCount} color="from-[#0d6662] to-[#0a8480]" />
        <StatCard icon={GraduationCap} label="Seminars" value={seminarCount} color="from-[#0d6662] to-[#0a5250]" />
        <StatCard icon={FlaskConical} label="Fellowships" value={fellowshipCount} color="from-[#0a8480] to-[#0d6662]" />
        <StatCard icon={Heart} label="Autism" value={autismCount} color="from-[#c2761c] to-[#a86318]" />
      </div>

      {/* TABS */}
      <div className="flex gap-1 bg-white rounded-2xl border border-[#1a1a2e]/5 p-1.5 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id ? "bg-[#0d6662] text-white shadow-md shadow-[#0d6662]/20" : "text-[#7c7c8a] hover:bg-[#0d6662]/5"}`}>
            <tab.icon size={16} />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-[#0d6662]/5"}`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-[#1a1a2e]/5 p-8">
            <h3 className="font-heading text-xl font-extrabold text-[#1a1a2e] mb-6">Account Details</h3>
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
                  <p className="text-xs font-bold text-[#7c7c8a] uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm text-[#1a1a2e] font-medium">{item.value}</p>
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
            <div className="bg-white rounded-3xl border border-[#1a1a2e]/5 p-16 text-center">
              <Package size={48} className="text-[#7c7c8a]/30 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-[#1a1a2e] mb-2">No Orders Yet</h3>
              <p className="text-sm text-[#7c7c8a] mb-6">Start shopping to see your orders here.</p>
              <Link href="/shop" className="btn-primary">Visit Shop <ArrowRight size={16} /></Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#1a1a2e]/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#faf9f6]">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Order #</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Amount</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a2e]/5">
                    {data.orders.map((o: any) => (
                      <tr key={o.id} className="hover:bg-[#faf9f6]/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#1a1a2e]">{o.orderNumber}</td>
                        <td className="px-6 py-4 text-[#7c7c8a]">{new Date(o.orderDate).toLocaleDateString("en-IN")}</td>
                        <td className="px-6 py-4 font-bold text-[#1a1a2e]">₹{o.totalAmount}</td>
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
          <div className="bg-white rounded-3xl border border-[#1a1a2e]/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1a1a2e]/5 flex items-center gap-2">
              <GraduationCap size={18} className="text-[#0d6662]" />
              <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e]">Seminar Registrations</h3>
            </div>
            {seminarCount === 0 ? (
              <div className="p-10 text-center">
                <Ticket size={32} className="text-[#7c7c8a]/30 mx-auto mb-3" />
                <p className="text-sm text-[#7c7c8a] font-medium">No seminar registrations</p>
                <Link href="/seminar" className="text-sm font-bold text-[#1a1a2e] mt-2 inline-block hover:text-[#0d6662] transition-colors">View Seminars →</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#faf9f6]">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Ticket #</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a2e]/5">
                    {data.seminars.map((s: any) => (
                      <tr key={s.id} className="hover:bg-[#faf9f6]/50 transition-colors">
                        <td className="px-6 py-3 font-bold text-[#1a1a2e]">{s.ticketNumber}</td>
                        <td className="px-6 py-3 text-[#7c7c8a]">{new Date(s.registrationDate).toLocaleDateString("en-IN")}</td>
                        <td className="px-6 py-3"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(s.isVerified ? "VERIFIED" : "PENDING")}`}>{s.isVerified ? "Verified" : "Pending"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-[#1a1a2e]/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1a1a2e]/5 flex items-center gap-2">
              <FlaskConical size={18} className="text-[#7c1d1d]" />
              <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e]">Fellowship Applications</h3>
            </div>
            {fellowshipCount === 0 ? (
              <div className="p-10 text-center">
                <FlaskConical size={32} className="text-[#7c7c8a]/30 mx-auto mb-3" />
                <p className="text-sm text-[#7c7c8a] font-medium">No fellowship applications</p>
                <Link href="/fellowship" className="text-sm font-bold text-[#1a1a2e] mt-2 inline-block hover:text-[#0d6662] transition-colors">Apply for Fellowship →</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#faf9f6]">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Tracking #</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Area</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a2e]/5">
                    {data.fellowships.map((f: any) => (
                      <tr key={f.id} className="hover:bg-[#faf9f6]/50 transition-colors">
                        <td className="px-6 py-3 font-bold text-[#1a1a2e]">{f.trackingNumber}</td>
                        <td className="px-6 py-3 text-[#7c7c8a]">{f.areaOfInterest || "—"}</td>
                        <td className="px-6 py-3 text-[#7c7c8a]">{new Date(f.createdAt).toLocaleDateString("en-IN")}</td>
                        <td className="px-6 py-3"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor(f.status)}`}>{f.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-[#1a1a2e]/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1a1a2e]/5 flex items-center gap-2">
              <Heart size={18} className="text-[#7c1d1d]" />
              <h3 className="font-heading text-lg font-extrabold text-[#1a1a2e]">Autism Programme</h3>
            </div>
            {autismCount === 0 ? (
              <div className="p-10 text-center">
                <Heart size={32} className="text-[#7c7c8a]/30 mx-auto mb-3" />
                <p className="text-sm text-[#7c7c8a] font-medium">No autism registrations</p>
                <Link href="/autism" className="text-sm font-bold text-[#1a1a2e] mt-2 inline-block hover:text-[#0d6662] transition-colors">View Programme →</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#faf9f6]">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">E-Ticket</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Child</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-[#7c7c8a] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a2e]/5">
                    {data.autism.map((a: any) => (
                      <tr key={a.id} className="hover:bg-[#faf9f6]/50 transition-colors">
                        <td className="px-6 py-3 font-bold text-[#1a1a2e]">{a.eTicketNumber}</td>
                        <td className="px-6 py-3 text-[#1a1a2e]">{a.childName}</td>
                        <td className="px-6 py-3 text-[#7c7c8a]">{new Date(a.registrationDate).toLocaleDateString("en-IN")}</td>
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
          <Loader2 size={32} className="text-[#0d6662] animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#7c7c8a] font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as any;
  const category = data?.category || user.category || "GENERAL";

  return <DashboardContent user={user} data={data} category={category} />;
}
