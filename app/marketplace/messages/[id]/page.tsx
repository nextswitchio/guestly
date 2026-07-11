"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  message_type: string;
  is_flagged: boolean;
  sender_name: string | null;
  sender_avatar: string | null;
  created_at: string;
}

interface Conversation {
  id: string;
  buyer_id: string;
  provider_user_id: string;
  provider_name: string | null;
  provider_avatar: string | null;
  disclaimer_accepted: boolean;
}

interface Disclaimer {
  title: string;
  body: string;
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [disclaimer, setDisclaimer] = useState<Disclaimer | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [acceptingDisclaimer, setAcceptingDisclaimer] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversation();
    fetchMessages();
    fetchDisclaimer();
    fetchUserId();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchUserId() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUserId(data.user?.id || data.id || "");
      }
    } catch {
      // silent
    }
  }

  async function fetchConversation() {
    try {
      const res = await fetch(`/api/marketplace/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setConversation(data);
        if (!data.disclaimer_accepted) {
          setShowDisclaimer(true);
        }
      }
    } catch {
      // silent
    }
  }

  async function fetchMessages() {
    try {
      const res = await fetch(`/api/marketplace/conversations/${id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function fetchDisclaimer() {
    try {
      const res = await fetch("/api/marketplace/disclaimer");
      if (res.ok) {
        setDisclaimer(await res.json());
      }
    } catch {
      // silent
    }
  }

  async function handleAcceptDisclaimer() {
    setAcceptingDisclaimer(true);
    try {
      const res = await fetch("/api/marketplace/disclaimer/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: id }),
      });
      if (res.ok) {
        setShowDisclaimer(false);
        setConversation((prev) => prev ? { ...prev, disclaimer_accepted: true } : prev);
        // Play notification sound
        try {
          const audioCtx = new AudioContext();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.frequency.value = 800;
          oscillator.type = "sine";
          gainNode.gain.value = 0.3;
          oscillator.start();
          setTimeout(() => { oscillator.stop(); audioCtx.close(); }, 300);
        } catch {
          // silent
        }
      }
    } catch {
      // silent
    } finally {
      setAcceptingDisclaimer(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/marketplace/conversations/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-neutral-500 hover:text-neutral-700">
          ← Back
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden">
          {conversation?.provider_avatar ? (
            <img src={conversation.provider_avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <span>👤</span>
          )}
        </div>
        <div>
          <h1 className="font-semibold text-neutral-900">{conversation?.provider_name || "Chat"}</h1>
        </div>
      </div>

      {/* Disclaimer Banner */}
      {showDisclaimer && disclaimer && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <span className="text-xl">⚠️</span> {disclaimer.title}
          </h3>
          <p className="text-sm text-amber-700 mb-4 leading-relaxed">{disclaimer.body}</p>
          <button
            onClick={handleAcceptDisclaimer}
            disabled={acceptingDisclaimer}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50"
          >
            {acceptingDisclaimer ? "Accepting..." : "I Understand & Accept"}
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center text-neutral-400 text-sm py-8">Loading messages...</div>
          ) : messages.length > 0 ? (
            messages.map((msg) => {
              const isMe = msg.sender_id === userId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-neutral-100 text-neutral-900 rounded-bl-md"
                  }`}>
                    {msg.is_flagged && (
                      <p className="text-xs text-amber-400 mb-1">⚠️ This message was flagged</p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-neutral-400"}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-neutral-400 text-sm py-8">No messages yet. Say hello!</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {conversation?.disclaimer_accepted ? (
          <form onSubmit={handleSendMessage} className="border-t border-neutral-200 p-4 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-neutral-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        ) : (
          <div className="border-t border-neutral-200 p-4 text-center">
            <p className="text-sm text-neutral-400">Accept the disclaimer above to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
