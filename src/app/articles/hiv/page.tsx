import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function HIVArticle() {
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
            HIV
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> September 18, 2021
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> Vd. R.B. Gogate
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <p>
            आता जो जनपदोध्वंस होऊ घातला आहे तो एड्‍सचा! खरं म्हणजे हा दोन पाय-यातून जाणारा जनपदोध्वंस आहे. HIV विषाणूने दूषित झालेल्या असंख्य प्रत्यक्ष एड्‍सच्या लक्षणांनी मृत्यूला कवटाळणा-या असंख्य लोकांचा.
          </p>

          <p>
            HIV- Human Immunodeficiency Virus याचा माणसात काय कारणांनी प्रथम प्रवेश झाला याची चर्चा यापूर्वी आलीच आहे. पण (HIV) विषाणूचा संसर्ग ज्या माणसास किंवा स्रीस झाला आहे ती व्यक्ती यांचा फैलाव – जननेंद्रियामार्फत, गुदामार्फत दुस-या व्यक्तीस करते; किंवा (HIV) पीडित माणसाच्या रक्ताचा संपर्क – ज्याला संसर्ग झालेला नाही अशा माणसाला इंजेक्शनद्वारे, जखमांद्वारे अथवा रक्तदानातून झाला तर त्यासही हा रोग होतो.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">Staging in AIDS</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>AIDS Group 1 – Acute infection:</strong> Fever, lymphadenopathy, G.I. tract symptoms (Abdominal pain, loose motions) rash on the skin, jaundice, aseptic meningitis or meningo encephalitis. Muscle skeletal complications. (Illness self limiting).</li>
            <li><strong>AIDS Group 2 – Asymptomatic:</strong> but occasionally moderately enlarged nodes in axilla. Anaemia, Leucopenia, Thrombocytopenia.</li>
            <li><strong>AIDS Group 3:</strong> Enlargement of all lymph glands, splenomegaly, unexplained fatigue, fever, night sweats, weight loss, diarrhoea.</li>
            <li><strong>AIDS Group 4:</strong> Constitutional persistent fever &gt; 1 month, Neurological – Dementia. Change in behavioural, cognitive and motor functions. Myelopathy – Subacute combined degeneration peripheral neuropathy. Sensory type, Acute/chronic meningitis, Cerebral haemorrhage, secondary infection. Finally death due to loss of immune system.</li>
          </ul>

          <h2 className="font-heading text-xl font-bold text-navy">Ayurvedic Perspective</h2>
          <p>
            म्हणजे येथे (HIV) चा संसर्ग अणुस्वरूप असतो व त्याचेच रूपांतर पुढे एड्‍स या महाभयंकर लक्षणसमुच्चयात होते.
          </p>

          <p className="font-semibold text-navy italic">
            अणुर्ही प्रथमं भूत्वा रोगः पश्चाद्विर्धते । सजातमूलोमुष्णाति बलं आयुश्च दुर्मते ॥ ११/५८
          </p>

          <p>
            आयुर्वेदात अशा त-हेची अवस्था राजयक्ष्मा, प्रमेह, ओजक्षय यामध्ये येते असे त्या त्या व्याधींची वर्णने पहिल्यानंतर दिसते. (HIV/AIDS) याचे वर्णन आयुर्वेदात आहे की नाही असा विचार करत बसण्यापेक्षा घडणा-या घटनांवरून चिकित्सा करणे हे योग्य ठरते- कर्मावरून- शरीरात कोणते द्रव्य गेले असले पाहिजे आणि त्याने कसे कसे उपद्रव्याप केले असले पाहिजेत याचे अनुमान करता येते. व त्याप्रमाणे आयुर्वेदातील तत्त्वांच्या चिकित्सा आधारे चिकित्सा करता येते.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">Treatment Approach</h2>
          <p>
            येथे चिकित्सा करत असताना शोष, राजयक्ष्मा, उपदंश व प्रमेह व्याधी त्याची लक्षणे चिकित्सा व शरीरावर होणारे परिणाम यांचा विचार करून (HIV) चे उपचार, औषधीद्रव्य व आहारविहार पथ्यापथ्यादि योजले आहेत.
          </p>

          <p>
            वरील व्याधी ओजक्षयाला कारणीभूत होतात म्हणून येथे ओजक्षयाचा विचार आणि कारणेही विचारात घेतली आहेत. प्रत्येक रोगास नाव देताच येते असे नाही. प्रत्येक लक्षण हा सुध्दा रोग असू शकतो. अगदी असाध्य अशा व्याधींमध्ये सुध्दा जोपर्यंत नाकासमोर धरलेले सूत हालते आहे तोपर्यंत चिकित्सा करावी असे आयुर्वेद सांगतो.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">Importance of Multi-disciplinary Knowledge</h2>
          <p className="font-semibold text-navy italic">
            एक शास्त्रंमधीयानो न विद्याच्छास्त्र निश्चयम्। तस्माद् बहुमतः शास्त्रं विजानियात् चिकित्सकः ॥ सु.सू.४/७
          </p>

          <p>
            सध्या चक्षुरिरेंद्रियाची व्याप्ती: microscope, ultramicroscope, CT scan, angiography, scopy यांनी वाढली आहे. कर्णेंद्रियाची व्याप्ती (Stethoscope) वगैरेंनी वाढली आहे. ती अतींद्रियच आहेत. त्याचा वापर आपण करणारच आहोत.
          </p>

          <p>
            ऋषिमुनींना जंतू, कृमी, राक्षस हे ज्ञात होते. काही कृमी हे अतिशय बारीक असल्यामुळे डोळ्यांना दिसत नाही.
          </p>

          <p className="font-semibold text-navy italic">
            "केचित् सूक्ष्मः अदर्शनः" या सूत्राने सांगितले आहे.
          </p>

          <p>
            आता ते कृमी ज्ञात झाले. एड्‍स निर्माण करणा-या (HIV) विषाणूचे ज्ञान झाले. पुढे उत्पन्न होणा-या घटनांवरून – लक्षणांवरून त्यांचे कर्तृत्व समजले. म्हणजेच एड्‍सचे पूर्वरूप HIV विषाणूंचे शरीरातील वास्तव्य हेच समजायचे नाही का?
          </p>

          <p>
            आणि म्हणूनच (HIV) ची शरीरातील चाहूल लागताच त्यावर चिकित्सा करणे आयुर्वेदाच्या दृष्टीने महत्त्वाचे ठरते.
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
