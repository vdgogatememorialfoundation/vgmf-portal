import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function ViddhaAgnikarmaShoolharChikitsa() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>

      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
            Shalya Tantra
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">
            विध्द व अग्निकर्म प्रभावी शूलहर चिकित्सा
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
            आयुर्वेदिय चिकित्सा करत असताना वेदना व शूल त्वरीत नाहीसा कसा करता येईल असा विचार माझ्या मनात सतत असे. व्यवहारामध्ये शूल असणारा माणूस अस्वस्थ असतो. कारण त्याला प्रत्येक क्रिया करताना त्रास जाणवत असतो. मला इन्जेक्शन द्या, गोळी द्या आणि शूल थांबवा असेच त्याचे मागणे असते.
          </p>

          <p>
            काही रुग्ण तर स्नेहन स्वेदनांदी उपचार घेउन आलेले असतात. सध्या शूल नाहीशी करणारी अनेक औषधे बाजारांत उपलब्ध आहेत. सामान्यतः ती NSAIDS मध्ये वर्गीकृत होतात. या सर्व औषधांचा रक्तवह व मूत्रवह स्रोतसावर – संस्थेवर विपरीत परिणाम होतो. अतिशय पित्त करण्याची त्यांची प्रवृत्ती असते.
          </p>

          <p>
            आयुर्वेदांतील शूलहर द्रव्ये NSAIDS इतकी प्रभावानी काम करणारी शूलहर नाहीत. स्नेहन-स्वेदन मर्यादित स्वरुपात उपशम देते. आयुर्वेदात प्रभावी शूलहर असे काही नाही हा गैरसमज आम्ही शिकत असताना सर्वांकडून ऐकू येणारा.
          </p>

          <p>
            वातज शूलामध्ये तर तो खासच उपाय आहे.
          </p>

          <p className="italic text-navy">
            &quot;साधा व सोपा&quot; या दोन्हीचा उल्लेख:
          </p>

          <p className="italic text-navy">
            अथातो अग्निकर्म विधि अध्यायं व्याख्यास्यामः। सु.सू.१२
          </p>

          <p className="italic text-navy">
            अथातः सिराव्यध विधि शारीरं व्याख्यास्यामः। सु.शा. ८
          </p>

          <p>
            विध्द चिकित्सा व अग्निकर्म चिकित्सा चायनीज वैद्यक शास्त्रात आहे असे ऐकून होतो. पण मुद्दामहून त्याचा असा अभ्यास केला नव्हता.
          </p>

          <p>
            आयुर्वेद व चायनीज वैद्यक शास्त्र यामध्ये एक महत्त्वाचे तत्त्व सारखेच आहे ते तत्त्व म्हणजे उष्ण व शीत.
          </p>

          <p>
            दोन्ही मधील साधर्म्याचा विचार केला की खालील गोष्टींचा खुलासा छान होतो:
          </p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>अंगुली प्रमाण हे दोन्ही शास्त्रांनी सांगितले आहे.</li>
            <li>आडवी व उभी मापे घेताना कोणते अंगुली प्रमाण घ्यावयाचे आहे याचा स्पष्ट खुलासा चायनीज वैद्यकीय शास्त्रात आहे.</li>
            <li>आयुर्वेदाने विध्द चिकित्सा – आवृत्त/ मार्गावरोधजन्य वातवृध्दित वायू काढण्यासाठी सांगितली.</li>
            <li>अग्निकर्मासाठी आयुर्वेदानी पिंपळी, बिब्बा, हळद, गुळ यांचा उपयोग सांगितला आहे.</li>
            <li>चायनीज मेडीसीन मधे अग्निकर्मा साठी लोह शलाका सांगितली आहे तर आयुर्वेदात पंचधातूंचा उपयोग सांगितला आहे.</li>
            <li>आयुर्वेदाने अग्निकर्म चिकित्सा अपुनर्भव चिकित्सा म्हणुन सांगितली आहे.</li>
            <li>आयुर्वेदाने मर्म स्थाने विचारात घेतली आहेत.</li>
            <li>चायनीज वैद्यकीय शास्त्र शैत्याने उत्पन्न होणार्या व्याधींमधे मॉक्सीबुशन सांगितले आहे.</li>
            <li>वायू जनीत शूलामध्ये विध्द चिकित्सा सांगितली आहे.</li>
            <li>आयुर्वेद शास्त्रात ज्यावेळी विध्द चिकित्सेचा उपयोग होत नाही त्यावेळी अग्निकर्म करावयास सांगितले आहे.</li>
            <li>स्नेहन स्वेदन अग्निकर्म व विध्द चिकित्सा ज्यावेळी संप्राप्ती स्नायू संधीच्या संबंधात असेल त्यावेळी वरचेवर करावयाच्या आहेत.</li>
          </ol>

          <p className="italic text-navy">
            शाम्यतेव न चच्छुलं स्निग्ध स्विन्नस्य मोक्षयेत। ततः सिरा दहेद्वापि मतिमान किर्तिते यथा॥ सु.उ. १७/ १८
          </p>

          <p>
            पाच हजारापेक्षा अधिक रुग्ण झाल्याखेरीज या संबधात पुस्तक लिहायचे नाही असे ठरविले होते. आता तो संकल्प पुरा झाला. म्हणून आपण सर्वांनी या उपक्रमांचे पुनः पुनरजीवन करावे व आयुर्वेद शाश्वत करावा.
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
