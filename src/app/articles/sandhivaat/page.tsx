import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function SandhivaatArticle() {
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
            संधिवात (Sandhivaat)
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
            संधिवात म्हणजे संधिशूल असाच अर्थ अनेकवेळा केला जातो पण मला असं वाटतं की तो तसा मर्यादित न घेता वायूने अस्थि, मज्जा, व संधि हे ज्या ठिकाणी शरीरात एकत्र येतात त्याठिकाणी निर्माण केलेले उत्पात.
          </p>

          <p>
            या उत्पातात शूल हे लक्षण प्रमुख असते. हा उत्पन्न होणारा शूल अध्यस्थि सौषिर्य, बंधनात आलेले शैथिल्य, बंधनांचा नाश, मज्जा क्षीणता, या सारख्या वायू प्रकोपामुळे घटना घडतात. यात स्रंस, व्यध किंवा स्थानसंश्रयासारख्याही गोष्टी असतात. संधि म्हणजे ज्या ठिकाणी सिरा, स्नायू, अस्थि एकत्र येतात तो भाग असेही मर्माच्या संदर्भात आलेल्या वर्णानात सापडते.
          </p>

          <p>
            म्हणून केवळ संधि म्हणजे दोन किंवा अनेक अस्थिंचे एकत्र येणे असे न करता तत्संबंधांतील सर्व भाव पदार्थ असा घ्यावा. संधिवात हा व्याधि प्रभूत प्रमाणात सापडतो. वातव्याधि असल्याने कायम स्वरूपी बरे करण्याची हमी नसलेला पण प्रयत्न तर करून पाहू असा रुग्णाचा व वैद्याचा व्यावहारिक विचार.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">लक्षणे</h2>
          <p>
            संधिवातातील प्रमुख लक्षण म्हणजे आकुंचन – प्रसरणादि क्रिया करताना होणा-या वेदना व त्यामुळे रोजच्या कामात आलेल्या मर्यादा, शोथ असतो पण दबणारा नसतो. संधिच्या हालचालीच्या वेळी काहीवेळा शब्द निर्माण करणारा अस त्याच थोडक्यात वर्णन करता येईल.
          </p>

          <p className="font-semibold text-navy italic">
            वातपूर्णदृतिस्पर्शः शोथ संधिगतेऽनिलॆ। प्रसरणाकुत्र्चनयोः प्रवृतिश्च संव्र्दना ॥ च.चि. २८/३०
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">कारणे</h2>
          <p>
            सामान्यतः वायू खालील कारणानी प्रकुपित होतो. धातुक्षय (वार्धक्य, शोष) दुःख शय्यासन- वेडेवाकडे झोपण्याची किंवा बसण्याची सतत वेळ येणे, वेगसंधारण, अभिघात, मर्माघात व अभोजन.
          </p>

          <p>
            ज्या शरीरात किंवा शरीर भागात रुक्ष, लघु, शीत दारुण, खर, विषद व सुषिरकरण या गोष्टी आढळतात तेथे वात प्रकोप होण्याची शक्यता खूप असते. सामान्यतः स्निग्ध, गुरू, उष्ण, श्लक्ष्ण, मृदु, पिच्छिल व घन अशा शरीरात किंवा शरीर भागात वात प्रकोप होत नाही.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">संधिगत वाताचे प्रकार</h2>
          <p>
            संधिगतवातात प्रामुख्याने खालील संधिशूलांचे प्रकार येतात:
          </p>

          <h3 className="font-heading text-lg font-bold text-navy">वातकंटक</h3>
          <p>
            हा गुल्फ संधिच्या आश्रयाने होणारा रोग आहे. चालताना गुल्फ संधिच्या ठिकाणी शूल असे याचे स्वरुप असते. खूप वेळ चालल्यामुळे वा चालताना पाऊल वेडेवाकडे पडल्यामुळे ही विकृती संभवते.
          </p>

          <h3 className="font-heading text-lg font-bold text-navy">कलाय खंज</h3>
          <p>
            यामध्ये वातकंटकाच्या पुढील संप्राप्ति घडते. ही संप्राप्ति सिरा- स्नायु व संधिबंधने यांच्या पुरती मर्यादित असते, येथे अस्थिभंग नसतो. वैकल्यकर मर्मावर आघात झाला तर असे घडू शकते. रुग्ण चालू लागताचा पायात कंप येतो व रुग्ण लंगडत चालतो.
          </p>

          <h3 className="font-heading text-lg font-bold text-navy">मन्या व कटीग्रह</h3>
          <p>
            व्यवहारामध्ये याला उसण भरणे असे म्हणतात. खरं तर संप्राप्ति वातकंटकाप्रमाणेच घडते. वेडेवाकडे बसणे, झोपणे, वजन उचलणे, मानेस अचानक ताण बसणे किंवा झटका बसणे यामुळे मन्या व कटीचे स्नायुंच्या ठिकाणी स्तंभ निर्माण होते.
          </p>

          <h3 className="font-heading text-lg font-bold text-navy">जानुसंधि विकृति</h3>
          <p>
            जानुसंधिच्या ठिकाणी संधिगतवात जास्त प्रमाणात आढळतो. ज्या दोन अस्थिंचा संधि बनतो त्यांच्या टोकाला एक आवरण असतो, त्याला (cartilage) असे म्हणतात. दोन अस्थिंच्यामध्ये विशेषतः जानुसंधिमध्ये अर्धचंद्राकृती असे खास आवरण असते, त्यामुळे दोन्ही सांध्यांची हालचाल सुलभ होते.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">चिकित्सा</h2>
          <p>
            संधिगतवाताची चिकित्सा करणे खरं तर कठीणच पण प्रयत्न तर हवाच. संधिगतवातामध्ये मी स्वतः विध्द, अग्निकर्म, स्नेहन व स्वेदन हे उपक्रम करतो व इतर लाक्षणिक चिकित्सा करतो.
          </p>

          <p>
            चिकित्सा करताना श्लेष्मक कफाच्या गुणधर्माचा विचार प्रथम करावा व त्यात कमतरता निर्माण झाली असेल तर आहाराने व पथ्यापथ्याने दुरुस्त करावी.
          </p>

          <p className="font-semibold text-navy italic">
            संधिसंश्लेषण, स्नेहन पूरण, बलस्थैर्य कृत्श्लेष्मा पंचधा प्रविभक्त उदक कर्मणा अनुग्रहं करोति ।
          </p>

          <p>
            वाताचे (प्रकुपित) वाढलेले गुण कमी करावयाचे तर कफाचे गुण वाढविणे हे योग्यच.
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
