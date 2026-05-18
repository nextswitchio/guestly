'use client';
import { CheckCircle } from 'lucide-react';

import { useState, useEffect } from 'react';

interface ViralLoopProgressProps {
  eventId: string;
  userId: string;
}

interface ViralLoop {
  id: string;
  eventId: string;
  name: string;
  description: string;
  milestones: {
    referrals: number;
    reward: string;
    unlocked: boolean;
  }[];
  currentReferrals: number;
}

export default function ViralLoopProgress({ eventId, userId }: ViralLoopProgressProps) {
  const [viralLoop, setViralLoop] = useState<ViralLoop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchViralLoopProgress();
  }, [eventId, userId]);

  const fetchViralLoopProgress = async () => {
    try {
      // Mock data - in real implementation, fetch from API
      const mockViralLoop: ViralLoop = {
        id: 'vl_1',
        eventId,
        name: 'Group Discount Challenge',
        description: 'Invite friends and unlock group discounts!',
        milestones: [
          { referrals: 3, reward: '10% off for you and your friends', unlocked: false },
          { referrals: 5, reward: '15% off for you and your friends', unlocked: false },
          { referrals: 10, reward: '20% off for you and your friends', unlocked: false },
        ],
        currentReferrals: 0,
      };

      setViralLoop(mockViralLoop);
    } catch (error) {
      console.error('Failed to fetch viral loop progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!viralLoop) {
    return null;
  }

  const nextMilestone = viralLoop.milestones.find(m => !m.unlocked);
  const progress = nextMilestone 
    ? (viralLoop.currentReferrals / nextMilestone.referrals) * 100 
    : 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {viralLoop.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {viralLoop.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {viralLoop.currentReferrals} referrals
          </span>
          {nextMilestone && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {nextMilestone.referrals - viralLoop.currentReferrals} more to unlock
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        {viralLoop.milestones.map((milestone, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              milestone.unlocked
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-gray-50 dark:bg-gray-700/50'
            }`}
          >
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                milestone.unlocked
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}
            >
              {milestone.unlocked ? '<CheckCircle className="h-4 w-4 inline-block" />' : index + 1}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {milestone.referrals} referrals
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {milestone.reward}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
