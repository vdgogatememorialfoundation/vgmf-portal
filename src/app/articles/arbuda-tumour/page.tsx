import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function ArbudaTumourArticle() {
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
            अर्बुद (Tumour)
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
            आयुर्वेदांत उंचवटाउंच असे तीन व्याधी प्रामुख्याने वर्णन केले आहेत ते म्हणजे ग्रंथी, गुल्म व अर्बुद. या खेरीज व्रणाशोथ व विद्रधी यांचेही वर्णन आयुर्वेदांत आहे. त्यापैकी व्रणशोथ व विद्रधी हे आशुकारी स्वरुपांत प्राधान्याने सापडतात.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">अर्बुदे</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li><strong>दोषज:</strong> औषधाने बरी होणारी, वातज, पित्तज, कफज, सन्निपातिक</li>
            <li><strong>छेद्य:</strong> छेदनानी बरी होणारी, मेदार्बुद (Lipoma), अस्थ्यार्बुद (ऑस्टिओमा), जलार्बुद (हायग्रोमा)</li>
            <li><strong>निःशेष छेदनानी:</strong> बरी होणारी. उदा: पोटॅटो, पॅरॉटीड ट्यूमर</li>
            <li><strong>असाध्य:</strong> १. मांसार्बुद (Epithelial) कॅन्सर २. रक्तार्बुद (मिझेंकायमल) सार्कोमा</li>
          </ul>

          <p>
            दोषज अर्बुदे ही तत्कालीन दोष दुष्य संमूर्च्छनेतून निर्माण होतात व ती काही वेळा आपोआप (सेल्फ रिग्रेसीव्ह) बरी होतात.
          </p>

          <p>
            छेद्य अर्बुदे शरीराच्या एखाद्या भागांत धातुच्या आश्रयानी उत्सेध निर्माण होतो. ही अर्बुदे समूळ काढून टाकणे तर पुन्हा होत नाहीत. अग्नीकर्मानी बरे झालेले व्याधी पुनः होत नाहीत.
          </p>

          <p>
            असाध्य अर्बुदे - शरीराच्या धातुतील एखादी पेशी (सेल) त्याची मूळ अनुवंशिक रचना बदलते. यापेशी अपक्व, मूळपेशीपेक्षा भिन्न व त्यांच्या वाढीवर शरिराचे नियंत्रण न राहिल्याने त्याची वाढही अमर्याद असते.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">अर्बुदांची चिकित्सा</h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>दोषज अर्बुदांची चिकित्सा ग्रंथाप्रमाणे करावी.</li>
            <li>लायपोमा- मेदार्बुद, अस्थ्यार्बुद यांचे छेदन करावे.</li>
            <li>लोकली मॅलिग्नंट अर्बुदे – निःशेष छेदन, क्षारकर्म व अग्निकर्म.</li>
            <li>मांसार्बुद व रक्तार्बुदामध्ये - अ) शक्यतो काही करू नये. ब) मार्गावरोधज संप्राप्ति निर्माण झाली असल्यास दुसरा मार्ग करावा.</li>
          </ol>

          <p className="font-semibold text-navy italic">
            आयुःप्रदश्च बलवर्णकरोडातंवृष्य प्रज्ञापदः। शकल दोष गदापहारी दीप्तग्निकृत्यपि विसमान गुणस्तद वैक्रान्तकः खलुवर्णर्बल लोहकारी रसायनेषु सर्वेषु पूर्वगण्यः प्रतापलन।
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
