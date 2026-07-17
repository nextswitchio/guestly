"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";

interface TicketReply {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_staff_reply: boolean;
  created_at: string;
  user_name: string;
}

interface Ticket {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
  category: string | null;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  updated_at: string;
  replies: TicketReply[];
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-red-100 text-red-700 border-red-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-700 border-gray-200",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

type SocketEvent = "connect" | "disconnect" | "support_history" | "support_new_message" | "support_typing" | "support_typing_stop";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"open" | "resolved">("open");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [online, setOnline] = useState(false);
  const [newTicketAlert, setNewTicketAlert] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/support/tickets", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets ?? []);
      }
    } catch (e) {
      console.error("Failed to fetch tickets:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, []);

  // Socket.IO connection
  useEffect(() => {
    const loadSocket = async () => {
      const { io } = await import("socket.io-client");
      const token = document.cookie.split("; ").find((r) => r.startsWith("access_token="))?.split("=")[1];

      const socket = io("https://guestly-backend-production.up.railway.app", {
        path: "/socket.io",
        transports: ["websocket"],
        auth: { token },
        reconnection: true,
      });

      socket.on("connect", () => setOnline(true));
      socket.on("disconnect", () => setOnline(false));

      socket.on("support_new_message", (msg: TicketReply) => {
        setTickets((prev) =>
          prev.map((t) =>
            t.id === msg.ticket_id ? { ...t, replies: [...t.replies, msg], updated_at: msg.created_at } : t
          )
        );
        if (msg.ticket_id !== activeTicketId) setNewTicketAlert(true);
        scrollToBottom();
      });

      socket.on("support_history", (data: { ticket_id: string; messages: TicketReply[] }) => {
        setTickets((prev) =>
          prev.map((t) => (t.id === data.ticket_id ? { ...t, replies: data.messages } : t))
        );
      });

      socket.on("support_typing", () => { setUserTyping(true); clearTypingTimer(); });
      socket.on("support_typing_stop", () => { setUserTyping(false); clearTypingTimer(); });

      socketRef.current = socket;
    };

    loadSocket();
    return () => { socketRef.current?.disconnect(); };
  }, [activeTicketId]);

  useEffect(() => {
    if (activeTicketId && socketRef.current?.connected) {
      socketRef.current.emit("join_support_chat", { ticket_id: activeTicketId });
      setNewTicketAlert(false);
    }
  }, [activeTicketId]);

  const clearTypingTimer = () => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setUserTyping(false), 3000);
  };

  const sendReply = async () => {
    const text = replyText.trim();
    if (!text || !activeTicketId) return;
    setSending(true);

    try {
      await fetch(`/api/admin/support/tickets/${activeTicketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reply", message: text }),
        credentials: "include",
      });
      setReplyText("");

      // Refresh ticket data
      const res = await fetch("/api/admin/support/tickets", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets ?? []);
      }
    } catch (e) {
      console.error("Failed to send reply:", e);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const changeStatus = async (ticketId: string, status: string) => {
    try {
      await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: status }),
        credentials: "include",
      });
      fetchTickets();
      if (status === "resolve") setActiveTicketId(null);
    } catch (e) {
      console.error("Failed to update ticket:", e);
    }
  };

  const changePriority = async (ticketId: string, priority: string) => {
    try {
      await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
        credentials: "include",
      });
      fetchTickets();
    } catch (e) {
      console.error("Failed to update priority:", e);
    }
  };

  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in_progress");
  const resolvedTickets = tickets.filter((t) => t.status === "resolved" || t.status === "closed");
  const displayedTickets = activeTab === "open" ? openTickets : resolvedTickets;
  const activeTicket = tickets.find((t) => t.id === activeTicketId);

  return (
    <div className="flex h-[calc(100vh-6rem)]">
      {/* Left Panel - Ticket List */}
      <div className={`${activeTicketId ? "hidden" : "w-full"} lg:w-96 lg:block border-r border-gray-100 flex flex-col`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Customer Control Center</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${online ? "bg-green-500" : "bg-red-400"}`} />
                <span className="text-xs text-gray-400">{online ? "Live" : "Offline"}</span>
                {newTicketAlert && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full font-medium animate-pulse">
                    New
                  </span>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={fetchTickets} size="sm">
              ↻ Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-red-50 rounded-lg py-2">
              <div className="font-bold text-red-600 text-lg">{openTickets.length}</div>
              <div className="text-red-500">Open</div>
            </div>
            <div className="bg-blue-50 rounded-lg py-2">
              <div className="font-bold text-blue-600 text-lg">
                {tickets.filter((t) => t.status === "in_progress").length}
              </div>
              <div className="text-blue-500">In Progress</div>
            </div>
            <div className="bg-green-50 rounded-lg py-2">
              <div className="font-bold text-green-600 text-lg">{resolvedTickets.length}</div>
              <div className="text-green-500">Resolved</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(["open", "resolved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-lime border-b-2 border-lime"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === "open" ? `Open (${openTickets.length})` : `Resolved (${resolvedTickets.length})`}
            </button>
          ))}
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">Loading...</div>
          ) : displayedTickets.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">🎉</p>
              <p>{activeTab === "open" ? "No open tickets" : "No resolved tickets"}</p>
            </div>
          ) : (
            displayedTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => { setActiveTicketId(ticket.id); setNewTicketAlert(false); }}
                className={`w-full text-left p-4 border-b border-gray-50 transition-colors hover:bg-gray-50 ${
                  activeTicketId === ticket.id ? "bg-lime/5 border-l-4 border-l-lime" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-900 truncate pr-2">{ticket.subject}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[ticket.status]}`}>
                    {ticket.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate mb-2">
                  {ticket.user_name || ticket.user_email || "Anonymous"}
                </p>
                <p className="text-xs text-gray-400 truncate">{ticket.message.substring(0, 80)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${PRIORITY_COLORS[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {format(new Date(ticket.updated_at), "MMM d, HH:mm")}
                  </span>
                  {ticket.replies.some((r) => !r.is_staff_reply && new Date(r.created_at) > new Date(Date.now() - 60000)) && (
                    <span className="w-2 h-2 rounded-full bg-lime" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className={`${activeTicketId ? "flex" : "hidden lg:flex"} flex-col flex-1`}>
        {!activeTicket ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-lg font-medium">Customer Control Center</p>
              <p className="text-sm">Select a ticket to start chatting</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <button className="lg:hidden text-gray-500 mr-3" onClick={() => setActiveTicketId(null)}>
                ← Back
              </button>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">{activeTicket.subject}</h2>
                <p className="text-xs text-gray-500">
                  {activeTicket.user_name} ({activeTicket.user_email}) · {activeTicket.category || "General"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Priority */}
                <select
                  value={activeTicket.priority}
                  onChange={(e) => changePriority(activeTicket.id, e.target.value)}
                  className="text-xs border rounded-lg px-2 py-1 bg-white"
                >
                  {["low", "medium", "high", "urgent"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                {/* Actions */}
                {activeTicket.status !== "resolved" && activeTicket.status !== "closed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => changeStatus(activeTicket.id, "resolve")}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    ✓ Resolve
                  </Button>
                )}
                {activeTicket.status === "resolved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => changeStatus(activeTicket.id, "reopen")}
                    className="text-blue-600 border-blue-200"
                  >
                    ↻ Reopen
                  </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {/* Initial message */}
              <div className="flex justify-start">
                <div className="max-w-[75%] bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{activeTicket.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {activeTicket.user_name} · {format(new Date(activeTicket.created_at), "MMM d, HH:mm")}
                  </p>
                </div>
              </div>

              {/* Replies */}
              {activeTicket.replies?.map((reply) => (
                <div
                  key={reply.id}
                  className={`flex ${reply.is_staff_reply ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                      reply.is_staff_reply
                        ? "bg-lime text-black rounded-tr-sm"
                        : "bg-white border border-gray-100 rounded-tl-sm"
                    }`}
                  >
                    <p
                      className={`text-sm whitespace-pre-wrap ${
                        reply.is_staff_reply ? "text-black" : "text-gray-700"
                      }`}
                    >
                      {reply.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] ${reply.is_staff_reply ? "text-black/50" : "text-gray-400"}`}>
                        {reply.user_name}
                      </span>
                      <span className={`text-[10px] ${reply.is_staff_reply ? "text-black/40" : "text-gray-400"}`}>
                        {format(new Date(reply.created_at), "HH:mm")}
                      </span>
                      {reply.is_staff_reply && (
                        <span className="text-[10px] text-black/40">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {userTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            {activeTicket.status !== "resolved" && activeTicket.status !== "closed" && (
              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendReply();
                      }
                    }}
                    placeholder="Type your reply..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-lime focus:ring-1 focus:ring-lime"
                    disabled={sending}
                  />
                  <Button
                    onClick={sendReply}
                    disabled={!replyText.trim() || sending}
                    className="rounded-xl px-6 bg-lime text-black hover:bg-lime/90 font-medium"
                  >
                    {sending ? "..." : "Send"}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
