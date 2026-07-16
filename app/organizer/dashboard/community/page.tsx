"use client";
import { Eye, FileEdit, Megaphone, MessageCircle, Users } from 'lucide-react';
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

interface Announcement {
  id: string;
  title: string;
  published_at: string | null;
  views?: number;
}

interface Discussion {
  id: string;
  user_name: string;
  content: string;
  reply_count: number;
  created_at: string;
}

interface CommunityStats {
  followers: number;
  posts: number;
}

export default function CommunityPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [stats, setStats] = useState<CommunityStats>({ followers: 0, posts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/announcements?limit=5").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/communities?type=discussions&limit=5").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/communities?type=stats").then((r) => r.json()).catch((err) => console.error("Failed to fetch community stats:", err)),
    ]).then(([ann, disc, st]) => {
      setAnnouncements(Array.isArray(ann?.data) ? ann.data : []);
      setDiscussions(Array.isArray(disc?.data) ? disc.data : []);
      if (st) setStats({ followers: st.followers ?? 0, posts: st.posts ?? 0 });
    }).finally(() => setLoading(false));
  }, []);

  const timeAgo = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Community</h1>
            <p className="mt-1 text-sm text-neutral-500">Engage with your audience and share updates</p>
          </div>
          <button className="rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-dark shadow-sm transition hover:bg-lime-hover">
            New Announcement
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Followers", value: stats.followers.toLocaleString(), icon: <Users className="h-5 w-5" /> },
            { label: "Posts", value: stats.posts.toLocaleString(), icon: <FileEdit className="h-5 w-5" /> },
            { label: "Discussions", value: discussions.length.toLocaleString(), icon: <MessageCircle className="h-5 w-5" /> },
          ].map((s) => (
            <Card key={s.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10 text-lime">{s.icon}</span>
              <div>
                <p className="text-lg font-bold text-neutral-900 tabular-nums">{s.value}</p>
                <p className="text-xs text-neutral-500">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Announcements */}
          <Card>
            <h2 className="mb-4 text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <Megaphone className="h-4 w-4" /> Announcements
            </h2>
            {loading ? (
              <div className="space-y-3 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-14 bg-neutral-100 rounded-xl" />)}</div>
            ) : announcements.length === 0 ? (
              <p className="text-sm text-neutral-400 py-4 text-center">No announcements yet</p>
            ) : (
              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 rounded-xl border border-neutral-100 p-3 transition hover:bg-neutral-50">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-50 text-sm">
                      <Megaphone className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900">{a.title}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                        {a.published_at && <span>{new Date(a.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>}
                        {a.views != null && <span><Eye className="h-3.5 w-3.5 inline-block mr-0.5" />{a.views}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Discussions */}
          <Card>
            <h2 className="mb-4 text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> Recent Discussions
            </h2>
            {loading ? (
              <div className="space-y-3 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-14 bg-neutral-100 rounded-xl" />)}</div>
            ) : discussions.length === 0 ? (
              <p className="text-sm text-neutral-400 py-4 text-center">No discussions yet</p>
            ) : (
              <div className="space-y-3">
                {discussions.map((d) => (
                  <div key={d.id} className="flex items-start gap-3 rounded-xl border border-neutral-100 p-3 transition hover:bg-neutral-50">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime/10 text-xs font-bold text-lime">
                      {d.user_name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-900">{d.user_name}</p>
                      <p className="mt-0.5 truncate text-sm text-neutral-600">{d.content}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                        <span>{d.reply_count} {d.reply_count === 1 ? "reply" : "replies"}</span>
                        <span>{timeAgo(d.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
