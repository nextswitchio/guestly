'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Users, Check, X, MessageCircle, ExternalLink,
  Copy, Check as CheckIcon, Send, Loader2, Wifi, WifiOff,
} from 'lucide-react';
import {
  getSocket, joinCollaboration, leaveCollaboration,
  sendCollaborationMessage, type CollaborationMessage,
} from '@/lib/websocket';

interface Collaboration {
  id: string;
  organizerId: string;
  organizerName: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventImage: string | null;
  status: 'invited' | 'accepted' | 'declined' | 'active' | 'completed';
  compensationType: string;
  compensationAmount?: number | null;
  commissionRate?: number | null;
  freeTicketCount?: number | null;
  deliverables: string[];
  trackingCode: string;
  promoCode?: string | null;
  invitedAt: string;
  acceptedAt?: string | null;
  message?: string | null;
}

interface Message {
  id: string;
  senderId: string;
  senderRole?: 'organizer' | 'influencer';
  content: string;
  createdAt: number;
}

type FilterStatus = 'all' | 'invited' | 'accepted' | 'active' | 'completed' | 'declined';

const STATUS_STYLES: Record<string, string> = {
  invited:   'bg-amber-100 text-amber-700',
  accepted:  'bg-blue-100 text-blue-700',
  active:    'bg-green-100 text-green-700',
  completed: 'bg-neutral-100 text-neutral-700',
  declined:  'bg-red-100 text-red-700',
};

const COMP_LABELS: Record<string, string> = {
  'free-tickets':  'Free Tickets',
  'fixed-payment': 'Fixed Payment',
  'commission':    'Commission',
  'hybrid':        'Hybrid',
  'paid':          'Fixed Payment',
  'free_tickets':  'Free Tickets',
};

export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Message modal
  const [msgCollab, setMsgCollab] = useState<Collaboration | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [msgInput, setMsgInput] = useState('');
  const [msgSending, setMsgSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const msgBottomRef = useRef<HTMLDivElement>(null);
  const activeCollabRef = useRef<string | null>(null);

  // ── Fetch collaborations ──────────────────────────────────────────────────
  const fetchCollaborations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/affiliates/collaborations');
      if (res.ok) {
        const data = await res.json();
        setCollaborations(data.collaborations || []);
      }
    } catch {
      setError('Failed to load collaborations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCollaborations(); }, [fetchCollaborations]);

  // ── Socket.IO setup ───────────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);

    const onMessage = (data: CollaborationMessage) => {
      // Only append if the message belongs to the currently open collab
      if (data.collaboration_id !== activeCollabRef.current) return;
      setMessages(prev => {
        // Deduplicate by id
        if (prev.some(m => m.id === data.id)) return prev;
        return [...prev, {
          id: data.id,
          senderId: data.sender_id,
          senderRole: data.sender_role,
          content: data.content,
          createdAt: new Date(data.created_at).getTime(),
        }];
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('collaboration_message', onMessage);
    if (socket.connected) setSocketConnected(true);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('collaboration_message', onMessage);
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    msgBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Open message modal ────────────────────────────────────────────────────
  const openMessages = async (collab: Collaboration) => {
    // Leave previous room if any
    if (activeCollabRef.current && activeCollabRef.current !== collab.id) {
      leaveCollaboration(activeCollabRef.current);
    }

    setMsgCollab(collab);
    setMessages([]);
    setMsgInput('');
    setMsgsLoading(true);
    activeCollabRef.current = collab.id;

    // Join socket room
    joinCollaboration(collab.id);

    // Load message history via REST
    try {
      const res = await fetch(`/api/influencers/collaborations/${collab.id}/messages`);
      if (res.ok) {
        const d = await res.json();
        const raw: any[] = Array.isArray(d.messages) ? d.messages : [];
        setMessages(raw.map(m => ({
          id: m.id,
          senderId: m.senderId ?? m.sender_id,
          senderRole: m.senderRole ?? m.sender_role,
          content: m.content,
          createdAt: m.createdAt ?? new Date(m.created_at ?? 0).getTime(),
        })));
      }
    } catch { /* best-effort */ }
    finally { setMsgsLoading(false); }
  };

  const closeMessages = () => {
    if (activeCollabRef.current) {
      leaveCollaboration(activeCollabRef.current);
      activeCollabRef.current = null;
    }
    setMsgCollab(null);
    setMessages([]);
    setMsgInput('');
  };

  // ── Send message via Socket.IO (with REST fallback) ───────────────────────
  const sendMessage = async () => {
    if (!msgCollab || !msgInput.trim()) return;
    const content = msgInput.trim();
    setMsgInput('');
    setMsgSending(true);

    if (socketConnected) {
      // Send via socket — the backend will broadcast back to the room
      sendCollaborationMessage(msgCollab.id, content);
      setMsgSending(false);
    } else {
      // Fallback: REST POST
      try {
        const res = await fetch(`/api/influencers/collaborations/${msgCollab.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        if (res.ok) {
          const d = await res.json();
          const m = d.message ?? d;
          setMessages(prev => [...prev, {
            id: m.id,
            senderId: m.senderId ?? m.sender_id,
            senderRole: 'influencer',
            content: m.content,
            createdAt: m.createdAt ?? new Date(m.created_at ?? 0).getTime(),
          }]);
        }
      } catch { /* best-effort */ }
      finally { setMsgSending(false); }
    }
  };

  // ── Accept / Decline ──────────────────────────────────────────────────────
  const handleResponse = async (collabId: string, action: 'accept' | 'decline') => {
    setActionLoading(collabId + action);
    setError(null);
    try {
      const res = await fetch(`/api/influencers/collaborations/${collabId}/${action}`, {
        method: 'POST',
      });
      if (res.ok) {
        setCollaborations(prev =>
          prev.map(c => c.id === collabId
            ? { ...c, status: action === 'accept' ? 'accepted' : 'declined' }
            : c
          )
        );
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error || d.detail || `Failed to ${action} invitation`);
      }
    } catch {
      setError(`Network error — could not ${action} invitation`);
    } finally {
      setActionLoading(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filtered = filter === 'all' ? collaborations : collaborations.filter(c => c.status === filter);
  const pendingCount = collaborations.filter(c => c.status === 'invited').length;

  const filters: { id: FilterStatus; label: string; count?: number }[] = [
    { id: 'all',       label: 'All' },
    { id: 'invited',   label: 'Pending',   count: pendingCount },
    { id: 'accepted',  label: 'Accepted' },
    { id: 'active',    label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'declined',  label: 'Declined' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/affiliate/dashboard"
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Collaborations</h1>
          <p className="text-neutral-500 mt-1">Manage invitations from event organizers</p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-1 flex-wrap">
        {filters.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              filter === f.id ? 'bg-lime text-dark' : 'text-neutral-500 hover:bg-neutral-100'
            }`}>
            {f.label}
            {f.count !== undefined && f.count > 0 && (
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${filter === f.id ? 'bg-dark/20' : 'bg-neutral-200'}`}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
          <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {filter === 'all' ? 'No collaborations yet' : `No ${filter} collaborations`}
          </h3>
          <p className="text-neutral-500 mb-4">
            {filter === 'all' || filter === 'invited'
              ? 'Organizers will send you collaboration invitations here'
              : 'No collaborations match this filter'}
          </p>
          <Link href="/affiliate/dashboard/events"
            className="inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors">
            Browse Events <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((collab) => {
            const isActing = actionLoading?.startsWith(collab.id);
            return (
              <div key={collab.id} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                {/* Event banner */}
                {collab.eventImage && (
                  <div className="relative h-36 w-full bg-neutral-100">
                    <Image
                      src={collab.eventImage}
                      alt={collab.eventName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-white font-semibold text-base leading-tight line-clamp-1">{collab.eventName}</p>
                      <p className="text-white/70 text-xs mt-0.5">
                        by {collab.organizerName}
                        {collab.eventDate ? ` · ${new Date(collab.eventDate).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                    <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-lg backdrop-blur-sm ${STATUS_STYLES[collab.status] ?? 'bg-neutral-100/80 text-neutral-600'}`}>
                      {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                    </span>
                  </div>
                )}

                <div className="p-5">
                  {/* Header (no banner fallback) */}
                  {!collab.eventImage && (
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-neutral-900">{collab.eventName}</h3>
                        <p className="text-sm text-neutral-500">
                          by {collab.organizerName}
                          {collab.eventDate ? ` · ${new Date(collab.eventDate).toLocaleDateString()}` : ''}
                        </p>
                      </div>
                      <span className={`self-start px-2.5 py-1 text-xs font-medium rounded-lg ${STATUS_STYLES[collab.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                        {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                      </span>
                    </div>
                  )}

                  {/* Compensation pills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1.5 bg-neutral-50 rounded-lg text-xs">
                      <span className="text-neutral-500">Type: </span>
                      <span className="font-medium text-neutral-900">{COMP_LABELS[collab.compensationType] ?? collab.compensationType}</span>
                    </span>
                    {collab.commissionRate != null && (
                      <span className="px-3 py-1.5 bg-lime/10 rounded-lg text-xs">
                        <span className="text-neutral-500">Commission: </span>
                        <span className="font-medium text-lime">{collab.commissionRate}%</span>
                      </span>
                    )}
                    {collab.compensationAmount != null && (
                      <span className="px-3 py-1.5 bg-green-100 rounded-lg text-xs">
                        <span className="text-neutral-500">Payment: </span>
                        <span className="font-medium text-green-700">₦{collab.compensationAmount.toLocaleString()}</span>
                      </span>
                    )}
                    {collab.freeTicketCount != null && (
                      <span className="px-3 py-1.5 bg-blue-100 rounded-lg text-xs">
                        <span className="text-neutral-500">Tickets: </span>
                        <span className="font-medium text-blue-700">{collab.freeTicketCount} free</span>
                      </span>
                    )}
                  </div>

                  {/* Organizer message */}
                  {collab.message && (
                    <div className="mb-4 p-3 bg-neutral-50 rounded-xl">
                      <p className="text-xs font-medium text-neutral-500 mb-1">Message from organizer</p>
                      <p className="text-sm text-neutral-700">{collab.message}</p>
                    </div>
                  )}

                  {/* Tracking code */}
                  {(collab.status === 'accepted' || collab.status === 'active' || collab.status === 'completed') && collab.trackingCode && (
                    <div className="mb-4 p-3 bg-lime/5 border border-lime/20 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-neutral-700">Tracking Code</p>
                        <code className="text-sm font-mono text-lime">{collab.trackingCode}</code>
                        {collab.promoCode && (
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Promo: <span className="font-mono font-medium text-neutral-900">{collab.promoCode}</span>
                          </p>
                        )}
                      </div>
                      <button onClick={() => copyCode(collab.trackingCode)}
                        className="flex items-center gap-1.5 rounded-lg bg-lime px-3 py-1.5 text-xs font-semibold text-dark hover:bg-lime-hover transition-colors shrink-0">
                        {copiedCode === collab.trackingCode ? <CheckIcon className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedCode === collab.trackingCode ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-100">
                    {collab.status === 'invited' && (
                      <>
                        <button disabled={!!isActing} onClick={() => handleResponse(collab.id, 'accept')}
                          className="flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors disabled:opacity-60">
                          {actionLoading === collab.id + 'accept'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Check className="h-4 w-4" />}
                          Accept
                        </button>
                        <button disabled={!!isActing} onClick={() => handleResponse(collab.id, 'decline')}
                          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-60">
                          {actionLoading === collab.id + 'decline'
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <X className="h-4 w-4" />}
                          Decline
                        </button>
                      </>
                    )}
                    {(collab.status === 'invited' || collab.status === 'accepted' || collab.status === 'active') && (
                      <button onClick={() => openMessages(collab)}
                        className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        {collab.status === 'invited' ? 'Message' : 'Message Organizer'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Live Message Modal ── */}
      {msgCollab && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeMessages(); }}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-neutral-900 text-sm truncate">{msgCollab.eventName}</p>
                  {/* Live indicator */}
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    socketConnected ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {socketConnected
                      ? <><Wifi className="h-3 w-3" /> Live</>
                      : <><WifiOff className="h-3 w-3" /> Offline</>
                    }
                  </span>
                </div>
                <p className="text-xs text-neutral-500 truncate">{msgCollab.organizerName}</p>
              </div>
              <button onClick={closeMessages}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors ml-3 shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-[220px]">
              {msgsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10">
                  <MessageCircle className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-400">No messages yet. Start the conversation.</p>
                </div>
              ) : (
                messages.map((m) => {
                  // influencer's own messages on the right; organizer's on the left
                  const isMine = m.senderRole === 'influencer' || m.senderId !== msgCollab.organizerId;
                  return (
                    <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${
                        isMine
                          ? 'bg-lime text-dark rounded-br-sm'
                          : 'bg-neutral-100 text-neutral-800 rounded-bl-sm'
                      }`}>
                        {!isMine && (
                          <p className="text-[10px] font-semibold text-neutral-500 mb-1">{msgCollab.organizerName}</p>
                        )}
                        <p className="leading-relaxed">{m.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-dark/40' : 'text-neutral-400'}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={msgBottomRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-neutral-100">
              {!socketConnected && (
                <p className="text-xs text-amber-600 mb-2 flex items-center gap-1">
                  <WifiOff className="h-3 w-3" /> Sending via fallback — live updates unavailable
                </p>
              )}
              <div className="flex gap-2">
                <input
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Write a message…"
                  className="flex-1 h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                />
                <button onClick={sendMessage} disabled={!msgInput.trim() || msgSending}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime text-dark hover:bg-lime-hover transition-colors disabled:opacity-50">
                  {msgSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
