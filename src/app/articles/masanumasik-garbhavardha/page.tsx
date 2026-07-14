import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function MasanumasikGarbhavardha() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>

      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
            Prasuti Tantra
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">
            मासानुमासिक गर्भवाढ
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> November 12, 2021
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> Vd. R.B. Gogate
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <p>
            आयुर्वेदामध्ये स्थुलमानाने गर्भाची गर्भाशयांत मासानुमासिक होणारी वाढ अर्वाचीन शास्त्रातील क्ष- किरण, सोनोग्राफी, सीटीस्कॅन, पेशीपरिक्षण यामुळे आलेली सूक्ष्मता सोडली तर ती मिळतीजुळती आहे. स्थुलमानाने गर्भाशयांत होणारी गर्भाची वाढ अगदी इंद्रियांच्या वाढीपासून त्यावेळी सध्या सारख्या सुविधा नसतानाही कशा अचूक लिहिल्या गेल्या हा कुतुहलाचा विषय आहे.
          </p>

          <p>
            आयुर्वेदामध्ये काही गोष्टीचे ज्ञान तपस्वीच्या अतिंद्रियांनी घडत असा उल्लेख सापडतो. कदाचित त्यावेळी असे काही ऋषीमुनी असतील की त्यांना हे ज्ञान त्यांच्या सुक्ष्मेंद्रियांनी झाले असावे.
          </p>

          <p className="italic text-navy">
            &quot;इदम आगम सिध्दत्वात प्रत्यक्ष फल दर्शनात&quot;
          </p>

          <p>
            हे ग्रंथात आलेल सूत्र ही येथे विचारांत घेणे आवश्यक आहे. त्याकाळी अपघातामुळे, विषप्रयोगाने, आजारांमुळे किंवा नैसर्गिकतः गर्भस्राव / गर्भपात होत असतील. अशा या गर्भाचे गर्भस्राव/ गर्भपाताचा काळ आणि डोळ्याला दिसलेले शिर, शाखा, नेत्र, कर्णमुखादी भाग यांचा अभ्यास अनेक वैद्यांनी केला असेल व त्याची नोंद केली असेल.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">पहिला महिना</h2>

          <p>
            कलल व बुडबुड्यांचे स्वरुप. मऊ गोळ्याला 4 थ्या आठवड्यांत घनत्व येते.
          </p>

          <p className="italic text-navy">
            स तु सर्व गुणवान् गर्भत्वमापन्नः प्रथमे मासि संमूर्च्छितः। सर्वधातु कलली कृत खेटभूतो भवत्यव्यक्त विग्रहः सदसद् भूताङावयवः ॥ च.शा.
          </p>

          <p>
            शुक्र शोणिताचा संयोग होतो त्यावेळीच लिंग ठरते. शुक्राचे बाहुल्य पुरूष लिंग, आर्तव बाहुल्य स्त्री लिंग व दोन्हीही समप्रमाणांत झाली तर नपुंसक लिंग उत्पन्न होते.
          </p>

          <p>
            <strong>First Month Medical Embryology:</strong> Fertilisation, Morula (12-16 cell stage) enters the uterus, Blastocyst implant, Implantation complete, Primary yolk sac forms, Secondary yolk sac forms.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">दुसरा महिना</h2>

          <p className="italic text-navy">
            द्वितीये मासि घनः सम्पद्यते पिंडः पेश्यर्बुद वा।
          </p>

          <p>
            <strong>Second Month:</strong> 27-28 days - Caudal neuropores closing or closed; upper limb buds appear. 50-56 days - Limbs long and bent at elbow and knees; fingers and toes free.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">तिसरा महिना</h2>

          <p>
            इंद्रिये व सर्व अवयवांची उत्पत्ती.
          </p>

          <p>
            <strong>Third Month:</strong> 9th week - Upper limbs bent at elbow; fingers are distinct. 12th week - pancreas starts secreting insulin.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">चौथा महिना</h2>

          <p>
            अंगप्रत्यंग व्यक्ततर होतात व गर्भाला स्थिरत्व येते.
          </p>

          <p>
            <strong>Fourth Month:</strong> 16th week - Colourless hair develop. 16th week - Fetus swallows amniotic fluid.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">पाचवा महिना</h2>

          <p>
            गर्भ मन जाणीव युक्त होते.
          </p>

          <p>
            <strong>Fifth Month:</strong> 20th week - Horny epidermis appear. 20th week - Meconium appears in Gastro intestinal tract.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">सहावा महिना</h2>

          <p>
            बुध्दिः। केशरोमनखास्थि स्नाय्वादीनि अभिव्यक्तानि.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">सातवा महिना</h2>

          <p>
            सातव्या महिन्यांत सामन्यतः खालील स्थिती गर्भाशयांत येते. ७ व्या महिन्यांत प्रसुती झाली तर बाळ जगते.
          </p>

          <p>
            <strong>Seventh Month:</strong> 28th week - Lung alveloli expands. गर्भ प्रसुतीच्या काळापर्यंत मातेच्या उदरामध्ये डोकेवर करून असतो.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">आठवा महिना</h2>

          <p>
            आठव्या महिन्यांत ओज अस्थिर असते.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">नववा महिना</h2>

          <p>
            नवव्या महिन्यात गर्भ सर्व शरीर अवयवांनी पुष्ट होऊन प्रसवोन्मुख होतो.
          </p>

          <p>
            <strong>Ninth Month:</strong> 36th week - Colourless hair completely disappear. 36th week - Bone marrow takes the function of haematopoiesis.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">गर्भासंबंधी</h2>

          <p>
            गर्भ मल-मूत्र व वायूचे निस्सारण करीत नाही.
          </p>

          <p>
            प्रसवाच्या वेळी अपत्य बाहेर येण्याआधी येणारे पाणी पाहून त्याला गर्भोदक म्हटले गेले. हे पाणी स्वच्छ येते असे पाहून त्यावरून गर्भाचे पोषण अन्नमलावर होत नाही व म्हणून मूल मलप्रवृत्ती करीत नाही असे ठासून सांगितले.
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
