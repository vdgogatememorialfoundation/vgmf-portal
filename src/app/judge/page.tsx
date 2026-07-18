"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scale,
  Calendar,
  Presentation,
  Trophy,
  ClipboardCheck,
  Star,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  Play,
  FileText,
  Send,
  Loader2,
  LogOut,
  User,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  BarChart3,
  SlidersHorizontal,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

type Tab = "events" | "cases" | "competitions" | "scored";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  eventType: string;
  eventDate: string;
  endDate: string | null;
  location: string | null;
  city: string | null;
  casePresentationCount: number;
  competitionEntryCount: number;
  scoredCount: number;
  hasScored: boolean;
}

interface PresentationItem {
  id: string;
  topic: string;
  description: string | null;
  videoUrl: string | null;
  pptUrl: string | null;
  pdfUrl: string | null;
  status: string;
  totalScore: number | null;
  submittedAt: string;
  event: { id: string; title: string; eventType: string };
  user: { id: string; name: string | null; email: string | null };
  myScore: ScoreData | null;
}

interface CompetitionItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  fileUrls: string | null;
  status: string;
  totalScore: number | null;
  submittedAt: string;
  event: { id: string; title: string; eventType: string };
  user: { id: string; name: string | null; email: string | null };
  myScore: ScoreData | null;
}

interface ScoreData {
  id: string;
  scientificMerit: number;
  innovation: number;
  feasibility: number;
  presentation: number;
  relevance: number;
  totalScore: number;
  feedback: string | null;
  scoredAt: string | null;
}

const CRITERIA = [
  { key: "scientificMerit", label: "Scientific Merit", desc: "Research quality and methodology" },
  { key: "innovation", label: "Innovation", desc: "Novelty and originality of approach" },
  { key: "feasibility", label: "Feasibility", desc: "Practical implementation potential" },
  { key: "presentation", label: "Presentation", desc: "Clarity and communication quality" },
  { key: "relevance", label: "Relevance", desc: "Applicability to the field" },
] as const;

const sidebarItems: { key: Tab; label: string; icon: typeof Calendar }[] = [
  { key: "events", label: "My Events", icon: Calendar },
  { key: "cases", label: "Case Presentations", icon: Presentation },
  { key: "competitions", label: "Competitions", icon: Trophy },
  { key: "scored", label: "Scored Items", icon: ClipboardCheck },
];

export default function JudgePanel() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("events");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [presentations, setPresentations] = useState<PresentationItem[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionItem[]>([]);
  const [scoredItems, setScoredItems] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [scoringItem, setScoringItem] = useState<{
    type: "case" | "competition";
    item: PresentationItem | CompetitionItem;
  } | null>(null);

  const [scores, setScores] = useState({
    scientificMerit: 50,
    innovation: 50,
    feasibility: 50,
    presentation: 50,
    relevance: 50,
  });
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalScore =
    Math.round(
      ((scores.scientificMerit + scores.innovation + scores.feasibility + scores.presentation + scores.relevance) / 5) *
        100
    ) / 100;

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/judge/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      toast.error("Failed to load events");
    }
  }, []);

  const fetchPresentations = useCallback(async () => {
    try {
      const res = await fetch("/api/judge/case-presentations");
      const data = await res.json();
      setPresentations(data.presentations || []);
    } catch {
      toast.error("Failed to load case presentations");
    }
  }, []);

  const fetchCompetitions = useCallback(async () => {
    try {
      const res = await fetch("/api/judge/competitions");
      const data = await res.json();
      setCompetitions(data.entries || []);
    } catch {
      toast.error("Failed to load competition entries");
    }
  }, []);

  const fetchScored = useCallback(async () => {
    try {
      const res = await fetch("/api/judge/scores");
      const data = await res.json();
      setScoredItems(data.scores || []);
    } catch {
      toast.error("Failed to load scored items");
    }
  }, []);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    setLoading(true);
    Promise.all([fetchEvents(), fetchPresentations(), fetchCompetitions(), fetchScored()]).finally(() =>
      setLoading(false)
    );
  }, [authStatus, fetchEvents, fetchPresentations, fetchCompetitions, fetchScored]);

  const openScoring = (type: "case" | "competition", item: PresentationItem | CompetitionItem) => {
    const existing = (item as any).myScore;
    if (existing) {
      setScores({
        scientificMerit: existing.scientificMerit,
        innovation: existing.innovation,
        feasibility: existing.feasibility,
        presentation: existing.presentation,
        relevance: existing.relevance,
      });
      setFeedback(existing.feedback || "");
    } else {
      setScores({ scientificMerit: 50, innovation: 50, feasibility: 50, presentation: 50, relevance: 50 });
      setFeedback("");
    }
    setScoringItem({ type, item });
  };

  const submitScore = async () => {
    if (!scoringItem) return;
    setSubmitting(true);
    try {
      const payload: any = {
        eventId: scoringItem.item.event.id,
        scientificMerit: scores.scientificMerit,
        innovation: scores.innovation,
        feasibility: scores.feasibility,
        presentation: scores.presentation,
        relevance: scores.relevance,
        feedback,
      };
      if (scoringItem.type === "case") {
        payload.casePresentationId = scoringItem.item.id;
      } else {
        payload.competitionEntryId = scoringItem.item.id;
      }

      const res = await fetch("/api/judge/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit score");
      }

      const result = await res.json();
      toast.success(result.updated ? "Score updated successfully" : "Score submitted successfully");
      setScoringItem(null);
      Promise.all([fetchEvents(), fetchPresentations(), fetchCompetitions(), fetchScored()]);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit score");
    } finally {
      setSubmitting(false);
    }
  };

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 size={36} className="text-teal animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <p className="text-muted mb-4">Please sign in to access the judge panel.</p>
          <Link href="/judge/login" className="btn-primary">
            Judge Login
          </Link>
        </div>
      </div>
    );
  }

  const role = (session.user as any)?.role;
  if (role !== "JUDGE" && role !== "REVIEWER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <Scale size={48} className="text-maroon/30 mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-extrabold text-navy mb-2">Access Denied</h1>
          <p className="text-muted mb-6">You need Judge or Reviewer privileges to access this panel.</p>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-cream">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] bg-ink flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center">
                <Scale size={20} className="text-white" />
              </div>
              <div>
                <span className="font-heading text-sm font-extrabold text-white block leading-tight">VGMF</span>
                <span className="text-[10px] text-teal-light font-semibold uppercase tracking-wider">Judge Panel</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-teal text-white shadow-lg shadow-teal/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center">
              <User size={14} className="text-teal-light" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {(session.user as any)?.name || "Judge"}
              </p>
              <p className="text-[10px] text-white/40 truncate">{role}</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1.5"
          >
            <LogOut size={14} />
            Sign Out
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-cream/80 backdrop-blur-xl border-b border-gray-200/60">
          <div className="flex items-center gap-4 px-4 sm:px-6 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-navy hover:text-teal transition-colors p-1"
            >
              <Menu size={22} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-lg font-extrabold text-navy truncate">
                {sidebarItems.find((s) => s.key === activeTab)?.label}
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted">
              <BarChart3 size={14} />
              <span className="font-medium">
                {presentations.length + competitions.length} items to review
              </span>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 size={36} className="text-teal animate-spin mb-4" />
              <p className="text-sm text-muted font-medium">Loading your panel...</p>
            </div>
          ) : (
            <>
              {activeTab === "events" && (
                <EventsTab events={events} />
              )}
              {activeTab === "cases" && (
                <CasesTab presentations={presentations} onScore={openScoring} />
              )}
              {activeTab === "competitions" && (
                <CompetitionsTab competitions={competitions} onScore={openScoring} />
              )}
              {activeTab === "scored" && (
                <ScoredTab items={scoredItems} />
              )}
            </>
          )}
        </div>
      </main>

      {scoringItem && (
        <ScoringModal
          item={scoringItem.item}
          type={scoringItem.type}
          scores={scores}
          feedback={feedback}
          totalScore={totalScore}
          onScoresChange={setScores}
          onFeedbackChange={setFeedback}
          onSubmit={submitScore}
          submitting={submitting}
          onClose={() => setScoringItem(null)}
        />
      )}
    </div>
  );
}

function EventsTab({ events }: { events: EventItem[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No events assigned"
        desc="Events with case presentations or competitions will appear here."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 card-hover">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
              <Calendar size={22} className="text-teal" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-lg font-extrabold text-navy mb-1">{event.title}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(event.eventDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {event.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {event.location}
                    {event.city ? `, ${event.city}` : ""}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal/10 text-teal font-semibold">
                  {event.eventType}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-center">
              <div>
                <p className="font-heading text-xl font-extrabold text-navy">{event.casePresentationCount}</p>
                <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Cases</p>
              </div>
              <div>
                <p className="font-heading text-xl font-extrabold text-navy">{event.competitionEntryCount}</p>
                <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Entries</p>
              </div>
              <div>
                <p className="font-heading text-xl font-extrabold text-gold">{event.scoredCount}</p>
                <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Scored</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CasesTab({
  presentations,
  onScore,
}: {
  presentations: PresentationItem[];
  onScore: (type: "case", item: PresentationItem) => void;
}) {
  if (presentations.length === 0) {
    return (
      <EmptyState
        icon={Presentation}
        title="No case presentations"
        desc="Case presentations for your assigned events will appear here."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {presentations.map((p) => (
        <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 card-hover">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                <Presentation size={18} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base font-extrabold text-navy mb-1">{p.topic}</h3>
                <p className="text-xs text-muted mb-2">
                  by <span className="font-semibold text-navy/80">{p.user.name || "Anonymous"}</span>
                  {" · "}
                  {new Date(p.submittedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-teal/10 text-teal font-semibold">{p.event.title}</span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
              {p.myScore && (
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="font-heading text-2xl font-extrabold text-teal">{p.myScore.totalScore.toFixed(1)}</p>
                  <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Your Score</p>
                </div>
              )}
            </div>

            {p.description && (
              <p className="text-sm text-muted line-clamp-2 ml-14">{p.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-2 ml-14">
              {p.videoUrl && (
                <a
                  href={p.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:text-teal-light transition-colors px-3 py-1.5 rounded-lg bg-teal/5 hover:bg-teal/10"
                >
                  <Play size={12} /> Video
                </a>
              )}
              {p.pptUrl && (
                <a
                  href={p.pptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-light transition-colors px-3 py-1.5 rounded-lg bg-gold/5 hover:bg-gold/10"
                >
                  <FileText size={12} /> PPT
                </a>
              )}
              {p.pdfUrl && (
                <a
                  href={p.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon hover:text-maroon transition-colors px-3 py-1.5 rounded-lg bg-maroon/5 hover:bg-maroon/10"
                >
                  <FileText size={12} /> PDF
                </a>
              )}
              <button
                onClick={() => onScore("case", p)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg bg-teal hover:bg-teal-light transition-colors ml-auto"
              >
                {p.myScore ? (
                  <>
                    <SlidersHorizontal size={12} /> Edit Score
                  </>
                ) : (
                  <>
                    <Star size={12} /> Score
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CompetitionsTab({
  competitions,
  onScore,
}: {
  competitions: CompetitionItem[];
  onScore: (type: "competition", item: CompetitionItem) => void;
}) {
  if (competitions.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="No competition entries"
        desc="Competition entries for your assigned events will appear here."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {competitions.map((e) => (
        <div key={e.id} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 card-hover">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-maroon/10 rounded-xl flex items-center justify-center shrink-0">
                <Trophy size={18} className="text-maroon" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base font-extrabold text-navy mb-1">{e.title}</h3>
                <p className="text-xs text-muted mb-2">
                  by <span className="font-semibold text-navy/80">{e.user.name || "Anonymous"}</span>
                  {" · "}
                  {new Date(e.submittedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-teal/10 text-teal font-semibold">{e.event.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-maroon/10 text-maroon font-semibold">{e.category}</span>
                  <StatusBadge status={e.status} />
                </div>
              </div>
              {e.myScore && (
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="font-heading text-2xl font-extrabold text-teal">{e.myScore.totalScore.toFixed(1)}</p>
                  <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Your Score</p>
                </div>
              )}
            </div>

            {e.description && (
              <p className="text-sm text-muted line-clamp-2 ml-14">{e.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-2 ml-14">
              {e.fileUrls && (() => {
                try {
                  const urls: string[] = JSON.parse(e.fileUrls);
                  return urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-light transition-colors px-3 py-1.5 rounded-lg bg-gold/5 hover:bg-gold/10"
                    >
                      <ExternalLink size={12} /> File {i + 1}
                    </a>
                  ));
                } catch {
                  return null;
                }
              })()}
              <button
                onClick={() => onScore("competition", e)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg bg-teal hover:bg-teal-light transition-colors ml-auto"
              >
                {e.myScore ? (
                  <>
                    <SlidersHorizontal size={12} /> Edit Score
                  </>
                ) : (
                  <>
                    <Star size={12} /> Score
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoredTab({ items }: { items: any[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="No scores yet"
        desc="Items you have scored will appear here with your feedback."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((s) => (
        <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} className="text-teal" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-base font-extrabold text-navy mb-1">
                {s.casePresentation?.topic || s.competitionEntry?.title || "Unknown"}
              </h3>
              <p className="text-xs text-muted mb-3">
                {s.event?.title} ·{" "}
                {s.casePresentation ? "Case Presentation" : "Competition Entry"}
                {s.casePresentation?.user?.name || s.competitionEntry?.user?.name
                  ? ` · by ${s.casePresentation?.user?.name || s.competitionEntry?.user?.name}`
                  : ""}
              </p>

              <div className="grid grid-cols-5 gap-2 mb-3">
                {[
                  { label: "Sci", val: s.scientificMerit },
                  { label: "Inno", val: s.innovation },
                  { label: "Feas", val: s.feasibility },
                  { label: "Pres", val: s.presentation },
                  { label: "Rel", val: s.relevance },
                ].map((c) => (
                  <div key={c.label} className="text-center">
                    <p className="font-heading text-sm font-extrabold text-navy">{c.val?.toFixed(0) || "—"}</p>
                    <p className="text-[9px] text-muted font-medium uppercase">{c.label}</p>
                  </div>
                ))}
              </div>

              {s.feedback && (
                <div className="bg-cream-dark rounded-xl p-3 text-xs text-muted">
                  <MessageSquare size={12} className="inline mr-1.5 text-teal" />
                  {s.feedback}
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="font-heading text-2xl font-extrabold text-teal">{s.totalScore?.toFixed(1) || "—"}</p>
              <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Total</p>
              {s.scoredAt && (
                <p className="text-[10px] text-muted/60 mt-1">
                  {new Date(s.scoredAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoringModal({
  item,
  type,
  scores,
  feedback,
  totalScore,
  onScoresChange,
  onFeedbackChange,
  onSubmit,
  submitting,
  onClose,
}: {
  item: PresentationItem | CompetitionItem;
  type: "case" | "competition";
  scores: { scientificMerit: number; innovation: number; feasibility: number; presentation: number; relevance: number };
  feedback: string;
  totalScore: number;
  onScoresChange: (s: any) => void;
  onFeedbackChange: (f: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  onClose: () => void;
}) {
  const title = type === "case" ? (item as PresentationItem).topic : (item as CompetitionItem).title;
  const presenterName = item.user?.name || "Anonymous";

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-in">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
            <Star size={18} className="text-teal" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-heading text-lg font-extrabold text-navy truncate">Score Submission</h2>
            <p className="text-xs text-muted truncate">{title}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-cream-dark rounded-xl p-4">
            <p className="text-xs text-muted mb-1">Presenter</p>
            <p className="text-sm font-semibold text-navy">{presenterName}</p>
            <p className="text-xs text-muted mt-1">Event: {item.event.title}</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">Total Score</p>
            <p className="font-heading text-4xl font-extrabold text-teal">{totalScore.toFixed(1)}</p>
            <p className="text-[10px] text-muted">Average of 5 criteria (0–100)</p>
          </div>

          <div className="space-y-5">
            {CRITERIA.map((c) => {
              const val = scores[c.key as keyof typeof scores];
              const color = val >= 75 ? "text-emerald-600" : val >= 50 ? "text-gold" : val >= 25 ? "text-orange-500" : "text-maroon";
              return (
                <div key={c.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <label className="text-sm font-semibold text-navy">{c.label}</label>
                      <p className="text-[10px] text-muted">{c.desc}</p>
                    </div>
                    <span className={`font-heading text-lg font-extrabold ${color}`}>{val}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={val}
                    onChange={(e) => onScoresChange({ ...scores, [c.key]: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-teal"
                  />
                  <div className="flex justify-between text-[9px] text-muted/50 mt-0.5 px-0.5">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="text-sm font-semibold text-navy mb-1.5 block">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              rows={4}
              placeholder="Provide constructive feedback for the presenter..."
              className="input-field resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center gap-3">
          <button onClick={onClose} className="btn-outline flex-1 justify-center py-2.5" disabled={submitting}>
            Cancel
          </button>
          <button onClick={onSubmit} className="btn-primary flex-1 justify-center py-2.5" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send size={16} /> Submit Score
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc }: { icon: typeof Calendar; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={28} className="text-teal/40" />
      </div>
      <h3 className="font-heading text-lg font-extrabold text-navy mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-sm text-center">{desc}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
    UNDER_REVIEW: "bg-yellow-50 text-yellow-700 border-yellow-200",
    SCORED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    SHORTLISTED: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
