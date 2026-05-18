"use client";
import { Award, Hand, Dumbbell, Flame, HandHelping, Heart, Laugh, Mic, Music, PartyPopper, Rocket, Smile, Sparkles, Star, ThumbsUp } from 'lucide-react';
import React from "react";
import { getSocket, ChatMessage, EventRoomState, UserPresence } from "@/lib/websocket";
import { useToast } from "@/components/ui/ToastProvider";

// ── Icons ────────────────────────────────────────────────────────────────────

function SendIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg className="h-10 w-10 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function SmileIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </svg>
  );
}

// ── Emoji Picker ─────────────────────────────────────────────────────────────

const EMOJI_LIST = [
  { id: "smile", icon: <Smile className="h-5 w-5" /> },
  { id: "laugh", icon: <Laugh className="h-5 w-5" /> },
  { id: "heart", icon: <Heart className="h-5 w-5" /> },
  { id: "party", icon: <PartyPopper className="h-5 w-5" /> },
  { id: "thumbsup", icon: <ThumbsUp className="h-5 w-5" /> },
  { id: "wave", icon: <Hand className="h-5 w-5" /> },
  { id: "fire", icon: <Flame className="h-5 w-5" /> },
  { id: "sparkles", icon: <Sparkles className="h-5 w-5" /> },
  { id: "helping", icon: <HandHelping className="h-5 w-5" /> },
  { id: "award", icon: <Award className="h-5 w-5" /> },
  { id: "rocket", icon: <Rocket className="h-5 w-5" /> },
  { id: "star", icon: <Star className="h-5 w-5" /> },
  { id: "dumbbell", icon: <Dumbbell className="h-5 w-5" /> },
  { id: "music", icon: <Music className="h-5 w-5" /> },
  { id: "mic", icon: <Mic className="h-5 w-5" /> },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.emoji-picker')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="emoji-picker absolute bottom-full right-0 mb-2 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
      <div className="grid grid-cols-5 gap-1">
        {EMOJI_LIST.map(({ id, icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              onSelect(id);
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-neutral-100"
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Props ────────────────────────────────────────────────────────────────────

interface ChatPanelProps {
  eventId: string;
  userId: string;
  userName: string;
}

export default function ChatPanel({ eventId, userId, userName }: ChatPanelProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [userCount, setUserCount] = React.useState(0);
  const [onlineUsers, setOnlineUsers] = React.useState<UserPresence[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [typingUsers, setTypingUsers] = React.useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const { addToast } = useToast();

  const scrollToBottom = React.useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  React.useEffect(() => {
    const socket = getSocket();

    function onConnect() {
      socket.emit("join-event", { eventId, userId, userName });
    }

    function onRoomState(state: EventRoomState) {
      setMessages(state.messages);
      setUserCount(state.userCount);
      if (state.onlineUsers) {
        setOnlineUsers(state.onlineUsers);
      }
      scrollToBottom();
    }

    function onNewMessage(msg: ChatMessage) {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    }

    function onUserJoined(data: { userId: string; userName: string; userCount: number }) {
      setUserCount(data.userCount);
      addToast(`${data.userName} joined`, { type: "info" });
    }

    function onUserLeft(data: { userId: string; userCount: number }) {
      setUserCount(data.userCount);
    }

    function onPresenceUpdate(data: { onlineUsers: UserPresence[] }) {
      setOnlineUsers(data.onlineUsers);
    }

    function onUserTyping(data: { userId: string; userName: string; isTyping: boolean }) {
      if (data.userId === userId) return; // Ignore own typing
      
      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (data.isTyping) {
          next.add(data.userName);
        } else {
          next.delete(data.userName);
        }
        return next;
      });
    }

    socket.on("connect", onConnect);
    socket.on("room-state", onRoomState);
    socket.on("new-message", onNewMessage);
    socket.on("user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);
    socket.on("presence-update", onPresenceUpdate);
    socket.on("user-typing", onUserTyping);

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("room-state", onRoomState);
      socket.off("new-message", onNewMessage);
      socket.off("user-joined", onUserJoined);
      socket.off("user-left", onUserLeft);
      socket.off("presence-update", onPresenceUpdate);
      socket.off("user-typing", onUserTyping);
      socket.emit("leave-event", { eventId, userId });
    };
  }, [eventId, userId, userName, addToast, scrollToBottom]);

  function handleInputChange(value: string) {
    setInput(value);

    // Emit typing indicator
    const socket = getSocket();
    if (value && !isTyping) {
      setIsTyping(true);
      socket.emit("typing", { eventId, userId, userName, isTyping: true });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing", { eventId, userId, userName, isTyping: false });
    }, 2000);
  }

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const socket = getSocket();
    socket.emit("send-message", { eventId, userId, userName, message: input });
    setInput("");
    setIsTyping(false);
    socket.emit("typing", { eventId, userId, userName, isTyping: false });
    inputRef.current?.focus();
  }

  function insertEmoji(emoji: string) {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  }

  function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function isOwnMessage(msg: ChatMessage) {
    return msg.userId === userId;
  }

  const typingText = React.useMemo(() => {
    const users = Array.from(typingUsers);
    if (users.length === 0) return null;
    if (users.length === 1) return `${users[0]} is typing...`;
    if (users.length === 2) return `${users[0]} and ${users[1]} are typing...`;
    return `${users.length} people are typing...`;
  }, [typingUsers]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-neutral-900">Live Chat</h3>
        <div className="flex items-center gap-3">
          {/* Online users indicator */}
          {onlineUsers.length > 0 && (
            <div className="group relative">
              <div className="flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-700 cursor-pointer">
                <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
                <UsersIcon />
                <span>{onlineUsers.length}</span>
              </div>
              {/* Tooltip with online users */}
              <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg group-hover:block z-10">
                <p className="mb-1 text-xs font-semibold text-neutral-700">Online now</p>
                <div className="max-h-32 overflow-y-auto">
                  {onlineUsers.map((user) => (
                    <div key={user.userId} className="flex items-center gap-2 py-1">
                      <span className="h-2 w-2 rounded-full bg-success-500" />
                      <span className="text-xs text-neutral-600">{user.userName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Total user count */}
          <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
            <UsersIcon />
            <span>{userCount}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <ChatBubbleIcon />
            <div>
              <p className="text-sm font-medium text-neutral-700">No messages yet</p>
              <p className="mt-0.5 text-xs text-neutral-400">Be the first to say hello!</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => {
              const own = isOwnMessage(msg);
              const isSystem = msg.type === "system";

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center text-xs text-neutral-400">
                    {msg.message}
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex flex-col ${own ? "items-end" : "items-start"}`}>
                  {!own && (
                    <span className="mb-0.5 text-xs font-medium text-neutral-500">{msg.userName}</span>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${own
                        ? "rounded-br-md bg-primary-600 text-white"
                        : "rounded-bl-md bg-neutral-100 text-neutral-800"
                      }`}
                  >
                    {msg.message}
                  </div>
                  <span className="mt-0.5 text-[10px] text-neutral-400">{formatTime(msg.timestamp)}</span>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Typing indicator */}
        {typingText && (
          <div className="mt-2 text-xs italic text-neutral-400">
            {typingText}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={send} className="border-t border-neutral-100 px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-100"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-700"
            >
              <SmileIcon />
            </button>
            {showEmojiPicker && (
              <EmojiPicker
                onSelect={insertEmoji}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white transition hover:bg-primary-700 disabled:opacity-40 disabled:hover:bg-primary-600"
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
}
