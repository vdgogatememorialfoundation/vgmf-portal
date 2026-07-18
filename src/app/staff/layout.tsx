"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  ExternalLink,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const sidebarLinks = [
  { href: "/staff", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/staff/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/staff/registrations", icon: Users, label: "Registrations" },
];

const pageTitles: Record<string, string> = {
  "/staff": "Dashboard",
  "/staff/orders": "Orders",
  "/staff/registrations": "Registrations",
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isLogin = pathname === "/staff/login";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLogin) {
    return <>{children}</>;
  }

  const currentPage = pageTitles[pathname] || "Staff";
  const isActive = (href: string) => {
    if (href === "/staff") return pathname === "/staff";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-cream flex">
      <aside
        className={`hidden lg:flex flex-col fixed h-screen z-40 transition-all duration-300 ease-out bg-white border-r border-cream-dark ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div className={`border-b border-cream-dark flex items-center ${collapsed ? "justify-center px-2 py-5" : "px-5 py-5"}`}>
          {!collapsed ? (
            <Link href="/staff" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal to-teal-light flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal/20">
                <span className="text-white font-heading font-extrabold text-sm">V</span>
              </div>
              <div className="overflow-hidden">
                <h1 className="font-heading text-lg font-bold text-navy leading-tight tracking-tight">
                  VGMF
                </h1>
                <p className="text-[10px] text-muted uppercase tracking-widest leading-none">
                  Staff Panel
                </p>
              </div>
            </Link>
          ) : (
            <Link href="/staff" className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal to-teal-light flex items-center justify-center shadow-lg shadow-teal/20">
              <span className="text-white font-heading font-extrabold text-sm">V</span>
            </Link>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {sidebarLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex items-center gap-3 rounded-xl transition-all duration-200 ease-out ${
                  collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
                } ${
                  active
                    ? "bg-teal/10 text-teal"
                    : "text-ink-soft hover:text-navy hover:bg-cream"
                }`}
                title={collapsed ? link.label : undefined}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-teal rounded-r-full" />
                )}
                <link.icon
                  size={20}
                  className={`flex-shrink-0 transition-colors duration-200 ${
                    active ? "text-teal" : "text-muted group-hover:text-navy"
                  }`}
                />
                {!collapsed && (
                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${
                      active ? "text-teal font-semibold" : ""
                    }`}
                  >
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-cream-dark p-3 space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-2.5 rounded-xl text-muted hover:text-navy hover:bg-cream transition-all duration-200 ${
              collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
            }`}
            title={collapsed ? "Back to Site" : undefined}
          >
            <ExternalLink size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">Back to Site</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-2.5 rounded-xl text-muted/60 hover:text-muted hover:bg-cream transition-all duration-200 px-3 py-2"
          >
            {collapsed ? (
              <ChevronRight size={18} className="mx-auto" />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-out ${
          collapsed ? "lg:ml-[72px]" : "lg:ml-64"
        }`}
      >
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-cream-dark">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-lg font-bold text-navy hidden sm:block">
                {currentPage}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-cream-dark bg-cream/50 hover:bg-cream transition-colors">
                <Bell size={18} className="text-muted" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-cream/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-teal-light flex items-center justify-center shadow-sm">
                    <span className="text-white font-heading font-bold text-xs">S</span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-navy leading-tight">Staff</p>
                    <p className="text-[10px] text-muted leading-tight">staff@vgmf.org</p>
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-cream-dark py-1.5 animate-scale-in">
                    <div className="px-4 py-2.5 border-b border-cream-dark">
                      <p className="text-sm font-semibold text-navy">Staff Member</p>
                      <p className="text-xs text-muted">staff@vgmf.org</p>
                    </div>
                    <Link
                      href="/"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 xl:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-cream-dark safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1.5">
          {sidebarLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[56px] transition-all duration-200 ${
                  active
                    ? "text-teal"
                    : "text-muted hover:text-navy"
                }`}
              >
                <div className={`relative p-1 rounded-xl transition-colors ${
                  active ? "bg-teal/10" : ""
                }`}>
                  <link.icon size={20} />
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal rounded-full" />
                  )}
                </div>
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
