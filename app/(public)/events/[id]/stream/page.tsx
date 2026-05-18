"use client";
import { AlertTriangle, Clock, MessageCircle, Monitor, Ticket } from 'lucide-react';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StreamEmbed from "@/components/virtual/StreamEmbed";
import PollPanel from "@/components/virtual/PollPanel";
import QAPanel from "@/components/virtual/QAPanel";
import ReactionBar from "@/components/virtual/ReactionBar";
import type { Event } from "@/lib/events";
import type { VirtualAccess } from "@/lib/store";

type AccessState = "loading" | "granted" | "denied" | "error" | "no-stream";
type StreamMode = "live" | "replay" | "upcoming";

interface AccessError {
  message: string;
  canPurchase?: boolean;
}

export default function VirtualEventStreamPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [accessState, setAccessState] = useState<AccessState>("loading");
  const [event, setEvent] = useState<Event | null>(null);
  const [access, setAccess] = useState<VirtualAccess | null>(null);
  const [error, setError] = useState<AccessError | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "polls" | "qa">("chat");
  const [streamMode, setStreamMode] = useState<StreamMode>("live");

  useEffect(() => {
    async function checkAccess() {
      try {
        // Get user info
        const authRes = await fetch("/api/auth/me");
        if (authRes.ok) {
          const authData = await authRes.json();
          setUserId(authData.userId);
          setUserName(authData.userId); // In a real app, fetch actual user name
          setUserRole(authData.role);
        }

        // Fetch event details
        const eventRes = await fetch(`/api/events/${eventId}`);
        if (!eventRes.ok) {
          setAccessState("error");
          setError({ message: "Event not found" });
          return;
        }

        const eventData = await eventRes.json();
        setEvent(eventData);

        // Check if event supports virtual streaming
        if (eventData.eventType !== "Virtual" && eventData.eventType !== "Hybrid") {
          setAccessState("no-stream");
          setError({ message: "This event does not support virtual streaming" });
          return;
        }

        if (!eventData.streamingConfig) {
          setAccessState("no-stream");
          setError({ message: "Virtual streaming is not configured for this event" });
          return;
        }

        // Determine stream mode based on event date and replay settings
        const eventDate = new Date(eventData.date);
        const now = new Date();
        const eventEndTime = new Date(eventDate.getTime() + 4 * 60 * 60 * 1000); // Assume 4 hour event duration

        if (now < eventDate) {
          // Event hasn't started yet
          setStreamMode("upcoming");
        } else if (now > eventEndTime) {
          // Event has ended - check for replay
          if (eventData.streamingConfig.enableReplay && eventData.streamingConfig.recordingUrl) {
            setStreamMode("replay");
          } else {
            setAccessState("no-stream");
            setError({ message: "This event has ended and replay is not available" });
            return;
          }
        } else {
          // Event is currently live
          setStreamMode("live");
        }

        // Request virtual access
        const accessRes = await fetch(`/api/events/${eventId}/virtual-access`, {
          method: "POST",
        });

        const accessData = await accessRes.json();

        if (!accessRes.ok) {
          setAccessState("denied");
          setError({
            message: accessData.error || "Access denied",
            canPurchase: accessRes.status === 403,
          });
          return;
        }

        setAccess(accessData.access);
        setAccessState("granted");
      } catch (err) {
        console.error("Error checking virtual access:", err);
        setAccessState("error");
        setError({ message: "Failed to verify access. Please try again." });
      }
    }

    checkAccess();
  }, [eventId]);

  // Loading state
  if (accessState === "loading") {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-lime border-t-transparent mb-4"></div>
          <p className="text-foreground-muted">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Access denied - no ticket
  if (accessState === "denied" && error?.canPurchase) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface-card rounded-lg border border-surface-border p-8 text-center">
          <div className="text-6xl mb-4"><Ticket className="h-4 w-4 inline-block" /></div>
          <h2 className="text-2xl font-semibold mb-2">Ticket Required</h2>
          <p className="text-foreground-muted mb-6">{error.message}</p>
          <button
            onClick={() => router.push(`/events/${eventId}/buy`)}
            className="w-full px-6 py-3 bg-lime text-white rounded-lg hover:bg-lime transition-colors"
          >
            Purchase Ticket
          </button>
          <button
            onClick={() => router.push(`/events/${eventId}`)}
            className="w-full mt-3 px-6 py-3 bg-transparent text-foreground border border-surface-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            View Event Details
          </button>
        </div>
      </div>
    );
  }

  // Access denied - other reason
  if (accessState === "denied" || accessState === "error") {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface-card rounded-lg border border-surface-border p-8 text-center">
          <div className="text-6xl mb-4"><AlertTriangle className="h-4 w-4 inline-block" /></div>
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-foreground-muted mb-6">{error?.message || "Unable to access this stream"}</p>
          <button
            onClick={() => router.push(`/events/${eventId}`)}
            className="w-full px-6 py-3 bg-lime text-white rounded-lg hover:bg-lime transition-colors"
          >
            Back to Event
          </button>
        </div>
      </div>
    );
  }

  // No streaming configured
  if (accessState === "no-stream") {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface-card rounded-lg border border-surface-border p-8 text-center">
          <div className="text-6xl mb-4">Monitor</div>
          <h2 className="text-2xl font-semibold mb-2">No Virtual Stream</h2>
          <p className="text-foreground-muted mb-6">{error?.message || "This event does not have virtual streaming"}</p>
          <button
            onClick={() => router.push(`/events/${eventId}`)}
            className="w-full px-6 py-3 bg-lime text-white rounded-lg hover:bg-lime transition-colors"
          >
            Back to Event
          </button>
        </div>
      </div>
    );
  }

  // Access granted - show stream
  if (accessState === "granted" && event && event.streamingConfig) {
    return (
      <div className="min-h-screen bg-surface-bg">
        {/* Header */}
        <div className="bg-surface-card border-b border-surface-border">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/events/${eventId}`)}
                className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                aria-label="Back to event"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold">{event.title}</h1>
                <p className="text-sm text-foreground-muted">
                  {streamMode === "live" && "Live Stream"}
                  {streamMode === "replay" && "Event Replay"}
                  {streamMode === "upcoming" && "Upcoming Event"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {streamMode === "live" && (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 text-rose-500 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                  LIVE
                </span>
              )}
              {streamMode === "replay" && (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-lime/10 text-lime rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  REPLAY
                </span>
              )}
              {streamMode === "upcoming" && (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  UPCOMING
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Stream + Engagement Tools */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stream and Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stream */}
              <div className="bg-surface-card rounded-lg border border-surface-border p-4">
                {streamMode === "upcoming" ? (
                  <div className="aspect-video bg-surface-bg rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4"><Clock className="h-4 w-4 inline-block" /></div>
                      <h3 className="text-xl font-semibold mb-2">Event Starts Soon</h3>
                      <p className="text-foreground-muted mb-4">
                        This stream will be available when the event starts on{" "}
                        {new Date(event.date).toLocaleString()}
                      </p>
                      <p className="text-sm text-foreground-muted">
                        Check back closer to the event time to join the live stream.
                      </p>
                    </div>
                  </div>
                ) : (
                  <StreamEmbed
                    provider={event.streamingConfig.provider}
                    streamUrl={
                      streamMode === "replay" && event.streamingConfig.recordingUrl
                        ? event.streamingConfig.recordingUrl
                        : event.streamingConfig.streamUrl
                    }
                    eventTitle={event.title}
                  />
                )}
              </div>

              {/* Reaction Bar */}
              <ReactionBar eventId={eventId} userId={userId || undefined} />

              {/* Replay Notice */}
              {streamMode === "replay" && (
                <div className="bg-lime/10 border border-lime/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-lime mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1 text-sm">
                      <p className="text-foreground mb-1 font-medium">
                        You're watching a replay
                      </p>
                      <p className="text-foreground-muted text-xs">
                        This event has ended. You're viewing a recording of the live stream. 
                        Interactive features like polls and Q&A are no longer available.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming Notice */}
              {streamMode === "upcoming" && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1 text-sm">
                      <p className="text-foreground mb-1 font-medium">
                        Stream not yet available
                      </p>
                      <p className="text-foreground-muted text-xs">
                        The live stream will begin when the event starts. You'll be able to join and interact with other attendees.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Info */}
              <div className="bg-surface-card rounded-lg border border-surface-border p-6">
                <h2 className="text-lg font-semibold mb-2">About this event</h2>
                <p className="text-foreground-muted mb-4">{event.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-foreground-muted">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-foreground-muted">{event.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-foreground-muted">{event.category}</span>
                  </div>
                </div>
              </div>

              {/* Access Info */}
              {access && (
                <div className="bg-lime/10 border border-lime/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-lime mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1 text-sm">
                      <p className="text-foreground mb-1">
                        Your access expires on {new Date(access.expiresAt).toLocaleString()}
                      </p>
                      <p className="text-foreground-muted text-xs">
                        You can rejoin this stream anytime before expiration using your unique access link.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Engagement Tools */}
            <div className="lg:col-span-1">
              {streamMode === "live" ? (
                <div className="bg-surface-card rounded-lg border border-surface-border overflow-hidden sticky top-6">
                  {/* Tabs */}
                  <div className="flex border-b border-surface-border">
                    <button
                      onClick={() => setActiveTab("polls")}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === "polls"
                          ? "bg-lime/10 text-lime border-b-2 border-lime"
                          : "text-foreground-muted hover:text-foreground hover:bg-surface-hover"
                      }`}
                    >
                      Polls
                    </button>
                    <button
                      onClick={() => setActiveTab("qa")}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === "qa"
                          ? "bg-lime/10 text-lime border-b-2 border-lime"
                          : "text-foreground-muted hover:text-foreground hover:bg-surface-hover"
                      }`}
                    >
                      Q&A
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="h-[600px] overflow-hidden">
                    {activeTab === "polls" && (
                      <PollPanel eventId={eventId} userId={userId || undefined} />
                    )}
                    {activeTab === "qa" && (
                      <QAPanel
                        eventId={eventId}
                        userId={userId || undefined}
                        userName={userName || undefined}
                        isOrganizer={userRole === "organiser"}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-surface-card rounded-lg border border-surface-border p-6 sticky top-6">
                  <div className="text-center">
                    <div className="text-4xl mb-3"><MessageCircle className="h-4 w-4 inline-block" /></div>
                    <h3 className="text-lg font-semibold mb-2">Interactive Features Unavailable</h3>
                    <p className="text-sm text-foreground-muted">
                      {streamMode === "replay" 
                        ? "Polls and Q&A are only available during live events."
                        : "Interactive features will be available when the event goes live."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
