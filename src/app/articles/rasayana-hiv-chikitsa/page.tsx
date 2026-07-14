import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function RasayanaHivChikitsa() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>

      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
            Kayachikitsa
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">
            रसायन व (HIV) पीडित रुग्णांसाठी चिकित्सा
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
            रसायन- शरीराचे बल वाढविणे, शरीरात होणारा पेशींचा क्षय थांबविणे, नवीन पेशींची उत्पत्ती करणे, आयुष्य वाढविणे, रोगानंतर आलेली दुर्बलता नाहीशी करणे हे रसायनाचे काम आहे.
          </p>

          <p>
            रसायन विधी दोन प्रकारचा असतो- १) कुटिप्रावेशिक २) वातातपिक. यातील वातातपिक हे व्यवहारामध्ये करण्यासारखे आहे.
          </p>

          <p className="italic text-navy">
            जराव्याधिनाशकमौषधम्। स्वस्थस्यौजस्कर यत्तु तदवृष्यं तद्रसायनम्॥ च.वि. ३/१४
          </p>

          <p className="italic text-navy">
            दीर्घमायुस्मृतिर्मेधा आरोग्यं, तरुणं वयः प्रभावर्ण स्वरोदार्य परं देहेन्द्रिय बल वाक्सिध्दि प्रणतिः कान्तिश्च। च.चि. १८
          </p>

          <p>
            HIV विषाणूने शरीरात प्रवेश केल्यानंतर आतापर्यंतच्या अनुभवावरून ७ ते ८ वर्षांचा काल आहे, की ज्यात व्याधी प्रतिकारशक्ती कमी झाल्यामुळे उत्पन्न होणारी राजयक्ष्माची लक्षणे नाहीत पण ती पुढे होणार आहेत.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">विरेचन</h2>

          <p>
            आमलकी (Emblica officinalis). मात्रा २ ते ४ ग्रॅम कोष्ठाप्रमाणे पहाटे/ सायंकाळी वाताच्या अनुलोमकाली देणे रास्त असते.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">रक्तमोक्षण (Blood Letting)</h2>

          <p>
            रक्तवह स्रोतोदुष्टी लक्षणातील ही महत्त्वाची शोधन चिकित्सा. रुग्णाचे बल पाहून सुरवातीलाच ६० ते १०० मिली. रक्तमोक्षण दर १५ दिवसांनी केला.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">रसायन- ओजस्कर चिकित्सा</h2>

          <p>
            <strong>गुडुची सत्त्व (Tinospora cordifolia)</strong> - मात्रा ५०० मिग्रॅ – दिवसातून ३ वेळा – अनुपान जल.
          </p>

          <p className="italic text-navy">
            वातहरं दीपनीयं श्लेष्मशोणित विबंध प्रशमनानाम्। च.सू.२५
          </p>

          <p>
            <strong>शतावरी (Asparagus racemosus)</strong> - मात्रा २ ग्रॅम- दिवसातून २ वेळा- अनुपान दूध.
          </p>

          <p>
            <strong>भुईकोहळा (Pueraria tuberosa)</strong> - मात्रा २ ग्रॅम- दिवसातून २ वेळा- अनुपान दूध.
          </p>

          <p>
            <strong>पिंपळी (Piper longum)</strong> – वर्धमान रसायन- रुग्णप्रकृती ऋतुकालाचा विचार करून १ ते ३, १ ते ७, १ ते १५.
          </p>

          <p>
            <strong>अभ्रक (भस्म)</strong> – धातुविवर्धन, आयुष्य वाढविणारे, रक्तदुष्टी घालविणारे.
          </p>

          <p className="italic text-navy">
            मृत्योर्भीति हरति सततम् सेवमानं मृताश्रम्।
          </p>

          <p>
            <strong>वंगभस्म (Tin)</strong> - १००- १५०- दिवसातून २ वेळा- अनुपान दूध किंवा जल.
          </p>

          <p>
            <strong>मकरध्वज वटी</strong> - मात्रा १२५ ग्रॅम – दिवसातून १ वेळा- अनुपान दूध.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">एड्‍सच्या रुग्णांची चिकित्सा</h2>

          <p>
            हा रुग्ण एकादश राजयक्ष्मा, शोष यांची जवळ जवळ सर्वच लक्षणे अवस्था संपवून क्षयावस्थेप्रत ज्यावेळी गेलेला असतो.
          </p>

          <p className="italic text-navy">
            यावत् कंठगतः प्राणस्तावत् कार्या प्रतिक्रिया। कदाचित् दैवयोगेन दृष्टारिष्टोपि जीवत ॥ भैषज्य रत्नावली
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
