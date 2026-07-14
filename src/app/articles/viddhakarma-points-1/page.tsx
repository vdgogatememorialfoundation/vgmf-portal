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
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
            Viddhakarma
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">
            Viddhakarma Points 1
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> February 6, 2022
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> Vd. R.B. Gogate
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <h2 className="font-heading text-xl font-bold text-navy">VIDDHAKARMA POINTS</h2>
          
          <p>
            In practice, one question always comes in our mind: is there any treatment in Ayurveda to stop the pain immediately? No one has shown to us and we have never seen such treatment. But in my professional career of so many years I can assure you that Ayurveda has such treatment to stop the pain immediately.
          </p>

          <p>
            This treatment of pain relief is described by Sushruta in chapter of Viddha chikitsa. Of course he has described that wherever raktamokshan is not possible (Blood letting) you can go for Viddha chikitsa (To bore a hole to drain).
          </p>

          <p>
            So this Viddha chikitsa is also used in various diseases other than pain treatment. For Example:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To drain the accumulated fluid in Jatodak awastha (Ascites)</li>
            <li>To let out entrapped vaayu in circulation of blood vessels</li>
            <li>To let out pus in vidradhi (abscess)</li>
          </ul>

          <p>
            When Viddha chikitsa is used for pain relief, then different measurements are described according to site of pain. If blood vessel is clearly visible at the site described then raktamokshan is advised.
          </p>

          <p>
            But if blood vessel is not clearly visible then Viddha is advised. In such cases, the point is selected according to the severity of pain and tolerance of patient.
          </p>

          <p>
            The Viddha is performed with sterile disposable hollow needles. The depth of Viddha depends on the site and condition. Superficial Viddha is done for skin and subcutaneous tissues while deep Viddha is done for muscles and deeper structures.
          </p>

          <p>
            The number of Viddha points also varies according to the condition. Single point Viddha is done for localized pain while multiple point Viddha is done for widespread pain.
          </p>

          <p>
            After Viddha, the patient is advised to rest for some time. The pain relief is usually immediate and lasts for several hours to days depending on the condition.
          </p>

          <p>
            This treatment is very economical and doesn't require any expensive medicines or equipment. It can be performed by any trained Ayurvedic practitioner.
          </p>

          <p>
            I have been using this treatment in my practice for many years and have found it very effective. I have treated more than 5000 patients with this treatment without any complications.
          </p>

          <p>
            I expect that every Ayurvedic practitioner should learn and use this treatment. It is our duty to preserve and promote these ancient therapeutic measures.
          </p>
        </div>
      </article>
    </div>
  );
}
