'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { BlogPostEditor } from '@/components/marketing/BlogPostEditor';
import { ContentDistributor } from '@/components/marketing/ContentDistributor';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  eventId?: string;
  slug?: string;
  authorName?: string;
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
};

export default function ContentMarketingPage() {
  const { addToast } = useToast();
  const [organizerId, setOrganizerId] = useState<string>('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userIdCookie = cookies.find((c) => c.trim().startsWith("user_id="));
    if (userIdCookie) {
      setOrganizerId(userIdCookie.split("=")[1]);
    }
  }, []);

  useEffect(() => {
    if (!organizerId) return;
    fetchPosts();
  }, [organizerId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/posts', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setShowEditor(false);
    setEditingPost(null);
    fetchPosts();
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await fetch(`/api/content/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleDistribute = async (channels: string[]) => {
    if (!selectedPost) return;
    try {
      const res = await fetch(`/api/content/posts/${selectedPost}/distribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ channels }),
      });
      if (res.ok) {
        addToast('Content distributed successfully', { type: 'success' });
      }
    } catch (err) {
      console.error('Failed to distribute content:', err);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (!organizerId) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Content Marketing</h1>
          <p className="text-neutral-500 mt-1">
            Create and distribute blog posts and event updates
          </p>
        </div>
        <Button
          onClick={() => { setShowEditor(true); setEditingPost(null); }}
        >
          <Icon name="plus" size={16} />
          New Post
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {showEditor ? (
        <BlogPostEditor
          organizerId={organizerId}
          initialData={editingPost ? {
            id: editingPost.id,
            title: editingPost.title,
            content: editingPost.content,
            excerpt: editingPost.excerpt || '',
            featuredImage: (editingPost as any).featuredImage,
            tags: editingPost.tags || [],
            status: editingPost.status,
          } : undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="space-y-6">
          {/* Blog Posts List */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Recent Posts ({posts.length})
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-4 border border-neutral-200 rounded-xl">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-neutral-200 rounded" />
                      <div className="h-3 w-32 bg-neutral-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="py-12 text-center text-neutral-500">
                <Icon name="file" size={32} />
                <p className="mt-2">No posts yet. Create your first post!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedPost(post.id === selectedPost ? null : post.id)}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">
                        {post.title}
                      </h3>
                      <p className="text-sm text-neutral-500 mt-1">
                        {post.publishedAt ? `Published ${formatDate(post.publishedAt)}` : `Draft • Created ${formatDate(post.createdAt)}`}
                        {post.eventId && ' • Event Update'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-lg ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : post.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(post); }}
                        className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Icon name="trash-2" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedPost && (
            <ContentDistributor postId={selectedPost} onDistribute={handleDistribute} />
          )}
        </div>
      )}
    </div>
  );
}
