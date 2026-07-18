import Link from "next/link";
import { MapPin, Phone, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center text-white font-heading font-extrabold text-xs">VG</div>
              <div>
                <h3 className="font-heading text-navy font-extrabold text-sm leading-none">VGMF</h3>
                <p className="text-[8px] text-muted tracking-wider uppercase">Est. 1972</p>
              </div>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">Preserving Ayurvedic heritage through research, education, and community service.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading text-xs font-extrabold text-navy mb-3 uppercase tracking-wider">Quick Links</h4>
            <div className="grid grid-cols-2 gap-1">
              {["Home", "About", "Fellowship", "Seminar", "Autism", "Shop", "Articles", "Contact"].map(l => (
                <Link key={l} href={l === "Home" ? "/" : `/${l.toLowerCase()}`} className="text-xs text-ink-soft hover:text-teal transition-colors py-0.5">{l}</Link>
              ))}
            </div>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="font-heading text-xs font-extrabold text-navy mb-3 uppercase tracking-wider">Programmes</h4>
            <div className="space-y-1">
              {["Research Fellowship", "National Seminar", "Autism Programme"].map(l => (
                <Link key={l} href={`/${l.split(" ")[0].toLowerCase()}`} className="block text-xs text-ink-soft hover:text-teal transition-colors">{l}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xs font-extrabold text-navy mb-3 uppercase tracking-wider">Contact</h4>
            <div className="space-y-2 text-xs text-ink-soft">
              <a href="https://maps.google.com/?q=102+Ramprasad+Chambers+Pune+411002" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-teal transition-colors">
                <MapPin size={12} className="mt-0.5 shrink-0 text-teal" />
                <span>102, Ramprasad Chambers, Pune 411002</span>
              </a>
              <a href="tel:+919373792952" className="flex items-center gap-2 hover:text-teal transition-colors">
                <Phone size={12} className="text-teal" /> +91 93737 92952
              </a>
              <a href="mailto:care@vaidyagogate.org" className="flex items-center gap-2 hover:text-teal transition-colors">
                <Mail size={12} className="text-teal" /> care@vaidyagogate.org
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[11px] text-muted">&copy; {new Date().getFullYear()} VGMF. All rights reserved.</p>
          <p className="text-[11px] text-muted flex items-center gap-1">
            Made with <Heart size={10} className="text-maroon fill-maroon" /> by Capture Visual Studios
          </p>
        </div>
      </div>
    </footer>
  );
}
