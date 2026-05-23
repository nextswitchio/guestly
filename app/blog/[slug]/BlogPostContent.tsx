'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Calendar, Share2, Clock, Eye, Tag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { slugify } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author_name: string;
  category_name: string;
  tags: string[];
  has_downloads: boolean;
  downloads: Array<{
    id: string;
    name: string;
    url: string;
    size: string;
  }>;
  featured_events: string[];
  views: number;
  reading_time: number;
  published_at: string;
  seo_title: string;
  seo_description: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  start_date: string;
  location_city: string;
  location_country: string;
  ticket_price_min: number;
  ticket_price_max: number;
}

export function BlogPostContent({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Post not found');
      }

      const data = await response.json();
      setPost(data);

      // Track view
      await fetch(`/api/blog/${slug}/view`, {
        method: 'POST',
        credentials: 'include',
      });

      // Load featured events if any
      if (data.featured_events && data.featured_events.length > 0) {
        loadFeaturedEvents(data.featured_events);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedEvents = async (eventIds: string[]) => {
    try {
      const promises = eventIds.map(id =>
        fetch(`/api/events/${id}`, { credentials: 'include' })
          .then(res => res.ok ? res.json() : null)
      );
      const events = (await Promise.all(promises)).filter(Boolean);
      setFeaturedEvents(events);
    } catch (err) {
      console.error('Failed to load featured events:', err);
    }
  };

  const handleDownload = async (downloadId: string, url: string) => {
    try {
      await fetch(`/api/blog/${slug}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ download_id: downloadId }),
      });
      window.open(url, '_blank');
    } catch (err) {
      console.error('Failed to track download:', err);
      window.open(url, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
        
        // Track share
        await fetch(`/api/blog/${slug}/share`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-lime border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Post Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'The blog post you\'re looking for doesn\'t exist.'}</p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative bg-[#001c24] -mt-[200px] pt-[200px]">
        <div className="absolute inset-0">
          {post.cover_image && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${post.cover_image})` }}
              />
              <div className="absolute inset-0 bg-[#001C24]/80" />
            </>
          )}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Category & Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {post.category_name && (
              <span className="px-3 py-1 bg-lime text-[#001C24] rounded-full text-sm font-bold">
                {post.category_name}
              </span>
            )}
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/10 text-white rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span>By {post.author_name}</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span>{new Date(post.published_at).toLocaleDateString()}</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.reading_time} min read
            </div>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views} views
            </div>
          </div>

          {/* Share Button */}
          <div className="mt-6">
            <Button onClick={handleShare} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div
              className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-lime prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Downloads Section */}
            {post.has_downloads && post.downloads.length > 0 && (
              <Card className="mt-12 p-6 bg-lime/5 border-lime/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-lime" />
                  Digital Downloads
                </h3>
                <p className="text-slate-600 mb-6">
                  Get exclusive resources mentioned in this post
                </p>
                <div className="space-y-3">
                  {post.downloads.map(download => (
                    <button
                      key={download.id}
                      onClick={() => handleDownload(download.id, download.url)}
                      className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-lime hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-lime/10 rounded-lg flex items-center justify-center">
                          <Download className="w-5 h-5 text-lime" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-slate-900">{download.name}</div>
                          {download.size && (
                            <div className="text-sm text-slate-500">{download.size}</div>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Events */}
            {featuredEvents.length > 0 && (
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-lime" />
                  Related Events
                </h3>
                <div className="space-y-4">
                  {featuredEvents.map(event => (
                    <Link
                      key={event.id}
                      href={`/events/${slugify(event.title)}`}
                      className="block group"
                    >
                      <div className="rounded-xl border border-slate-200 overflow-hidden hover:border-lime hover:shadow-md transition-all">
                        {event.cover_image && (
                          <img
                            src={event.cover_image}
                            alt={event.title}
                            className="w-full h-32 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h4 className="font-semibold text-slate-900 group-hover:text-lime transition-colors line-clamp-2 mb-2">
                            {event.title}
                          </h4>
                          <div className="text-xs text-slate-500 space-y-1">
                            <div>{new Date(event.start_date).toLocaleDateString()}</div>
                            <div>{event.location_city}, {event.location_country}</div>
                            {event.ticket_price_min > 0 && (
                              <div className="font-medium text-lime">
                                From ${event.ticket_price_min}
                              </div>
                            )}
                          </div>
                          <Button size="sm" className="w-full mt-3">
                            {new Date(event.start_date) < new Date() ? "View Event" : "Get Tickets"}
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
