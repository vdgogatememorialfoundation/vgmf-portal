import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function SangyaharanAyurvedicConceptArticle() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>

      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
            Shalya Tantra
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">
            SANGYAHARAN- AN AYURVEDIC CONCEPT
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
          <p className="font-semibold text-navy">
            By Dr.R.B.Gogate, G.F.A.M., A.V.P. (Shalya-Shalakya)
          </p>

          <p>
            Many detailed surgical procedures are read in Ayurveda but not much information about anaesthetics drugs is offered by available Samhita editing for Surgical procedures on piles, fissure or kidney stones. The patient was either tied up with ropes to operation table or held tightly by assistants.
          </p>

          <p>
            In Mutravrudhi or Dakodara patient needs to be incised and bled. Indicated Snehan and Swedan lessen the pain in such procedures.
          </p>

          <p>
            The concept of Sangyaharan (anaesthesia) in Ayurveda is not well documented but the principles of pain management through Snehan, Swedan, and certain herbal preparations were practiced.
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
