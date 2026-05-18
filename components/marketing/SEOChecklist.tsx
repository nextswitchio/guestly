'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';

interface SEOChecklistItem {
  id: string;
  label: string;
  status: 'passed' | 'warning' | 'failed';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface SEOChecklistProps {
  eventId: string;
}

export function SEOChecklist({ eventId }: SEOChecklistProps) {
  const [checklist, setChecklist] = useState<SEOChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchChecklist();
  }, [eventId]);

  const fetchChecklist = async () => {
    try {
      const response = await fetch(`/api/seo/checklist/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setChecklist(data.items || []);
        setScore(data.score || 0);
      }
    } catch (error) {
      console.error('Failed to fetch SEO checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <Icon name="check-circle" className="w-5 h-5 text-success-500" />;
      case 'warning':
        return <Icon name="alert-circle" className="w-5 h-5 text-warning-500" />;
      case 'failed':
        return <Icon name="x" className="w-5 h-5 text-danger-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    const colors = {
      high: 'bg-danger-100 text-danger-700',
      medium: 'bg-warning-100 text-warning-700',
      low: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-700'}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-danger-600';
  };

  const passedCount = checklist.filter(item => item.status === 'passed').length;
  const totalCount = checklist.length;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">SEO Optimization Checklist</h3>
          <button
            onClick={fetchChecklist}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <Icon name="refresh-cw" className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
              <span className="text-gray-500 text-sm">/ 100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  score >= 80 ? 'bg-success-500' : score >= 60 ? 'bg-warning-500' : 'bg-danger-500'
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {passedCount}/{totalCount}
            </div>
            <div className="text-sm text-gray-500">Checks Passed</div>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="p-6">
        <div className="space-y-3">
          {checklist.map(item => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">{getStatusIcon(item.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
                  {getPriorityBadge(item.priority)}
                </div>
                <p className="text-sm text-gray-600">{item.message}</p>
              </div>
            </div>
          ))}
        </div>

        {checklist.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Icon name="search" className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No SEO checklist items available</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">SEO Tips</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Keep meta titles between 50-60 characters</li>
          <li>• Write meta descriptions between 150-160 characters</li>
          <li>• Use descriptive, keyword-rich URLs</li>
          <li>• Add alt text to all images</li>
          <li>• Include structured data for better search visibility</li>
        </ul>
      </div>
    </div>
  );
}
