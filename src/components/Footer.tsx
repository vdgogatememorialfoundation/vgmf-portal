import Link from "next/link";
import { MapPin, Phone, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f3f1ec] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#0d6662] rounded-lg flex items-center justify-center text-white font-heading font-extrabold text-xs">VG</div>
              <div>
                <h3 className="font-heading text-[#1a1a2e] font-extrabold text-sm leading-none">VGMF</h3>
                <p className="text-[8px] text-[#7c7c8a] tracking-wider uppercase">Est. 1972</p>
              </div>
            </div>
            <p className="text-xs text-[#7c7c8a] leading-relaxed">Preserving Ayurvedic heritage through research, education, and community service. Committed to advancing traditional knowledge with modern evidence-based practices.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading text-xs font-extrabold text-[#1a1a2e] mb-4 uppercase tracking-wider">Quick Links</h4>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
              {["Home", "About", "Fellowship", "Seminar", "Autism", "Shop", "Articles", "Contact"].map(l => (
                <Link key={l} href={l === "Home" ? "/" : `/${l.toLowerCase()}`} className="text-xs text-[#7c7c8a] hover:text-[#0d6662] transition-colors py-0.5">{l}</Link>
              ))}
            </div>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="font-heading text-xs font-extrabold text-[#1a1a2e] mb-4 uppercase tracking-wider">Programmes</h4>
            <div className="space-y-1.5">
              {["Research Fellowship", "National Seminar", "Autism Programme"].map(l => (
                <Link key={l} href={`/${l.split(" ")[0].toLowerCase()}`} className="block text-xs text-[#7c7c8a] hover:text-[#0d6662] transition-colors">{l}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xs font-extrabold text-[#1a1a2e] mb-4 uppercase tracking-wider">Contact</h4>
            <div className="space-y-2.5 text-xs text-[#7c7c8a]">
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
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 pt-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[11px] text-[#7c7c8a]">&copy; {new Date().getFullYear()} Vaidya Gogate Memorial Foundation. All rights reserved.</p>
          <p className="text-[11px] text-[#7c7c8a] flex items-center gap-1">
            Made with <Heart size={10} className="text-[#7c1d1d] fill-[#7c1d1d]" /> by Capture Visual Studios
          </p>
        </div>
      </div>
    </footer>
  );
}
