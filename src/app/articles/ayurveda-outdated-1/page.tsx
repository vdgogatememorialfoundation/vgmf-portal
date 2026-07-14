import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function AyurvedaOutdated1() {
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
            आयुर्वेद आऊटडेटेड ? मुळीच नाही .1
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> November 19, 2021
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> Vd. R.B. Gogate
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <p>
            गेल्या दोन-तीन दशकांत जगभर निरनिराळ्या वैद्यक प्रणाली प्रकाशझोतात येणे हेच मुळी सध्याच्या मान्यवर वैद्यक प्रणालीमधील कमीपणा, दुर्गुण किंवा अजून बरंच काही न समजलेलं आहे हे त्याचे द्योतक आहे. चीन स्वतःच्या अशा चायनीज मेडिसिनचा स्वतःचे वैद्यक शास्त्र म्हणून पुरस्कार करते. भारताला मात्र आयुर्वेद हे भारतीय वैद्यक शास्त्र आहे हे म्हणावेसे वाटत नाही हे आमचे मोठे दुर्दैव आहे.
          </p>

          <p>
            इ.पू.2000 पर्यंत आयुर्वेद वाढला तो राजाश्रयामुळे. त्यानंतर आक्रमणे, बुद्ध धर्माचा उगम आणि ब्रिटिशांचा व्यापाराच्या दृष्टीने आलेला साम्राज्यवाद यामुळे खरंतर आयुर्वेद प्रगती करू शकला नाही.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">आयुर्वेद अपरिवर्तनीय आहे का?</h2>

          <p>
            आयुर्वेदाला सुरुवातीपासूनच परिवर्तन मान्य आहे. आयुर्वेद शास्त्रात कालानुरूप बदल होतच गेले आहेत. आयुर्वेदाने सुरुवातीच्या काळात माणसाने पाणी थोडेसे प्यावे असे ठाम सांगितले पण नंतर तोच सकाळी पाण्याचे उषःपान करावे असे सांगू लागला. चरकाचार्यांनी मज्जागत वात असाध्य सांगितला. तोच पुढे एक हजार वर्षांनी सुश्रुतांनी शस्त्रकर्म साध्य सांगितला.
          </p>

          <p>
            चरकांपर्यंत मांसार्बुद व रक्तार्बुदे (कॅन्सर ट्युमर्स) संपूर्ण काढून टाकून पुन्हा न होण्यासाठी तेथे अग्निकर्म करीत असत. सुश्रुतांनी पुढे ती असाध्यच आहेत असे लक्षात आल्यावर शस्त्रकर्मात यश इच्छिणाऱ्या वैद्याने त्यावर शस्त्रकर्म करू नये असेच सांगितले.
          </p>

          <p>
            सुश्रुताने माणसाच्या मृत शरीराचे विच्छेदन करून शरीर अवयवांचा अभ्यास करावा असं सांगितलं व त्याची पद्धतही वर्णन केली.
          </p>

          <p>
            इदम् आगम सिध्दत्वात प्रलक्ष फलदर्शनात्। मंत्रवत् संप्रवक्तव्यं मा मिमांसु कदाचन्॥
          </p>

          <p>
            ग्रंथात आम्ही उल्लेखलेली औषधे, रोग लक्षणे, रोग निदान याचा अनुभव आम्ही अनेक रुग्णांवर घेऊनच त्याची नोंद ग्रंथात केली आहे.
          </p>

          <p>
            एकं शास्त्रधीयानो न विद्याच्छास्त्र निश्चयम्। तस्मात् बहुश्रुतः शास्त्रं विजानिया च्चिकित्सकः॥ सुसू ४/६,७
          </p>

          <p>
            आयुर्वेदशास्त्र स्वतःला परिपूर्ण शास्त्र म्हणून संबोधून घेत नाही. आयुर्वेद म्हणतो आम्हाला कळलेल्या गोष्टींपेक्षा न कळलेल्या अनेक गोष्टी आहेत.
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
