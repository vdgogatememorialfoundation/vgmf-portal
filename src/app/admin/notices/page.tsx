"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

type Notice = { id: string; title: string; content?: string; noticeType: string; position: string; sortOrder: number; isActive: boolean };

export default function AdminNoticesPage() {
  const [items, setItems] = useState<Notice[]>([]);
  const [form, setForm] = useState({ title: "", content: "", noticeType: "info", position: "below-header", sortOrder: 0, isActive: true });
  const [saving, setSaving] = useState(false);
  const load = () => fetch("/api/admin/notices").then(r => r.json()).then(d => setItems(d.items || [])).catch(() => toast.error("Failed to load notices"));
  useEffect(() => { void load(); }, []);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { const r = await fetch("/api/admin/notices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); if (!r.ok) throw new Error(); toast.success("Notice added"); setForm({ title: "", content: "", noticeType: "info", position: "below-header", sortOrder: 0, isActive: true }); load(); } catch { toast.error("Unable to save notice"); } finally { setSaving(false); }
  };
  const remove = async (id: string) => { if (!confirm("Delete this notice permanently?")) return; const r = await fetch(`/api/admin/notices/${id}`, { method: "DELETE" }); if (r.ok) { toast.success("Notice deleted"); load(); } else toast.error("Unable to delete notice"); };
  return <div className="space-y-6">
    <div><h1 className="font-heading text-3xl font-extrabold text-ink">Notices</h1><p className="text-muted">Upload and manage public notices, brochures, popups and dashboard alert content.</p></div>
    <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-100 p-6 grid md:grid-cols-2 gap-4">
      <input required placeholder="Notice title" className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
      <input placeholder="Brochure / file URL" className="input-field" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
      <select className="input-field" value={form.noticeType} onChange={e => setForm({...form, noticeType: e.target.value})}><option>info</option><option>warning</option><option>urgent</option><option>promo</option></select>
      <select className="input-field" value={form.position} onChange={e => setForm({...form, position: e.target.value})}><option>below-header</option><option>above-hero</option><option>popup</option></select>
      <input type="number" className="input-field" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: Number(e.target.value)})} />
      <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} /> Active</label>
      <button className="btn-primary md:col-span-2" disabled={saving}><Plus size={16} /> {saving ? "Saving..." : "Add Notice"}</button>
    </form>
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">{items.map(n => <div key={n.id} className="flex items-center justify-between gap-4 p-4 border-b last:border-b-0"><div><b>{n.title}</b><p className="text-sm text-muted">{n.content || "No file URL"} · {n.noticeType} · {n.position}</p></div><button onClick={() => remove(n.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div>)}</div>
  </div>;
}
