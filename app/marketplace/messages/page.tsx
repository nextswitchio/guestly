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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Messages</h1>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4 animate-pulse">
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
              className="flex items-center gap-3 bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center shrink-0 overflow-hidden">
                {conv.provider_avatar ? (
                  <img src={conv.provider_avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-neutral-900 truncate">{conv.provider_name || "Unknown"}</h3>
                  {conv.last_message_at && (
                    <span className="text-xs text-neutral-400 shrink-0 ml-2">
                      {new Date(conv.last_message_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500 truncate">
                    {conv.last_message_preview || "No messages yet"}
                  </p>
                  {conv.unread_count > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 shrink-0 ml-2">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
                <span className="text-xs text-neutral-400">{conv.provider_type_label}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
          <p className="text-neutral-500 mb-2">No conversations yet.</p>
          <Link href="/marketplace" className="text-sm text-blue-600 hover:text-blue-700">
            Browse providers to start a conversation →
          </Link>
        </div>
      )}
    </div>
  );
}
