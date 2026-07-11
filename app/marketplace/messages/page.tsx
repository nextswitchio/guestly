"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Conversation {
  id: string;
  buyer_id: string;
  provider_user_id: string;
  provider_type: string;
  provider_name: string | null;
  provider_avatar: string | null;
  provider_type_label: string | null;
  last_message_preview: string | null;
  last_message_at: string | null;
  unread_count: number;
  disclaimer_accepted: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    try {
      const res = await fetch("/api/marketplace/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-lg font-bold text-neutral-900 mb-6">Messages</h1>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-neutral-100 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-neutral-100 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-neutral-100 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/marketplace/messages/${conv.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden border border-neutral-200/60">
                {conv.provider_avatar ? (
                  <img src={conv.provider_avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-neutral-900 truncate">{conv.provider_name || "Unknown"}</h3>
                  {conv.last_message_at && (
                    <span className="text-[11px] text-neutral-400 shrink-0 ml-2">
                      {new Date(conv.last_message_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-neutral-500 truncate">
                    {conv.last_message_preview || "No messages yet"}
                  </p>
                  {conv.unread_count > 0 && (
                    <span className="bg-lime text-dark text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0 ml-2">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
                {conv.provider_type_label && (
                  <span className="text-[10px] text-neutral-400 mt-1 block">{conv.provider_type_label}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200/60 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <p className="text-neutral-900 font-semibold mb-1">No conversations yet</p>
          <p className="text-sm text-neutral-400 mb-4">Start a conversation by browsing providers.</p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark text-white rounded-xl text-sm font-medium hover:bg-[#0d2730] transition-colors"
          >
            Browse Providers
          </Link>
        </div>
      )}
    </div>
  );
}
