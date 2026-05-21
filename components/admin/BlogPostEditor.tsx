'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { RichTextEditor } from './RichTextEditor';
import { X, Plus, Upload, Eye, Calendar, Download, Tag, Folder, Link as LinkIcon } from 'lucide-react';

interface BlogPostEditorProps {
  postId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Event {
  id: string;
  title: string;
}

interface Download {
  id: string;
  name: string;
  url: string;
  size: string;
}

export function BlogPostEditor({ postId, onSave, onCancel }: BlogPostEditorProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [scheduledAt, setScheduledAt] = useState('');

  // SEO state
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // Downloads state
  const [hasDownloads, setHasDownloads] = useState(false);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [downloadName, setDownloadName] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadSize, setDownloadSize] = useState('');

  // Event upselling state
  const [featuredEvents, setFeaturedEvents] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Active tab
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'downloads' | 'events'>('content');

  useEffect(() => {
    loadCategories();
    loadEvents();
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/blog/categories', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/events?status=published&page_size=100', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const loadPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const post = await response.json();
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
        setCoverImage(post.cover_image || '');
        setCategoryId(post.category_id || '');
        setTags(post.tags || []);
        setStatus(post.status);
        setScheduledAt(post.scheduled_at || '');
        setSeoTitle(post.seo_title || '');
        setSeoDescription(post.seo_description || '');
        setSeoKeywords(post.seo_keywords || []);
        setCanonicalUrl(post.canonical_url || '');
        setHasDownloads(post.has_downloads || false);
        setDownloads(post.downloads || []);
        setFeaturedEvents(post.featured_events || []);
      } else {
        setError('Failed to load post');
      }
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = async () => {
    if (!title) return;
    try {
      const response = await fetch('/api/admin/blog/posts/generate-slug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title }),
      });
      if (response.ok) {
        const data = await response.json();
        setSlug(data.slug);
      }
    } catch (err) {
      console.error('Failed to generate slug:', err);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addDownload = () => {
    if (downloadName && downloadUrl) {
      setDownloads([
        ...downloads,
        {
          id: Date.now().toString(),
          name: downloadName,
          url: downloadUrl,
          size: downloadSize,
        },
      ]);
      setDownloadName('');
      setDownloadUrl('');
      setDownloadSize('');
    }
  };

  const removeDownload = (id: string) => {
    setDownloads(downloads.filter(d => d.id !== id));
  };

  const addFeaturedEvent = () => {
    if (selectedEvent && !featuredEvents.includes(selectedEvent)) {
      setFeaturedEvents([...featuredEvents, selectedEvent]);
      setSelectedEvent('');
    }
  };

  const removeFeaturedEvent = (eventId: string) => {
    setFeaturedEvents(featuredEvents.filter(id => id !== eventId));
  };

  const handleSave = async (publishStatus: 'draft' | 'published') => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content,
        excerpt,
        cover_image: coverImage,
        category_id: categoryId || null,
        tags,
        status: publishStatus,
        seo_title: seoTitle || title,
        seo_description: seoDescription || excerpt,
        seo_keywords: seoKeywords,
        canonical_url: canonicalUrl,
        has_downloads: hasDownloads,
        downloads,
        featured_events: featuredEvents,
        scheduled_at: scheduledAt || null,
      };

      const url = postId
        ? `/api/admin/blog/posts/${postId}`
        : '/api/admin/blog/posts';
      const method = postId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to save post');
      }

      onSave?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-lime border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-600">Loading post...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {postId ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        <div className="flex gap-3">
          <Button onClick={() => handleSave('draft')} variant="outline" disabled={saving}>
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button onClick={() => handleSave('published')} disabled={saving}>
            {saving ? 'Publishing...' : 'Publish'}
          </Button>
          {onCancel && (
            <Button onClick={onCancel} variant="ghost">Cancel</Button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          {[
            { id: 'content', label: 'Content', icon: Eye },
            { id: 'seo', label: 'SEO', icon: LinkIcon },
            { id: 'downloads', label: 'Downloads', icon: Download },
            { id: 'events', label: 'Event Upselling', icon: Calendar },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-lime text-lime font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                onBlur={generateSlug}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium mb-2">URL Slug *</label>
              <div className="flex gap-2">
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                />
                <Button onClick={generateSlug} variant="outline" size="sm">
                  Generate
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                URL: /blog/{slug || 'post-url-slug'}
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the post (recommended for SEO)"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl min-h-[100px]"
                maxLength={300}
              />
              <p className="text-xs text-slate-500 mt-1">
                {excerpt.length}/300 characters
              </p>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image URL</label>
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {coverImage && (
                <div className="mt-3">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="max-w-sm rounded-xl border border-slate-200"
                  />
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button onClick={addTag} variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-lime/10 text-lime rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-lime-700">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Scheduled Publishing */}
            <div>
              <label className="block text-sm font-medium mb-2">Schedule Publishing</label>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Leave empty to publish immediately
              </p>
            </div>
          </Card>

          {/* Rich Text Editor */}
          <Card className="p-6">
            <label className="block text-sm font-medium mb-4">Content *</label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your blog post..."
            />
          </Card>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Search Engine Optimization</h3>
            <p className="text-sm text-slate-600 mb-6">
              Optimize your blog post for search engines to improve visibility and ranking.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">SEO Title</label>
            <Input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={title || 'Enter SEO title'}
              maxLength={60}
            />
            <p className="text-xs text-slate-500 mt-1">
              {seoTitle.length}/60 characters (optimal: 50-60)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meta Description</label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder={excerpt || 'Enter meta description'}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl min-h-[100px]"
              maxLength={160}
            />
            <p className="text-xs text-slate-500 mt-1">
              {seoDescription.length}/160 characters (optimal: 150-160)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Focus Keywords</label>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add a keyword"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    if (input.value.trim() && !seoKeywords.includes(input.value.trim())) {
                      setSeoKeywords([...seoKeywords, input.value.trim()]);
                      input.value = '';
                    }
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {seoKeywords.map(keyword => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    onClick={() => setSeoKeywords(seoKeywords.filter(k => k !== keyword))}
                    className="hover:text-slate-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Canonical URL</label>
            <Input
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://guestly.com/blog/post-slug"
            />
            <p className="text-xs text-slate-500 mt-1">
              Use if this content is published elsewhere to avoid duplicate content penalties
            </p>
          </div>

          {/* SEO Preview */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h4 className="text-sm font-medium mb-3">Search Engine Preview</h4>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-blue-600 text-lg mb-1">
                {seoTitle || title || 'Your Post Title'}
              </div>
              <div className="text-green-700 text-xs mb-2">
                https://guestly.com/blog/{slug || 'post-slug'}
              </div>
              <div className="text-sm text-slate-600">
                {seoDescription || excerpt || 'Your post description will appear here...'}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Downloads Tab */}
      {activeTab === 'downloads' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasDownloads"
              checked={hasDownloads}
              onChange={(e) => setHasDownloads(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-lime focus:ring-lime"
            />
            <label htmlFor="hasDownloads" className="text-sm font-medium">
              This post includes digital downloads
            </label>
          </div>

          {hasDownloads && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Download Name</label>
                  <Input
                    value={downloadName}
                    onChange={(e) => setDownloadName(e.target.value)}
                    placeholder="e.g., Event Planning Checklist"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Download URL</label>
                  <Input
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    placeholder="https://example.com/file.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">File Size (optional)</label>
                  <Input
                    value={downloadSize}
                    onChange={(e) => setDownloadSize(e.target.value)}
                    placeholder="e.g., 2.5 MB"
                  />
                </div>

                <Button onClick={addDownload} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Download
                </Button>
              </div>

              {downloads.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Downloads ({downloads.length})</h4>
                  {downloads.map(download => (
                    <div
                      key={download.id}
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="font-medium">{download.name}</div>
                          <div className="text-xs text-slate-500">
                            {download.size && `${download.size} • `}
                            {download.url}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeDownload(download.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Card>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Featured Events</h3>
            <p className="text-sm text-slate-600 mb-6">
              Select events to feature in this blog post. These will be displayed as call-to-action widgets.
            </p>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl"
            >
              <option value="">Select an event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            <Button onClick={addFeaturedEvent} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {featuredEvents.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Featured Events ({featuredEvents.length})</h4>
              {featuredEvents.map(eventId => {
                const event = events.find(e => e.id === eventId);
                return event ? (
                  <div
                    key={eventId}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <div className="font-medium">{event.title}</div>
                    </div>
                    <button
                      onClick={() => removeFeaturedEvent(eventId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
