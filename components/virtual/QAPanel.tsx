"use client";
import { Check } from 'lucide-react';
import { useState, useEffect } from "react";
import type { QAQuestion } from "@/lib/store";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { getSocket } from "@/lib/websocket";
import type { QAQuestionEvent, QAUpvotedEvent, QAAnsweredEvent, QADeletedEvent } from "@/lib/websocket";

interface QAPanelProps {
  eventId: string;
  userId?: string;
  userName?: string;
  isOrganizer?: boolean;
}

type FilterType = "all" | "answered" | "unanswered";

export default function QAPanel({ eventId, userId, userName, isOrganizer }: QAPanelProps) {
  const [questions, setQuestions] = useState<QAQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [upvotedQuestions, setUpvotedQuestions] = useState<Set<string>>(new Set());
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();

    // Set up WebSocket listeners for real-time updates
    const socket = getSocket();
    
    socket.emit("join-event", { eventId, userId: userId || "guest", userName: userName || "User" });

    const handleQAQuestion = (data: QAQuestionEvent) => {
      setQuestions((prev) => [data.question, ...prev]);
    };

    const handleQAUpvoted = (data: QAUpvotedEvent) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === data.questionId ? data.question : q))
      );
    };

    const handleQAAnswered = (data: QAAnsweredEvent) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === data.questionId ? data.question : q))
      );
    };

    const handleQADeleted = (data: QADeletedEvent) => {
      setQuestions((prev) => prev.filter((q) => q.id !== data.questionId));
    };

    socket.on("qa-question", handleQAQuestion);
    socket.on("qa-upvoted", handleQAUpvoted);
    socket.on("qa-answered", handleQAAnswered);
    socket.on("qa-deleted", handleQADeleted);

    return () => {
      socket.off("qa-question", handleQAQuestion);
      socket.off("qa-upvoted", handleQAUpvoted);
      socket.off("qa-answered", handleQAAnswered);
      socket.off("qa-deleted", handleQADeleted);
    };
  }, [eventId, userId, userName]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/qa`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !userName || !newQuestion.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${eventId}/qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion, userName }),
      });

      const data = await res.json();
      if (data.success) {
        setQuestions((prev) => [data.data, ...prev]);
        setNewQuestion("");
      } else {
        alert(data.error || "Failed to submit question");
      }
    } catch (error) {
      console.error("Failed to submit question:", error);
      alert("Failed to submit question");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (questionId: string) => {
    if (!userId || upvotedQuestions.has(questionId)) return;

    try {
      const res = await fetch(`/api/events/${eventId}/qa/${questionId}/upvote`, {
        method: "POST",
      });

      const data = await res.json();
      if (data.success) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === questionId ? data.data : q))
        );
        setUpvotedQuestions((prev) => new Set(prev).add(questionId));
      } else {
        alert(data.error || "Failed to upvote");
      }
    } catch (error) {
      console.error("Failed to upvote:", error);
    }
  };

  const handleAnswer = async (questionId: string) => {
    if (!isOrganizer || !answerText.trim()) return;

    try {
      const res = await fetch(`/api/events/${eventId}/qa/${questionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answerText, answeredBy: userName || "Organizer" }),
      });

      const data = await res.json();
      if (data.success) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === questionId ? data.data : q))
        );
        setAnsweringId(null);
        setAnswerText("");
      } else {
        alert(data.error || "Failed to answer");
      }
    } catch (error) {
      console.error("Failed to answer:", error);
      alert("Failed to answer");
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!isOrganizer) return;

    if (!confirm("Are you sure you want to delete this question?")) return;

    setDeletingId(questionId);
    try {
      const res = await fetch(`/api/events/${eventId}/qa/${questionId}/delete`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      } else {
        alert(data.error || "Failed to delete question");
      }
    } catch (error) {
      console.error("Failed to delete question:", error);
      alert("Failed to delete question");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter questions based on selected filter
  const filteredQuestions = questions.filter((q) => {
    if (filter === "answered") return q.answered;
    if (filter === "unanswered") return !q.answered;
    return true;
  });

  const answeredCount = questions.filter((q) => q.answered).length;
  const unansweredCount = questions.filter((q) => !q.answered).length;

  if (loading) {
    return (
      <div className="p-4 text-center text-foreground-muted">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Question submission form */}
      {userId && (
        <form onSubmit={handleSubmitQuestion} className="border-b border-surface-border p-4">
          <div className="flex gap-2">
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask a question..."
              disabled={submitting}
              className="flex-1"
            />
            <Button type="submit" disabled={submitting || !newQuestion.trim()}>
              {submitting ? "Sending..." : "Ask"}
            </Button>
          </div>
        </form>
      )}

      {/* Filter tabs */}
      <div className="border-b border-surface-border bg-surface-card px-4 py-2">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-primary-500 text-white"
                : "text-foreground-muted hover:bg-surface-hover"
            }`}
          >
            All ({questions.length})
          </button>
          <button
            onClick={() => setFilter("unanswered")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === "unanswered"
                ? "bg-primary-500 text-white"
                : "text-foreground-muted hover:bg-surface-hover"
            }`}
          >
            Unanswered ({unansweredCount})
          </button>
          <button
            onClick={() => setFilter("answered")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === "answered"
                ? "bg-primary-500 text-white"
                : "text-foreground-muted hover:bg-surface-hover"
            }`}
          >
            Answered ({answeredCount})
          </button>
        </div>
      </div>

      {/* Questions list */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center text-foreground-muted">
            {filter === "all" && "No questions yet. Be the first to ask!"}
            {filter === "answered" && "No answered questions yet."}
            {filter === "unanswered" && "No unanswered questions."}
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="rounded-lg border border-surface-border bg-surface-card p-4"
            >
              {/* Question header */}
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="font-medium text-foreground">{q.question}</p>
                    {/* Status badge */}
                    {q.answered ? (
                      <span className="inline-flex items-center rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-700">
                       <Check className="h-4 w-4 inline" /> Answered
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground-muted">
                    by {q.userName} • {new Date(q.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                {/* Upvote button */}
                <button
                  onClick={() => handleUpvote(q.id)}
                  disabled={!userId || upvotedQuestions.has(q.id)}
                  className="flex flex-col items-center gap-1 rounded-md px-3 py-1 transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
                  title={upvotedQuestions.has(q.id) ? "Already upvoted" : "Upvote this question"}
                >
                  <Icon name="thumbs-up" className="w-5 h-5" />
                  <span className="text-sm font-semibold text-foreground-muted">
                    {q.upvotes}
                  </span>
                </button>
              </div>

              {/* Answer */}
              {q.answered && q.answer && (
                <div className="mt-3 rounded-md bg-primary-50 p-3 dark:bg-primary-900/20">
                  <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                    Answer by {q.answeredBy}:
                  </p>
                  <p className="mt-1 text-sm text-foreground">{q.answer}</p>
                </div>
              )}

              {/* Moderator controls (organizer only) */}
              {isOrganizer && (
                <div className="mt-3 flex items-center gap-2">
                  {!q.answered && (
                    <>
                      {answeringId === q.id ? (
                        <div className="flex-1 space-y-2">
                          <Input
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            placeholder="Type your answer..."
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAnswer(q.id)}
                              disabled={!answerText.trim()}
                            >
                              Submit Answer
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setAnsweringId(null);
                                setAnswerText("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setAnsweringId(q.id)}
                        >
                          Answer
                        </Button>
                      )}
                    </>
                  )}
                  
                  {/* Delete button */}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(q.id)}
                    disabled={deletingId === q.id}
                  >
                    {deletingId === q.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
