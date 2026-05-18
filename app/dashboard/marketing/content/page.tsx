'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { BlogPostEditor } from '@/components/marketing/BlogPostEditor';
import { ContentDistributor } from '@/components/marketing/ContentDistributor';

export default function ContentMarketingPage() {
  const [organizerId, setOrganizerId] = useState<string>('');
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userIdCookie = cookies.find((c) => c.trim().startsWith("user_id="));
    if (userIdCookie) {
      setOrganizerId(userIdCookie.split("=")[1]);
    }
  }, []);

  const handleDistribute = async (channels: string[]) => {
    try {
      // Handle content distribution logic here
    } catch (error) {
      console.error('Failed to distribute content:', error);
    }
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
            Create and distribute blog posts and content
          </p>
        </div>
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="flex items-center gap-2 px-4 py-2.5 bg-lime text-dark font-semibold rounded-xl hover:bg-lime-hover transition-colors"
        >
          <Icon name="plus" size={16} />
          New Post
        </button>
      </div>

      {showEditor ? (
        <BlogPostEditor 
          organizerId={organizerId}
          onSave={() => setShowEditor(false)}
          onCancel={() => setShowEditor(false)}
        />
      ) : (
        <div className="space-y-6">
          {/* Blog Posts List */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Recent Posts
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900">
                      Sample Blog Post Title {i}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      Published 2 days ago • 1.2K views
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg">
                      Published
                    </span>
                    <button className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                      <Icon name="edit" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ContentDistributor postId="post_123" onDistribute={handleDistribute} />
        </div>
      )}
    </div>
  );
}
