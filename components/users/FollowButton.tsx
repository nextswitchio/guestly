"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
  type?: 'user' | 'organizer';
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({
  userId,
  initialIsFollowing,
  type = 'user',
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        const response = await fetch(`/api/users/${userId}/follow`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFollowing(false);
          onFollowChange?.(false);
        }
      } else {
        // Follow
        const response = await fetch(`/api/users/${userId}/follow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        });

        if (response.ok) {
          setIsFollowing(true);
          onFollowChange?.(true);
        }
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
