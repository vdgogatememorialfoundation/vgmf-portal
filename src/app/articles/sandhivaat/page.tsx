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
            या उत्पातात शूल हे लक्षण प्रमुख असते. हा उत्पन्न होणारा शूल अध्यस्थि सौषिर्य, बंधनात आलेले शैथिल्य, बंधनांचा नाश, मज्जा क्षीणता, या सारख्या वायू प्रकोपामुळे घटना घडतात.
          </p>

          <p className="font-semibold text-navy italic">
            वातपूर्णदृतिस्पर्शः शोथ संधिगतेऽनिलॆ। प्रसरणाकुत्र्चनयोः प्रवृतिश्च संव्र्दना ॥ च.चि. २८/३०
          </p>

          <p>
            सामान्यतः वायू खालील कारणानी प्रकुपित होतो. धातुक्षय (वार्धक्य, शोष) दुःख शय्यासन- वेडेवाकडे झोपण्याची किंवा बसण्याची सतत वेळ येणे, वेगसंधारण, अभिघात, मर्माघात व अभोजन.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">संधिगतवाताचे प्रकार</h2>

          <h3 className="font-heading text-lg font-bold text-navy">वातकंटक</h3>
          <p>
            हा गुल्फ संधिच्या आश्रयाने होणारा रोग आहे. चालताना गुल्फ संधिच्या ठिकाणी शूल असे याचे स्वरुप असते.
          </p>
          <p className="font-semibold text-navy italic">
            रूक पादे विषमन्यस्ते श्रमाद्वा जायते यदा। वातेन गुल्फमश्रित्य तमाहुर्वात कण्टकम्॥ अ.हृ.नि.१५५
          </p>

          <h3 className="font-heading text-lg font-bold text-navy">कलाय खंज</h3>
          <p>
            यामध्ये वातकंटकाच्या पुढील संप्राप्ति घडते.
          </p>
          <p className="font-semibold text-navy italic">
            कम्पते गमानारम्भे खत्र्चग्निव च याति यः। कलायखत्र्जं तं विद्यान्मुक्तसंधि प्रबंधनम्॥ अ.हृ.नि. १५/४६
          </p>

          <h3 className="font-heading text-lg font-bold text-navy">मन्या व कटीग्रह</h3>
          <p>
            व्यवहारामध्ये याला उसण भरणे असे म्हणतात.
          </p>

          <h3 className="font-heading text-lg font-bold text-navy">जानुसंधि विकृति</h3>
          <p>
            जानुसंधिच्या ठिकाणी संधिगतवात जास्त प्रमाणात आढळतो.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">संधिगतवाताची चिकित्सा</h2>
          <p>
            संधिगतवातामध्ये मी स्वतः विध्द, अग्निकर्म, स्नेहन व स्वेदन हे उपक्रम करतो.
          </p>

          <p className="font-semibold text-navy italic">
            विरेको मांसमेदस्थे निरुहाः शमनानिच। बाह्यभ्यंतरतः स्नेहैरस्थि मज्जागतं जयेत्॥ च.चि. २८/२३
          </p>

          <p className="font-semibold text-navy italic">
            बस्तिः पुरुषाधाने कटिः सक्थीनी पादावस्थीनिच वातस्थानानि।
          </p>

          <p>
            वैद्य रा.ब. गोगटे, G.F.A.M(BOM) A.V.P. (SURGERY), Pune. निवृत्त प्राध्यापक व आयुर्वेदिक चिकित्सक, पुणे.
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
