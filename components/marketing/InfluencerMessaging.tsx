'use client';
import { CheckCircle } from 'lucide-react';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { getSocket, joinCollaboration, leaveCollaboration, sendCollaborationMessage } from '@/lib/websocket';

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

    // Poll for new messages every 5 seconds (fallback)
    const interval = setInterval(fetchMessages, 5000);

    // Try Socket.IO real-time updates
    let socketConnected = false;
    try {
      const socket = getSocket();
      
      socket.on('connect', () => {
        socketConnected = true;
        // Join collaboration room
        joinCollaboration(collaborationId);
      });

      socket.on('collaboration_joined', () => {
        // room joined successfully
      });

      socket.on('collaboration_message', (msg: any) => {
        // Append incoming message
        setMessages((prev) => [...prev, {
          id: msg.id,
          collaborationId: msg.collaboration_id || collaborationId,
          senderId: msg.sender_id,
          senderRole: msg.sender_role || (msg.sender_id === currentUserId ? 'organizer' : 'influencer'),
          content: msg.content,
          attachments: msg.attachments || [],
          read: false,
          createdAt: new Date(msg.created_at).getTime(),
        }]);
      });

      socket.on('messages_marked_read', (data: any) => {
        // Update UI to show messages as read
      });

      socket.on('disconnect', () => {
        socketConnected = false;
      });

      return () => {
        clearInterval(interval);
        if (socketConnected) {
          leaveCollaboration(collaborationId);
        }
      };
    } catch (e) {
      return () => clearInterval(interval);
    }
  }, [collaborationId, currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      // Try Socket.IO first
      const socket = getSocket();
      
      if (socket.connected) {
        // Send via Socket.IO - backend handler will persist and broadcast
        sendCollaborationMessage(collaborationId, newMessage);
        setNewMessage('');
      } else {
        // Fallback to HTTP if Socket.IO not connected
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
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Header */}
        <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Messages
            </h3>
            <p className="text-sm text-neutral-500">
              Chat with {currentUserRole === 'organizer' ? influencerName : organizerName}
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium text-dark bg-lime rounded-full">
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
            <p className="text-neutral-500">
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
                      ? 'bg-lime text-dark'
                      : 'bg-neutral-100 text-neutral-900'
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
                              ? 'bg-lime/80 hover:bg-lime'
                              : 'bg-neutral-200 hover:bg-neutral-300'
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
                      isCurrentUser ? 'text-lime/80' : 'text-neutral-500'
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
        <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200">
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
        <p className="text-xs text-neutral-500 mt-2">
          Press Enter to send
        </p>
      </form>
    </Card>
  );
}
