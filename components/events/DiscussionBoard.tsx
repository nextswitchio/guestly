"use client";
import { Camera, Lightbulb, MessageCircle } from 'lucide-react';
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ReactionBar from "@/components/virtual/ReactionBar";
import { 
  getSocket, 
  joinDiscussion, 
  leaveDiscussion,
  emitDiscussionThreadCreated,
  emitDiscussionReplyCreated,
  emitDiscussionTyping,
  type DiscussionThread as SocketDiscussionThread,
  type DiscussionReply as SocketDiscussionReply,
  type DiscussionThreadCreatedEvent,
  type DiscussionReplyCreatedEvent,
  type DiscussionTypingEvent
} from "@/lib/websocket";

type DiscussionThread = {
  id: string;
  eventId: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  likes: number;
  replyCount: number;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
};

type DiscussionReply = {
  id: string;
  threadId: string;
  parentReplyId?: string;
  authorId: string;
  authorName: string;
  content: string;
  likes: number;
  createdAt: number;
};

type ReplyTreeNode = DiscussionReply & {
  children: ReplyTreeNode[];
};

interface DiscussionBoardProps {
  eventId: string;
  eventDate?: string; // Event date to determine if it's post-event
  eventTitle?: string; // Event title for context
}

export default function DiscussionBoard({ eventId, eventDate, eventTitle }: DiscussionBoardProps) {
  const [threads, setThreads] = React.useState<DiscussionThread[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showNewThreadModal, setShowNewThreadModal] = React.useState(false);
  const [selectedThread, setSelectedThread] = React.useState<DiscussionThread | null>(null);
  const [threadReplies, setThreadReplies] = React.useState<DiscussionReply[]>([]);
  const [newThreadTitle, setNewThreadTitle] = React.useState("");
  const [newThreadContent, setNewThreadContent] = React.useState("");
  const [replyContent, setReplyContent] = React.useState("");
  const [replyingTo, setReplyingTo] = React.useState<DiscussionReply | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [typingUsers, setTypingUsers] = React.useState<Map<string, string>>(new Map());
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Check if event has ended
  const isEventPast = eventDate ? new Date(eventDate) < new Date() : false;

  // Get current user info from cookies
  const getUserInfo = () => {
    if (typeof document === 'undefined') return null;
    const userId = document.cookie.split('; ').find(row => row.startsWith('user_id='))?.split('=')[1];
    const role = document.cookie.split('; ').find(row => row.startsWith('role='))?.split('=')[1];
    const userName = role === 'organiser' ? 'Organizer' : role === 'vendor' ? 'Vendor' : 'Attendee';
    return userId ? { userId, userName } : null;
  };

  // Socket.IO connection and event listeners
  React.useEffect(() => {
    const socket = getSocket();
    const userInfo = getUserInfo();
    
    if (!userInfo) return;

    // Join discussion room
    joinDiscussion(eventId, userInfo.userId, userInfo.userName);

    // Listen for new threads
    const handleThreadCreated = (event: DiscussionThreadCreatedEvent) => {
      setThreads(prev => [event.thread, ...prev]);
    };

    // Listen for new replies
    const handleReplyCreated = (event: DiscussionReplyCreatedEvent) => {
      // Update reply count in thread list
      setThreads(prev => prev.map(thread => 
        thread.id === event.threadId 
          ? { ...thread, replyCount: thread.replyCount + 1 }
          : thread
      ));

      // If viewing this thread, add the reply
      if (selectedThread?.id === event.threadId) {
        setThreadReplies(prev => [...prev, event.reply]);
      }
    };

    // Listen for typing indicators
    const handleTyping = (event: DiscussionTypingEvent) => {
      if (event.userId === userInfo.userId) return; // Ignore own typing

      setTypingUsers(prev => {
        const newMap = new Map(prev);
        if (event.isTyping) {
          newMap.set(event.userId, event.userName);
        } else {
          newMap.delete(event.userId);
        }
        return newMap;
      });

      // Auto-clear typing indicator after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => {
          const newMap = new Map(prev);
          newMap.delete(event.userId);
          return newMap;
        });
      }, 3000);
    };

    socket.on("discussion-thread-created", handleThreadCreated);
    socket.on("discussion-reply-created", handleReplyCreated);
    socket.on("discussion-typing", handleTyping);

    // Cleanup
    return () => {
      socket.off("discussion-thread-created", handleThreadCreated);
      socket.off("discussion-reply-created", handleReplyCreated);
      socket.off("discussion-typing", handleTyping);
      leaveDiscussion(eventId, userInfo.userId);
    };
  }, [eventId, selectedThread?.id]);

  // Load threads
  const loadThreads = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/discussions`);
      const data = await res.json();
      if (data.success) {
        setThreads(data.data);
      }
    } catch (err) {
      console.error("Failed to load threads:", err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  React.useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  // Load thread details and replies
  const loadThreadDetails = async (threadId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/discussions/${threadId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedThread(data.data.thread);
        setThreadReplies(data.data.replies);
      }
    } catch (err) {
      console.error("Failed to load thread details:", err);
    }
  };

  // Create new thread
  const handleCreateThread = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      setError("Title and content are required");
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${eventId}/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newThreadTitle,
          content: newThreadContent,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        // Emit Socket.IO event for real-time update
        emitDiscussionThreadCreated(eventId, data.data);
        
        setNewThreadTitle("");
        setNewThreadContent("");
        setShowNewThreadModal(false);
        await loadThreads();
      } else {
        setError(data.error || "Failed to create thread");
      }
    } catch (err) {
      setError("Failed to create thread");
    } finally {
      setSubmitting(false);
    }
  };

  // Add reply to thread or nested reply
  const handleAddReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedThread || !replyContent.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/events/${eventId}/discussions/${selectedThread.id}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            content: replyContent,
            parentReplyId: replyingTo?.id
          }),
        }
      );
      
      const data = await res.json();
      if (data.success) {
        // Emit Socket.IO event for real-time update
        emitDiscussionReplyCreated(eventId, selectedThread.id, data.data);
        
        setReplyContent("");
        setReplyingTo(null);
        await loadThreadDetails(selectedThread.id);
        await loadThreads(); // Refresh to update reply count
      }
    } catch (err) {
      console.error("Failed to add reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle typing indicator
  const handleTypingChange = (value: string) => {
    setReplyContent(value);
    
    const userInfo = getUserInfo();
    if (!userInfo) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing event
    emitDiscussionTyping(
      eventId,
      selectedThread?.id || null,
      userInfo.userId,
      userInfo.userName,
      true
    );

    // Set timeout to emit "stopped typing" after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      emitDiscussionTyping(
        eventId,
        selectedThread?.id || null,
        userInfo.userId,
        userInfo.userName,
        false
      );
    }, 2000);
  };

  // Build nested reply structure
  const buildReplyTree = (replies: DiscussionReply[]): ReplyTreeNode[] => {
    const replyMap = new Map<string, ReplyTreeNode>();
    const rootReplies: ReplyTreeNode[] = [];

    // First pass: create map of all replies with children array
    replies.forEach(reply => {
      replyMap.set(reply.id, { ...reply, children: [] });
    });

    // Second pass: build tree structure
    replies.forEach(reply => {
      const replyWithChildren = replyMap.get(reply.id)!;
      if (reply.parentReplyId) {
        const parent = replyMap.get(reply.parentReplyId);
        if (parent) {
          parent.children.push(replyWithChildren);
        } else {
          // Parent not found, treat as root
          rootReplies.push(replyWithChildren);
        }
      } else {
        rootReplies.push(replyWithChildren);
      }
    });

    return rootReplies;
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Render nested reply component
  const ReplyItem = ({ 
    reply, 
    depth = 0 
  }: { 
    reply: ReplyTreeNode; 
    depth?: number;
  }) => {
    const maxDepth = 3; // Limit nesting depth for UI clarity
    const isMaxDepth = depth >= maxDepth;

    return (
      <div className={depth > 0 ? "ml-8 mt-4" : ""}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-success-700">
              {reply.authorName.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-slate-900">
                {reply.authorName}
              </span>
              <span className="text-xs text-slate-600">
                {timeAgo(reply.createdAt)}
              </span>
            </div>
            <p className="text-sm text-slate-500 whitespace-pre-wrap mb-2">
              {reply.content}
            </p>
            {!isMaxDepth && (
              <button
                onClick={() => {
                  // Extract only the DiscussionReply properties without children
                  const replyData: DiscussionReply = {
                    id: reply.id,
                    threadId: reply.threadId,
                    parentReplyId: reply.parentReplyId,
                    authorId: reply.authorId,
                    authorName: reply.authorName,
                    content: reply.content,
                    likes: reply.likes,
                    createdAt: reply.createdAt,
                  };
                  setReplyingTo(replyData);
                  // Focus on textarea after state update
                  setTimeout(() => {
                    document.getElementById('reply-textarea')?.focus();
                  }, 100);
                }}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Reply
              </button>
            )}
          </div>
        </div>
        
        {/* Render nested replies */}
        {reply.children.length > 0 && (
          <div className="mt-3 space-y-3">
            {reply.children.map(childReply => (
              <ReplyItem key={childReply.id} reply={childReply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-slate-500">Loading discussions...</div>
      </div>
    );
  }

  // Post-event reflection thread suggestions
  const reflectionPrompts = [
    "What was your favorite moment from the event?",
    "Share your photos and memories from the event",
    "What did you learn or take away from this event?",
    "Would you attend this event again? Why or why not?",
    "Shoutout to someone you met at the event",
  ];

  return (
    <div className="space-y-4">
      {/* Post-event banner */}
      {isEventPast && (
        <div className="bg-gradient-to-r from-primary-50 to-success-50 dark:from-primary-900/20 dark:to-success-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span>Event Memories & Reflections</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">
                  Post-Event
                </span>
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                {eventTitle ? `${eventTitle} has concluded` : "This event has concluded"}. The community is still active! Share your experiences, photos, and connect with fellow attendees.
              </p>
              <div className="flex flex-wrap gap-2">
                {reflectionPrompts.slice(0, 3).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setNewThreadTitle(prompt);
                      setShowNewThreadModal(true);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-navy-800 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    MessageCircle {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with new thread button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isEventPast ? "Event Memories & Discussions" : "Discussions"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {threads.length} {threads.length === 1 ? "thread" : "threads"}
            {isEventPast && " • Community remains active"}
          </p>
        </div>
        <Button
          onClick={() => setShowNewThreadModal(true)}
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          {isEventPast ? "Share Memory" : "New Thread"}
        </Button>
      </div>

      {/* Thread list */}
      {threads.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-3">{isEventPast ? <Camera className="h-8 w-8" /> : <MessageCircle className="h-8 w-8" />}</div>
          <h3 className="font-semibold text-slate-900 mb-2">
            {isEventPast ? "No memories shared yet" : "No discussions yet"}
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            {isEventPast 
              ? "Be the first to share your experience and photos from this event"
              : "Be the first to start a conversation about this event"
            }
          </p>
          <Button onClick={() => setShowNewThreadModal(true)} size="sm">
            {isEventPast ? "Share Your Experience" : "Start Discussion"}
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <Card
              key={thread.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => loadThreadDetails(thread.id)}
            >
              <div className="flex items-start gap-3">
                {/* Author avatar */}
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary-700">
                    {thread.authorName.charAt(0)}
                  </span>
                </div>

                {/* Thread content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {thread.isPinned && (
                          <svg
                            className="w-4 h-4 text-warning-500 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.409 1.574 1.195 1.574H6.5a1 1 0 01.894.553l.448.894a1 1 0 001.788 0l.448-.894A1 1 0 0111 13.4h1.123c.786 0 1.445-.794 1.195-1.574L12.5 10.274 11 9.051V6a1 1 0 10-2 0v3.051l-1.5 1.223z" />
                          </svg>
                        )}
                        <h3 className="font-semibold text-slate-900 truncate">
                          {thread.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {thread.content}
                      </p>
                    </div>
                  </div>

                  {/* Thread metadata */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {thread.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {thread.replyCount} {thread.replyCount === 1 ? "reply" : "replies"}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {timeAgo(thread.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New thread modal */}
      <Modal
        open={showNewThreadModal}
        onClose={() => {
          setShowNewThreadModal(false);
          setNewThreadTitle("");
          setNewThreadContent("");
          setError("");
        }}
        title={isEventPast ? "Share Your Experience" : "Start a New Discussion"}
        size="lg"
      >
        <form onSubmit={handleCreateThread} className="space-y-4">
          {isEventPast && (
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-900 dark:text-primary-300 mb-2">
                   <Lightbulb className="h-4 w-4 inline" /> Reflection Ideas
                  </p>
                  <ul className="text-xs text-primary-700 dark:text-primary-400 space-y-1">
                    <li>• Share your favorite moments and photos</li>
                    <li>• Discuss what you learned or discovered</li>
                    <li>• Connect with people you met</li>
                    <li>• Provide feedback for future events</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <Input
            label="Thread Title"
            placeholder={isEventPast ? "What's your story from the event?" : "What would you like to discuss?"}
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            required
            autoFocus
          />
          
          <Textarea
            label="Content"
            placeholder={isEventPast 
              ? "Share your experience, photos, or memories from the event..."
              : "Share your thoughts, ask questions, or start a conversation..."
            }
            value={newThreadContent}
            onChange={(e) => setNewThreadContent(e.target.value)}
            rows={6}
            required
          />
          
          {error && (
            <div className="text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-lg p-3">
              {error}
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowNewThreadModal(false);
                setNewThreadTitle("");
                setNewThreadContent("");
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : isEventPast ? "Share" : "Create Thread"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Thread detail modal */}
      <Modal
        open={!!selectedThread}
        onClose={() => {
          setSelectedThread(null);
          setThreadReplies([]);
          setReplyContent("");
          setReplyingTo(null);
        }}
        title="Discussion Thread"
        size="xl"
      >
        {selectedThread && (
          <div className="space-y-6">
            {/* Thread header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {selectedThread.isPinned && (
                  <svg
                    className="w-5 h-5 text-warning-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.409 1.574 1.195 1.574H6.5a1 1 0 01.894.553l.448.894a1 1 0 001.788 0l.448-.894A1 1 0 0111 13.4h1.123c.786 0 1.445-.794 1.195-1.574L12.5 10.274 11 9.051V6a1 1 0 10-2 0v3.051l-1.5 1.223z" />
                  </svg>
                )}
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedThread.title}
                </h2>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-700">
                      {selectedThread.authorName.charAt(0)}
                    </span>
                  </div>
                  {selectedThread.authorName}
                </span>
                <span>•</span>
                <span>{timeAgo(selectedThread.createdAt)}</span>
              </div>
              
              <p className="text-slate-500 whitespace-pre-wrap">
                {selectedThread.content}
              </p>

              {/* Reactions for the thread */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <ReactionBar 
                  eventId={`discussion-${selectedThread.id}`} 
                  userId={getUserInfo()?.userId}
                  variant="compact"
                  showLabel={false}
                />
              </div>
            </div>

            {/* Replies */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                {threadReplies.length} {threadReplies.length === 1 ? "Reply" : "Replies"}
              </h3>
              
              <div className="space-y-4 mb-6">
                {buildReplyTree(threadReplies).map((reply) => (
                  <ReplyItem key={reply.id} reply={reply} />
                ))}
              </div>

              {/* Reply form */}
              <form onSubmit={handleAddReply} className="space-y-3">
                {replyingTo && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-primary-700 mb-1">
                        Replying to {replyingTo.authorName}
                      </div>
                      <div className="text-xs text-primary-600 line-clamp-2">
                        {replyingTo.content}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="text-primary-600 hover:text-primary-700 shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* Typing indicators */}
                {typingUsers.size > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 animate-pulse">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span>
                      {Array.from(typingUsers.values()).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                    </span>
                  </div>
                )}
                
                <Textarea
                  id="reply-textarea"
                  placeholder={replyingTo ? `Reply to ${replyingTo.authorName}...` : "Write a reply..."}
                  value={replyContent}
                  onChange={(e) => handleTypingChange(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  {replyingTo && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel Reply
                    </Button>
                  )}
                  <Button type="submit" disabled={submitting || !replyContent.trim()}>
                    {submitting ? "Posting..." : "Post Reply"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
