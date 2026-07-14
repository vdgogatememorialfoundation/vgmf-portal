import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

const articleData: Record<string, { title: string; category: string; content: string }> = {
  "hiv-ayurveda": {
    title: "HIV in Ayurveda",
    category: "Kayachikitsa",
    content: `HIV/AIDS याचे वर्णन आयुर्वेदात आहे की नाही असा विचार करत बसण्यापेक्षा घडणाऱ्या घटनांवरून चिकित्सा करणे हे योग्य ठरते — कर्मावरून शरीरात कोणते द्रव्य गेले असले पाहिजे आणि त्याने कसे कसे उपद्रव्याप केले असले पाहिजेत याचे अनुमान करता येते. त्याप्रमाणे आयुर्वेदातील तत्त्वांच्या चिकित्सा आधारे चिकित्सा करता येते.

In Ayurveda, diseases are understood through the framework of Dosha, Dhatu, and Mala. The HIV infection can be analyzed through the lens of Ojas Kshaya (depletion of vital essence) and the subsequent manifestation of various opportunistic infections. The Ayurvedic approach focuses on strengthening the immune system through Rasayana therapy, Panchakarma detoxification, and specific herbal formulations.

Vaidya R.B. Gogate's research explored the application of Ayurvedic principles to modern diseases, demonstrating that traditional knowledge systems can offer valuable perspectives even for contemporary health challenges.`
  },
  "agnikarma-chikitsa": {
    title: "Agnikarma Chikitsa",
    category: "Shalya Tantra",
    content: `Agnikarma, or thermal cauterization, is one of the most significant parasurgical procedures in Ayurveda. Vaidya R.B. Gogate was a pioneer in standardizing and documenting Agnikarma techniques for modern clinical practice.

The procedure involves the controlled application of heat to specific points on the body using specialized instruments (Shalaka) made of various metals. It is particularly effective for musculoskeletal disorders, chronic pain conditions, and certain skin ailments.

Key applications include: Gridhrasi (sciatica), Sandhivat (osteoarthritis), Avabahuk (frozen shoulder), and various Vata disorders. The therapy works by balancing the aggravated Vata and Kapha doshas while promoting local healing through controlled thermal stimulation.`
  },
  "viddhakarma-research": {
    title: "Viddhakarma Research",
    category: "Research",
    content: `Viddhakarma, or therapeutic needling, is a specialized Ayurvedic procedure that involves the insertion of fine needles at specific points to achieve therapeutic effects. It is distinct from acupuncture in its theoretical foundation and clinical approach.

The VGMF Viddhakarma Research Fellowship supports evidence-based research into this ancient technique. Research areas include: musculoskeletal disorders, pain management, neurological conditions, comparative clinical studies, mechanism-based research, and classical textual documentation.

Vaidya Gogate's work documented over 50 specific Viddha points and their therapeutic indications, creating a systematic framework that continues to guide practitioners today.`
  },
  sandhivat: {
    title: "Sandhivat (Arthritis)",
    category: "Kayachikitsa",
    content: `Sandhivat, correlated with osteoarthritis in modern medicine, is described extensively in Ayurvedic texts as a Vata-predominant disorder affecting the joints. The condition involves pain (Shoola), swelling (Shotha), and restricted movement (Stambha) in affected joints.

Ayurvedic management includes: Snehana (oleation therapy), Swedana (sudation), Virechana (therapeutic purgation), Basti (medicated enema), and Agnikarma for localized pain relief. Vaidya Gogate's research demonstrated significant improvement in Sandhivat patients using a combination of these approaches.`
  },
  sangyaharan: {
    title: "Sangyaharan",
    category: "Shalya Tantra",
    content: `Sangyaharan, or the practice of surgical anesthesia in ancient India, represents one of the most advanced aspects of Ayurvedic surgery. Ancient texts describe various methods of pain management during surgical procedures, including herbal preparations, pressure point techniques, and specialized diets.

The Sushruta Samhita contains detailed descriptions of surgical procedures performed under Sangyaharan, suggesting a sophisticated understanding of pain management that predates modern anesthesia by centuries.`
  },
  arbuda: {
    title: "Arbuda (Tumors)",
    category: "Kayachikitsa",
    content: `Arbuda in Ayurveda encompasses various types of growths and tumors. The classical texts describe both benign and malignant varieties, with detailed classification based on dosha predominance, location, and clinical presentation.

Ayurvedic management involves a multi-pronged approach including: Shodhana (purification therapies), Shamana (palliative treatment), Rasayana (immunomodulation), and in appropriate cases, surgical intervention as described in Shalya Tantra. Vaidya Gogate contributed to the understanding of Ayurvedic approaches to tumor management during his tenure at the Cancer Project.`
  },
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleData[slug];

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-3xl font-extrabold text-navy">Article Not Found</h1>
        <p className="text-muted mt-4">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/articles" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-navy text-white font-semibold rounded-xl">← Back to Articles</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/articles" className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>
      <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">{article.category}</span>
      <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-6">{article.title}</h1>
      <div className="flex items-center gap-4 text-sm text-muted mb-8 pb-8 border-b">
        <span className="flex items-center gap-1"><User size={14} /> Vaidya R.B. Gogate</span>
        <span className="flex items-center gap-1"><Tag size={14} /> {article.category}</span>
      </div>
      <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </div>
  );
}
