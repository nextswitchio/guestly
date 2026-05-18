'use client';
import { MessageCircle, RefreshCw } from 'lucide-react';

import { use, useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useRouter } from 'next/navigation';

interface Event {
  id: string;
  title: string;
}

interface Discussion {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  replies: number;
}

export default function EventCommunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchEvent();
    fetchDiscussions();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data.event);
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
        setDiscussions(data.discussions || []);
      }
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/events/${id}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchDiscussions();
      }
    } catch (error) {
      console.error('Failed to post message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
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
              Connect with other attendees and discuss the event
            </p>
          </div>
        </div>

        {/* Post New Message */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Start a Discussion</h2>
          <form onSubmit={handlePostMessage} className="space-y-4">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your thoughts, ask questions, or connect with other attendees..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
              required
            />
            <Button type="submit">
              <Icon name="arrow-right" className="w-4 h-4 mr-2" />
              Post Message
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
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{discussion.userName}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(discussion.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-white mb-3">{discussion.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <button className="flex items-center gap-1 hover:text-lime">
                        <Icon name="message-circle" className="w-4 h-4" />
                        {discussion.replies} replies
                      </button>
                      <button className="flex items-center gap-1 hover:text-lime">
                        <Icon name="heart" className="w-4 h-4" />
                        Like
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
