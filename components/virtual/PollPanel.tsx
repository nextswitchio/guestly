"use client";

import { useState, useEffect } from "react";
import type { Poll } from "@/lib/store";
import PieChart from "@/components/charts/PieChart";
import { getSocket } from "@/lib/websocket";
import type { PollCreatedEvent, PollVotedEvent, PollClosedEvent } from "@/lib/websocket";

interface PollPanelProps {
  eventId: string;
  userId?: string;
}

type ViewMode = 'bars' | 'chart';

export default function PollPanel({ eventId, userId }: PollPanelProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<Record<string, ViewMode>>({});
  const [animatingVotes, setAnimatingVotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPolls();

    // Set up WebSocket listeners for real-time updates
    const socket = getSocket();
    
    socket.emit("join-event", { eventId, userId: userId || "guest", userName: "User" });

    const handlePollCreated = (data: PollCreatedEvent) => {
      setPolls((prev) => [data.poll, ...prev]);
    };

    const handlePollVoted = (data: PollVotedEvent) => {
      // Trigger animation for vote update
      setAnimatingVotes((prev) => new Set(prev).add(data.pollId));
      
      setPolls((prev) =>
        prev.map((p) => (p.id === data.pollId ? data.poll : p))
      );

      // Remove animation flag after animation completes
      setTimeout(() => {
        setAnimatingVotes((prev) => {
          const next = new Set(prev);
          next.delete(data.pollId);
          return next;
        });
      }, 800);
    };

    const handlePollClosed = (data: PollClosedEvent) => {
      setPolls((prev) =>
        prev.map((p) => (p.id === data.pollId ? { ...p, closedAt: Date.now() } : p))
      );
    };

    socket.on("poll-created", handlePollCreated);
    socket.on("poll-voted", handlePollVoted);
    socket.on("poll-closed", handlePollClosed);

    return () => {
      socket.off("poll-created", handlePollCreated);
      socket.off("poll-voted", handlePollVoted);
      socket.off("poll-closed", handlePollClosed);
    };
  }, [eventId, userId]);

  const fetchPolls = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/polls`);
      const data = await res.json();
      if (data.success) {
        setPolls(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch polls:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    if (!userId || votedPolls.has(pollId)) return;

    try {
      const res = await fetch(`/api/events/${eventId}/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });

      const data = await res.json();
      if (data.success) {
        // Update the poll with new vote counts
        setPolls((prev) =>
          prev.map((p) => (p.id === pollId ? data.data : p))
        );
        setVotedPolls((prev) => new Set(prev).add(pollId));
        
        // Trigger animation
        setAnimatingVotes((prev) => new Set(prev).add(pollId));
        setTimeout(() => {
          setAnimatingVotes((prev) => {
            const next = new Set(prev);
            next.delete(pollId);
            return next;
          });
        }, 800);
      } else {
        alert(data.error || "Failed to vote");
      }
    } catch (error) {
      console.error("Failed to vote:", error);
      alert("Failed to vote");
    }
  };

  const toggleViewMode = (pollId: string) => {
    setViewMode((prev) => ({
      ...prev,
      [pollId]: prev[pollId] === 'chart' ? 'bars' : 'chart'
    }));
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-foreground-muted">
        Loading polls...
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="p-4 text-center text-foreground-muted">
        No polls yet
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {polls.map((poll) => {
        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
        const hasVoted = votedPolls.has(poll.id);
        const isClosed = !!poll.closedAt;
        const isAnimating = animatingVotes.has(poll.id);
        const currentViewMode = viewMode[poll.id] || 'bars';

        return (
          <div
            key={poll.id}
            className={`rounded-lg border border-surface-border bg-surface-card p-4 transition-all duration-300 ${
              isAnimating ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
            }`}
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{poll.question}</h3>
                <p className="text-sm text-foreground-muted">
                  <span className={`font-medium ${isAnimating ? 'animate-pulse text-primary-500' : ''}`}>
                    {totalVotes}
                  </span>{" "}
                  {totalVotes === 1 ? "vote" : "votes"}
                  {isClosed && " • Closed"}
                </p>
              </div>
              
              {/* View mode toggle */}
              {totalVotes > 0 && (
                <button
                  onClick={() => toggleViewMode(poll.id)}
                  className="ml-2 rounded-md border border-surface-border bg-surface-bg px-3 py-1 text-xs font-medium text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                  title={currentViewMode === 'bars' ? 'Show chart view' : 'Show bar view'}
                >
                  {currentViewMode === 'bars' ? (
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                      Chart
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Bars
                    </span>
                  )}
                </button>
              )}
            </div>

            {currentViewMode === 'bars' ? (
              // Bar view with voting
              <div className="space-y-2">
                {poll.options.map((option) => {
                  const percentage =
                    totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleVote(poll.id, option.id)}
                      disabled={!userId || hasVoted || isClosed}
                      className="relative w-full overflow-hidden rounded-md border border-surface-border bg-surface-bg p-3 text-left transition-all hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {/* Progress bar background with animation */}
                      <div
                        className={`absolute inset-0 bg-primary-100 transition-all ${
                          isAnimating ? 'duration-500' : 'duration-700'
                        }`}
                        style={{ 
                          width: `${percentage}%`,
                          transition: `width ${isAnimating ? '0.5s' : '0.7s'} cubic-bezier(0.34, 1.56, 0.64, 1)`
                        }}
                      />

                      {/* Content */}
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {option.text}
                          </span>
                          {hasVoted && option.votes > 0 && (
                            <span className="text-xs text-foreground-muted">
                              ({option.votes} {option.votes === 1 ? 'vote' : 'votes'})
                            </span>
                          )}
                        </div>
                        <span className={`text-sm font-semibold text-foreground-muted tabular-nums ${
                          isAnimating ? 'animate-pulse text-primary-600' : ''
                        }`}>
                          {percentage}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              // Chart view
              <div className="py-4">
                <PieChart
                  data={poll.options.map((option) => ({
                    label: option.text,
                    value: option.votes
                  }))}
                  size={240}
                  animated={true}
                  gradient={true}
                />
              </div>
            )}

            {!userId && (
              <p className="mt-3 text-sm text-foreground-muted">
                Sign in to vote
              </p>
            )}
            
            {hasVoted && !isClosed && (
              <p className="mt-3 flex items-center gap-1 text-sm text-success-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                You voted
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
