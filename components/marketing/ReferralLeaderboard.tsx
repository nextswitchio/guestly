'use client';

import { useState, useEffect } from 'react';

interface ReferralLeaderboardProps {
  eventId: string;
  limit?: number;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  referrals: number;
  conversions: number;
  rewards: number;
}

export default function ReferralLeaderboard({ eventId, limit = 10 }: ReferralLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [eventId, limit]);

  const fetchLeaderboard = async () => {
    try {
      // Mock data - in real implementation, fetch from API
      const mockLeaderboard: LeaderboardEntry[] = [
        { rank: 1, userId: 'u1', name: 'Chioma A.', referrals: 15, conversions: 12, rewards: 1200 },
        { rank: 2, userId: 'u2', name: 'Kwame B.', referrals: 12, conversions: 10, rewards: 1000 },
        { rank: 3, userId: 'u3', name: 'Amara C.', referrals: 10, conversions: 8, rewards: 800 },
        { rank: 4, userId: 'u4', name: 'Tunde D.', referrals: 8, conversions: 7, rewards: 700 },
        { rank: 5, userId: 'u5', name: 'Zara E.', referrals: 7, conversions: 6, rewards: 600 },
      ];

      setLeaderboard(mockLeaderboard.slice(0, limit));
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Referral Leaderboard
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No referrals yet. Be the first to invite friends!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Referral Leaderboard
      </h3>

      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <div
            key={entry.userId}
            className={`flex items-center gap-4 p-3 rounded-lg ${
              entry.rank <= 3
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
                : 'bg-gray-50 dark:bg-gray-700/50'
            }`}
          >
            {/* Rank */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                entry.rank === 1
                  ? 'bg-yellow-400 text-yellow-900'
                  : entry.rank === 2
                  ? 'bg-gray-300 text-gray-700'
                  : entry.rank === 3
                  ? 'bg-orange-400 text-orange-900'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}
            >
              {entry.rank}
            </div>

            {/* Name */}
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">
                {entry.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {entry.conversions} conversions
              </div>
            </div>

            {/* Stats */}
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-white">
                {entry.referrals} referrals
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                ₦{entry.rewards.toLocaleString()} earned
              </div>
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length >= limit && (
        <div className="mt-4 text-center">
          <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
            View Full Leaderboard
          </button>
        </div>
      )}
    </div>
  );
}
