import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function InstrumentsForAgnikarmaAndViddhakarmaArticle() {
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
            Instruments for Agnikarma and Viddhakarma
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
            The most frequently asked question about Agnikarma and Viddhakarma is about the requirements and instruments used for the procedure. Various conditions require various instruments.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">Viddhakarma</h2>

          <h3 className="font-heading text-lg font-bold text-navy">Place</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>This procedure does not require any big setup or any expensive instruments.</li>
            <li>Even an OPD room or even the patient&apos;s own house can be used to perform this procedure.</li>
          </ul>

          <h3 className="font-heading text-lg font-bold text-navy">Apparatus</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>A bed or a chair as per the patient&apos;s requirements and disease condition is needed for the patient to lay down or sit.</li>
            <li>Disposable insulin needle no:26, (as per Dr. R. B. Gogate&apos;s book). Use of no. 22 &amp; 24 is also seen.</li>
            <li>Spirited cotton swabs.</li>
            <li>Regular cotton swabs to wipe off any blood.</li>
          </ul>

          <h2 className="font-heading text-xl font-bold text-navy">Agnikarma</h2>

          <h3 className="font-heading text-lg font-bold text-navy">Place</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Agnikarma, just like Viddhakarma, does not require any large setups.</li>
            <li>It can be performed even in a room, an OPD room or even the patient&apos;s house.</li>
          </ul>

          <h3 className="font-heading text-lg font-bold text-navy">Apparatus</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>A bed or a chair for the patient to lie down or sit.</li>
            <li>A candle or anything that provides a small steady flame like spirit lamp.</li>
            <li>Agnikarma shalaka.</li>
            <li>Sneh like vaseline, ghee, etc.</li>
            <li>Digital thermometer.</li>
            <li>Foot scale, caliper, tape.</li>
            <li>Holder for probe i.e. shalaka.</li>
            <li>Match box.</li>
            <li>Band aid.</li>
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
