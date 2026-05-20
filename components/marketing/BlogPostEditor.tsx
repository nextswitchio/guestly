'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface BlogPostEditorProps {
  organizerId: string;
  eventId?: string;
  initialData?: {
    id?: string;
    title: string;
    content: string;
    excerpt: string;
    featuredImage?: string;
    tags: string[];
    status?: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function BlogPostEditor({ organizerId, eventId, initialData, onSave, onCancel }: BlogPostEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [publishAsUpdate, setPublishAsUpdate] = useState(!!eventId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title,
        content,
        excerpt,
        featuredImage,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        status,
        category: 'Event Update',
        seoMetadata: { metaTitle: title, metaDescription: excerpt, keywords: tags.split(',').map(t => t.trim()).filter(Boolean) },
        eventId: publishAsUpdate && eventId ? eventId : undefined,
      };

      let response;
      if (initialData?.id) {
        response = await fetch(`/api/content/posts/${initialData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/content/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save post');
      }

      const data = await response.json();
      onSave(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {initialData?.id ? 'Edit Post' : 'New Blog Post'}
      </h2>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {eventId && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-lime/20 bg-lime/5 p-3">
          <input
            type="checkbox"
            id="publishAsUpdate"
            checked={publishAsUpdate}
            onChange={(e) => setPublishAsUpdate(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-lime focus:ring-lime"
          />
          <label htmlFor="publishAsUpdate" className="text-sm text-slate-700">
            Publish as an event update on the community page
          </label>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary of the post"
            className="w-full px-3 py-2 border rounded-2xl min-h-[80px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Featured Image URL</label>
          <Input
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog post content here..."
            className="w-full px-3 py-2 border rounded-2xl min-h-[300px] font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="events, marketing, tips"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={() => handleSave('published')} disabled={saving}>
            {saving ? 'Publishing...' : 'Publish'}
          </Button>
          <Button onClick={() => handleSave('draft')} variant="outline" disabled={saving}>
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
        </div>
      </div>
    </Card>
  );
}
