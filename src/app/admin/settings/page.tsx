"use client";
import { useState, useEffect } from "react";
import { Save, Globe, Mail, Bell, Shield, Palette, Database, Image, Upload, Check } from "lucide-react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "Vaidya Gogate Memorial Foundation",
    siteUrl: "https://staging.vaidyagogate.org",
    adminEmail: "admin@vaidyagogate.org",
    timezone: "Asia/Kolkata",
    primaryColor: "#0f1f4a",
    accentColor: "#c9a84c",
    logoUrl: "",
    faviconUrl: "",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.items) {
        const s: any = {};
        data.items.forEach((item: any) => { s[item.key] = item.value; });
        setSettings(prev => ({ ...prev, ...s }));
        if (s.logoUrl) setLogoPreview(s.logoUrl);
        if (s.faviconUrl) setFaviconPreview(s.faviconUrl);
      }
    } catch (e) {
      console.error("Failed to fetch settings:", e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "favicon") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (data.url) {
        if (type === "logo") {
          setLogoPreview(data.url);
          setSettings(prev => ({ ...prev, logoUrl: data.url }));
        } else {
          setFaviconPreview(data.url);
          setSettings(prev => ({ ...prev, faviconUrl: data.url }));
        }
      }
    } catch (e) {
      console.error("Upload failed:", e);
    } finally {
      setUploading(false);
    }
  };

  const stats = [
    { icon: Globe, label: "Site Status", value: "Online", color: "text-green-600 bg-green-50" },
    { icon: Mail, label: "Email", value: "ZeptoMail", color: "text-blue-600 bg-blue-50" },
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl border p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2"><Globe size={20} className="text-navy" /><h3 className="font-heading text-lg font-bold text-navy">General Settings</h3></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Site Name</label>
              <input value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Site URL</label>
              <input value={settings.siteUrl} onChange={e => setSettings({...settings, siteUrl: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Admin Email</label>
              <input value={settings.adminEmail} onChange={e => setSettings({...settings, adminEmail: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Timezone</label>
              <input value={settings.timezone} onChange={e => setSettings({...settings, timezone: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
            </div>
          </div>
        </div>

        {/* Logo & Favicon */}
        <div className="bg-white rounded-2xl border p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2"><Image size={20} className="text-navy" /><h3 className="font-heading text-lg font-bold text-navy">Logo & Favicon</h3></div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Site Logo</label>
              {logoPreview && (
                <div className="mb-3 p-4 bg-gray-50 rounded-xl flex items-center justify-center">
                  <img src={logoPreview} alt="Logo preview" className="max-h-16 object-contain" />
                </div>
              )}
              <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-navy/30 transition-colors block">
                <Upload size={20} className="mx-auto text-muted mb-2" />
                <p className="text-sm text-muted">Click to upload logo</p>
                <p className="text-xs text-muted mt-1">PNG, JPG, SVG up to 2MB</p>
                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, "logo")} className="hidden" />
              </label>
            </div>
            {/* Favicon Upload */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Favicon</label>
              {faviconPreview && (
                <div className="mb-3 p-4 bg-gray-50 rounded-xl flex items-center justify-center">
                  <img src={faviconPreview} alt="Favicon preview" className="max-h-8 object-contain" />
                </div>
              )}
              <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-navy/30 transition-colors block">
                <Upload size={20} className="mx-auto text-muted mb-2" />
                <p className="text-sm text-muted">Click to upload favicon</p>
                <p className="text-xs text-muted mt-1">ICO, PNG 32x32 or 64x64</p>
                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, "favicon")} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-2xl border p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2"><Palette size={20} className="text-navy" /><h3 className="font-heading text-lg font-bold text-navy">Appearance</h3></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Primary Color</label>
              <div className="flex gap-2">
                <input type="color" value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})}
                  className="w-12 h-12 rounded-xl border cursor-pointer" />
                <input value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})}
                  className="flex-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Accent Color</label>
              <div className="flex gap-2">
                <input type="color" value={settings.accentColor} onChange={e => setSettings({...settings, accentColor: e.target.value})}
                  className="w-12 h-12 rounded-xl border cursor-pointer" />
                <input value={settings.accentColor} onChange={e => setSettings({...settings, accentColor: e.target.value})}
                  className="flex-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl border p-6 space-y-5">
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
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={uploading}
            className="flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light disabled:opacity-50">
            {saved ? <><Check size={18} /> Saved!</> : <><Save size={18} /> Save All Settings</>}
          </button>
          {uploading && <span className="text-sm text-muted animate-pulse">Uploading...</span>}
        </div>
      </form>
    </div>
  );
}
