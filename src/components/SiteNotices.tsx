"use client";
import { useState, useEffect } from "react";
import { X, Info, AlertTriangle, AlertCircle, Megaphone } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  content: string | null;
  noticeType: string;
  position: string;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
}

const noticeTypeConfig: Record<string, { icon: any; bg: string; border: string; iconColor: string; label: string }> = {
  info: { icon: Info, bg: "bg-teal/5", border: "border-teal/20", iconColor: "text-teal", label: "Info" },
  warning: { icon: AlertTriangle, bg: "bg-gold/5", border: "border-gold/20", iconColor: "text-gold", label: "Warning" },
  urgent: { icon: AlertCircle, bg: "bg-maroon/5", border: "border-maroon/20", iconColor: "text-maroon", label: "Urgent" },
  promo: { icon: Megaphone, bg: "bg-purple-50", border: "border-purple-200", iconColor: "text-purple-600", label: "Promo" },
};

function NoticeCard({ notice, onDismiss }: { notice: Notice; onDismiss: (id: string) => void }) {
  const config = noticeTypeConfig[notice.noticeType] || noticeTypeConfig.info;
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border ${config.border} rounded-xl p-4 flex items-start gap-3`}>
      <div className={`w-8 h-8 ${config.bg} border ${config.border} rounded-lg flex items-center justify-center shrink-0`}>
        <Icon size={14} className={config.iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-bold text-ink">{notice.title}</p>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${config.bg} ${config.iconColor} border ${config.border}`}>
            {config.label}
          </span>
        </div>
        {notice.content && (
          <p className="text-xs text-muted leading-relaxed line-clamp-2">{notice.content}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(notice.id)}
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
      >
        <X size={12} className="text-muted" />
      </button>
    </div>
  );
}

export default function SiteNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const dismissedStr = localStorage.getItem("vgmf_dismissed_notices");
    if (dismissedStr) {
      setDismissed(new Set(JSON.parse(dismissedStr)));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    fetch("/api/notices")
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const activeNotices = Array.isArray(data) ? data.filter((n: Notice) => {
          const now = new Date();
          if (n.startDate && new Date(n.startDate) > now) return false;
          if (n.endDate && new Date(n.endDate) < now) return false;
          return n.isActive && n.position === "below-header" && !dismissed.has(n.id);
        }) : [];
        setNotices(activeNotices);
      })
      .catch(() => setNotices([]));
  }, [loaded, dismissed]);

  const handleDismiss = (id: string) => {
    const newDismissed = new Set(dismissed);
    newDismissed.add(id);
    setDismissed(newDismissed);
    localStorage.setItem("vgmf_dismissed_notices", JSON.stringify([...newDismissed]));
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  if (!loaded || notices.length === 0) return null;

  return (
    <section className="bg-cream/50 border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="space-y-2">
          {notices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} onDismiss={handleDismiss} />
          ))}
        </div>
      </div>
    </section>
  );
}
