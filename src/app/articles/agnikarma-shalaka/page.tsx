import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function AgnikarmaShalakaArticle() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>

      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
            Agnikarma
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">
            Agnikarma Shalaka
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> February 3, 2022
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> Vd. R.B. Gogate
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <p>
            A probe is needed to perform the Agnikarma Chikitsa. Various conditions require use of different types of probes. The temperature of the probe too is decided depending on the type of probe and condition of disease in the patient.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">Types</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Suvarna shalaka</strong> i.e. gold probe.
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>70% gold, 30% silver and copper in traces.</li>
                <li>Dimensions: Length- 7cm, Weight- 3-4g.</li>
              </ul>
            </li>
            <li>
              <strong>Loha shalaka</strong> i.e. iron probe.
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>Dimensions: Length- 25cm.</li>
              </ul>
            </li>
            <li>
              <strong>Panchaloha shalaka</strong> i.e. probe made out of 5 metals.
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>Description: Panchaloha used are- iron, copper, silver, gold and brass.</li>
              </ul>
            </li>
            <li><strong>Jambavaushtha shalaka.</strong></li>
            <li><strong>Shara shalaka.</strong></li>
            <li><strong>Asthi.</strong></li>
            <li><strong>Godanta.</strong></li>
            <li><strong>Aja shakrut.</strong></li>
            <li><strong>Madhu.</strong></li>
            <li><strong>Guda.</strong></li>
            <li>
              <strong>Mrittika shalaka</strong> i.e. mud probe.
            </li>
            <li><strong>Sneha.</strong></li>
            <li><strong>Bhallatak</strong> i.e. Semicarpus anacardium.</li>
            <li><strong>Pippali</strong> i.e. Piper longum.</li>
            <li><strong>Halkunda.</strong></li>
          </ul>

          <h2 className="font-heading text-xl font-bold text-navy">Temperatures</h2>

          <p>
            To perform Agnikarma, the probe should be heated. The following temperatures were used by Vd. R. B. Gogate sir in his practice:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Pippali</strong>- 57°C, heated directly.</li>
            <li><strong>Halkunda</strong>- 80°C, heated directly.</li>
            <li><strong>Suvarna shalaka</strong>- 98°C-100°C, heated indirectly.</li>
            <li><strong>Loha shalaka</strong>- 228°C, heated directly.</li>
            <li><strong>Guda</strong>- 60°C, heated directly.</li>
            <li><strong>Bhallatak</strong>- 54°C, heated directly.</li>
            <li><strong>Mrittika shalaka</strong>- 80°C- 100°C, heated directly.</li>
          </ul>

          <h2 className="font-heading text-xl font-bold text-navy">Use of various shalakas</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Pippali, aja shakrut, godanta, shara shalaka can be used with respect to skin.</li>
            <li>Pippali and halkunda can be used in conditions related to yakrit and pleeha and kamala as well as skin.</li>
            <li>Panchaloha shalaka can be used in mamsa vrana.</li>
            <li>Jambavaushtha shalaka can be used in mamsa vrana.</li>
            <li>Use of guda can be seen in Avabahuk.</li>
            <li>Use of madhu, ghrita and sneha is seen in sira, snayu, asthi and sandhivrana.</li>
            <li>Use of mrittika shalaka can be seen in calcaneal spur and kurchashoola.</li>
          </ul>
        </div>

        <div className="bg-gray-50 border-l-4 border-navy p-4 mt-8">
          <p className="text-sm text-muted italic">
            Please note: The article(s) were written by Dr. R. B. Gogate during 1961-2010. The fundamental relevance of these holds true even today, yet the readers/viewers should consider the timeline and the limited availability of the resources which might conflict with the recent advancements.
          </p>
        </div>
      </article>
    </div>
  );
}
