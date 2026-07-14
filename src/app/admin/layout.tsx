import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Package, Users, UserCog, Calendar, BookOpen, Megaphone, Settings, LogOut } from "lucide-react";

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/staff", icon: UserCog, label: "Staff" },
  { href: "/admin/events", icon: Calendar, label: "Events" },
  { href: "/admin/articles", icon: BookOpen, label: "Articles" },
  { href: "/admin/announcements", icon: Megaphone, label: "Announcements" },
  { href: "/admin/content", icon: Settings, label: "Content" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex">
      <aside className="w-64 bg-navy text-white hidden lg:flex flex-col fixed h-screen z-40">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="font-heading text-xl font-bold text-gold">VGMF Admin</Link>
          <p className="text-xs text-white/50 mt-1">Management Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map(link => (
            <Link key={link.href} href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              <link.icon size={18} /> {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/50 hover:text-white"><LogOut size={16} /> Back to Site</Link>
        </div>
      </aside>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex overflow-x-auto">
        {sidebarLinks.slice(0, 5).map(link => (
          <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1 px-3 py-2 text-xs text-muted hover:text-navy min-w-[64px]">
            <link.icon size={18} /> {link.label}
          </Link>
        ))}
      </div>
      <main className="flex-1 lg:ml-64 p-6 lg:p-8 pb-20 lg:pb-8">{children}</main>
    </div>
  );
}
