"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  UserCog,
  Calendar,
  BookOpen,
  Megaphone,
  FileText,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BarChart3,
  ClipboardList,
  Link2,
  Shield,
  FileCode,
  Lock,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/staff", icon: UserCog, label: "Staff" },
  { href: "/admin/events", icon: Calendar, label: "Events" },
  { href: "/admin/articles", icon: BookOpen, label: "Articles" },
  { href: "/admin/announcements", icon: Megaphone, label: "Announcements" },
  { href: "/admin/content", icon: FileText, label: "Content" },
  { href: "/admin/portals", icon: Link2, label: "Portal Links" },
  { href: "/admin/roles", icon: Shield, label: "Roles" },
  { href: "/admin/pages", icon: FileCode, label: "Pages" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/reports", icon: ClipboardList, label: "Reports" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/users": "Users",
  "/admin/staff": "Staff",
  "/admin/events": "Events",
  "/admin/articles": "Articles",
  "/admin/announcements": "Announcements",
  "/admin/content": "Content",
  "/admin/portals": "Portal Links",
  "/admin/roles": "Roles",
  "/admin/pages": "Pages",
  "/admin/analytics": "Analytics",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isLogin = pathname === "/admin/login";

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

  const currentPage = pageTitles[pathname] || "Admin";
  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed h-screen z-40 transition-all duration-300 ease-out bg-white border-r border-cream-dark ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className={`border-b border-cream-dark flex items-center ${collapsed ? "justify-center px-2 py-5" : "px-5 py-5"}`}>
          {!collapsed ? (
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal to-teal-light flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal/20">
                <span className="text-white font-heading font-extrabold text-sm">V</span>
              </div>
              <div className="overflow-hidden">
                <h1 className="font-heading text-lg font-bold text-ink leading-tight tracking-tight">
                  VGMF Admin Panel
                </h1>
                <p className="text-[10px] text-muted uppercase tracking-widest leading-none">
                  Management
                </p>
              </div>
            </Link>
          ) : (
            <Link href="/admin" className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal to-teal-light flex items-center justify-center shadow-lg shadow-teal/20">
              <span className="text-white font-heading font-extrabold text-sm">V</span>
            </Link>
          )}
        </div>

        {/* Navigation */}
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
                    : "text-muted hover:text-ink hover:bg-cream"
                }`}
                title={collapsed ? link.label : undefined}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-teal rounded-r-full" />
                )}
                <link.icon
                  size={20}
                  className={`flex-shrink-0 transition-colors duration-200 ${
                    active ? "text-teal" : "text-muted group-hover:text-ink"
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

        {/* Back to Site + Collapse Toggle */}
        <div className="border-t border-cream-dark p-3 space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-2.5 rounded-xl text-muted hover:text-ink hover:bg-cream transition-all duration-200 ${
              collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
            }`}
            title={collapsed ? "Back to Site" : undefined}
          >
            <ExternalLink size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">Back to Site</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-2.5 rounded-xl text-muted hover:text-ink hover:bg-cream transition-all duration-200 px-3 py-2"
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

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-out ${
          collapsed ? "lg:ml-[72px]" : "lg:ml-64"
        }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-cream-dark">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            {/* Left: Page Title */}
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-lg font-bold text-ink hidden sm:block">
                {currentPage}
              </h2>
            </div>

            {/* Right: Search, Notifications, Profile */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`flex items-center gap-2 rounded-xl border transition-all duration-200 ${
                    searchOpen
                      ? "w-64 border-teal/40 bg-white shadow-sm"
                      : "w-10 h-10 border-cream-dark bg-cream hover:bg-cream-dark"
                  }`}
                >
                  <Search
                    size={16}
                    className={`flex-shrink-0 ${searchOpen ? "ml-3 text-muted" : "mx-auto text-muted"}`}
                  />
                  {searchOpen && (
                    <input
                      autoFocus
                      placeholder="Search..."
                      className="w-full pr-3 py-2 text-sm bg-transparent outline-none text-ink placeholder:text-muted"
                      onBlur={() => setSearchOpen(false)}
                    />
                  )}
                </button>
              </div>

              {/* Notifications */}
              <button className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-cream-dark bg-cream hover:bg-cream-dark transition-colors">
                <Bell size={18} className="text-muted" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-cream transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-teal-light flex items-center justify-center shadow-sm">
                    <span className="text-white font-heading font-bold text-xs">A</span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-ink leading-tight">Admin</p>
                    <p className="text-[10px] text-muted leading-tight">admin@vgmf.org</p>
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-cream-dark py-1.5 animate-scale-in">
                    <div className="px-4 py-2.5 border-b border-cream-dark">
                      <p className="text-sm font-semibold text-ink">Admin</p>
                      <p className="text-xs text-muted">admin@vgmf.org</p>
                    </div>
                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-cream transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={16} /> Settings
                    </Link>
                    <Link
                      href="/change-password"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-cream transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Lock size={16} /> Change Password
                    </Link>
                    <Link
                      href="/"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-cream-dark safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1.5">
          {sidebarLinks.slice(0, 5).map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[56px] transition-all duration-200 ${
                  active
                    ? "text-teal"
                    : "text-muted hover:text-ink"
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
          <Link
            href="#"
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[56px] text-muted hover:text-ink transition-colors"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div className="p-1">
              <Settings size={20} />
            </div>
            <span className="text-[10px] font-medium">More</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
