import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function AyurvedaOutdated5() {
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
            आयुर्वेद आऊटडेटेड ? मुळीच नाही .5
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
          <h2 className="font-heading text-xl font-bold text-navy">हेवी मेटल्स व आयुर्वेद</h2>

          <p>
            कालानुरूप चिकित्सेच्या उपक्रमात बदल होत असतात हे मी मागेच सांगितले आहे. मेटल्स, रत्ने, माणके ही आयुर्वेद शास्त्रात रसशास्त्र या शाखेमध्ये नंतर आली. ही औषधी खालील कारणांमुळे व्यवहारात आली. काढे, चूर्णांपेक्षा ती घेण्यास सोपी, चवीला बरी, मात्रा थोडी, खराब होण्याकडे प्रवृत्ती नाही, उपलब्धता मुबलक व आयडेंटिफिकेशनला अडचण नसलेली आहेत. पण ती वापरताना त्याची शुद्धी डिटॉक्सिफिकेशन अतिशय महत्त्वाचे.
          </p>

          <p>
            आयुर्वेदाला ठाऊक होते की ही मेटल शरीरात तशीच म्हणजे अशुद्ध स्वरूपात गेली तर मानवाला धोका पोहोचू शकतो. ती मानवी शरीरात अशुद्ध स्वरूपात गेली तर काय काय लक्षणे निर्माण होतात हेही स्पष्टपणे लिहून ठेवले आहे. थोडक्यात त्याची टॉक्सिसिटी लिहिली आहे. आपण एक दोन उदाहरणे पाहू.
          </p>

          <p>
            अशुद्ध पारा पोटात गेला तर त्वचेचे रोग, भूक नाहीशी होणे, अंगाची आग होणे, अन्नाला चव न लागणे व मरणही संभवते. थोडक्यात तो प्रथम व्हॅस्क्युलर सिस्टिम वर टॉक्सिसिटी दाखवतो, यकृताला बिघडवतो.
          </p>

          <p>
            अशुद्ध तांबे; भ्रम, मूर्च्छा, घामाचे प्रमाण वाढणे, ओकारी, चव न लागणे, सर्वांग दाह व चिडचिडेपणा निर्माण करतो. येथेही त्याचा परिणाम व्हॅस्क्युलर (यात यकृत आलेच) मस्तुलुंग व मूत्र संस्थेवर परिणाम झालेला दिसतो.
          </p>

          <p>
            असे असतानाही आपण यांचे प्रयोग उंदरांवर, सशांवर करतो. या प्राण्यांमध्ये ओकारी, अन्न न खाणे, घाम येणे, चिडचिडेपणा ही लक्षणे व्यक्त स्वरूपात दिसतील. पण हे न बोलणारे प्राणी भ्रम, अंगाची आग, अन्नाला चव न लागणे ही लक्षणे कशी व्यक्त करणार? ही सर्व लक्षणे टॉक्सिसिटी सुरू होताच दिसू लागतात. आपण नंतर हे प्राणी कापून त्यांचे परिणाम मूत्रपिंड, यकृत, वृक्क, बोनमॅरो, ब्रेन वगैरे वर काय झाले आहे हे पाहतो. आयुर्वेदाने अनुमानाने लक्षणांवरून कोणत्या अवयवावर टॉक्सिक लक्षणे निर्माण होतात हे सांगितले. आता आपण हिस्टोपॅथोलॉजीकल परीक्षणाने मूत्र व रक्ताच्या परीक्षणावरून शरीरात डेमॉन्स्ट्रेबल काय घडले हे दृक पुराव्याने दाखवतो.
          </p>

          <p>
            अशी ही अशुद्ध मेटल्स, रत्ने, माणके यांची शुद्धी गोमूत्र, ताक, दूध यासारख्या किंवा वनस्पतींच्या काढ्याच्या द्वारे करण्यास सांगितली आहेत आणि अशी शुद्ध झालेली मेटल्स औषधी कारणासाठी वापरावी असा आयुर्वेदाचा दंडक आहे. ती निर्विषिकरणाची (डिटॉक्सीकेशन) प्रक्रिया आहे की ज्यामुळे मानवावर दुष्परिणाम होणार नाहीत.
          </p>

          <p>
            काही वनस्पतीज औषधांच्या बाबतीत सुद्धा अशी शुद्धी अपेक्षित आहे. त्यामुळे त्यांच्या ॲडव्हर्स टॉक्सिक रिअँक्शन्स दिसत नाही. संजीवनी मध्ये बिब्बा वापरताना तो आधी दुधात शिजवून घ्यावा. लशुणादिवटी मध्ये लसुन वापरताना त्याची दह्यात किंवा ताकात शुद्धि करून घ्यावी. तुळशीचा स्वरस वापरताना ती मंजिऱ्या आलेली असता कामा नये.
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
