import Link from "next/link";
import { ArrowRight } from "lucide-react";

const articles = [
  { title: "HIV in Ayurveda", category: "Kayachikitsa", slug: "hiv-ayurveda", excerpt: "Exploring Ayurvedic perspectives on HIV/AIDS through Karma, Dravya, and Upadwipa." },
  { title: "Agnikarma Chikitsa", category: "Shalya Tantra", slug: "agnikarma-chikitsa", excerpt: "Understanding thermal cauterization and clinical applications." },
  { title: "Viddhakarma Research", category: "Research", slug: "viddhakarma-research", excerpt: "Evidence-based approaches to therapeutic needling." },
  { title: "Sandhivat (Arthritis)", category: "Kayachikitsa", slug: "sandhivat", excerpt: "Ayurvedic approach to joint disorders and management." },
  { title: "Sangyaharan", category: "Shalya Tantra", slug: "sangyaharan", excerpt: "Surgical anesthesia in ancient Ayurvedic practice." },
  { title: "Arbuda (Tumors)", category: "Kayachikitsa", slug: "arbuda", excerpt: "Ayurvedic perspective on tumor management." },
];

export default function ArticlesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Knowledge</span>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-navy">Articles & Research</h1>
        <p className="text-muted mt-3">Explore Ayurvedic knowledge across multiple disciplines</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {["All","Kayachikitsa","Shalya Tantra","Research","Prasuti Tantra","Shalakya Tantra"].map(c => (
          <button key={c} className="px-4 py-2 rounded-full text-sm font-medium border hover:bg-navy hover:text-white hover:border-navy transition-all">{c}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((a, i) => (
          <Link key={i} href={`/articles/${a.slug}`} className="card-hover bg-white rounded-2xl border p-6">
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">{a.category}</span>
            <h3 className="font-heading text-lg font-bold text-navy mt-2 mb-2">{a.title}</h3>
            <p className="text-sm text-ink-soft leading-relaxed">{a.excerpt}</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy mt-4">Read Article <ArrowRight size={16} /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
