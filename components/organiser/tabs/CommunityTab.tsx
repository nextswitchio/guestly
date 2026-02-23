import React from "react";
import Card from "@/components/ui/Card";

const posts = [
  { id: 1, author: "Ada O.", message: "Super excited for this event! Who else is going?", likes: 12, replies: 4, time: "3h ago" },
  { id: 2, author: "Kwame A.", message: "Any vegetarian food options available?", likes: 5, replies: 2, time: "6h ago" },
  { id: 3, author: "Fatima B.", message: "The lineup looks amazing. Can’t wait!", likes: 18, replies: 6, time: "1d ago" },
];

export default function CommunityTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* Post Composer */}
      <Card>
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
            O
          </span>
          <div className="flex-1">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-400">
              Share an update with your community…
            </div>
            <div className="mt-2 flex justify-end">
              <button className="rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700">
                Post
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Posts */}
      {posts.map((p) => (
        <Card key={p.id}>
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {p.author.charAt(0)}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-900">{p.author}</span>
                <span className="text-xs text-neutral-400">{p.time}</span>
              </div>
              <p className="mt-1 text-sm text-neutral-700">{p.message}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
                <button className="flex items-center gap-1 hover:text-primary-600 transition">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {p.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-primary-600 transition">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {p.replies}
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

