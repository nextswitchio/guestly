import { MessageCircle } from 'lucide-react';
"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

interface Discussion {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  timestamp: number;
  replies: number;
  likes: number;
}

interface CommunityTabProps {
  eventId: string;
}

export default function CommunityTab({ eventId }: CommunityTabProps) {
  const [postText, setPostText] = React.useState("");
  const [postTitle, setPostTitle] = React.useState("");
  const [discussions, setDiscussions] = React.useState<Discussion[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [posting, setPosting] = React.useState(false);

  React.useEffect(() => {
    fetchDiscussions();
  }, [eventId]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/events/${eventId}/discussions`);
      if (res.ok) {
        const data = await res.json();
        setDiscussions(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!postText.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/events/${eventId}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: postTitle || 'Update', content: postText }),
      });
      if (res.ok) {
        setPostText('');
        setPostTitle('');
        fetchDiscussions();
      }
    } catch (error) {
      console.error('Failed to post:', error);
    } finally {
      setPosting(false);
    }
  };

  const totalEngagement = discussions.reduce((sum, d) => sum + (d.likes || 0) + d.replies, 0);
  const avgEngagement = discussions.length > 0 ? (totalEngagement / discussions.length).toFixed(1) : 0;

  const formatDate = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Stats Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-3xl"><MessageCircle className="h-4 w-4 inline-block" /></span>
            <h3 className="text-lg font-semibold">Community Engagement</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-white/80">Total Posts</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{loading ? '...' : discussions.length}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Total Likes</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{loading ? '...' : discussions.reduce((s, d) => s + (d.likes || 0), 0)}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Total Replies</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{loading ? '...' : discussions.reduce((s, d) => s + d.replies, 0)}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Avg. Engagement</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{loading ? '...' : avgEngagement}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Post Composer */}
      <Card className="border-2 border-primary-100 bg-gradient-to-br from-primary-50/50 to-white">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-lg font-bold text-white shadow-sm">
            O
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Post title (optional)..."
              className="w-full mb-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share an update with your community..."
              className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              rows={3}
            />
            <div className="mt-3 flex items-center justify-end">
              <Button size="sm" onClick={handlePost} disabled={!postText.trim() || posting}>
                {posting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Posts Feed */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse p-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-neutral-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-neutral-200 rounded" />
                    <div className="h-3 w-full bg-neutral-200 rounded" />
                    <div className="h-3 w-3/4 bg-neutral-200 rounded" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : discussions.length === 0 ? (
          <EmptyState
            icon="message-circle"
            title="No community posts yet"
            description="Start the conversation! Share updates, answer questions, and engage with your attendees to build excitement."
            tips={[
              "Share behind-the-scenes content to build anticipation",
              "Answer attendee questions to improve their experience",
              "Encourage attendees to introduce themselves",
            ]}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {discussions.map((d) => (
              <Card key={d.id} className="transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white">
                    {d.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900">{d.userName}</span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-500">{formatDate(d.timestamp)}</span>
                    </div>
                    {d.title && <p className="mt-1 text-sm font-medium text-neutral-900">{d.title}</p>}
                    <p className="mt-2 text-sm leading-relaxed text-neutral-700">{d.content}</p>
                    <div className="mt-4 flex items-center gap-6">
                      <button className="group flex items-center gap-2 text-sm text-neutral-500 transition hover:text-primary-600">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 transition group-hover:bg-primary-50">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">{d.likes || 0}</span>
                      </button>
                      <button className="group flex items-center gap-2 text-sm text-neutral-500 transition hover:text-primary-600">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 transition group-hover:bg-primary-50">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <span className="font-medium">{d.replies}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Engagement Tips */}
      <Card className="border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50/50 to-transparent">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
            <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Engagement Tips</p>
            <ul className="mt-2 space-y-1 text-xs text-neutral-600">
              <li>• Post regular updates to keep attendees excited</li>
              <li>• Respond quickly to questions to build trust</li>
              <li>• Share behind-the-scenes content for authenticity</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
