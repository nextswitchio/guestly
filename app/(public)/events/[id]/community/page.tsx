'use client';
import { MessageCircle, RefreshCw, FileText, Megaphone } from 'lucide-react';

import { use, useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
}

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

interface EventUpdate {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: number;
  tags?: string[];
}

export default function EventCommunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [eventUpdates, setEventUpdates] = useState<EventUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const userIdCookie = cookies.find((c) => c.trim().startsWith('user_id='));
    if (userIdCookie) {
      setUserId(userIdCookie.split('=')[1]);
    }
  }, []);

  useEffect(() => {
    fetchEvent();
    fetchDiscussions();
    fetchEventUpdates();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`/api/events/${id}/discussions`);
      if (response.ok) {
        const data = await response.json();
        setDiscussions(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventUpdates = async () => {
    try {
      const response = await fetch(`/api/content/posts?eventId=${id}`);
      if (response.ok) {
        const data = await response.json();
        const updates = (data.posts || [])
          .filter((p: { eventId?: string; status?: string }) => p.eventId === id && p.status === 'published')
          .map((p: { id: string; title: string; excerpt?: string; slug: string; publishedAt?: number; createdAt: number; tags?: string[] }) => ({
            id: p.id,
            title: p.title,
            excerpt: p.excerpt || '',
            slug: p.slug,
            publishedAt: p.publishedAt || p.createdAt,
            tags: p.tags,
          }));
        setEventUpdates(updates);
      }
    } catch (error) {
      console.error('Failed to fetch event updates:', error);
    }
  };

  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/events/${id}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: newTitle, content: newMessage }),
      });

      if (response.ok) {
        setNewTitle('');
        setNewMessage('');
        fetchDiscussions();
      }
    } catch (error) {
      console.error('Failed to post message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/events/${id}`)}
            className="flex items-center gap-2"
          >
            <Icon name="arrow-left" className="w-4 h-4" />
            Back to Event
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{event?.title || 'Event'} Community</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Connect with other attendees, read updates, and discuss the event
            </p>
          </div>
        </div>

        {/* Event Updates from Organizer */}
        {eventUpdates.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="h-5 w-5 text-lime" />
              <h2 className="text-xl font-semibold">Event Updates</h2>
              <span className="rounded-full bg-lime/10 px-2 py-0.5 text-xs font-medium text-lime">
                {eventUpdates.length}
              </span>
            </div>
            <div className="space-y-3">
              {eventUpdates.map((update) => (
                <Card key={update.id} className="p-4 sm:p-6 border-l-4 border-l-lime">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center text-dark shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-lime uppercase tracking-wide">Organizer Update</span>
                        <span className="text-sm text-gray-500">
                          {new Date(update.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{update.title}</h3>
                      {update.excerpt && (
                        <p className="text-gray-600 mt-1">{update.excerpt}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <Link
                          href={`/blog/${update.slug}`}
                          className="text-sm font-medium text-lime hover:underline"
                        >
                          Read full update →
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Post New Discussion */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Start a Discussion</h2>
          <form onSubmit={handlePostMessage} className="space-y-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Discussion title..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your thoughts, ask questions, or connect with other attendees..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
              required
            />
            <Button type="submit">
              <Icon name="arrow-right" className="w-4 h-4 mr-2" />
              Post Discussion
            </Button>
          </form>
        </Card>

        {/* Discussions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Discussions</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-4xl animate-spin"><RefreshCw className="h-4 w-4 inline-block" /></span>
            </div>
          ) : discussions.length === 0 ? (
            <Card className="p-6 sm:p-12 text-center">
              <span className="text-6xl mb-4 block"><MessageCircle className="h-4 w-4 inline-block" /></span>
              <h3 className="text-xl font-semibold mb-2">No discussions yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Be the first to start a conversation!
              </p>
            </Card>
          ) : (
            discussions.map((discussion) => (
              <Card key={discussion.id} className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center text-dark font-semibold shrink-0">
                    {discussion.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{discussion.userName}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(discussion.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {discussion.title && (
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{discussion.title}</h4>
                    )}
                    <p className="text-gray-900 dark:text-white mb-3">{discussion.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <button className="flex items-center gap-1 hover:text-lime">
                        <Icon name="message-circle" className="w-4 h-4" />
                        {discussion.replies} replies
                      </button>
                      <button className="flex items-center gap-1 hover:text-lime">
                        <Icon name="heart" className="w-4 h-4" />
                        {discussion.likes || 0} likes
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
