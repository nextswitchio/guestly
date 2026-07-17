"use client";

import React, { useState, useEffect } from "react";

interface Ticket {
  id: string;
  subject: string;
  status: string;
  user_name: string;
  user_email: string;
  message: string;
  created_at: string;
  replies: any[];
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/support/tickets", { credentials: "include" });
      if (!res.ok) {
        setError(`Server error: ${res.status}`);
        return;
      }
      const data = await res.json();
      setTickets(data.tickets ?? []);
    } catch (e: any) {
      setError(e.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const sendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setSending(true);
    try {
      await fetch(`/api/admin/support/tickets/${selectedTicket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reply", message: replyText }),
        credentials: "include",
      });
      setReplyText("");
      fetchTickets();
    } catch (e: any) {
      setError(e.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const changeStatus = async (id: string, action: string) => {
    await fetch(`/api/admin/support/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
      credentials: "include",
    });
    fetchTickets();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-lime border-t-transparent rounded-full mx-auto mb-3" />
          Loading tickets...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-2">{error}</div>
        <button onClick={fetchTickets} className="text-lime underline">Retry</button>
      </div>
    );
  }

  if (selectedTicket) {
    const t = selectedTicket;
    return (
      <div className="max-w-3xl mx-auto p-6">
        <button onClick={() => setSelectedTicket(null)} className="text-lime mb-4 block">← Back to tickets</button>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{t.subject}</h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              t.status === "open" ? "bg-red-100 text-red-700" :
              t.status === "in_progress" ? "bg-blue-100 text-blue-700" :
              "bg-green-100 text-green-700"
            }`}>{t.status}</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">{t.user_name} ({t.user_email})</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-1">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{t.message}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(t.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {t.replies?.map((r: any) => (
            <div key={r.id} className={`flex ${r.is_staff_reply ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-xl px-4 py-2.5 ${
                r.is_staff_reply ? "bg-lime text-black" : "bg-gray-100 text-gray-700"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{r.message}</p>
                <p className="text-[10px] opacity-50 mt-1">{r.user_name} · {new Date(r.created_at).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>

        {t.status !== "resolved" && t.status !== "closed" && (
          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendReply()}
              placeholder="Type your reply..."
              className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-lime"
            />
            <button onClick={sendReply} disabled={!replyText.trim() || sending}
              className="bg-lime text-black px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">
              {sending ? "..." : "Send"}
            </button>
            <button onClick={() => changeStatus(t.id, "resolve")}
              className="bg-green-100 text-green-700 px-4 py-2.5 rounded-xl text-sm font-medium">
              Resolve
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-sm text-gray-500">{tickets.length} total</p>
        </div>
        <button onClick={fetchTickets} className="text-sm text-lime underline">Refresh</button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No support tickets yet</p>
          <p className="text-sm mt-1">Tickets from users will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className="w-full text-left bg-white border rounded-xl p-4 hover:border-lime transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{t.subject}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  t.status === "open" ? "bg-red-100 text-red-700" :
                  t.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                }`}>{t.status}</span>
              </div>
              <p className="text-sm text-gray-500">{t.user_name || t.user_email}</p>
              <p className="text-xs text-gray-400 mt-1 truncate">{t.message.substring(0, 100)}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(t.created_at).toLocaleString()}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
