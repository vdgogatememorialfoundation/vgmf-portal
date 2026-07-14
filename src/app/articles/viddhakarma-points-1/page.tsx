import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function ViddhakarmaPoints1Article() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>
      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Viddhakarma</span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">Viddhakarma Points 1</h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1"><Calendar size={14} /> February 6, 2022</span>
            <span className="flex items-center gap-1"><User size={14} /> Vd. R.B. Gogate</span>
          </div>
        </header>
        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <p>
            In practice, one question always comes in our mind is, is there any treatment in Ayurveda to stop the pain immediately. No one has shown to us and we have never seen such treatment. But in my professional career of so many years I can assure you that Ayurveda has such treatment to stop the pain immediately.
          </p>

          <p>
            This treatment of pain relief is described by Sushruta in chapter of Viddha chikitsa. Of course he has described that wherever raktamokshan is not possible (Blood letting) you can go for Viddha chikitsa (To bore a hole to drain).
          </p>

          <p>
            So this Viddha chikitsa is also used in various diseases other than pain treatment, For Example: to drain the accumulated fluid in Jatodak awastha (Ascites), to let out entrapped vaayu in circulation of blood vessels, to let out pus in vidradhi (abscess).
          </p>

          <p>
            When Viddha chikitsa is used for pain relief, then different measurements are described according to site of pain. If blood vessel is clearly visible at the site described then raktamokshan is advised. But if blood vessel is not clearly visible then Viddha is advised. In such cases, the point is selected according to the severity of pain and tolerance of patient.
          </p>

          <p>
            The Viddha is performed with sterile disposable hollow needles. The depth of Viddha depends on the site and condition. Superficial Viddha is done for skin and subcutaneous tissues while deep Viddha is done for muscles and deeper structures.
          </p>
        </div>
        <div className="bg-gray-50 border-l-4 border-navy p-4 mt-8">
          <p className="text-sm text-muted italic">Please note: The article(s) were written by Dr. R. B. Gogate during 1961-2010. The fundamental relevance of these holds true even today, yet the readers/viewers should consider the timeline and the limited availability of the resources which might conflict with the recent advancements.</p>
        </div>
      </article>
    </div>
  );
}
