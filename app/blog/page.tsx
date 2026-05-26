"use client";

import { PageHeader } from "@/components/PageHeader";
import { listBlogPosts } from '@/lib/marketing';
import Link from 'next/link';
import { StarIcon } from '@/utils/icons';
import { useState } from 'react';
import { useToast } from "@/components/ui/ToastProvider";

export default function BlogPage() {
  const { addToast } = useToast();
  const posts = listBlogPosts('public');
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      if (res.ok) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
        addToast('Thanks for subscribing! Check your inbox for a confirmation email.', { type: 'success' });
      } else {
        setNewsletterStatus('error');
        addToast('Something went wrong. Please try again.', { type: 'error' });
      }
    } catch {
      setNewsletterStatus('error');
      addToast('Something went wrong. Please try again.', { type: 'error' });
    }
  };

  return (
    <div className="bg-white">
      {/* Hero — using PageHeader component, no buttons */}
      <header className="relative bg-[#001c24] -mt-[200px] pt-[200px] font-dm selection:bg-lime selection:text-[#001C24]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
            style={{ backgroundImage: "url(/hero1.jpg)" }}
          />
          <div className="absolute inset-0 bg-[#001C24E5]" />
          <div className="absolute inset-0 bg-linear-to-b from-[#031419]/0 to-[#03151A]" />
        </div>
        <div className="relative max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-20">
            <div className="w-full lg:w-[65%]">
              <div className="flex items-center gap-2 text-lime text-sm sm:text-base leading-5 tracking-[-0.16px] pb-5">
                <StarIcon className="text-lime" />
                <p>The Guestly Journal</p>
              </div>
              <h1 className="text-5xl lg:text-[82.09px] text-white lg:leading-22.5 tracking-[-1.4px] font-medium">
                Stories, tips &amp; insights
                <br />
                from the event world.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-[#EEEEEE] leading-[150%] sm:tracking-[0.18px]">
                Discover how to plan unforgettable events, grow your audience, and
                build thriving communities across Africa.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lime/10">
              <svg className="h-8 w-8 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">No posts yet</h2>
            <p className="mt-2 text-slate-500">Our writers are crafting something amazing. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="mb-16">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="grid gap-0 md:grid-cols-2">
                    {featuredPost.featuredImage ? (
                      <div className="aspect-[4/3] overflow-hidden md:aspect-auto">
                        <img
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-lime/20 to-lime/5 md:aspect-auto">
                        <svg className="h-16 w-16 text-lime/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                    )}
                    <div className="flex flex-col justify-center p-8 sm:p-12">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="rounded-full bg-lime px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#001C24]">
                          Featured
                        </span>
                        {featuredPost.tags?.slice(0, 1).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-lime-hover sm:text-3xl">
                        {featuredPost.title}
                      </h2>
                      {featuredPost.excerpt && (
                        <p className="mt-4 line-clamp-3 text-base leading-relaxed text-slate-600">
                          {featuredPost.excerpt}
                        </p>
                      )}
                      <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
                        <span>{formatDate(featuredPost.publishedAt || featuredPost.createdAt)}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-400" />
                        <span>{readingTime(featuredPost.content)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Posts Grid */}
            <section>
              <div className="mb-8 flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">Latest Articles</h2>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {remainingPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    {post.featuredImage ? (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime/20">
                          <svg className="h-6 w-6 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-2 flex items-center gap-2">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-lime-hover line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-slate-400">
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-400" />
                        <span>{readingTime(post.content)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Newsletter CTA */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900">Stay in the loop</h2>
            <p className="mt-3 text-slate-600">
              Get event tips, industry insights, and platform updates delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-slate-900 placeholder-slate-400 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime sm:w-80"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="rounded-xl bg-lime px-6 py-3 font-bold text-[#001C24] transition-all hover:bg-lime-hover disabled:opacity-50"
                >
                  {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
          </div>
        </div>
      </section>
    </div>
  );
}
