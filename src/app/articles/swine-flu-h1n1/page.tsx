import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function SwineFluH1N1Article() {
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
            स्वाइन फ्लू- नवीन त-हेचा फ्लू सात दिवसांचा संततज्वर
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
            स्वाइन फ्लू (H1N1)- नवीन त-हेचा फ्लू सात दिवसांचा संततज्वर
          </p>

          <p>
            हा एक नेहमीच्या सात दिवसाच्या संततज्वराचा (इन्फ्लूएन्झाचा) प्रकार आहे आणि म्हणून नेहमीच्या इन्फ्लूएन्झामधील लक्षणेही याही रोगामध्ये सापडतात. नेहमीच्या वातावरणीय &apos;फ्लू&apos; मध्ये व या प्रकारच्या &apos;फ्लू&apos; मध्ये फरक एवढाच की, याचा प्रसार खूप तीव्रतेने होतो.
          </p>

          <p>
            हा प्रसार श्वास मार्गातून होतो असे जरी खरे असले तरी सुध्दा एखाद्या ठिकाणी हा पिडीत रुग्ण शिंकला असेल आणि त्या ठिकाणी प्राकृत माणसाचा हात लागला व तो त्याने चुकुन स्वतःच्या नाकाला, डोळ्याला, तोंडाला लावला तरी सुध्दा त्याला हा रोग संभवतो.
          </p>

          <p>
            या व्हायरस चा शोध अमेरिकेमध्ये एप्रिल २००९ मध्ये लागला. त्याच वेळी याच प्रकारच्या &apos;फ्लू&apos; ने आजारी माणसे मेक्सिको व कॅनडातही आढळली.
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
