import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function ShalyaShalakyatantriyaShoolaArticle() {
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
            शल्य- शालाक्यतंत्रीय शूल
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
          <p className="font-semibold text-navy italic">
            यत् मनोशरीरविघातकरं तत् शल्यम्। सुखसंज्ञकं आरोग्यम्।
          </p>

          <p>
            जे शरीर आणि मन या दोघांनाही बाधा करते. ते शल्य होय. शल्य याचा अर्थ टोचणी, बोचणी, वेदना या अर्थी असेल. वेदना या सुखकर या दुखःकर असू शकतात. दाबल्यावर शूलही असतो, तर काही वेळा बरेही वाटते. उष्णतेने शूल निर्माण होतो तर काही वेळा उष्णता सुखकरही असते.
          </p>

          <p>
            Pain is an unpleasant sensory and emotional experience associated with actual or potential tissue damage or described in such a type of damage.
          </p>

          <p>
            स्पर्शज्ञान हे वायूचे शंकातीत लक्षण आहे. वायूच्या प्रकोपामुळे किंवा शमनामुळे स्पर्शज्ञानात बदल होतो.
          </p>

          <p>
            आयुर्वेदात शूलाची उत्पत्ती वातप्रकोपामुळे होते असे सांगितले आहे. वातप्रकोपाची कारणे - धातुक्षय, अभिघात, मार्गावरोध, विष, अग्निमांद्य.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">शूलाची चिकित्सा</h2>
          <p>
            स्नेहन, स्वेदन, अग्निकर्म, विध्द चिकित्सा, रक्तमोक्षण, औषध चिकित्सा.
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
