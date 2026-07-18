import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag, Share2, BookOpen, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug }, select: { title: true, excerpt: true } });
  if (!article) return { title: "Article Not Found" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    select: { id: true, title: true, slug: true, content: true, excerpt: true, category: true, authorName: true, coverImageUrl: true, createdAt: true, publishedAt: true, viewCount: true },
  });

  if (!article) notFound();

  // Increment view count (fire and forget)
  prisma.article.update({ where: { slug }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  const relatedArticles = await prisma.article.findMany({
    where: { isPublished: true, category: article.category || undefined, NOT: { id: article.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, title: true, slug: true, excerpt: true, category: true, createdAt: true },
  });

  return (
    <div>
      {/* HEADER */}
      <section className="relative bg-navy py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-[10%] w-[300px] h-[300px] bg-gold/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link href="/articles" className="inline-flex items-center gap-2 text-white/50 hover:text-gold text-sm font-medium mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Articles
          </Link>
          {article.category && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold-light text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
              <Tag size={12} /> {article.category}
            </span>
          )}
          <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
            {article.authorName && (
              <span className="flex items-center gap-1.5"><User size={14} /> {article.authorName}</span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5"><BookOpen size={14} /> {article.viewCount} views</span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_250px] gap-12">
            {/* ARTICLE BODY */}
            <article className="prose prose-lg max-w-none">
              {article.excerpt && (
                <p className="text-xl text-ink-soft leading-relaxed font-medium border-l-4 border-gold pl-6 mb-8 not-prose">
                  {article.excerpt}
                </p>
              )}
              <div className="whitespace-pre-line text-ink-soft leading-relaxed text-base" dangerouslySetInnerHTML={{ __html: article.content || "Content not available." }} />
            </article>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h3 className="font-heading text-sm font-extrabold text-navy mb-4 uppercase tracking-wider">Share Article</h3>
                <div className="flex gap-2">
                  {["Twitter", "LinkedIn", "WhatsApp"].map(platform => (
                    <button key={platform} className="flex-1 py-2.5 bg-navy/5 text-navy text-xs font-bold rounded-xl hover:bg-navy hover:text-white transition-all duration-200">
                      {platform[0]}
                    </button>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Share2 size={14} className="text-gold" />
                    <span className="text-xs font-bold text-ink-soft uppercase tracking-wider">Copy Link</span>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); }} className="w-full py-2.5 text-xs font-bold text-ink-soft bg-cream-dark rounded-xl hover:bg-navy/5 transition-colors">
                    Copy URL
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* RELATED ARTICLES */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-cream-dark">
          <div className="max-w-7xl mx-auto px-6">
            <div className="section-heading">
              <span className="badge">Related</span>
              <h2>More from {article.category}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedArticles.map(rel => (
                <Link key={rel.id} href={`/articles/${rel.slug}`} className="group bg-white rounded-2xl border border-gray-100 p-6 card-hover block">
                  {rel.category && (
                    <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-bold rounded-full mb-3 uppercase tracking-wider">{rel.category}</span>
                  )}
                  <h3 className="font-heading text-base font-extrabold text-navy mb-2 group-hover:text-gold transition-colors leading-snug line-clamp-2">{rel.title}</h3>
                  {rel.excerpt && <p className="text-sm text-ink-soft line-clamp-2 mb-3">{rel.excerpt}</p>}
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-navy group-hover:text-gold transition-colors">
                    Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
