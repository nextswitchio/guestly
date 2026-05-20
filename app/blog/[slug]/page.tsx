import { notFound } from 'next/navigation';
import { getBlogPostBySlug, listBlogPosts } from '@/lib/marketing';
import Link from 'next/link';
import { StarIcon } from '@/utils/icons';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = listBlogPosts('public');
    return posts
      .filter((p) => p.status === 'published')
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const readingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const relatedPosts = listBlogPosts('public')
    .filter((p) => p.id !== post.id && p.status === 'published')
    .filter((p) => p.tags?.some((t) => post.tags?.includes(t)))
    .slice(0, 3);

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="mb-6 ml-6 list-disc space-y-2 text-slate-600">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={i} className="mb-4 mt-10 text-2xl font-bold text-slate-900">{trimmed.slice(3)}</h2>);
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={i} className="mb-3 mt-8 text-xl font-semibold text-slate-900">{trimmed.slice(4)}</h3>);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        listItems.push(<li key={i}>{trimmed.slice(2)}</li>);
      } else if (trimmed.startsWith('---')) {
        flushList();
        elements.push(<hr key={i} className="my-8 border-slate-200" />);
      } else if (trimmed === '') {
        flushList();
      } else {
        flushList();
        elements.push(<p key={i} className="mb-5 text-base leading-relaxed text-slate-700">{trimmed}</p>);
      }
    });
    flushList();
    return elements;
  };

  return (
    <div className="bg-white">
      {/* Hero — matching explore page structure */}
      <header className="relative bg-[#001c24] -mt-[200px] pt-[200px] font-dm selection:bg-lime selection:text-[#001C24]">
        {post.featuredImage && (
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
              style={{ backgroundImage: `url(${post.featuredImage})` }}
            />
            <div className="absolute inset-0 bg-[#001C24E5]" />
            <div className="absolute inset-0 bg-linear-to-b from-[#031419]/0 to-[#03151A]" />
          </div>
        )}
        <div className="relative max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-20">
            <div className="w-full lg:w-[65%]">
              {/* Breadcrumb */}
              <nav className="mb-4 flex items-center gap-2 text-sm text-white/40">
                <Link href="/" className="transition-colors hover:text-lime">Home</Link>
                <span>/</span>
                <Link href="/blog" className="transition-colors hover:text-lime">Guestly Journal</Link>
              </nav>

              {/* Tags */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-lime/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-lime"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-5xl text-white lg:text-[82.09px] lg:leading-22.5 tracking-[-1.4px] font-medium">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="mt-6 text-base sm:text-lg text-[#EEEEEE] leading-[150%] sm:tracking-[0.18px]">
                  {post.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/40">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">
                    G
                  </div>
                  <span className="text-white/60">Guestly Team</span>
                </div>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span>{readingTime(post.content)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose-custom">
          {renderContent(post.content)}
        </div>

        {/* Share */}
        <div className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Share this article</h3>
            <div className="flex gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all hover:border-lime hover:text-lime hover:bg-lime/5">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all hover:border-lime hover:text-lime hover:bg-lime/5">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all hover:border-lime hover:text-lime hover:bg-lime/5">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-10">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-lime transition-all hover:gap-3 font-medium"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m7 7l-7 7m0 0l7-7" />
            </svg>
            Back to all articles
          </Link>
        </div>
      </main>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <StarIcon className="h-5 w-5 text-lime" />
              <h2 className="text-2xl font-bold text-slate-900">Related Articles</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {related.featuredImage ? (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={related.featuredImage}
                        alt={related.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/20">
                        <svg className="h-5 w-5 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-lime-hover line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-slate-400">
                      <span>{formatDate(related.publishedAt || related.createdAt)}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-400" />
                      <span>{readingTime(related.content)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
