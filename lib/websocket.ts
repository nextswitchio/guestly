import { io, Socket } from "socket.io-client";
import type { Poll, QAQuestion, Reaction } from "./store";

export interface ChatMessage {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  type: "message" | "system";
  emoji?: string; // Optional emoji reaction
}

export interface UserPresence {
  userId: string;
  userName: string;
  eventId: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: number;
  joinedAt: number;
}

export interface EventRoomState {
  attendees: string[];
  messages: ChatMessage[];
  userCount: number;
  onlineUsers?: UserPresence[];
}

export interface PresenceUpdateEvent {
  onlineUsers: UserPresence[];
}

export interface UserTypingEvent {
  userId: string;
  userName: string;
  isTyping: boolean;
}

// WebSocket event types for virtual engagement
export interface PollCreatedEvent {
  poll: Poll;
}

export interface PollVotedEvent {
  pollId: string;
  poll: Poll;
}

export interface PollClosedEvent {
  pollId: string;
}

export interface QAQuestionEvent {
  question: QAQuestion;
}

export interface QAUpvotedEvent {
  questionId: string;
  question: QAQuestion;
}

export interface QAAnsweredEvent {
  questionId: string;
  question: QAQuestion;
}

export interface QADeletedEvent {
  questionId: string;
}

export interface ReactionEvent {
  reaction: Reaction;
}

// Discussion event types
export interface DiscussionThread {
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
}

export interface DiscussionReply {
  id: string;
  threadId: string;
  parentReplyId?: string;
  authorId: string;
  authorName: string;
  content: string;
  likes: number;
  createdAt: number;
}

export interface DiscussionThreadCreatedEvent {
  thread: DiscussionThread;
}

export interface DiscussionReplyCreatedEvent {
  threadId: string;
  reply: DiscussionReply;
}

export interface DiscussionTypingEvent {
  threadId: string | null;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface UserJoinedDiscussionEvent {
  userId: string;
  userName: string;
}

export interface UserLeftDiscussionEvent {
  userId: string;
}

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;
    
    // Get JWT token from cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];
    
    socket = io(socketUrl, {
      path: "/socket.io/",
      addTrailingSlash: false,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      auth: {
        token: token || '',
      },
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Helper functions for emitting virtual engagement events
export function emitPollCreated(eventId: string, poll: Poll) {
  const socket = getSocket();
  socket.emit("poll-created", { eventId, poll });
}

export function emitPollVoted(eventId: string, pollId: string, poll: Poll) {
  const socket = getSocket();
  socket.emit("poll-voted", { eventId, pollId, poll });
}

export function emitPollClosed(eventId: string, pollId: string) {
  const socket = getSocket();
  socket.emit("poll-closed", { eventId, pollId });
}

export function emitQAQuestion(eventId: string, question: QAQuestion) {
  const socket = getSocket();
  socket.emit("qa-question", { eventId, question });
}

export function emitQAUpvoted(eventId: string, questionId: string, question: QAQuestion) {
  const socket = getSocket();
  socket.emit("qa-upvoted", { eventId, questionId, question });
}

export function emitQAAnswered(eventId: string, questionId: string, question: QAQuestion) {
  const socket = getSocket();
  socket.emit("qa-answered", { eventId, questionId, question });
}

export function emitQADeleted(eventId: string, questionId: string) {
  const socket = getSocket();
  socket.emit("qa-deleted", { eventId, questionId });
}

export function emitReaction(eventId: string, reaction: Reaction) {
  const socket = getSocket();
  socket.emit("reaction", { eventId, reaction });
}

// Discussion event emitters
export function joinDiscussion(eventId: string, userId: string, userName: string) {
  const socket = getSocket();
  socket.emit("join-discussion", { eventId, userId, userName });
}

export function leaveDiscussion(eventId: string, userId: string) {
  const socket = getSocket();
  socket.emit("leave-discussion", { eventId, userId });
}

export function emitDiscussionThreadCreated(eventId: string, thread: DiscussionThread) {
  const socket = getSocket();
  socket.emit("discussion-thread-created", { eventId, thread });
}

export function emitDiscussionReplyCreated(
  eventId: string,
  threadId: string,
  reply: DiscussionReply
) {
  const socket = getSocket();
  socket.emit("discussion-reply-created", { eventId, threadId, reply });
}

export function emitDiscussionTyping(
  eventId: string,
  threadId: string | null,
  userId: string,
  userName: string,
  isTyping: boolean
) {
  const socket = getSocket();
  socket.emit("discussion-typing", { eventId, threadId, userId, userName, isTyping });
}

// Notification event types
export interface GeoNotification {
  id: string;
  event_id: string;
  title: string;
  message: string;
  distance: number;
  type: "geo_notification";
  created_at: string;
}

export interface NewNotificationEvent {
  id: string;
  event_id: string;
  title: string;
  message: string;
  distance: number;
  type: string;
  created_at: string;
}

// Notification subscription helpers
export function subscribeNotifications(userId: string) {
  const socket = getSocket();
  socket.emit("subscribe_notifications", { user_id: userId });
}

export function unsubscribeNotifications() {
  const socket = getSocket();
  socket.emit("unsubscribe_notifications");
}

// --- Influencer Collaboration Real-Time Messaging ---

export interface CollaborationMessage {
  id: string;
  collaboration_id: string;
  sender_id: string;
  sender_role: 'organizer' | 'influencer';
  content: string;
  attachments?: string[];
  created_at: string;
}

export function joinCollaboration(collaborationId: string) {
  const socket = getSocket();
  socket.emit("join_collaboration", { collaboration_id: collaborationId });
}

export function leaveCollaboration(collaborationId: string) {
  const socket = getSocket();
  socket.emit("leave_collaboration", { collaboration_id: collaborationId });
}

export function sendCollaborationMessage(collaborationId: string, content: string, attachments?: string[]) {
  const socket = getSocket();
  socket.emit("send_collaboration_message", {
    collaboration_id: collaborationId,
    content: content,
    attachments: attachments,
  });
}

export function markCollaborationMessagesRead(collaborationId: string, messageIds?: string[]) {
  const socket = getSocket();
  socket.emit("mark_messages_read", {
    collaboration_id: collaborationId,
    message_ids: messageIds,
  });
}

export function onNewNotification(callback: (notification: NewNotificationEvent) => void) {
  const socket = getSocket();
  socket.on("new_notification", callback);
  return () => socket.off("new_notification", callback);
}
