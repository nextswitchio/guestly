"use client";

import { useState, useEffect } from "react";
import type { Reaction } from "@/lib/store";
import { getSocket } from "@/lib/websocket";
import type { ReactionEvent } from "@/lib/websocket";
import { Icon } from "@/components/ui/Icon";

interface ReactionBarProps {
  eventId: string;
  userId?: string;
  variant?: 'default' | 'compact'; // Add variant support
  showLabel?: boolean; // Option to show/hide label
}

const REACTION_TYPES: Reaction["type"][] = ['clap', 'heart', 'fire', 'party', 'thumbs-up'];

const REACTION_CONFIG: Record<Reaction["type"], { icon: string; label: string }> = {
  'clap': { icon: 'clap', label: 'Clap' },
  'heart': { icon: 'heart', label: 'Love' },
  'fire': { icon: 'fire', label: 'Fire' },
  'party': { icon: 'party', label: 'Party' },
  'thumbs-up': { icon: 'thumbs-up', label: 'Like' },
};

export default function ReactionBar({ eventId, userId, variant = 'default', showLabel = true }: ReactionBarProps) {
  const [counts, setCounts] = useState<Record<Reaction["type"], number>>({
    'clap': 0,
    'heart': 0,
    'fire': 0,
    'party': 0,
    'thumbs-up': 0,
  });
  const [recentReactions, setRecentReactions] = useState<Reaction[]>([]);
  const [animatingReaction, setAnimatingReaction] = useState<Reaction["type"] | null>(null);
  const [clickedReaction, setClickedReaction] = useState<Reaction["type"] | null>(null);

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // Refresh every 30 seconds

    // Set up WebSocket listener for real-time reactions
    const socket = getSocket();
    
    socket.emit("join-event", { eventId, userId: userId || "guest", userName: "User" });

    const handleReaction = (data: ReactionEvent) => {
      const { reaction } = data;
      
      // Update counts
      setCounts((prev) => ({ ...prev, [reaction.type]: prev[reaction.type] + 1 }));
      
      // Add floating animation
      setRecentReactions((prev) => [...prev, reaction]);
      
      // Remove after animation
      setTimeout(() => {
        setRecentReactions((prev) => prev.filter((r) => r.id !== reaction.id));
      }, 2000);
    };

    socket.on("reaction", handleReaction);

    return () => {
      clearInterval(interval);
      socket.off("reaction", handleReaction);
    };
  }, [eventId, userId]);

  const fetchCounts = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/reactions?type=counts`);
      const data = await res.json();
      if (data.success) {
        setCounts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reaction counts:", error);
    }
  };

  const handleReaction = async (type: Reaction["type"]) => {
    if (!userId) {
      alert("Please sign in to react");
      return;
    }

    // Optimistic update with animation
    setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setAnimatingReaction(type);
    setClickedReaction(type);

    // Add floating animation
    const floatingReaction: Reaction = {
      id: `temp-${Date.now()}`,
      eventId,
      userId,
      type,
      timestamp: Date.now(),
    };
    setRecentReactions((prev) => [...prev, floatingReaction]);

    // Remove after animation
    setTimeout(() => {
      setRecentReactions((prev) => prev.filter((r) => r.id !== floatingReaction.id));
    }, 2000);

    try {
      const res = await fetch(`/api/events/${eventId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      const data = await res.json();
      if (!data.success) {
        // Revert optimistic update on error
        setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
      }
    } catch (error) {
      console.error("Failed to send reaction:", error);
      // Revert optimistic update on error
      setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
    } finally {
      setTimeout(() => {
        setAnimatingReaction(null);
        setClickedReaction(null);
      }, 300);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <div className="relative">
      {/* Floating reactions with enhanced animation */}
      <div className="pointer-events-none absolute inset-x-0 bottom-full mb-2 flex justify-center overflow-hidden">
        {recentReactions.map((reaction) => (
          <div
            key={reaction.id}
            className="animate-float-up absolute"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              animationDuration: "2s",
            }}
          >
            <Icon 
              name={REACTION_CONFIG[reaction.type].icon as any} 
              className={`${isCompact ? 'w-8 h-8' : 'w-12 h-12'} text-primary-500`}
            />
          </div>
        ))}
      </div>

      {/* Reaction buttons */}
      <div className={`flex items-center ${isCompact ? 'gap-1' : 'gap-2'} rounded-lg border border-surface-border bg-surface-card ${isCompact ? 'p-2' : 'p-3'}`}>
        {REACTION_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            disabled={!userId}
            className={`group relative flex flex-col items-center ${isCompact ? 'gap-0.5' : 'gap-1'} rounded-md ${isCompact ? 'px-2 py-1' : 'px-3 py-2'} transition-all hover:scale-110 hover:bg-surface-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
              animatingReaction === type ? "animate-bounce-scale" : ""
            } ${
              clickedReaction === type ? "bg-surface-hover" : ""
            }`}
            title={userId ? `React with ${REACTION_CONFIG[type].label}` : "Sign in to react"}
          >
            <Icon 
              name={REACTION_CONFIG[type].icon as any} 
              className={`${isCompact ? 'w-5 h-5' : 'w-6 h-6'} transition-transform group-hover:scale-125 ${
                animatingReaction === type ? "animate-pulse text-primary-500" : "text-foreground"
              }`}
            />
            {counts[type] > 0 && (
              <span className={`${isCompact ? 'text-[10px]' : 'text-xs'} font-semibold text-foreground-muted transition-all ${
                animatingReaction === type ? "scale-125 text-primary-600" : ""
              }`}>
                {counts[type]}
              </span>
            )}
            
            {/* Ripple effect on click */}
            {clickedReaction === type && (
              <span className="absolute inset-0 animate-ripple rounded-md bg-primary-500 opacity-30"></span>
            )}
          </button>
        ))}
      </div>

      {!userId && showLabel && (
        <p className={`mt-2 text-center ${isCompact ? 'text-xs' : 'text-sm'} text-foreground-muted`}>
          Sign in to react
        </p>
      )}

      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-50px) scale(1.3) rotate(10deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-120px) scale(0.5) rotate(-10deg);
          }
        }

        @keyframes bounce-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.6;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }

        .animate-bounce-scale {
          animation: bounce-scale 0.3s ease-in-out;
        }

        .animate-ripple {
          animation: ripple 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
