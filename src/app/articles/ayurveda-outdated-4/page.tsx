import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function AyurvedaOutdated4() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>

      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
            Research
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">
            आयुर्वेद आऊटडेटेड? मुळीच नाही 4
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> December 8, 2021
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> Vd. R.B. Gogate
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <h2 className="font-heading text-xl font-bold text-navy">पंचकर्म व विशेषतः रक्तमोक्षण अघोरी उपचार आहेत का?</h2>

          <p>
            शिक्षित माणसाने हे उपचार केले तर नक्कीच नाहीत. भूलतज्ञ याच्या हातून रुग्ण मरतो, शस्त्रकर्म करताना किंवा नंतरही रुग्ण करू शकतो. प्रत्येक वेळी चिकित्सा करणाऱ्यांची चुक असते असे नाही. या गोष्टी रुग्ण सापेक्ष ही असतात. रक्तमोक्षाच्या बाबतीतही असेच म्हणता येईल.
          </p>

          <p>
            रक्त पाहूनच काही लोकांना मूर्च्छा येते व त्यावर योग्य ती चिकित्सा झाली नाही तर मृत्यूही येतो. रक्तमोक्षण करीत असताना प्रमाणापेक्षा जास्त रक्तस्त्राव होऊ लागला (हेही रुग्ण सापेक्ष असते) तर रुक्मिणी आंबट खाण्याची इच्छा करतो, पंखा सुरू करावयास सांगतो, शिरा दिसेनाशा होतात. अशी लक्षणे दिसू लागताच, रक्तमोक्षण बंद करावा असे ग्रंथ सांगतो.
          </p>

          <p>
            एवढी काळजी घेऊनही रक्तस्त्राव जास्त झाला तर त्यावरची संपूर्ण चिकित्सा आयुर्वेदात लिहिली आहे. प्रथम जा सिरीयल रक्तस्त्राव अजूनही होत राहिला असेल त्या सेनेचे मुख्य बांधावे घट्ट बांधावे थंड पदार्थ लावावेत रक्ताची गुठळी काढून टाकावी व एवढे करून ते थांबले तर तप्त शाखेचा डाग द्यावा.
          </p>

          <div className="bg-gray-50 border-l-4 border-navy p-4 mt-8">
            <p className="text-sm text-muted italic">
              Please note: The article(s) were written by Dr. R. B. Gogate during 1961-2010. The fundamental relevance of these holds true even today, yet the readers/viewers should consider the timeline and the limited availability of the resources which might conflict with the recent advancements.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
