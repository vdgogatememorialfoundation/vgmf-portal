import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f3f1ec] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-[#0d6662] rounded-lg flex items-center justify-center text-white font-heading font-extrabold text-sm">VG</div>
              <div>
                <h3 className="font-heading text-[#1a1a2e] font-extrabold text-base leading-none">VGMF</h3>
                <p className="text-[9px] text-[#7c7c8a] tracking-wider uppercase">Est. 1972</p>
              </div>
            </div>
            <p className="text-xs text-[#7c7c8a] leading-relaxed">
              Preserving Ayurvedic heritage through research, education, and community service. Committed to advancing traditional knowledge with modern evidence-based practices.
            </p>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="font-heading text-xs font-extrabold text-[#1a1a2e] mb-4 uppercase tracking-wider">Programmes</h4>
            <div className="space-y-2">
              <Link href="/fellowship" className="block text-xs text-[#7c7c8a] hover:text-[#0d6662] transition-colors">Research Fellowship</Link>
              <Link href="/seminar" className="block text-xs text-[#7c7c8a] hover:text-[#0d6662] transition-colors">National Seminar</Link>
              <Link href="/autism" className="block text-xs text-[#7c7c8a] hover:text-[#0d6662] transition-colors">Autism Programme</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xs font-extrabold text-[#1a1a2e] mb-4 uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/verify" className="block text-xs text-[#7c7c8a] hover:text-[#0d6662] transition-colors">Verify Certificate</Link>
              <Link href="/fellowship/track" className="block text-xs text-[#7c7c8a] hover:text-[#0d6662] transition-colors">Track Application</Link>
              <Link href="/dashboard" className="block text-xs text-[#7c7c8a] hover:text-[#0d6662] transition-colors">My Registrations</Link>
              <div className="pt-1">
                <span className="block text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider mb-1">Resources</span>
                <Link href="/articles" className="block text-xs text-[#7c7c8a] hover:text-[#0d6662] transition-colors pl-2 border-l border-slate-300">Articles</Link>
                <Link href="/events-gallery" className="block text-xs text-[#7c7c8a] hover:text-[#0d6662] transition-colors pl-2 border-l border-slate-300 mt-1">Events Gallery</Link>
              </div>
              <Link href="/about" className="block text-xs text-[#7c7c8a] hover:text-[#0d6662] transition-colors">About Us</Link>
              <Link href="/contact" className="block text-xs text-[#7c7c8a] hover:text-[#0d6662] transition-colors">Contact</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xs font-extrabold text-[#1a1a2e] mb-4 uppercase tracking-wider">Contact</h4>
            <div className="space-y-3 text-xs text-[#7c7c8a]">
              <a href="https://maps.google.com/?q=102+Ramprasad+Chambers+Pune+411002" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-[#0d6662] transition-colors">
                <MapPin size={12} className="mt-0.5 shrink-0 text-[#0d6662]" />
                <span>102, Ramprasad Chambers, Pune 411002</span>
              </a>
              <a href="tel:+919373792952" className="flex items-center gap-2 hover:text-[#0d6662] transition-colors">
                <Phone size={12} className="text-[#0d6662]" /> +91 93737 92952
              </a>
              <a href="mailto:care@vaidyagogate.org" className="flex items-center gap-2 hover:text-[#0d6662] transition-colors">
                <Mail size={12} className="text-[#0d6662]" /> care@vaidyagogate.org
              </a>
              <p className="flex items-start gap-2">
                <MapPin size={12} className="mt-0.5 shrink-0 text-[#0d6662]" /> Pune, Maharashtra
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 pt-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[11px] text-[#7c7c8a]">&copy; {new Date().getFullYear()} Vaidya Gogate Memorial Foundation. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px] text-[#7c7c8a]">
            <Link href="/articles" className="hover:text-[#0d6662] transition-colors">Articles</Link>
            <Link href="/events-gallery" className="hover:text-[#0d6662] transition-colors">Events Gallery</Link>
            <Link href="/shop" className="hover:text-[#0d6662] transition-colors">Shop</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
