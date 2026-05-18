'use client';
import { CheckCircle } from 'lucide-react';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';

interface Message {
  id: string;
  collaborationId: string;
  senderId: string;
  senderRole: 'organizer' | 'influencer';
  content: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  read: boolean;
  readAt?: number;
  createdAt: number;
}

interface InfluencerMessagingProps {
  collaborationId: string;
  currentUserId: string;
  currentUserRole: 'organizer' | 'influencer';
  organizerName: string;
  influencerName: string;
}

export function InfluencerMessaging({
  collaborationId,
  currentUserId,
  currentUserRole,
  organizerName,
  influencerName,
}: InfluencerMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/influencers/collaborations/${collaborationId}/messages`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages.reverse()); // Reverse to show oldest first
        setUnreadCount(data.unreadCount);
        
        // Mark messages as read
        if (data.unreadCount > 0) {
          await fetch(
            `/api/influencers/collaborations/${collaborationId}/messages/read`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({}),
            }
          );
          setUnreadCount(0);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(interval);
  }, [collaborationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch(
        `/api/influencers/collaborations/${collaborationId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newMessage }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  };

  const getSenderName = (senderRole: 'organizer' | 'influencer') => {
    return senderRole === 'organizer' ? organizerName : influencerName;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Messages
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chat with {currentUserRole === 'organizer' ? influencerName : organizerName}
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-primary-600 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Icon name="message-circle" className="w-16 h-16 text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isCurrentUser
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  {!isCurrentUser && (
                    <p className="text-xs font-medium mb-1 opacity-75">
                      {getSenderName(message.senderRole)}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 text-xs p-2 rounded ${
                            isCurrentUser
                              ? 'bg-primary-700 hover:bg-primary-800'
                              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          <Icon name="paperclip" className="w-4 h-4" />
                          <span className="truncate">{attachment.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      isCurrentUser ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {formatTimestamp(message.createdAt)}
                    {message.read && isCurrentUser && (
                      <span className="ml-2"><CheckCircle className="h-4 w-4 inline-block" /><CheckCircle className="h-4 w-4 inline-block" /></span>
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={sending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-6"
          >
            {sending ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <Icon name="send" className="w-5 h-5" />}
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Press Enter to send
        </p>
      </form>
    </Card>
  );
}
