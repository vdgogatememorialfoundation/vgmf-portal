import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function ViddhakarmaPoints4Article() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>
      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Viddhakarma</span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">Viddhakarma Points 4</h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1"><Calendar size={14} /> April 16, 2022</span>
            <span className="flex items-center gap-1"><User size={14} /> Vd. R.B. Gogate</span>
          </div>
        </header>
        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <p>
            There is confusion regarding position of penis. Whether it should be erected or not. If modern science is considered, the position of penis is more suitable for Viddha. Specifically, in leukaemia patients, there is symptom of priapism. In such cases, Rakta Mokshan is advised on upper part by taking marking incisions.
          </p>

          <p>
            In calcaneal spur, mud probe (Mrittika Shalaka) is used for Agni karma. In calcaneal spur, Agni karma is performed at the point with severe pain. This Shalaka should be blunt and not pointed. When this Shalaka is heated on candle light, then small paper is kept on Agni karma point because carbon formed by candle light flame can cause wound at Agni karma point. Also if these carbon particles are not removed completely then there are chances of cancer at that point. Hence this precaution of keeping paper is must when candle is used for heating the Shalaka. But when stove or gas is used for heating then this precaution is not needed.
          </p>

          <p>
            In Apachi (Cervical lymphadenitis), Viddha is done at the swollen lymph nodes. The procedure helps in draining the accumulated fluid and reduces the swelling. Multiple Viddha points may be required depending on the size and number of lymph nodes affected.
          </p>
        </div>
        <div className="bg-gray-50 border-l-4 border-navy p-4 mt-8">
          <p className="text-sm text-muted italic">Please note: The article(s) were written by Dr. R. B. Gogate during 1961-2010. The fundamental relevance of these holds true even today, yet the readers/viewers should consider the timeline and the limited availability of the resources which might conflict with the recent advancements.</p>
        </div>
      </article>
    </div>
  );
}
