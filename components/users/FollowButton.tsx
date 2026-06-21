"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  type?: 'user' | 'organizer';
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({
  userId,
  initialIsFollowing = false,
  type = 'organizer',
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/follows/check?organizerId=${userId}`)
      .then(r => r.json())
      .then(d => { if (d.following !== undefined) setIsFollowing(d.following); })
      .catch(() => {});
  }, [userId]);

  const handleToggleFollow = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followingId: userId,
          action: isFollowing ? "unfollow" : "follow",
          followType: type,
        }),
      });

      const d = await response.json();
      if (d.success) {
        setIsFollowing(d.following ?? !isFollowing);
        onFollowChange?.(d.following ?? !isFollowing);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? "secondary" : "primary"}
      size="sm"
      onClick={handleToggleFollow}
      loading={loading}
      disabled={loading}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
