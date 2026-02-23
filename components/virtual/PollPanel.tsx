"use client";
import React from "react";

// ── Icons ────────────────────────────────────────────────────────────────────

function CheckCircleIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg className="h-10 w-10 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: number;
  closed: boolean;
}

interface PollPanelProps {
  eventId: string;
  userId: string;
}

// ── Mock polls for UI demo ──────────────────────────────────────────────────

const DEMO_POLLS: Poll[] = [
  {
    id: "poll-1",
    question: "What topic should we cover next?",
    options: [
      { id: "o1", label: "AI & Machine Learning", votes: 24 },
      { id: "o2", label: "Web3 & Blockchain", votes: 18 },
      { id: "o3", label: "Mobile Development", votes: 12 },
      { id: "o4", label: "Cloud Infrastructure", votes: 9 },
    ],
    createdAt: Date.now() - 300_000,
    closed: false,
  },
  {
    id: "poll-2",
    question: "How are you enjoying the event?",
    options: [
      { id: "o5", label: "🔥 Amazing!", votes: 42 },
      { id: "o6", label: "👍 Pretty good", votes: 28 },
      { id: "o7", label: "😐 It's okay", votes: 5 },
    ],
    createdAt: Date.now() - 900_000,
    closed: true,
  },
];

// ── Component ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PollPanel({ eventId, userId }: PollPanelProps) {
  const [polls, setPolls] = React.useState<Poll[]>(DEMO_POLLS);
  const [votedPolls, setVotedPolls] = React.useState<Record<string, string>>({});

  function vote(pollId: string, optionId: string) {
    if (votedPolls[pollId]) return; // already voted

    setVotedPolls((prev) => ({ ...prev, [pollId]: optionId }));
    setPolls((prev) =>
      prev.map((p) =>
        p.id === pollId
          ? {
            ...p,
            options: p.options.map((o) =>
              o.id === optionId ? { ...o, votes: o.votes + 1 } : o
            ),
          }
          : p
      )
    );
  }

  function totalVotes(poll: Poll) {
    return poll.options.reduce((sum, o) => sum + o.votes, 0);
  }

  function pct(votes: number, total: number) {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  }

  if (polls.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <BarChartIcon />
        <div>
          <p className="text-sm font-medium text-neutral-700">No polls yet</p>
          <p className="mt-0.5 text-xs text-neutral-400">
            The host hasn&apos;t created any polls for this event.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="space-y-4 p-4">
        {polls.map((poll) => {
          const total = totalVotes(poll);
          const voted = votedPolls[poll.id];
          const showResults = !!voted || poll.closed;

          return (
            <div
              key={poll.id}
              className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4"
            >
              {/* Question */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-neutral-900">{poll.question}</h4>
                {poll.closed && (
                  <span className="shrink-0 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                    Closed
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {poll.options.map((option) => {
                  const percentage = pct(option.votes, total);
                  const isSelected = voted === option.id;

                  if (showResults) {
                    return (
                      <div key={option.id} className="relative overflow-hidden rounded-lg">
                        {/* Bar background */}
                        <div
                          className={`absolute inset-0 rounded-lg transition-all duration-500 ${isSelected ? "bg-primary-100" : "bg-neutral-100"
                            }`}
                          style={{ width: `${percentage}%` }}
                        />
                        {/* Content */}
                        <div className="relative flex items-center justify-between px-3 py-2">
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <span className="text-primary-600">
                                <CheckCircleIcon />
                              </span>
                            )}
                            <span
                              className={`text-sm ${isSelected ? "font-medium text-primary-700" : "text-neutral-700"
                                }`}
                            >
                              {option.label}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-neutral-500">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => vote(poll.id, option.id)}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-left text-sm text-neutral-700 transition hover:border-primary-300 hover:bg-primary-50"
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <p className="mt-2.5 text-[11px] text-neutral-400">
                {total} vote{total !== 1 ? "s" : ""}
                {showResults && voted && " · You voted"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
