import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Calendar, User, Search } from "lucide-react";
import { Suspense } from "react";

export const metadata = { title: "Articles & Research" };

function CategoryFilter({ categories, active }: { categories: string[]; active: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Link href="/articles" className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${!active || active === "All" ? "bg-[#0891b2] text-white shadow-md shadow-[#0891b2]/20" : "bg-white border border-gray-200 text-ink-soft hover:border-[#0891b2]/30 hover:text-[#0891b2]"}`}>
        All
      </Link>
      {categories.map(cat => (
        <Link key={cat} href={`/articles?category=${encodeURIComponent(cat)}`} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${active === cat ? "bg-[#0891b2] text-white shadow-md shadow-[#0891b2]/20" : "bg-white border border-gray-200 text-ink-soft hover:border-[#0891b2]/30 hover:text-[#0891b2]"}`}>
          {cat}
        </Link>
      ))}
    </div>
  );
}

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const params = await searchParams;
  const category = params.category || "";
  const query = params.q || "";

  const where: any = { isPublished: true };
  if (category) where.category = category;

  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, category: true, authorName: true, coverImageUrl: true, createdAt: true, publishedAt: true },
  });

  const filteredArticles = query
    ? articles.filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.excerpt?.toLowerCase().includes(query.toLowerCase()))
    : articles;

  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))] as string[];

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#0891b2] via-[#06b6d4] to-[#22d3ee] py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-[10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 left-[5%] w-[300px] h-[300px] bg-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Search size={14} className="text-white" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">Knowledge Base</span>
          </span>
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-white mb-4">
            Articles & <span className="text-gold-light">Research</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Explore Dr. R.B. Gogate&apos;s contributions to Ayurvedic science across Shalya Tantra, Shalakya Tantra, Viddhakarma, and more.
          </p>
          <form className="max-w-lg mx-auto">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" name="q" defaultValue={query} placeholder="Search articles..."
                className="input-field !pl-12 !pr-4 !py-3.5 !rounded-2xl !bg-white/95 !shadow-xl" />
            </div>
          </form>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <Suspense fallback={null}>
              <CategoryFilter categories={categories} active={category} />
            </Suspense>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <Search size={48} className="text-muted/30 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-navy mb-2">No articles found</h3>
              <p className="text-sm text-muted">Try a different search or category filter.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <Link key={article.id} href={`/articles/${article.slug}`} className="group bg-white rounded-3xl border border-gray-100 p-7 card-hover block">
                  {article.category && (
                    <span className="inline-block px-3 py-1 bg-[#0891b2]/10 text-[#0891b2] text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                      {article.category}
                    </span>
                  )}
                  <h3 className="font-heading text-lg font-extrabold text-navy mb-3 group-hover:text-[#0891b2] transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-sm text-ink-soft leading-relaxed mb-5 line-clamp-3">{article.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-muted">
                      {article.authorName && (
                        <span className="flex items-center gap-1"><User size={12} /> {article.authorName}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-navy/30 group-hover:text-[#0891b2] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
