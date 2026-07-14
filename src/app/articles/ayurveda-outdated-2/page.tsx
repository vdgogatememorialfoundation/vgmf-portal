import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function AyurvedaOutdated2() {
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
            आयुर्वेद आऊटडेटेड ? मुळीच नाही .2
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> November 26, 2021
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> Vd. R.B. Gogate
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <h2 className="font-heading text-xl font-bold text-navy">आयुर्वेदातील पायाभूत कल्पना चुकीच्या आहेत का?</h2>

          <p>
            चार हजार वर्षापूर्वीच्या ज्ञानाचा विचार केला तर तसे वाटण्याचे मुळीच कारण नाही कारण काहीतरी गृहीत धरूनच पुढे जावे लागते. आयुर्वेदाची सुरुवात फुलातून सूक्ष्मात आहे असं म्हणलं तर चूक होणार नाही. ब्रह्मांडात आहे तेच प्राण्यांमध्ये आहे तेच वनस्पतीत आहे हे निरीक्षणाच्या आधारे गृहीत धरून आयुर्वेदाने पुढची वाटचाल केली.
          </p>

          <p>
            दही लागल्यावर ते भांड्याला घट्ट चिकटून असते त्याला हलवले नाही तर ते जागचे हलत नाही पण त्यात नुसता समस्या खूपसा त्याला लगेच पाणी सुटेल. याचा अर्थच असा की दह्याचा मूळ स्वभाव विघटनाचा आहे.
          </p>

          <p>
            गावरान ज्वारी हायब्रीड ज्वारी. दोघांच्या निर्मितीचा काळ सुमारे अनुक्रमे चार व तीन महिन्यांचा. हायब्रीड ज्वारी चे उत्पन्न भरपूर असते पण ती चवीला चांगली नसते ती लवकर खराब होते. याच्या उलट आवळा फळ. निर्मितीला वेळ लागतो आधार लागत नाही. महिना-महिना रंग न बदलता तसाच राहतो.
          </p>

          <p>
            सृष्टी निरीक्षण-औषधी द्रव्यांच्या बाबतीतही त्या वनस्पतीची स्वाभाविक प्रवृत्ती प्राण्याचा रोग झाल्यावर व रोग नसताना विशिष्ट वनस्पती खाण्याकडे कल त्यांचे त्यांच्या वर होणारे परिणाम याचा सतत अभ्यास झाला. बरेच पक्षी आपल्याच सूचीतून झाडांचे फुलांचे फळांचे रस घेतात व आपल्या गुदद्वारात घालतात व रोगमुक्त होतात. यावरून एनिमाची व औषधे गुदावाटे देण्याची कल्पना आली.
          </p>

          <p>
            हत्ती निसर्ग तहास शिंगाडे कमल कंद बिया खूप खातात. हत्ती आयुर्वेदा हे पदार्थ हत्ती मध्ये वृष्यता दाखवितात. शिंगाडा पाण्यात असतो त्याचा आतला गर पाण्यात असूनही कुजत नाही. हीच कल्पना बाळ पोटात असते ते पाण्यात असते त्याचा नाश होऊ न देण्यासाठी शिंगाडा हा पदार्थ गर्भ संस्थापक म्हणून आयुर्वेदात आला.
          </p>

          <p>
            दूर्वा कितीही नाहीशा करण्याचा प्रयत्न केला ताक शिंपडणे सोडून तर त्या नाश पावत नाही. ज्या रुग्णांमध्ये वार सुटण्याच्या मुळे गर्भपात होण्याची प्रवृत्ती असते त्या ठिकाणी गर्भ स्थापक म्हणून आयुर्वेदाने दुर्वांचा वापर सांगितला.
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
