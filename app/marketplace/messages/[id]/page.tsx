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

interface Deal {
  id: string;
  conversation_id: string;
  buyer_id: string;
  provider_user_id: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  completed_at: string | null;
  buyer_name: string | null;
  provider_name: string | null;
  created_at: string;
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [disclaimer, setDisclaimer] = useState<Disclaimer | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [acceptingDisclaimer, setAcceptingDisclaimer] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [showDealForm, setShowDealForm] = useState(false);
  const [dealTitle, setDealTitle] = useState("");
  const [dealDescription, setDealDescription] = useState("");
  const [dealAmount, setDealAmount] = useState("");
  const [creatingDeal, setCreatingDeal] = useState(false);
  const [payingDeal, setPayingDeal] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversation();
    fetchMessages();
    fetchDeals();
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
    } catch { /* silent */ }
  }

  async function fetchConversation() {
    try {
      const res = await fetch(`/api/marketplace/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setConversation(data);
        if (!data.disclaimer_accepted) setShowDisclaimer(true);
      }
    } catch { /* silent */ }
  }

  async function fetchMessages() {
    try {
      const res = await fetch(`/api/marketplace/conversations/${id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch { /* silent */ } finally { setLoading(false); }
  }

  async function fetchDeals() {
    try {
      const res = await fetch(`/api/marketplace/deals?conversation_id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setDeals(data.deals || []);
      }
    } catch { /* silent */ }
  }

  async function fetchDisclaimer() {
    try {
      const res = await fetch("/api/marketplace/disclaimer");
      if (res.ok) setDisclaimer(await res.json());
    } catch { /* silent */ }
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
        } catch { /* silent */ }
      }
    } catch { /* silent */ } finally { setAcceptingDisclaimer(false); }
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
      if (res.ok) { setNewMessage(""); fetchMessages(); }
    } catch { /* silent */ } finally { setSending(false); }
  }

  async function handleCreateDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!dealTitle.trim() || !dealAmount || creatingDeal) return;
    setCreatingDeal(true);
    try {
      const res = await fetch("/api/marketplace/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: id,
          title: dealTitle.trim(),
          description: dealDescription.trim() || undefined,
          amount: parseFloat(dealAmount),
        }),
      });
      if (res.ok) {
        setShowDealForm(false);
        setDealTitle("");
        setDealDescription("");
        setDealAmount("");
        fetchDeals();
        fetchMessages();
      }
    } catch { /* silent */ } finally { setCreatingDeal(false); }
  }

  async function handleAcceptDeal(dealId: string) {
    try {
      const res = await fetch("/api/marketplace/deals/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal_id: dealId }),
      });
      if (res.ok) { fetchDeals(); fetchMessages(); }
    } catch { /* silent */ }
  }

  async function handlePayDeal(dealId: string) {
    setPayingDeal(dealId);
    try {
      const res = await fetch("/api/marketplace/deals/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal_id: dealId }),
      });
      if (res.ok) { fetchDeals(); fetchMessages(); }
      else {
        const data = await res.json();
        alert(data.detail || "Payment failed");
      }
    } catch { alert("Payment failed"); } finally { setPayingDeal(null); }
  }

  const isProvider = userId === conversation?.provider_user_id;
  const isBuyer = userId === conversation?.buyer_id;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-neutral-500 hover:text-neutral-700">← Back</button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden">
          {conversation?.provider_avatar ? (
            <img src={conversation.provider_avatar} alt="" className="w-full h-full object-cover" />
          ) : <span>👤</span>}
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
          <button onClick={handleAcceptDisclaimer} disabled={acceptingDisclaimer}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50">
            {acceptingDisclaimer ? "Accepting..." : "I Understand & Accept"}
          </button>
        </div>
      )}

      {/* Deals Section */}
      {conversation?.disclaimer_accepted && deals.length > 0 && (
        <div className="mb-4 space-y-3">
          {deals.map((deal) => (
            <div key={deal.id} className={`rounded-xl border p-4 ${
              deal.status === "paid" ? "bg-green-50 border-green-200" :
              deal.status === "accepted" ? "bg-blue-50 border-blue-200" :
              deal.status === "completed" ? "bg-purple-50 border-purple-200" :
              deal.status === "cancelled" ? "bg-red-50 border-red-200" :
              "bg-neutral-50 border-neutral-200"
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-neutral-900">{deal.title}</h4>
                  {deal.description && <p className="text-sm text-neutral-600 mt-1">{deal.description}</p>}
                  <p className="text-lg font-bold text-neutral-900 mt-2">₦{deal.amount.toLocaleString()}</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                    deal.status === "proposed" ? "bg-yellow-100 text-yellow-700" :
                    deal.status === "accepted" ? "bg-blue-100 text-blue-700" :
                    deal.status === "paid" ? "bg-green-100 text-green-700" :
                    deal.status === "completed" ? "bg-purple-100 text-purple-700" :
                    "bg-neutral-100 text-neutral-600"
                  }`}>{deal.status.replace("_", " ").toUpperCase()}</span>
                </div>
                <div className="flex gap-2">
                  {deal.status === "proposed" && isProvider && (
                    <button onClick={() => handleAcceptDeal(deal.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                      Accept
                    </button>
                  )}
                  {deal.status === "accepted" && isBuyer && (
                    <button onClick={() => handlePayDeal(deal.id)} disabled={payingDeal === deal.id}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50">
                      {payingDeal === deal.id ? "Paying..." : "Pay Now"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center text-neutral-400 text-sm py-8">Loading messages...</div>
          ) : messages.length > 0 ? (
            messages.map((msg) => {
              const isSystem = msg.message_type === "system";
              const isMe = msg.sender_id === userId;
              return (
                <div key={msg.id} className={`flex ${isSystem ? "justify-center" : isMe ? "justify-end" : "justify-start"}`}>
                  {isSystem ? (
                    <div className="text-xs text-neutral-500 bg-neutral-50 px-3 py-1 rounded-full">{msg.content}</div>
                  ) : (
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isMe ? "bg-blue-600 text-white rounded-br-md" : "bg-neutral-100 text-neutral-900 rounded-bl-md"
                    }`}>
                      {msg.is_flagged && <p className="text-xs text-amber-400 mb-1">⚠️ This message was flagged</p>}
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-neutral-400"}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  )}
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
          <div className="border-t border-neutral-200 p-4">
            {/* Deal Form */}
            {showDealForm && (
              <form onSubmit={handleCreateDeal} className="mb-3 bg-neutral-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-neutral-900">Create Deal</h4>
                  <button type="button" onClick={() => setShowDealForm(false)} className="text-neutral-400 hover:text-neutral-600 text-sm">✕</button>
                </div>
                <input type="text" value={dealTitle} onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="Deal title (e.g. DJ services for event)" required
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm" />
                <input type="number" value={dealAmount} onChange={(e) => setDealAmount(e.target.value)}
                  placeholder="Amount (₦)" required min="1" step="0.01"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm" />
                <input type="text" value={dealDescription} onChange={(e) => setDealDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm" />
                <button type="submit" disabled={creatingDeal}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                  {creatingDeal ? "Creating..." : "Propose Deal"}
                </button>
              </form>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <button type="button" onClick={() => setShowDealForm(!showDealForm)}
                className="px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-medium hover:bg-green-100 shrink-0">
                💰 Deal
              </button>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..." className="flex-1 px-4 py-2 border border-neutral-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={sending} />
              <button type="submit" disabled={!newMessage.trim() || sending}
                className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="border-t border-neutral-200 p-4 text-center">
            <p className="text-sm text-neutral-400">Accept the disclaimer above to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
