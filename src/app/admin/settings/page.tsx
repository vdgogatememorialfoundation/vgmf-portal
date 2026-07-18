"use client";
import { useState, useEffect } from "react";
import {
  Save,
  Globe,
  Shield,
  CreditCard,
  Calendar,
  Bell,
  Check,
  Eye,
  EyeOff,
  Lock,
  Key,
  ToggleLeft,
  ToggleRight,
  Mail,
  Image as ImageIcon,
} from "lucide-react";

interface SettingItem {
  id: string;
  key: string;
  value: string;
  description: string;
  group: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/site-settings");
      const data = await res.json();
      const map: Record<string, string> = {};
      (data.items || []).forEach((item: SettingItem) => {
        map[item.key] = item.value;
      });
      setSettings(map);
    } catch {
      console.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error("Failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBoolean = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: prev[key] === "true" ? "false" : "true" }));
  };

  const Toggle = ({ label, description, settingKey }: { label: string; description: string; settingKey: string }) => {
    const isOn = settings[settingKey] === "true";
    return (
      <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
        <div>
          <p className="text-sm font-medium text-ink">{label}</p>
          <p className="text-xs text-muted">{description}</p>
        </div>
        <button
          onClick={() => toggleBoolean(settingKey)}
          className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
            isOn ? "bg-teal" : "bg-slate-200"
          }`}
        >
          <div
            className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              isOn ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    );
  };

  const SecretInput = ({ label, settingKey, placeholder }: { label: string; settingKey: string; placeholder?: string }) => {
    const visible = showSecrets[settingKey] || false;
    return (
      <div>
        <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{label}</label>
        <div className="relative">
          <input
            type={visible ? "text" : "password"}
            value={settings[settingKey] || ""}
            onChange={(e) => updateSetting(settingKey, e.target.value)}
            placeholder={placeholder}
            className="input-field w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowSecrets((prev) => ({ ...prev, [settingKey]: !prev[settingKey] }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">Site Settings</h1>
          <p className="text-muted mt-1 text-sm">Configure your platform settings</p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="h-5 bg-slate-100 rounded animate-pulse w-40 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-4 bg-slate-50 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">Site Settings</h1>
          <p className="text-muted mt-1 text-sm">Configure authentication, payments, and general settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
        >
          {saved ? (
            <span className="flex items-center gap-2"><Check size={16} /> Saved!</span>
          ) : saving ? (
            <span className="flex items-center gap-2"><Save size={16} className="animate-pulse" /> Saving...</span>
          ) : (
            <span className="flex items-center gap-2"><Save size={16} /> Save Settings</span>
          )}
        </button>
      </div>

      {/* Auth Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Shield size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-navy">Authentication</h3>
            <p className="text-xs text-muted">Control user signup and login behavior</p>
          </div>
        </div>
        <div className="space-y-1">
          <Toggle
            label="Allow Signups"
            description="When disabled, new users cannot create accounts"
            settingKey="auth.allowSignup"
          />
          <Toggle
            label="Allow Login"
            description="When disabled, no user can log in (maintenance mode)"
            settingKey="auth.allowLogin"
          />
          <div className="py-3">
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Login Method</label>
            <div className="flex gap-2">
              {["password", "otp", "both"].map((method) => (
                <button
                  key={method}
                  onClick={() => updateSetting("auth.loginMethod", method)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                    settings["auth.loginMethod"] === method
                      ? "bg-teal text-white shadow-sm"
                      : "bg-slate-100 text-muted hover:bg-slate-200"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CreditCard size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-navy">Payment Settings</h3>
            <p className="text-xs text-muted">Razorpay payment gateway configuration</p>
          </div>
        </div>
        <div className="space-y-4">
          <Toggle
            label="Enable Payments"
            description="Enable or disable payment processing"
            settingKey="payment.isEnabled"
          />
          <Toggle
            label="Razorpay Test Mode"
            description="Use test keys instead of live keys"
            settingKey="payment.razorpayTestMode"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <SecretInput label="Razorpay Key ID" settingKey="payment.razorpayKeyId" placeholder="rzp_live_..." />
            <SecretInput label="Razorpay Key Secret" settingKey="payment.razorpayKeySecret" placeholder="••••••••" />
            <SecretInput label="Razorpay Test Key ID" settingKey="payment.razorpayTestKeyId" placeholder="rzp_test_..." />
            <SecretInput label="Razorpay Test Secret" settingKey="payment.razorpayTestSecret" placeholder="••••••••" />
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Mail size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-navy">Email Settings</h3>
            <p className="text-xs text-muted">ZeptoMail email gateway configuration</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <SecretInput label="ZeptoMail API Key" settingKey="email.zeptoApiKey" placeholder="PHtE6r0..." />
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">From Email</label>
              <input
                type="email"
                value={settings["email.fromAddress"] || ""}
                onChange={(e) => updateSetting("email.fromAddress", e.target.value)}
                className="input-field w-full"
                placeholder="noreply@vaidyagogate.org"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Branding Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
            <ImageIcon size={20} className="text-pink-600" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-navy">Branding</h3>
            <p className="text-xs text-muted">Logo, favicon and site appearance</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Site Logo URL</label>
            <input
              value={settings["branding.logoUrl"] || ""}
              onChange={(e) => updateSetting("branding.logoUrl", e.target.value)}
              className="input-field w-full"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Favicon URL</label>
            <input
              value={settings["branding.faviconUrl"] || ""}
              onChange={(e) => updateSetting("branding.faviconUrl", e.target.value)}
              className="input-field w-full"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
            <Globe size={20} className="text-teal" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-navy">General</h3>
            <p className="text-xs text-muted">Basic site information</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Site Name</label>
            <input
              value={settings["general.siteName"] || ""}
              onChange={(e) => updateSetting("general.siteName", e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Contact Email</label>
            <input
              type="email"
              value={settings["general.contactEmail"] || ""}
              onChange={(e) => updateSetting("general.contactEmail", e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Contact Phone</label>
            <input
              value={settings["general.contactPhone"] || ""}
              onChange={(e) => updateSetting("general.contactPhone", e.target.value)}
              className="input-field w-full"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
      </div>

      {/* Event Defaults */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Calendar size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-navy">Event Defaults</h3>
            <p className="text-xs text-muted">Default values for event registrations</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Default Cancellation Fee (₹)</label>
            <input
              type="number"
              min={0}
              value={settings["events.defaultCancellationFee"] || "0"}
              onChange={(e) => updateSetting("events.defaultCancellationFee", e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Default Refund Percentage (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={settings["events.defaultRefundPercentage"] || "100"}
              onChange={(e) => updateSetting("events.defaultRefundPercentage", e.target.value)}
              className="input-field w-full"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-8 py-3 text-sm disabled:opacity-50"
        >
          {saved ? (
            <span className="flex items-center gap-2"><Check size={16} /> All Settings Saved</span>
          ) : (
            <span className="flex items-center gap-2"><Save size={16} /> Save All Settings</span>
          )}
        </button>
      </div>
    </div>
  );
}
