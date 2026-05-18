'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface BlogPostEditorProps {
  organizerId: string;
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    tags: string[];
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function BlogPostEditor({ organizerId, initialData, onSave, onCancel }: BlogPostEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');

  const handleSave = () => {
    onSave({
      title,
      content,
      excerpt,
      coverImage,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Blog Post Editor</h2>
      
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
            className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cover Image URL</label>
          <Input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog post content here..."
            className="w-full px-3 py-2 border rounded-lg min-h-[300px] font-mono text-sm"
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
          <Button onClick={handleSave}>Save Draft</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </Card>
  );
}
