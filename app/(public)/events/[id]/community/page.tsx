"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type Post = {
  id: string;
  author: string;
  message: string;
  createdAt: number;
  likes: number;
};

export default function EventCommunity({ params }: { params: { id: string } }) {
  const eventId = params.id;
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function load() {
    const res = await fetch(`/api/events/${eventId}/community`, { cache: "no-store" });
    const data = await res.json();
    if (res.ok) setPosts(data.data as Post[]);
  }

  React.useEffect(() => {
    void load();
  }, [eventId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/community`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setMessage("");
        await load();
      } else {
        setError(data.error || "Failed to post");
      }
    } catch {
      setError("Failed to post");
    } finally {
      setLoading(false);
    }
  }

  function timeAgo(ts: number) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <ProtectedRoute allowRoles={["attendee", "organiser", "vendor"]}>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Event Community
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Discuss plans, ask questions, and connect with others.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card>
              <form onSubmit={submit} className="flex flex-col gap-3">
                <textarea
                  className="min-h-[90px] w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  placeholder="Share your thoughts or ask a question…"
                  value={message}
                  onChange={(e) => setMessage(e.currentTarget.value)}
                />
                {error && <div className="text-xs text-red-600">{error}</div>}
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading || !message.trim()}>
                    {loading ? "Posting…" : "Post"}
                  </Button>
                </div>
              </form>
            </Card>

            {posts.length === 0 ? (
              <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500">
                No posts yet. Be the first to start a discussion.
              </div>
            ) : (
              posts.map((p) => (
                <Card key={p.id}>
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                      {p.author.charAt(0)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-900">{p.author}</span>
                        <span className="text-xs text-neutral-400">{timeAgo(p.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-sm text-neutral-700 whitespace-pre-wrap">{p.message}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="hidden lg:block">
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Tips</h3>
              <ul className="list-disc pl-5 text-xs text-neutral-600">
                <li>Be respectful and stay on topic</li>
                <li>Use this space to coordinate and ask questions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

