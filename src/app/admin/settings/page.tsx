"use client";
import { useState } from "react";
import { Save, Globe, Mail, Bell, Shield, Palette, Database } from "lucide-react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const stats = [
    { icon: Globe, label: "Site Status", value: "Online", color: "text-green-600 bg-green-50" },
    { icon: Mail, label: "SMTP Status", value: "Connected", color: "text-blue-600 bg-blue-50" },
    { icon: Database, label: "DB Status", value: "Healthy", color: "text-green-600 bg-green-50" },
    { icon: Shield, label: "SSL", value: "Active", color: "text-green-600 bg-green-50" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="font-heading text-3xl font-extrabold text-navy">Settings</h1><p className="text-muted mt-1">Configure site-wide settings</p></div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}><s.icon size={20} /></div>
            <p className="text-xs text-muted uppercase tracking-wider">{s.label}</p>
            <p className="font-heading text-xl font-extrabold text-navy mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={handleSave} className="bg-white rounded-2xl border p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2"><Globe size={20} className="text-navy" /><h3 className="font-heading text-lg font-bold text-navy">General Settings</h3></div>
          {[
            { key: "siteName", label: "Site Name", value: "VGMF" },
            { key: "siteUrl", label: "Site URL", value: "https://vgmf.org" },
            { key: "adminEmail", label: "Admin Email", value: "admin@vgmf.org" },
            { key: "timezone", label: "Timezone", value: "Asia/Kolkata" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{f.label}</label>
              <input defaultValue={f.value} className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
            </div>
          ))}
        </form>

        <form onSubmit={handleSave} className="bg-white rounded-2xl border p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2"><Bell size={20} className="text-navy" /><h3 className="font-heading text-lg font-bold text-navy">Notification Settings</h3></div>
          <div className="space-y-3">
            {[
              { label: "Order confirmation emails", checked: true },
              { label: "New user registration alerts", checked: true },
              { label: "Seminar registration notifications", checked: true },
              { label: "Fellowship application alerts", checked: true },
              { label: "Marketing emails", checked: false },
            ].map((opt, i) => (
              <label key={i} className="flex items-center justify-between py-2 border-b last:border-0 cursor-pointer">
                <span className="text-sm text-ink-soft">{opt.label}</span>
                <input type="checkbox" defaultChecked={opt.checked} className="accent-navy w-4 h-4" />
              </label>
            ))}
          </div>
        </form>

        <form onSubmit={handleSave} className="bg-white rounded-2xl border p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2"><Palette size={20} className="text-navy" /><h3 className="font-heading text-lg font-bold text-navy">Appearance</h3></div>
          {[
            { key: "primaryColor", label: "Primary Color", value: "#0f1f4a" },
            { key: "accentColor", label: "Accent Color", value: "#c9a84c" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{f.label}</label>
              <div className="flex gap-2">
                <input type="color" defaultValue={f.value} className="w-12 h-12 rounded-xl border cursor-pointer" />
                <input defaultValue={f.value} className="flex-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
              </div>
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Logo</label>
            <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-navy/30 transition-colors">
              <p className="text-sm text-muted">Click to upload or drag and drop</p>
              <p className="text-xs text-muted mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </form>

        <form onSubmit={handleSave} className="bg-white rounded-2xl border p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2"><Shield size={20} className="text-navy" /><h3 className="font-heading text-lg font-bold text-navy">Security</h3></div>
          {[
            { key: "currentPassword", label: "Current Password", type: "password" },
            { key: "newPassword", label: "New Password", type: "password" },
            { key: "confirmPassword", label: "Confirm Password", type: "password" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{f.label}</label>
              <input type={f.type} className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
            </div>
          ))}
          <div>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-sm text-ink-soft">Enable Two-Factor Authentication</span>
              <input type="checkbox" defaultChecked className="accent-navy w-4 h-4" />
            </label>
          </div>
        </form>
      </div>

      <div className="mt-6">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light">
          <Save size={18} /> {saved ? "Saved!" : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}
