import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center text-navy font-heading font-extrabold text-xl shadow-lg shadow-gold/20">
                VG
              </div>
              <div>
                <h3 className="font-heading text-xl font-extrabold text-white leading-none">Vaidya Gogate</h3>
                <p className="text-[10px] text-white/40 tracking-widest uppercase mt-0.5">Memorial Foundation</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Preserving the legacy of Vaidya R.B. Gogate through research, education, and community service rooted in authentic Ayurvedic tradition.
            </p>
            <div className="flex gap-2">
              {["Facebook", "Instagram", "YouTube"].map(s => (
                <a key={s} href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-gold hover:text-navy flex items-center justify-center text-white/50 transition-all duration-300 text-xs font-bold">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-extrabold text-gold mb-5">Quick Links</h4>
            <div className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Fellowship", href: "/fellowship" },
                { label: "Seminar", href: "/seminar" },
                { label: "Autism Programme", href: "/autism" },
                { label: "Shop", href: "/shop" },
                { label: "Articles", href: "/articles" },
                { label: "Contact", href: "/contact" },
              ].map(l => (
                <Link key={l.href} href={l.href} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-gold transition-colors duration-200 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">{l.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="font-heading text-lg font-extrabold text-gold mb-5">Our Programmes</h4>
            <div className="space-y-2.5">
              {[
                { label: "Research Fellowship", href: "/fellowship" },
                { label: "Fellowship Application", href: "/fellowship/apply" },
                { label: "Track Application", href: "/fellowship/track" },
                { label: "National Seminar", href: "/seminar" },
                { label: "Seminar Registration", href: "/seminar/register" },
                { label: "Autism Awareness", href: "/autism" },
                { label: "Autism Registration", href: "/autism/register" },
              ].map(l => (
                <Link key={l.href + l.label} href={l.href} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-gold transition-colors duration-200 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">{l.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-extrabold text-gold mb-5">Contact Us</h4>
            <div className="space-y-4 text-sm text-white/50">
              <a href="https://maps.google.com/?q=102+Ramprasad+Chambers+Pune+411002" target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-3 group hover:text-gold transition-colors">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold/60 group-hover:text-gold" />
                <span>102, Ramprasad Chambers, 368/1, Jawaharlal Nehru Rd, near Kirad Hospital, Pune, Maharashtra 411002</span>
              </a>
              <a href="tel:+919373792952" className="flex items-center gap-3 group hover:text-gold transition-colors">
                <Phone size={16} className="shrink-0 text-gold/60 group-hover:text-gold" />
                <span>+91 93737 92952</span>
              </a>
              <a href="mailto:care@vaidyagogate.org" className="flex items-center gap-3 group hover:text-gold transition-colors">
                <Mail size={16} className="shrink-0 text-gold/60 group-hover:text-gold" />
                <span>care@vaidyagogate.org</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/30">&copy; {new Date().getFullYear()} Vaidya Gogate Memorial Foundation. All rights reserved.</p>
          <p className="text-sm text-white/30">
            Developed by{" "}
            <a href="https://capturevisualstudios.com" target="_blank" className="text-gold hover:underline inline-flex items-center gap-1">
              Capture Visual Studios <ArrowUpRight size={12} />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
