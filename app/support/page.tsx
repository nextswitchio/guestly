'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import {
  Send,
  RefreshCw,
  ChevronLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Ticket as TicketIcon,
  Headphones,
} from 'lucide-react';

const SOCKET_URL = 'https://guestly-backend-production.up.railway.app';
const SOCKET_PATH = '/socket.io';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'payment', label: 'Payment Issue' },
  { value: 'event', label: 'Event Help' },
  { value: 'account', label: 'Account' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'other', label: 'Other' },
] as const;

interface Ticket {
  id: string;
  subject: string;
  message: string;
  category?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at?: string;
  updated_at?: string;
}

interface ChatMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: 'user' | 'staff';
  message: string;
  created_at: string;
}

interface UserInfo {
  name?: string;
  email?: string;
}

type ActiveTab = 'contact' | 'tickets';
type View = 'list' | 'chat';

function getStatusBadge(status: Ticket['status']) {
  const map: Record<string, { label: string; classes: string }> = {
    open: { label: 'Open', classes: 'bg-lime/15 text-lime border border-lime/30' },
    in_progress: { label: 'In Progress', classes: 'bg-blue-400/15 text-blue-400 border border-blue-400/30' },
    resolved: { label: 'Resolved', classes: 'bg-green-400/15 text-green-400 border border-green-400/30' },
    closed: { label: 'Closed', classes: 'bg-neutral-500/15 text-neutral-400 border border-neutral-500/30' },
  };
  const info = map[status] || map.open;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${info.classes}`}>
      {info.label}
    </span>
  );
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function MessagePreview(text: string, maxLen = 80): string {
  if (!text) return '';
  const cleaned = text.replace(/\n/g, ' ').trim();
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) + '...' : cleaned;
}

export default function SupportPage() {
  const { addToast } = useToast();

  // ---- Tabs & views ----
  const [activeTab, setActiveTab] = useState<ActiveTab>('contact');
  const [view, setView] = useState<View>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // ---- User info ----
  const [user, setUser] = useState<UserInfo | null>(null);

  // ---- Contact form ----
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ---- My Tickets ----
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

  // ---- Chat ----
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [staffTyping, setStaffTyping] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ---- Fetch user info ----
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.user) {
          const u = d.user;
          setUser({ name: u.name || u.full_name || '', email: u.email || '' });
          setFormData((prev) => ({
            ...prev,
            name: u.name || u.full_name || prev.name,
            email: u.email || prev.email,
          }));
        }
      })
      .catch(() => {});
  }, []);

  // ---- Fetch tickets ----
  const fetchTickets = useCallback(async () => {
    setTicketsLoading(true);
    setTicketsError(null);
    try {
      const res = await fetch('/api/support/tickets/my', { credentials: 'include' });
      if (!res.ok) {
        if (res.status === 401) {
          setTicketsError('Please log in to view your tickets.');
          return;
        }
        throw new Error('Failed to fetch');
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.tickets ?? data.feedback ?? [];
      setTickets(list);
    } catch {
      setTicketsError('Failed to load tickets. Please try again.');
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets();
    }
  }, [activeTab, fetchTickets]);

  // ---- Contact form submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const body: Record<string, string> = {
        subject: formData.subject,
        message: `From: ${formData.name} (${formData.email})\nCategory: ${formData.category}\n\n${formData.message}`,
        category: formData.category,
      };
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSubmitted(true);
        addToast("Ticket submitted! We'll get back to you soon.", { type: 'success' });
        setTimeout(() => {
          setSubmitted(false);
          setFormData((prev) => ({ ...prev, subject: '', category: 'general', message: '' }));
        }, 3000);
      } else {
        const errData = await res.json().catch(() => ({}));
        addToast(errData.error || 'Failed to submit ticket.', { type: 'error' });
      }
    } catch {
      addToast('Network error. Please try again.', { type: 'error' });
    } finally {
      setSending(false);
    }
  };

  // ---- Open ticket chat ----
  const openChat = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setView('chat');
    setMessages([]);
    setChatInput('');
    setChatLoading(true);
    setChatError(null);
    setStaffTyping(false);
  };

  const backToList = () => {
    setView('list');
    setSelectedTicket(null);
    disconnectSocket();
  };

  // ---- Socket.IO ----
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const getAccessToken = (): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(^|;\s*)access_token=([^;]*)/);
    return match ? decodeURIComponent(match[2]) : null;
  };

  const emitTyping = useCallback(() => {
    if (!selectedTicket) return;
    socketRef.current?.emit('support_typing', { ticket_id: selectedTicket.id });
  }, [selectedTicket]);

  const handleChatInputChange = (val: string) => {
    setChatInput(val);
    emitTyping();
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socketRef.current?.emit('support_typing_stop', { ticket_id: selectedTicket?.id });
    }, 2000);
  };

  useEffect(() => {
    if (!selectedTicket) return;

    const token = getAccessToken();
    const socket = io(SOCKET_URL, {
      path: SOCKET_PATH,
      auth: token ? { token } : undefined,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_support_chat', { ticket_id: selectedTicket.id });
    });

    socket.on('support_history', (history: ChatMessage[]) => {
      setMessages(Array.isArray(history) ? history : []);
      setChatLoading(false);
    });

    socket.on('support_new_message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
      setStaffTyping(false);
    });

    socket.on('support_typing', () => {
      setStaffTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setStaffTyping(false), 3000);
    });

    socket.on('support_typing_stop', () => {
      setStaffTyping(false);
    });

    socket.on('connect_error', () => {
      setChatError('Unable to connect to chat. Please try again.');
      setChatLoading(false);
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        setChatError('Chat session ended. You can still view past messages.');
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [selectedTicket]);

  // Auto-scroll on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ---- Send chat message ----
  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text || !selectedTicket || !socketRef.current?.connected) return;

    const msg = {
      ticket_id: selectedTicket.id,
      message: text,
    };

    // Optimistic
    const optimistic: ChatMessage = {
      id: `opt-${Date.now()}`,
      ticket_id: selectedTicket.id,
      sender_id: 'user',
      sender_type: 'user',
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    socketRef.current.emit('support_message', msg);
    setChatInput('');
    socketRef.current.emit('support_typing_stop', { ticket_id: selectedTicket.id });
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ---- Render helpers ----
  const renderContactTab = () => (
    <div className="max-w-2xl mx-auto">
      {submitted ? (
        <Card variant="navy" padding="lg">
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-lime/15 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-lime" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ticket Submitted!</h3>
            <p className="text-white/60">
              We&apos;ll review your request and get back to you within 24 hours.
            </p>
          </div>
        </Card>
      ) : (
        <Card variant="navy" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="block">
                <span className="text-sm font-medium text-white/80 block mb-1.5">Name</span>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-lime/50 focus:ring-1 focus:ring-lime/30 transition-all"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-white/80 block mb-1.5">Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-lime/50 focus:ring-1 focus:ring-lime/30 transition-all"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="block">
                <span className="text-sm font-medium text-white/80 block mb-1.5">Subject</span>
                <input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What do you need help with?"
                  required
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-lime/50 focus:ring-1 focus:ring-lime/30 transition-all"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-white/80 block mb-1.5">Category</span>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-lime/50 focus:ring-1 focus:ring-lime/30 transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23c7fd02' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25rem',
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-navy-700 text-white">
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-white/80 block mb-1.5">Message</span>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue or question in detail..."
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-lime/50 focus:ring-1 focus:ring-lime/30 transition-all resize-none"
              />
            </label>

            <Button type="submit" loading={sending} variant="primary" className="w-full md:w-auto">
              Send Message
            </Button>
          </form>
        </Card>
      )}
    </div>
  );

  const renderTicketList = () => {
    if (ticketsLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-lime animate-spin mb-4" />
          <p className="text-white/50">Loading your tickets...</p>
        </div>
      );
    }

    if (ticketsError) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
          <p className="text-white/60 mb-4">{ticketsError}</p>
          <Button variant="outline" size="sm" onClick={fetchTickets}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Retry
          </Button>
        </div>
      );
    }

    if (tickets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-5">
            <TicketIcon className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No tickets yet</h3>
          <p className="text-white/50 text-center max-w-sm">
            When you submit a support request, it will appear here. You can chat with our team in real-time.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-6"
            onClick={() => setActiveTab('contact')}
          >
            Create a Ticket
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <Card
            key={ticket.id}
            variant="navy"
            padding="lg"
            hoverable
            className="cursor-pointer"
            onClick={() => openChat(ticket)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-semibold text-white truncate">{ticket.subject}</h3>
                  {getStatusBadge(ticket.status)}
                </div>
                <p className="text-sm text-white/40 truncate">
                  {MessagePreview(ticket.message)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-white/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {ticket.updated_at ? formatTimeAgo(ticket.updated_at) : ''}
                </span>
                <ChevronLeft className="w-4 h-4 text-white/30 rotate-180" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderChat = () => {
    if (!selectedTicket) return null;

    return (
      <div className="flex flex-col h-[calc(100vh-240px)] min-h-[500px]">
        {/* Chat header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10 shrink-0">
          <button
            onClick={backToList}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{selectedTicket.subject}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              {getStatusBadge(selectedTicket.status)}
              <span className="text-xs text-white/30">{selectedTicket.id}</span>
            </div>
          </div>
          <Button variant="outline" size="xs" onClick={() => fetchTickets()}>
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 scroll-smooth">
          {chatLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-7 h-7 text-lime animate-spin mb-3" />
              <p className="text-white/40 text-sm">Connecting to chat...</p>
            </div>
          ) : chatError && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
              <p className="text-white/50 text-sm text-center max-w-xs">{chatError}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Headphones className="w-10 h-10 text-white/15 mb-4" />
              <p className="text-white/40 text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.sender_type === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      isUser
                        ? 'bg-lime text-dark rounded-br-md'
                        : 'bg-white/8 text-white/90 rounded-bl-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        isUser ? 'text-dark/50' : 'text-white/25'
                      }`}
                    >
                      {formatTimeAgo(msg.created_at)}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {staffTyping && (
            <div className="flex justify-start">
              <div className="bg-white/8 text-white/50 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm flex items-center gap-2">
                <span>Staff is typing</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input */}
        <div className="pt-3 border-t border-white/10 shrink-0">
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => handleChatInputChange(e.target.value)}
              onKeyDown={handleChatKeyDown}
              placeholder="Type your message..."
              disabled={!socketRef.current?.connected && !chatLoading}
              className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-lime/50 focus:ring-1 focus:ring-lime/30 transition-all disabled:opacity-40"
            />
            <Button
              onClick={sendMessage}
              disabled={!chatInput.trim() || !socketRef.current?.connected}
              size="sm"
              className="h-11 w-11 p-0 flex items-center justify-center rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderMyTicketsTab = () => {
    if (view === 'chat') {
      return renderChat();
    }
    return renderTicketList();
  };

  return (
    <div className="min-h-screen bg-[#001c24]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-lime/10 rounded-2xl mb-5">
            <Headphones className="w-7 h-7 text-lime" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-aeonik">
            Support Center
          </h1>
          <p className="text-white/50 text-lg">
            We&apos;re here to help. Reach out anytime.
          </p>
        </div>

        {/* Tabs - hide when in chat view */}
        {view !== 'chat' && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white/5 rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'contact'
                    ? 'bg-lime text-dark shadow-lg shadow-lime/20'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                Contact Us
              </button>
              <button
                onClick={() => { setActiveTab('tickets'); setView('list'); }}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'tickets'
                    ? 'bg-lime text-dark shadow-lg shadow-lime/20'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                My Tickets
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'contact' && renderContactTab()}
        {activeTab === 'tickets' && renderMyTicketsTab()}
      </div>
    </div>
  );
}
