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
      const res = await fetch("/api/auth/me", { cache: "no-store" });
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

  const dealStatusStyle = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-50 border-green-200/60";
      case "accepted": return "bg-lime/5 border-lime/30";
      case "completed": return "bg-neutral-50 border-neutral-200/60";
      case "cancelled": return "bg-red-50 border-red-200/60";
      default: return "bg-amber-50 border-amber-200/60";
    }
  };

  const dealStatusBadge = (status: string) => {
    switch (status) {
      case "proposed": return "bg-amber-100 text-amber-700";
      case "accepted": return "bg-lime/20 text-dark";
      case "paid": return "bg-green-100 text-green-700";
      case "completed": return "bg-neutral-100 text-neutral-600";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-neutral-200/60 shadow-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-200/60">
          {conversation?.provider_avatar ? (
            <img src={conversation.provider_avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          )}
        </div>
        <div>
          <h1 className="font-semibold text-sm text-neutral-900">{conversation?.provider_name || "Chat"}</h1>
          <p className="text-[11px] text-neutral-400">Marketplace conversation</p>
        </div>
      </div>

      {/* Disclaimer Banner */}
      {showDisclaimer && disclaimer && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5 mb-5">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2 text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {disclaimer.title}
          </h3>
          <p className="text-sm text-amber-700 mb-4 leading-relaxed">{disclaimer.body}</p>
          <button
            onClick={handleAcceptDisclaimer}
            disabled={acceptingDisclaimer}
            className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-40"
          >
            {acceptingDisclaimer ? "Accepting..." : "I Understand & Accept"}
          </button>
        </div>
      )}

      {/* Deals Section */}
      {conversation?.disclaimer_accepted && deals.length > 0 && (
        <div className="mb-4 space-y-3">
          {deals.map((deal) => (
            <div key={deal.id} className={`rounded-2xl border p-4 ${dealStatusStyle(deal.status)}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-neutral-900">{deal.title}</h4>
                  {deal.description && <p className="text-xs text-neutral-600 mt-1">{deal.description}</p>}
                  <p className="text-lg font-bold text-dark mt-2">₦{deal.amount.toLocaleString()}</p>
                  <span className={`inline-block mt-2 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${dealStatusBadge(deal.status)}`}>
                    {deal.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {deal.status === "proposed" && isProvider && (
                    <button
                      onClick={() => handleAcceptDeal(deal.id)}
                      className="px-4 py-2 bg-lime text-dark rounded-xl text-xs font-semibold hover:bg-lime-hover transition-colors"
                    >
                      Accept
                    </button>
                  )}
                  {deal.status === "accepted" && isBuyer && (
                    <button
                      onClick={() => handlePayDeal(deal.id)}
                      disabled={payingDeal === deal.id}
                      className="px-4 py-2 bg-dark text-white rounded-xl text-xs font-semibold hover:bg-[#0d2730] transition-colors disabled:opacity-40"
                    >
                      {payingDeal === deal.id ? (
                        <span className="flex items-center gap-1.5">
                          <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Paying...
                        </span>
                      ) : "Pay Now"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="h-6 w-6 border-2 border-neutral-300 border-t-dark rounded-full animate-spin" />
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => {
              const isSystem = msg.message_type === "system";
              const isMe = msg.sender_id === userId;
              return (
                <div key={msg.id} className={`flex ${isSystem ? "justify-center" : isMe ? "justify-end" : "justify-start"}`}>
                  {isSystem ? (
                    <div className="text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 px-3 py-1.5 rounded-full">
                      {msg.content}
                    </div>
                  ) : (
                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 ${
                      isMe
                        ? "bg-dark text-white rounded-2xl rounded-br-md"
                        : "bg-neutral-100 text-neutral-900 rounded-2xl rounded-bl-md"
                    }`}>
                      <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? "text-white/40" : "text-neutral-400"}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-neutral-400">
              No messages yet. Say hello!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {conversation?.disclaimer_accepted && (
          <div className="border-t border-neutral-100 p-4">
            {/* Deal Form Toggle */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setShowDealForm(!showDealForm)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  showDealForm ? "bg-dark text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showDealForm ? "Cancel" : "Propose Deal"}
              </button>
            </div>

            {/* Deal Form */}
            {showDealForm && (
              <form onSubmit={handleCreateDeal} className="mb-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100 space-y-3">
                <input
                  type="text"
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="Deal title (e.g. DJ for 4 hours)"
                  className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime/20 focus:border-lime transition-all"
                  required
                />
                <textarea
                  value={dealDescription}
                  onChange={(e) => setDealDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime/20 focus:border-lime transition-all resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">₦</span>
                    <input
                      type="number"
                      value={dealAmount}
                      onChange={(e) => setDealAmount(e.target.value)}
                      placeholder="Amount"
                      min="1"
                      className="w-full pl-7 pr-3 py-2.5 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime/20 focus:border-lime transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={creatingDeal}
                    className="px-5 py-2.5 bg-lime text-dark rounded-xl text-sm font-semibold hover:bg-lime-hover transition-colors disabled:opacity-40"
                  >
                    {creatingDeal ? "Creating..." : "Propose"}
                  </button>
                </div>
              </form>
            )}

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime/20 focus:border-lime transition-all"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-5 py-3 bg-dark text-white rounded-xl text-sm font-medium hover:bg-[#0d2730] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
