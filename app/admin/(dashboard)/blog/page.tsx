'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { BlogPostEditor } from '@/components/admin/BlogPostEditor';
import {
  Plus, Search, Filter, Eye, Edit, Trash2, Calendar,
  TrendingUp, FileText, Download, Share2, BarChart3
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  author_name: string;
  category_name: string;
  status: string;
  views: number;
  unique_views: number;
  shares: number;
  downloads_count: number;
  published_at: string;
  created_at: string;
}

interface Analytics {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
  total_unique_views: number;
  total_shares: number;
  total_downloads: number;
}

export default function AdminBlogPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPosts();
    loadAnalytics();
  }, [page, statusFilter, categoryFilter, searchQuery]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: '20',
      });
      
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category_id', categoryFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/admin/blog/posts?${params}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
        setTotalPages(data.page_count || 1);
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/blog/analytics', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        loadPosts();
        loadAnalytics();
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const handleEdit = (postId: string) => {
    setSelectedPost(postId);
    setView('edit');
  };

  const handleSaveComplete = () => {
    setView('list');
    setSelectedPost(null);
    loadPosts();
    loadAnalytics();
  };

  if (view === 'create') {
    return (
      <div className="p-8">
        <BlogPostEditor
          onSave={handleSaveComplete}
          onCancel={() => setView('list')}
        />
      </div>
    );
  }

  if (view === 'edit' && selectedPost) {
    return (
      <div className="p-8">
        <BlogPostEditor
          postId={selectedPost}
          onSave={handleSaveComplete}
          onCancel={() => setView('list')}
        />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog Management</h1>
          <p className="text-slate-600">
            Manage your blog posts, categories, and content
          </p>
        </div>
        <Button onClick={() => setView('create')}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Total Posts</div>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold">{analytics.total_posts}</div>
            <div className="text-xs text-slate-500 mt-1">
              {analytics.published_posts} published, {analytics.draft_posts} drafts
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Total Views</div>
              <Eye className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold">
              {analytics.total_views.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {analytics.total_unique_views.toLocaleString()} unique
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Total Shares</div>
              <Share2 className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold">
              {analytics.total_shares.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Across all posts
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Downloads</div>
              <Download className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold">
              {analytics.total_downloads.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Digital resources
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="pl-10"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl"
          >
            <option value="">All Categories</option>
            {/* Categories would be loaded dynamically */}
          </select>
        </div>
      </Card>

      {/* Posts Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Post
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Stats
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="animate-spin w-8 h-8 border-4 border-lime border-t-transparent rounded-full mx-auto mb-4" />
                    Loading posts...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No posts found. Create your first blog post!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {post.cover_image && (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium text-slate-900">
                            {post.title}
                          </div>
                          <div className="text-sm text-slate-500">
                            by {post.author_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.category_name && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {post.category_name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : post.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          {post.shares}
                        </div>
                        {post.downloads_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {post.downloads_count}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          variant="ghost"
                          size="sm"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(post.id)}
                          variant="ghost"
                          size="sm"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(post.id)}
                          variant="ghost"
                          size="sm"
                          title="Delete"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
