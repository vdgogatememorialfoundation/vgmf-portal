import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function FAQsArticle() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>

      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
            General
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">
            FAQs
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> September 18, 2021
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> Vd. R.B. Gogate
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <p>
            According to Su:Sh.6/44 if sadyapranhar Marmas are damaged it could cost one&apos;s life. That is why surgery is contraindicated at those vital points. But now a days surgeries of shir, hridaya, &amp; Basti are commonly performed. Is it not contradicting sushruta samhita? Is it not necessary to redefined this kind of statements?
          </p>

          <p>
            It is true that Sadyapranhar marma isn&apos;t actually what the word &apos;Sadyaha&apos; literally means. Here the literal meaning of sadyapranhara shouldn&apos;t be considered because death may be prolonged upto 15 days depending on the severity of trauma &amp; status of oja of the patient.
          </p>

          <p>
            The marmaghata described in Ayurveda are unplanned injuries. But the planned surgery is done with all aseptic precautions, proper anaesthesia, and proper suturing. So the comparison between marmaghata and planned surgery is not appropriate.
          </p>

          <p>
            Sushruta himself has described many surgical procedures including those on vital areas. The contraindication was for unplanned injuries at those sites.
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
