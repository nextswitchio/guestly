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
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
  }
  return socket;
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
