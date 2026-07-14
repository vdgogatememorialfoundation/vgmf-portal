import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function RaktamokshanArticle() {
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
            Raktamokshan
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
          <h2 className="font-heading text-xl font-bold text-navy">Introduction to Raktamokshana</h2>

          <p>
            Sira Vyadh is a broad term used for removal of blood. It could be of any type e.g. Venesection, horn, Gourd, leech or scarification (or even a prick).
          </p>

          <p className="font-semibold text-navy italic">
            सिराविषाणतुम्बैस्तु जलौकाभि: पदस्तथा। अवगाढं यथापूर्वं निर्हरेत् दुष्टशोणितम्॥ सु.शा. 8/25
          </p>

          <p>
            The principle of Siravyadha procedure is to remove vitiated blood.
          </p>

          <p>
            In Siravyadha Vidhi Adhyaya, Acharya Sushruta has used the word &apos;Vyadha&apos;. It means to bore a hole to drain, to let out entrapped Vayu, to let out entrapped circulation in blood vessels, to let out fluid in jatodaka and mutra vriddhi, to let out pus in Vidradhi. If the blood vessel is big, blood can be removed; but if it is not visible, it is to be pricked by needle till the prick bleeds or may not bleed.
          </p>

          <p className="font-semibold text-navy italic">
            जिव्हामूले व्यधेत्। नासाग्रे व्यधेत्।
          </p>

          <p>
            Sira carries all the doshas (i.e. Vata, pitta, kapha) along with rakta. Vitiated Vayu moving in Sira produces different Vata Vyadhi.
          </p>

          <p>
            Blood vitiated by vata, pitta, kapha should be removed from body using shrunga (Horn of animals) Jalouka (leech therapy) alabu (pitcher gourd) respectively.
          </p>

          <p>
            In indicated conditions, correctly performed Raktamokshana results in relieving pain, reduction in severity and produces a sensation of well-being. Interpretation for these results is as follows:
          </p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>This is probably due to removal of obstruction in blood vessels and establishment of circulation.</li>
            <li>It reduces the load of pathogens circulating in blood.</li>
            <li>It lets out Vata.</li>
          </ol>

          <p>
            Raktamokshana if performed after proper diagnosis and evaluation gives instant results compared to conservative treatment. If there is no relief in pain by snehana and swedana, Raktamokshana should be carried out followed by Agnikarma.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">Benefits of Raktamokshana</h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>Raktamokshana (blood letting) is effective blood purification therapy.</li>
            <li>It is to be performed on people who are prone to Rakta pradoshaj vyadhi.</li>
            <li>In sushruta samhita, Raktamokshana is considered as partial or complete treatment.</li>
            <li>Raktamokshana is curative as well as preventive therapy.</li>
            <li>Unlike other Panchakarma procedures, not much man power is required.</li>
            <li>Raktamokshana is economical and cost effective.</li>
            <li>In a healthy person, blood letting in sharada rutu (autumn) as stated in rutucharya, is not a contradiction. Especially for those who are prone to raktapradoshaja vyadhi.</li>
            <li>Blood letting of individuals used for blood donation in selected donors. Approximately 250 ml blood letting done for blood donation.</li>
          </ol>
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
