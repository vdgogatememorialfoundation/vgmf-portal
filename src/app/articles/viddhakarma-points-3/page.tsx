import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function ViddhakarmaPoints3Article() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>
      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Viddhakarma</span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">Viddhakarma Points 3</h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1"><Calendar size={14} /> March 6, 2022</span>
            <span className="flex items-center gap-1"><User size={14} /> Vd. R.B. Gogate</span>
          </div>
        </header>
        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <p>
            2 precautions should be taken before doing Viddha or Rakta mokshan. First thing is check if patient gets frightened by seeing blood. If it is so, then we have to perform the procedures carefully in such a way that patient doesn&apos;t see blood. Another thing to be asked before Viddha or Agni karma check if patient went into shock after taking any injection or any prick. If such history is present, then both these procedures should be done very carefully.
          </p>

          <p>
            Amount of blood letting should not go above 250 ml. Though Ayurveda says 560 ml blood can be withdrawn but it is not accepted. We should stick to standard parameters about the blood amount accepted worldwide.
          </p>

          <p>
            There is one difference between Viddha of Ayurveda and acupuncture of Chinese medicine. In acupuncture, needle should be retained at that place, it should be removed inside – such descriptions are seen in acupuncture. But no such descriptions in Ayurveda.
          </p>

          <p>
            Now we will see where to make Viddha at different sites. First of them is Viddha for pain relief. The points are selected according to the site of pain and the severity of condition.
          </p>
        </div>
        <div className="bg-gray-50 border-l-4 border-navy p-4 mt-8">
          <p className="text-sm text-muted italic">Please note: The article(s) were written by Dr. R. B. Gogate during 1961-2010. The fundamental relevance of these holds true even today, yet the readers/viewers should consider the timeline and the limited availability of the resources which might conflict with the recent advancements.</p>
        </div>
      </article>
    </div>
  );
}
