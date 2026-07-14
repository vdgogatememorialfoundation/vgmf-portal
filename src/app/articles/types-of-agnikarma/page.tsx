import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function TypesOfAgnikarmaArticle() {
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
            Types of Agnikarma
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
          <h2 className="font-heading text-xl font-bold text-navy">Types of Agnikarma</h2>

          <p className="font-semibold text-navy italic">
            तत्र वलय बिंदू विलेखा प्रतिसारणानीति दहनविशेषा:। सु.सू.१२/१
          </p>

          <p>Agnikarma is of four types:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Valaya</strong> i.e. circle.</li>
            <li><strong>Bindu</strong> i.e. dot.</li>
            <li><strong>Vilekha</strong> i.e. line.</li>
            <li><strong>Pratisarana</strong> like grasta vrana.</li>
          </ul>

          <p className="font-semibold text-navy italic">
            तत्र सम्यदग्धे मधुसर्पिभ्यामभ्यंग:।सु.सू.१२/१३
          </p>

          <p>
            To stop bleeding, heat cauterisation should be used as the last resort. After Agnikarma honey and ghee should be applied.
          </p>

          <p className="font-semibold text-navy italic">
            स्नेहोपनाहाग्निकर्मबंधोन्मर्दनानि च। स्नायुसन्ध्यास्थि संप्राप्ते कुर्याद्वायवतन्द्रित:।।सु.चि.८/४
          </p>

          <p>
            A question which is very commonly asked is how many times should the Viddha or Agnikarma Chikitsa should be performed for shoola? The answer being, it can be performed repeatedly till the patient gets relief!
          </p>
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
