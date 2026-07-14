import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function AgnikarmaArticle() {
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
            Agnikarma
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
          <h2 className="font-heading text-xl font-bold text-navy">Introduction To Agni Karma</h2>

          <p>
            Many people have a false belief that Ayurveda is not useful in management of acute pain. They are unaware about the pain management techniques mentioned in Ayurveda.
          </p>

          <p>
            Agni karma is a superior para surgical procedure which is highly effective in relieving pain.
          </p>

          <p>
            Agni means heat &amp; karma means procedure. Agni karma is the procedure in which indirect heat by conduction method is applied over skin surface on the affected part of patient&apos;s body. According to patient&apos;s tolerance and severity of pain, different materials like suvarna shalaka (gold probe), pippali (Piper longum), gud (Jaggery) are used.
          </p>

          <p>
            Agni karma is done on specific points with all precautions to avoid injury to marma.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">Benefits of Agnikarma</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Can be used in a variety of diseases.</li>
            <li>Gives instant pain relief.</li>
            <li>Can be done using a variety of probes.</li>
            <li>Does not require a large set up.</li>
            <li>Diseases once treated by Agnikarma do not occur again.</li>
            <li>It can be successfully used even in diseases that could not be treated by using medicines, kshara and even shastrakarma.</li>
            <li>It is easy to perform.</li>
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
