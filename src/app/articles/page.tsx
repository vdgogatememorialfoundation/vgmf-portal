import Link from "next/link";
import { prisma } from "@/lib/prisma";

const articles = [
  {
    slug: "legend-shalaki",
    title: "LEGEND SHALAKI",
    category: "Shalakya Tantra",
    date: "March 31, 2023",
    excerpt: "A tribute to Prof. Dr. R.B. Gogate, recognizing his contributions as a great academician, skilled surgeon, genuine teacher, and philosopher in the field of Shalakya Tantra."
  },
  {
    slug: "shalakya-tantra-at-glance",
    title: "Shalakya Tantra at a Glance",
    category: "Shalakya Tantra",
    date: "March 31, 2023",
    excerpt: "An overview of Shalakya Tantra, covering diseases of the head and neck region including eyes, ears, nose, and mouth, and their treatment using various Shalaka instruments."
  },
  {
    slug: "viddhakarma-correlation-chinese-medicine",
    title: "Viddhakarma and its Correlation with Chinese Medicine",
    category: "Research",
    date: "February 3, 2022",
    excerpt: "A comparative study of Viddhakarma (Ayurvedic acupuncture) and Chinese acupuncture, highlighting their similarities in principles, treatment points, and therapeutic approaches."
  },
  {
    slug: "viddhakarma-points-1",
    title: "Viddhakarma Points 1",
    category: "Viddhakarma",
    date: "February 6, 2022",
    excerpt: "Introduction to Viddhakarma points for instant pain management. Description of specific points and their applications in various pain conditions."
  },
  {
    slug: "viddhakarma-points-2",
    title: "Viddhakarma Points 2 (with Agnikarma Tips)",
    category: "Viddhakarma",
    date: "February 11, 2022",
    excerpt: "Detailed discussion on Viddhakarma points with practical tips for Agnikarma. Use of different Shalaka instruments including Suvarna, Mrittika, and Loh Shalaka."
  },
  {
    slug: "viddhakarma-points-3",
    title: "Viddhakarma Points 3",
    category: "Viddhakarma",
    date: "March 6, 2022",
    excerpt: "Precautions before performing Viddha or Rakta Mokshan. Understanding the differences between Ayurvedic Viddha and Chinese acupuncture."
  },
  {
    slug: "viddhakarma-points-4",
    title: "Viddhakarma Points 4",
    category: "Viddhakarma",
    date: "April 16, 2022",
    excerpt: "Advanced Viddhakarma points including treatment for conditions like Apachi (cervical lymphadenitis) and calcaneal spur."
  },
  {
    slug: "hiv",
    title: "HIV",
    category: "Kayachikitsa",
    date: "September 18, 2021",
    excerpt: "Ayurvedic perspective on HIV/AIDS, understanding the disease through the lens of Rajayakshma, Prameha, and Ojakshaya. Treatment approach based on Ayurvedic principles."
  },
  {
    slug: "sandhivaat",
    title: "संधिवात (Sandhivaat)",
    category: "Kayachikitsa",
    date: "September 18, 2021",
    excerpt: "Comprehensive study of Sandhivaat (arthritis) from Ayurvedic perspective. Types, causes, symptoms, and treatment including Viddha and Agnikarma."
  },
  {
    slug: "viddha-agnikarma-shoolhar-chikitsa",
    title: "विध्द व अग्निकर्म प्रभावी शूलहर चिकित्सा",
    category: "Shalya Tantra",
    date: "September 19, 2021",
    excerpt: "Viddha and Agnikarma as effective pain management therapies. Comparison with Chinese medicine and practical applications in clinical practice."
  }
];

export default async function ArticlesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Knowledge Base</span>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-navy mb-4">Articles & Research</h1>
        <p className="text-muted max-w-2xl mx-auto">Explore authentic Ayurvedic knowledge, research papers, and clinical insights by Vd. R.B. Gogate</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {["All", "Shalakya Tantra", "Viddhakarma", "Kayachikitsa", "Shalya Tantra", "Research"].map(cat => (
          <button key={cat} className="px-4 py-2 rounded-full text-sm font-medium border hover:bg-navy hover:text-white transition-all">
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="card-hover bg-white rounded-2xl border p-6 block">
            <span className="inline-block px-2 py-1 bg-navy/5 text-navy text-xs font-semibold rounded mb-3">
              {article.category}
            </span>
            <h3 className="font-heading text-lg font-bold text-navy mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-ink-soft mb-4 line-clamp-3">
              {article.excerpt}
            </p>
            <p className="text-xs text-muted">
              {article.date}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
