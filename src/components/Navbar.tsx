"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Phone, ChevronDown, User, LogOut, Shield, Settings } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/fellowship", label: "Fellowship" },
  { href: "/seminar", label: "Seminar" },
  { href: "/autism", label: "Autism" },
  { href: "/shop", label: "Shop" },
  { href: "/articles", label: "Articles" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement Ticker */}
      <div className="bg-teal text-white text-xs overflow-hidden" style={{ height: "28px" }}>
        <div className="flex items-center h-7 whitespace-nowrap" style={{ animation: "marquee 25s linear infinite" }}>
          <span className="mx-8 font-semibold">📢 Applications Open for VGMF Research Fellowship 2026</span>
          <span className="mx-8 font-semibold">🏥 National Seminar on Agnikarma &amp; Viddhakarma - Register Now</span>
          <span className="mx-8 font-semibold">🤝 Free Autism Awareness Programme for Families</span>
          <span className="mx-8 font-semibold">📞 Contact: +91 93737 92952</span>
          <span className="mx-8 font-semibold">📢 Applications Open for VGMF Research Fellowship 2026</span>
          <span className="mx-8 font-semibold">🏥 National Seminar on Agnikarma &amp; Viddhakarma - Register Now</span>
          <span className="mx-8 font-semibold">🤝 Free Autism Awareness Programme for Families</span>
          <span className="mx-8 font-semibold">📞 Contact: +91 93737 92952</span>
        </div>
      </div>

      {/* Main Nav - Short & Clean */}
      <nav className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 bg-teal rounded-lg flex items-center justify-center text-white font-heading font-extrabold text-sm">
                VG
              </div>
              <div className="hidden sm:block">
                <h1 className="font-heading text-navy font-extrabold text-sm leading-none">Vaidya Gogate</h1>
                <p className="text-[9px] text-muted font-medium tracking-wider uppercase">Memorial Foundation</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="px-3 py-1.5 text-xs font-semibold text-ink-soft hover:text-teal hover:bg-teal/5 rounded-lg transition-all">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth */}
            <div className="hidden lg:flex items-center gap-2">
              <a href="tel:+919373792952" className="flex items-center gap-1 text-xs text-muted hover:text-teal transition-colors px-2 py-1">
                <Phone size={12} /> +91 93737 92952
              </a>
              {session ? (
                <div className="relative">
                  <button onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-7 h-7 bg-teal rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {session.user?.name?.[0] || "U"}
                    </div>
                    <ChevronDown size={12} className={`text-muted transition-transform ${userMenu ? "rotate-180" : ""}`} />
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 animate-scale-in z-50">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-navy">{session.user?.name}</p>
                        <p className="text-[10px] text-muted">{session.user?.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-ink-soft hover:bg-slate-50">
                        <User size={14} /> Dashboard
                      </Link>
                      {role === "ADMIN" && (
                        <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-ink-soft hover:bg-slate-50">
                          <Shield size={14} /> Admin
                        </Link>
                      )}
                      {role === "STAFF" && (
                        <Link href="/staff" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-ink-soft hover:bg-slate-50">
                          <Settings size={14} /> Staff
                        </Link>
                      )}
                      <button onClick={() => signOut()} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-danger hover:bg-red-50 w-full">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="btn-primary !py-1.5 !px-3 text-xs !rounded-lg">Sign In</Link>
              )}
            </div>

            <button onClick={() => setOpen(!open)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-50">
              {open ? <X size={20} className="text-navy" /> : <Menu size={20} className="text-navy" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden border-t bg-white animate-scale-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-ink-soft hover:bg-teal/5 hover:text-teal transition-colors">
                  {link.label}
                </Link>
              ))}
              {!session && (
                <Link href="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-bold bg-teal text-white text-center mt-2">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
