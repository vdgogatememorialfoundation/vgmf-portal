"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Phone, Mail, ChevronDown, User, LogOut, Settings, Shield, Truck, LayoutDashboard } from "lucide-react";

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
      {/* Utility Bar */}
      <div className="bg-navy text-white/80 text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><Phone size={12} /> +91 93737 92952</span>
            <span className="flex items-center gap-1"><Mail size={12} /> care@vaidyagogate.org</span>
          </div>
          <span>Advancing Ayurveda Since 1972</span>
        </div>
      </div>
      
      {/* Main Nav */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-gold font-bold text-lg">VG</div>
              <div>
                <h1 className="font-heading text-navy font-bold text-lg leading-tight">Vaidya Gogate</h1>
                <p className="text-[10px] text-muted tracking-wider uppercase">Memorial Foundation</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="px-3 py-2 text-sm font-medium text-ink-soft hover:text-navy hover:bg-navy/5 rounded-lg transition-colors">
                  {link.label}
                </Link>
              ))}
              <Link href="/shop/track"
                className="px-3 py-2 text-sm font-medium text-ink-soft hover:text-navy hover:bg-navy/5 rounded-lg transition-colors flex items-center gap-1">
                <Truck size={14} /> Track Order
              </Link>
            </div>

            {/* Auth */}
            <div className="hidden lg:flex items-center gap-3">
              {session ? (
                <div className="relative">
                  <button onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-white text-sm font-medium">
                      {session.user?.name?.[0] || "U"}
                    </div>
                    <ChevronDown size={16} />
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-1 animate-scale-in">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">{session.user?.name}</p>
                        <p className="text-xs text-muted">{session.user?.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"><LayoutDashboard size={16} /> Dashboard</Link>
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"><User size={16} /> Profile</Link>
                      {role === "ADMIN" && <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"><Shield size={16} /> Admin Panel</Link>}
                      {role === "STAFF" && <Link href="/staff" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"><Settings size={16} /> Staff Panel</Link>}
                      <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"><LogOut size={16} /> Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy-light transition-colors">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-gray-50">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden border-t bg-white animate-scale-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-navy/5 transition-colors">
                  {link.label}
                </Link>
              ))}
              {!session && <Link href="/login" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium bg-navy text-white text-center mt-2">Sign In</Link>}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
