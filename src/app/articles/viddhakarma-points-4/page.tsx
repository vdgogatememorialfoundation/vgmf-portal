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
            In Apachi (Cervical lymphadenitis) above wrist joint 3 lines are said to be drawn by heated Shalaka with distance of 1 anguli (2cm) between them. Agni karma is suggested to perform at the base of the thumb (anatomical snuff box). This Agni karma is specifically done in jaundice and for this Agni karma turmeric is used after heating it. In this Agni karma, dushtavrana is expected. This treatment is done on upadhatu of Rakta Dhatu i.e. sira (vessel) and kandara (tendons). Treatment on upadhatu is mentioned first time in this Agni karma.
          </p>

          <p>
            Agni karma is done at painful points we can do it at any painful point. Only consider that this is not &lsquo;marma&rsquo; (vital) point. While performing Viddha or Agni karma, we need to fix the points. Many times anguli praman is described to fix the points. Sometimes marma points are also described to fix points of Agni karma and Viddha. Hence knowledge of marma points is very important before performing these procedures. Anguli praman is considered to be most important measure to fix points. In Chinese medicines acupressure and moxibustion also anguli praman is stated.
          </p>

          <p>
            Description of anguli praman by Ayurveda and Chinese medicines is almost similar. Generally, distance at 1st interphalangeal joint of index finger is considered as &lsquo;anguli praman&rsquo; or distance between joined four fingers is said to be &lsquo;four angulis&rsquo;. This distance divided by four or two is considered to be 1 anguli or 2 anguli. This distance is to be measured according to patient&rsquo;s fingers. These distance criteria are now fixed for that patient. This distance is measured in centimetres and then used in Viddha or Agni karma for fixation of point. For example: 4 anguli above ankle joint, 2 anguli below Indrabasti marma, 2 anguli below Vidhur marma, Etc.
          </p>
        </div>
        <div className="bg-gray-50 border-l-4 border-navy p-4 mt-8">
          <p className="text-sm text-muted italic">Please note: The article(s) were written by Dr. R. B. Gogate during 1961-2010. The fundamental relevance of these holds true even today, yet the readers/viewers should consider the timeline and the limited availability of the resources which might conflict with the recent advancements.</p>
        </div>
      </article>
    </div>
  );
}
