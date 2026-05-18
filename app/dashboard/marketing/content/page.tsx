'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { BlogPostEditor } from '@/components/marketing/BlogPostEditor';
import { ContentDistributor } from '@/components/marketing/ContentDistributor';

export default function ContentMarketingPage() {
  const [organizerId, setOrganizerId] = useState<string>('');
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    // Get user ID from cookies
    const cookies = document.cookie.split(";");
    const userIdCookie = cookies.find((c) => c.trim().startsWith("user_id="));
    
    if (userIdCookie) {
      const id = userIdCookie.split("=")[1];
      setOrganizerId(id);
    }
  }, []);

  const handleDistribute = async (channels: string[]) => {
    try {
      // Handle content distribution logic here
      // You could make an API call here to distribute the content
    } catch (error) {
      console.error('Failed to distribute content:', error);
    }
  };

  if (!organizerId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Marketing</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create and distribute blog posts and content
          </p>
        </div>
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Icon name="plus" className="w-4 h-4" />
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Posts
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Sample Blog Post Title {i}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Published 2 days ago • 1.2K views
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-medium bg-success-100 text-success-700 rounded-full">
                      Published
                    </span>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Icon name="edit" className="w-4 h-4" />
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
