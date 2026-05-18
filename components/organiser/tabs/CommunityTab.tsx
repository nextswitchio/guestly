import { MessageCircle } from 'lucide-react';
"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

const posts = [
  { id: 1, author: "Ada O.", message: "Super excited for this event! Who else is going?", likes: 12, replies: 4, time: "3h ago" },
  { id: 2, author: "Kwame A.", message: "Any vegetarian food options available?", likes: 5, replies: 2, time: "6h ago" },
  { id: 3, author: "Fatima B.", message: "The lineup looks amazing. Can't wait!", likes: 18, replies: 6, time: "1d ago" },
];

export default function CommunityTab() {
  const [postText, setPostText] = React.useState("");
  const totalEngagement = posts.reduce((sum, p) => sum + p.likes + p.replies, 0);
  const avgEngagement = posts.length > 0 ? (totalEngagement / posts.length).toFixed(1) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Stats Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-3xl"><MessageCircle className="h-4 w-4 inline-block" /></span>
            <h3 className="text-lg font-semibold">Community Engagement</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-white/80">Total Posts</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{posts.length}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Total Likes</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{posts.reduce((s, p) => s + p.likes, 0)}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Total Replies</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{posts.reduce((s, p) => s + p.replies, 0)}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Avg. Engagement</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{avgEngagement}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Post Composer */}
      <Card className="border-2 border-primary-100 bg-gradient-to-br from-primary-50/50 to-white">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-lg font-bold text-white shadow-sm">
            O
          </div>
          <div className="flex-1">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share an update with your community..."
              className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              rows={3}
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                  </svg>
                </button>
              </div>
              <Button size="sm" disabled={!postText.trim()}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                Post
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Posts Feed */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
          <div className="flex gap-2">
            <button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50">
              All Posts
            </button>
            <button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:bg-neutral-50">
              Questions
            </button>
            <button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:bg-neutral-50">
              Updates
            </button>
          </div>
        </div>

        {posts.length === 0 ? (
          <EmptyState
            icon="message-circle"
            title="No community posts yet"
            description="Start the conversation! Share updates, answer questions, and engage with your attendees to build excitement."
            action={{
              label: "Create First Post",
              onClick: () => {},
            }}
            tips={[
              "Share behind-the-scenes content to build anticipation",
              "Answer attendee questions to improve their experience",
              "Encourage attendees to introduce themselves",
            ]}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((p) => (
              <Card key={p.id} className="transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white">
                    {p.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900">{p.author}</span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-500">{p.time}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-700">{p.message}</p>
                    <div className="mt-4 flex items-center gap-6">
                      <button className="group flex items-center gap-2 text-sm text-neutral-500 transition hover:text-primary-600">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 transition group-hover:bg-primary-50">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">{p.likes}</span>
                      </button>
                      <button className="group flex items-center gap-2 text-sm text-neutral-500 transition hover:text-primary-600">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 transition group-hover:bg-primary-50">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <span className="font-medium">{p.replies}</span>
                      </button>
                      <button className="group flex items-center gap-2 text-sm text-neutral-500 transition hover:text-primary-600">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 transition group-hover:bg-primary-50">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                          </svg>
                        </div>
                        <span className="font-medium">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Engagement Tips */}
      <Card className="border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50/50 to-transparent">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
            <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Engagement Tips</p>
            <ul className="mt-2 space-y-1 text-xs text-neutral-600">
              <li>• Post regular updates to keep attendees excited</li>
              <li>• Respond quickly to questions to build trust</li>
              <li>• Share behind-the-scenes content for authenticity</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
