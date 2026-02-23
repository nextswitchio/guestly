"use client";
import React from "react";
import { getSocket, ChatMessage, EventRoomState } from "@/lib/websocket";
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
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
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
      scrollToBottom();
    }

    function onNewMessage(msg: ChatMessage) {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    }

    function onUserJoined(data: { userId: string; userName: string; userCount: number }) {
      setUserCount(data.userCount);
      addToast(`${data.userName} joined`, "info");
    }

    function onUserLeft(data: { userId: string; userCount: number }) {
      setUserCount(data.userCount);
    }

    socket.on("connect", onConnect);
    socket.on("room-state", onRoomState);
    socket.on("new-message", onNewMessage);
    socket.on("user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);

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
      socket.emit("leave-event", { eventId, userId });
    };
  }, [eventId, userId, userName, addToast, scrollToBottom]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const socket = getSocket();
    socket.emit("send-message", { eventId, userId, userName, message: input });
    setInput("");
    inputRef.current?.focus();
  }

  function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function isOwnMessage(msg: ChatMessage) {
    return msg.userId === userId;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-neutral-900">Live Chat</h3>
        <div className="flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-700">
          <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
          <UsersIcon />
          <span>{userCount}</span>
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
      </div>

      {/* Input */}
      <form onSubmit={send} className="border-t border-neutral-100 px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-100"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
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
