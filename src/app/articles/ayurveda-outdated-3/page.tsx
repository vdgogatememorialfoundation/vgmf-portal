import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function AyurvedaOutdated3() {
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
            आयुर्वेद आऊटडेटेड ? मुळीच नाही .3
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
          <h2 className="font-heading text-xl font-bold text-navy">आयुर्वेदात शल्यतंत्र नावालाही नाही?</h2>

          <p>
            खरं तर तसं नाही. जेव्हा आयुर्वेद लिहिला गेला चिकित्सा म्हणून त्याची योजना झाली त्यावेळची उपलब्धता संमोहन शास्त्राचा अभाव शरीररचना व शरीरक्रिया याबाबतची अपुरी माहिती त्रुटी यांचा विचार केला तर आयुर्वेद आणि खुप खुप ऑपरेशन्स वर्णन केली आहेत.
          </p>

          <p>
            मुळव्याध भगंदर परफोरेशन एक्स्त्रॅक्शन ब्लेंडर स्टोन शरीरामध्ये गेलेली अनेक प्रकारची सल्ले काढणे सर्व तऱ्हेच्या अस्थिभंगाचे चिकित्सा मोतीबिंदू व सर्व जगाने मान्य केलेली नाका वरची वरी कन्स्ट्रक्शन मेडिकल ग्राफ प्लास्टिक सर्जरी इत्यादी अनेक प्रकारची शस्त्रकर्म वर्णन केली आहेत.
          </p>

          <p>
            पोटावर आघात होऊन आतडी बाहेर आली असतील व त्यांना पूर्ण झाला असेल तर तो काळे डोळे लावून शिवावा. नोन टेबल मटेरियल व क्लीप ची संकल्पना आयुर्वेदाने प्रथम मांडली.
          </p>

          <p>
            जलोदर आतील पाणी काढताना ते नाभीच्या खाली व डाव्या बाजूस छिद्र करून काढावे. सर्जिकल ॲनाटोमी मध्ये तोच पॉईंट सांगितला आहे.
          </p>

          <p>
            बाई प्रसूती होताना मृत झाली पण बाळ पोटात जिवंत असेल तर ओटीपोटावर छेद घेऊन बाळाला बाहेर काढून वाचवावे. हे सर्व काल्पनिक आहे असे कोण म्हणेल?
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
