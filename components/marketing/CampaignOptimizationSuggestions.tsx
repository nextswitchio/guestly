'use client';
import { ArrowRight } from 'lucide-react';

import { useState, useEffect } from 'react';

interface OptimizationSuggestion {
  id: string;
  type: 'warning' | 'info' | 'success';
  category: 'budget' | 'targeting' | 'creative' | 'timing' | 'channel';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
}

interface CampaignOptimizationSuggestionsProps {
  campaignId: string;
}

export default function CampaignOptimizationSuggestions({
  campaignId,
}: CampaignOptimizationSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, [campaignId]);

  const fetchSuggestions = async () => {
    try {
      // Mock suggestions - in real implementation, analyze campaign data
      const mockSuggestions: OptimizationSuggestion[] = [
        {
          id: 's1',
          type: 'warning',
          category: 'budget',
          title: 'Budget pacing ahead of schedule',
          description:
            'Your campaign is spending 40% faster than planned. Consider reducing daily budget or pausing underperforming ad sets.',
          impact: 'high',
          action: 'Adjust Budget',
        },
        {
          id: 's2',
          type: 'info',
          category: 'timing',
          title: 'Peak engagement time detected',
          description:
            'Your audience is most active between 6-9 PM. Schedule more posts during this window for better engagement.',
          impact: 'medium',
          action: 'Update Schedule',
        },
        {
          id: 's3',
          type: 'success',
          category: 'channel',
          title: 'Instagram performing well',
          description:
            'Instagram has 2.5x higher conversion rate than other channels. Consider increasing budget allocation.',
          impact: 'high',
          action: 'Increase Budget',
        },
      ];

      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Failed to fetch optimization suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-neutral-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Optimization Suggestions
        </h3>
        <p className="text-sm text-neutral-500">
          No suggestions available yet. Check back after your campaign has more data.
        </p>
      </div>
    );
  }

  const getTypeStyles = (type: OptimizationSuggestion['type']) => {
    switch (type) {
      case 'warning':
        return 'border-amber-200 bg-amber-100';
      case 'success':
        return 'border-green-200 bg-green-100';
      default:
        return 'border-blue-200 bg-blue-100';
    }
  };

  const getImpactBadge = (impact: OptimizationSuggestion['impact']) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-neutral-100 text-neutral-700',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[impact]}`}>
        {impact.toUpperCase()} IMPACT
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Optimization Suggestions
      </h3>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`p-4 border rounded-lg ${getTypeStyles(suggestion.type)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-neutral-900">
                    {suggestion.title}
                  </h4>
                  {getImpactBadge(suggestion.impact)}
                </div>
                <p className="text-sm text-neutral-500">
                  {suggestion.description}
                </p>
              </div>
            </div>

            {suggestion.action && (
              <button className="mt-3 text-sm font-medium text-lime hover:text-lime/80">
                {suggestion.action}<ArrowRight className="h-4 w-4 inline" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
