import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">Vaidya Gogate Memorial Foundation</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Preserving ancient Ayurvedic wisdom through research, education, and community service since 1972.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"><Youtube size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-lg font-bold mb-4 text-gold">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {["Home","About","Fellowship","Seminar","Autism","Shop","Articles","Contact"].map(l => (
                <Link key={l} href={l === "Home" ? "/" : `/${l.toLowerCase()}`} className="text-sm text-white/70 hover:text-gold transition-colors py-1">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading text-lg font-bold mb-4 text-gold">Contact Us</h4>
            <div className="space-y-3 text-sm text-white/70">
              <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-gold" /> 102, Ramprasad Chambers, 368/1, Jawaharlal Nehru Rd, near Kirad Hospital, above Shraddha Medicals, New Nana Peth, Pune, Maharashtra 411002</p>
              <p className="flex items-center gap-2"><Phone size={16} className="text-gold" /> +91 93737 92952</p>
              <p className="flex items-center gap-2"><Mail size={16} className="text-gold" /> care@vaidyagogate.org</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-white/50">
          <p>© {new Date().getFullYear()} Vaidya Gogate Memorial Foundation. All rights reserved.</p>
          <p>Developed by <a href="https://capturevisualstudios.com" target="_blank" className="text-gold hover:underline">Capture Visual Studios</a></p>
        </div>
      </div>
    </footer>
  );
}
