"use client";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility Bar */}
      <div className="bg-navy text-white/70 text-xs hidden md:block transition-all">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex justify-between items-center">
          <div className="flex gap-6">
            <a href="tel:+919373792952" className="flex items-center gap-1.5 hover:text-gold transition-colors">
              <Phone size={11} /> +91 93737 92952
            </a>
            <a href="mailto:care@vaidyagogate.org" className="flex items-center gap-1.5 hover:text-gold transition-colors">
              <Mail size={11} /> care@vaidyagogate.org
            </a>
          </div>
          <span className="text-white/40 font-medium">Advancing Ayurveda Since 1972</span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-navy/5 border-b border-gray-100/50" : "bg-white border-b border-gray-100"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-navy to-navy-light rounded-xl flex items-center justify-center text-gold font-heading font-extrabold text-lg shadow-lg shadow-navy/20 group-hover:shadow-navy/30 transition-shadow">
                VG
              </div>
              <div className="hidden sm:block">
                <h1 className="font-heading text-navy font-extrabold text-lg leading-none tracking-tight">Vaidya Gogate</h1>
                <p className="text-[10px] text-muted font-medium tracking-widest uppercase mt-0.5">Memorial Foundation</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="px-3.5 py-2 text-[13px] font-semibold text-ink-soft hover:text-navy hover:bg-navy/5 rounded-lg transition-all duration-200">
                  {link.label}
                </Link>
              ))}
              <Link href="/shop/track"
                className="px-3.5 py-2 text-[13px] font-semibold text-ink-soft hover:text-navy hover:bg-navy/5 rounded-lg transition-all duration-200 flex items-center gap-1.5">
                <Truck size={13} /> Track
              </Link>
            </div>

            {/* Auth */}
            <div className="hidden lg:flex items-center gap-3">
              {session ? (
                <div className="relative">
                  <button onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-navy/5 transition-all duration-200">
                    <div className="w-9 h-9 bg-gradient-to-br from-navy to-navy-light rounded-xl flex items-center justify-center text-gold text-sm font-bold shadow-md">
                      {session.user?.name?.[0] || "U"}
                    </div>
                    <ChevronDown size={14} className={`text-muted transition-transform duration-200 ${userMenu ? "rotate-180" : ""}`} />
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-navy/10 border border-gray-100 py-2 animate-scale-in z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-navy">{session.user?.name}</p>
                        <p className="text-xs text-muted mt-0.5">{session.user?.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-navy/5 hover:text-navy transition-colors">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-navy/5 hover:text-navy transition-colors">
                        <User size={16} /> Profile
                      </Link>
                      {role === "ADMIN" && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-navy/5 hover:text-navy transition-colors">
                          <Shield size={16} /> Admin Panel
                        </Link>
                      )}
                      {role === "STAFF" && (
                        <Link href="/staff" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-navy/5 hover:text-navy transition-colors">
                          <Settings size={16} /> Staff Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-danger hover:bg-red-50 w-full transition-colors">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="btn-gold text-sm !py-2 !px-4">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-xl hover:bg-navy/5 transition-colors">
              {open ? <X size={24} className="text-navy" /> : <Menu size={24} className="text-navy" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-scale-in">
            <div className="px-6 py-4 space-y-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-ink-soft hover:bg-navy/5 hover:text-navy transition-colors">
                  {link.label}
                </Link>
              ))}
              {!session && (
                <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold bg-navy text-white text-center mt-3">
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
