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

          <p>
            (HIV) ची लागण एखाद्या स्त्रीला दिवस राहण्यापूर्वीच झाली असेल तर काही वेळा ते बाळ (HIV) चा संसर्ग घेऊन येते किंवा प्रसवाच्या वेळी (HIV) पीडित योनीच्या संसर्गातून लागण घेते.
          </p>

          <p>
            अशी ही संसर्ग पावलेली व्यक्ती संसर्ग झाल्यावर ८ ते १० वर्षे इतर सामन्य माणसासारखेच जीवन जगत असते. पण ती हळूहळू प्रतिकार अक्षम होत असते.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">Staging in AIDS from modern books</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>AIDS Group 1 – Acute infection:</strong> Fever, lymphadenopathy, G.I. tract symptoms.</li>
            <li><strong>AIDS Group 2 – Asymptomatic:</strong> but occasionally moderately enlarged nodes.</li>
            <li><strong>AIDS Group 3:</strong> Enlargement of all lymph glands, splenomegaly, unexplained fatigue, fever, night sweats, weight loss, diarrhoea.</li>
            <li><strong>AIDS Group 4:</strong> Constitutional persistent fever &gt; 1 month, Neurological – Dementia. Finally death due to loss of immune system.</li>
          </ul>

          <p>
            म्हणजे येथे (HIV) चा संसर्ग अणुस्वरूप असतो व त्याचेच रूपांतर पुढे एड्‍स या महाभयंकर लक्षणसमुच्चयात होते.
          </p>

          <p className="font-semibold text-navy italic">
            अणुर्ही प्रथमं भूत्वा रोगः पश्चाद्विर्धते। सजातमूलोमुष्णाति बलं आयुश्च दुर्मते ॥ ११/५८
          </p>

          <p>
            आयुर्वेदात अशा त-हेची अवस्था राजयक्ष्मा, प्रमेह, ओजक्षय यामध्ये येते.
          </p>

          <p>
            (HIV/AIDS) याचे वर्णन आयुर्वेदात आहे की नाही असा विचार करत बसण्यापेक्षा घडणा-या घटनांवरून चिकित्सा करणे हे योग्य ठरते.
          </p>

          <p className="font-semibold text-navy italic">
            एक शास्त्रंमधीयानो न विद्याच्छास्त्र निश्चयम्। तस्माद् बहुमतः शास्त्रं विजानियात् चिकित्सकः॥ सु.सू.४/७
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">AIDS &amp; Insects</h2>
          <p>
            Some blood sucking insects pick up parasites or viruses along with their blood meal. HIV was not found to replicate in any of them and therefore biological transmission of HIV by insects has been ruled out.
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
