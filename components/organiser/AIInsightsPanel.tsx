import { AlertTriangle, Bot, Search } from 'lucide-react';
"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import InsightCard from "./InsightCard";
import { EventInsight } from "@/lib/store";

interface AIInsightsPanelProps {
  eventId: string;
  maxInsights?: number;
  showHeader?: boolean;
}

export default function AIInsightsPanel({ 
  eventId, 
  maxInsights = 5,
  showHeader = true 
}: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<EventInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/events/${eventId}/insights`);
        const result = await response.json();
        
        if (result.success) {
          // Sort by confidence (highest first) and limit
          const sortedInsights = result.data
            .sort((a: EventInsight, b: EventInsight) => b.confidence - a.confidence)
            .slice(0, maxInsights);
          setInsights(sortedInsights);
        } else {
          setError(result.error?.message || "Failed to load insights");
        }
      } catch (err) {
        console.error("Error fetching insights:", err);
        setError("Failed to load insights");
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      fetchInsights();
    }
  }, [eventId, maxInsights]);

  if (loading) {
    return (
      <Card padding="md" variant="navy">
        {showHeader && (
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/20 text-lg">
              Bot
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-white">AI Insights</h2>
              <p className="text-xs text-navy-400">Smart recommendations for your event</p>
            </div>
            <Badge variant="live" dot>Beta</Badge>
          </div>
        )}
        
        {/* Loading skeleton */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-navy-700/40 border border-navy-600/30 animate-pulse"
            />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card padding="md" variant="navy">
        {showHeader && (
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/20 text-lg">
              Bot
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-white">AI Insights</h2>
              <p className="text-xs text-navy-400">Smart recommendations for your event</p>
            </div>
            <Badge variant="live" dot>Beta</Badge>
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="text-4xl mb-3"><AlertTriangle className="h-4 w-4 inline-block" /></span>
          <p className="text-sm text-navy-300 mb-2">Unable to load insights</p>
          <p className="text-xs text-navy-500">{error}</p>
        </div>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card padding="md" variant="navy">
        {showHeader && (
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/20 text-lg">
              Bot
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-white">AI Insights</h2>
              <p className="text-xs text-navy-400">Smart recommendations for your event</p>
            </div>
            <Badge variant="live" dot>Beta</Badge>
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="text-4xl mb-3"><Search className="h-4 w-4 inline-block" /></span>
          <p className="text-sm text-navy-300 mb-2">Generating insights...</p>
          <p className="text-xs text-navy-500">
            We need more data to provide meaningful insights. Start selling tickets to unlock AI-powered recommendations.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="md" variant="navy">
      {showHeader && (
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/20 text-lg">
            Bot
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-white">AI Insights</h2>
            <p className="text-xs text-navy-400">
              {insights.length} {insights.length === 1 ? "insight" : "insights"} available
            </p>
          </div>
          <Badge variant="live" dot>Beta</Badge>
        </div>
      )}

      {/* Insights */}
      <div className="flex flex-col gap-3">
        {insights.map((insight) => (
          <InsightCard
            key={`${insight.type}-${insight.createdAt}`}
            insight={insight}
          />
        ))}
      </div>

      <p className="mt-4 text-center text-[10px] text-navy-500">
        Powered by Guestly Intelligence · Updated every 24 hours
      </p>
    </Card>
  );
}
