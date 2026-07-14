import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function OfficeProceduresShalakyatantra() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>

      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
            Shalakya Tantra
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">
            OFFICE PROCEDURES AND COST-EFFECTIVE TREATMENT IN SHALAKYATANTRA
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> September 19, 2021
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> Vd. R.B. Gogate
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <p>
            It is day to day experience, that Basic principles, especially the Triskandha Sutra stated by Ayurveda are really eternal of any branch of Ayurveda; it may be Shalya tantra, Shalakya tantra, Kayachikitsa, or Stri Rog Prasuti Tantra.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">KARNA SHULA</h2>

          <p>
            Ayurveda has advocated to instil Sesame oil drops in the Vataj Karnashula. Some time before, I translated some of the part of Hasti- Ayurveda, where I got a reference regarding a remedy for Dantashula, in which, instillation of Sesame oil in the ear of same side was advocated. I did the same experiment with some modifications in Human beings and got positive result.
          </p>

          <p className="italic text-navy">
            एकं शास्त्रमधीयानो न विद्यात् शास्त्रनिश्चयम्। तस्माद् बहुश्रुतः शास्त्रं विजानीया चिकित्सकः॥ सु.सू.४/६
          </p>

          <p>
            Ayurveda has laid down some specific criteria:
          </p>

          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Which oil is expected by Ayurveda?</strong> Ans.: Sesame oil is expected.</li>
            <li><strong>How much it should be warm?</strong> Ans.: Sesame oil is taken from a lamp for 24 hrs.</li>
            <li><strong>What is the quantity to be used?</strong> The quantity should be such that, after dipping our index finger up to 2nd knuckle in oil, whatever amounts of oil is dropped down is the dose of instillation.</li>
          </ol>

          <p>
            Another beneficial treatment in Otalgia is the Agni karma done at Apanga pradesha or the Viddhakarma at the same site.
          </p>

          <p>
            In Dentalgia, Viddha therapy has been advised at the root of tongue:
          </p>

          <p className="italic text-navy">
            जिव्हारोगेषु अधोजिव्हायां दन्तव्याधिषु च। सु.शा.८/१७
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">MANYASTAMBHA</h2>

          <p className="italic text-navy">
            मन्यास्तम्भेऽ प्येतदेव विधानं, विशेषतो वातश्लेष्महरैः नस्यैः रूक्षस्वेदैश्चोपचारेत्
          </p>

          <p>
            In प्रतिश्याय and D.N.S., internal application of Bhallataka Taila (Semicarpus anacardium) to the Nasal Septum and Lateral nasal wall is useful.
          </p>

          <p>
            Tamakashwasa alongwith Pratishyay is treated by dry Anjera (Garden fig) + Goraksha Chincha magaja powder (Adansonia digtata) daily on empty stomach very effectively.
          </p>

          <p>
            Instantly beneficial and quick-relieving medicine for Stomatitis is Deep red shoe flower (i.e. जास्वंद Hibiscus rosasinensis). Two or three flowers must be chewed, which will give instant result.
          </p>

          <p>
            Sushruta has rightly commented:
          </p>

          <p className="italic text-navy">
            सिराव्यधचिकित्सार्धं शल्यतन्त्रे प्रकीर्तितः। यथा प्रणिहितः सम्यग्बस्तिः कायचिकित्सिते। सु.शा. ८/२३
          </p>

          <p className="italic text-navy">
            स्नेहादिभिः क्रियायोगेः न तथा लेपनैरपि। यान्त्याशु व्याधयः शान्तिं यथा सम्यक सिराव्यधात्॥ सु.शा.८/२२
          </p>

          <p className="italic text-navy">
            प्रत्यक्षतो हि यद् दृष्टं च यद्भवेत्। समास्तस्त दुभयं भूयो ज्ञानवर्धनम्॥ सु.शा. ५/४८
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
