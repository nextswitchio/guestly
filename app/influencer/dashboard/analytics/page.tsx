"use client";
import React, { useState, useEffect } from "react";
import { TrendingUp, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

export default function InfluencerAnalyticsPage() {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/influencer/contents/my", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setContents(d.contents || d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totals = contents.reduce(
    (acc, c) => ({
      views: acc.views + (c.viewCount || c.view_count || 0),
      likes: acc.likes + (c.likeCount || c.like_count || 0),
      comments: acc.comments + (c.commentCount || c.comment_count || 0),
      shares: acc.shares + (c.shareCount || c.share_count || 0),
    }),
    { views: 0, likes: 0, comments: 0, shares: 0 }
  );

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Content Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Views", value: totals.views, icon: Eye, color: "text-blue-600" },
          { label: "Total Likes", value: totals.likes, icon: Heart, color: "text-red-500" },
          { label: "Comments", value: totals.comments, icon: MessageCircle, color: "text-green-600" },
          { label: "Shares", value: totals.shares, icon: Share2, color: "text-purple-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border rounded-xl p-5 shadow-sm">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">Content Performance</h2>
      {contents.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No content yet. Create your first post to see analytics.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contents.map((c) => (
            <div key={c.id} className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{c.title || c.caption || "Untitled"}</h3>
                <p className="text-xs text-gray-400">{c.contentType || c.content_type}</p>
              </div>
              <div className="flex gap-4 text-sm">
                <span>👁 {(c.viewCount || c.view_count || 0).toLocaleString()}</span>
                <span>❤️ {(c.likeCount || c.like_count || 0).toLocaleString()}</span>
                <span>💬 {(c.commentCount || c.comment_count || 0).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
