"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";

interface UserProfile {
  userId: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
}

interface FollowListProps {
  userId: string;
  type: 'followers' | 'following';
  isOpen: boolean;
  onClose: () => void;
}

export default function FollowList({ userId, type, isOpen, onClose }: FollowListProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, userId, type]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/${type}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={type === 'followers' ? 'Followers' : 'Following'}
      size="md"
    >
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-foreground-muted">
            <p>No {type} yet</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {users.map((user) => (
              <Link
                key={user.userId}
                href={`/attendee/profile?userId=${user.userId}`}
                onClick={onClose}
                className="flex items-center gap-3 p-4 hover:bg-surface-hover transition-colors"
              >
                <div className="flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-lg">
                        {user.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {user.displayName}
                  </p>
                  {user.bio && (
                    <p className="text-sm text-foreground-muted truncate">
                      {user.bio}
                    </p>
                  )}
                  <p className="text-xs text-foreground-subtle mt-1">
                    {user.followers} followers · {user.following} following
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
