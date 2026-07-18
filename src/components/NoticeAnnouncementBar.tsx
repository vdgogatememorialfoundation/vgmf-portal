"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, X } from "lucide-react";

interface Item { id: string; title: string; summary?: string | null; linkUrl?: string | null; type: "announcement" | "notice"; }

export default function NoticeAnnouncementBar() {
  const [items, setItems] = useState<Item[]>([]);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    fetch("/api/public/notice-feed")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]));
  }, []);

  if (closed || items.length === 0) return null;
  const content = items.map((item) => (
    <span key={`${item.type}-${item.id}`} className="mx-8 inline-flex items-center gap-2">
      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">{item.type}</span>
      {item.linkUrl ? <Link href={item.linkUrl} className="hover:underline">{item.title}</Link> : <span>{item.title}</span>}
      {item.summary && <span className="hidden md:inline text-white/75">— {item.summary}</span>}
    </span>
  ));

  return (
    <div className="relative z-40 overflow-hidden bg-gradient-to-r from-[#082f2d] via-[#0d6662] to-[#c2761c] text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center gap-3 px-4 py-2">
        <Megaphone size={16} className="shrink-0 text-amber-100" />
        <div className="flex-1 overflow-hidden whitespace-nowrap text-xs font-semibold">
          <div className="inline-block min-w-full animate-[ticker_28s_linear_infinite]">{content}{content}</div>
        </div>
        <button onClick={() => setClosed(true)} className="rounded-full p-1 hover:bg-white/15" aria-label="Hide notices"><X size={14} /></button>
      </div>
    </div>
  );
}
