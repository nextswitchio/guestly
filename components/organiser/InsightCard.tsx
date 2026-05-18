import { ArrowRight, Banknote, BarChart3, Building2, Clock, Lightbulb, Megaphone, Target, Users } from 'lucide-react';
"use client";
import React from "react";
import Badge from "@/components/ui/Badge";
import { EventInsight } from "@/lib/store";

interface InsightCardProps {
  insight: EventInsight;
  onAction?: () => void;
}

// Map insight types to icons, colors, and labels
function getInsightIcon(type: string) {
  switch (type) {
    case "attendance_prediction": return <Users className="h-5 w-5" />;
    case "revenue_forecast": return <Banknote className="h-5 w-5" />;
    case "pricing_recommendation": return <Lightbulb className="h-5 w-5" />;
    case "timing_suggestion": return <Clock className="h-5 w-5" />;
    case "promotion_timing": return <Megaphone className="h-5 w-5" />;
    case "audience_targeting": return <Target className="h-5 w-5" />;
    case "performance_comparison": return <BarChart3 className="h-5 w-5" />;
    case "city_benchmark": return <Building2 className="h-5 w-5" />;
    default: return <Lightbulb className="h-5 w-5" />;
  }
}

const insightConfig = {
  attendance_prediction: {
    label: "Attendance",
    badgeVariant: "primary" as const,
    color: "primary",
  },
  revenue_forecast: {
    label: "Revenue",
    badgeVariant: "success" as const,
    color: "success",
  },
  pricing_recommendation: {
    label: "Pricing",
    badgeVariant: "warning" as const,
    color: "warning",
  },
  timing_suggestion: {
    label: "Timing",
    badgeVariant: "primary" as const,
    color: "primary",
  },
  promotion_timing: {
    label: "Promotion",
    badgeVariant: "success" as const,
    color: "success",
  },
  audience_targeting: {
    label: "Audience",
    badgeVariant: "primary" as const,
    color: "primary",
  },
  performance_comparison: {
    label: "Performance",
    badgeVariant: "warning" as const,
    color: "warning",
  },
  city_benchmark: {
    label: "Benchmark",
    badgeVariant: "primary" as const,
    color: "primary",
  },
};

// Get confidence level label and color
function getConfidenceDisplay(confidence: number): { label: string; color: string } {
  if (confidence >= 0.8) {
    return { label: "High confidence", color: "text-success-400" };
  } else if (confidence >= 0.5) {
    return { label: "Medium confidence", color: "text-warning-400" };
  } else {
    return { label: "Low confidence", color: "text-navy-400" };
  }
}

// Extract actionable recommendation from insight data
function getRecommendation(insight: EventInsight): string | null {
  const { type, data } = insight;
  
  switch (type) {
    case "attendance_prediction":
      if (data.predictedAttendance > data.currentSales * 1.5) {
        return "Consider increasing marketing efforts to reach predicted attendance.";
      }
      return "Monitor sales velocity and adjust marketing as needed.";
      
    case "revenue_forecast":
      if (data.projectedRevenue > data.currentRevenue * 2) {
        return "Strong revenue potential. Consider adding premium ticket tiers.";
      }
      return "Track revenue progress and optimize pricing strategy.";
      
    case "pricing_recommendation":
      if (data.recommendedPrice && data.currentPrice) {
        const diff = ((data.recommendedPrice - data.currentPrice) / data.currentPrice * 100).toFixed(0);
        if (Math.abs(Number(diff)) > 10) {
          return `Consider ${Number(diff) > 0 ? "increasing" : "decreasing"} price by ${Math.abs(Number(diff))}%.`;
        }
      }
      return "Current pricing is optimal for your market.";
      
    case "timing_suggestion":
      if (data.recommendedDay || data.recommendedTime) {
        return `Best time: ${data.recommendedDay || ""} ${data.recommendedTime || ""}`.trim();
      }
      return "Review timing recommendations for optimal attendance.";
      
    case "promotion_timing":
      if (data.nextPromotionWindow) {
        return `Next promotion window: ${data.nextPromotionWindow}`;
      }
      return "Schedule promotions during peak engagement times.";
      
    case "audience_targeting":
      if (data.topDemographic) {
        return `Focus on ${data.topDemographic} demographic for best results.`;
      }
      return "Review audience insights to refine targeting strategy.";
      
    case "city_benchmark":
      if (data.performanceVsAverage) {
        const perf = data.performanceVsAverage;
        if (perf > 1.2) {
          return "Performing 20% above city average. Great work!";
        } else if (perf < 0.8) {
          return "Below city average. Review successful events for insights.";
        }
      }
      return "Compare your metrics with city benchmarks.";
      
    default:
      return null;
  }
}

// Format key metrics from insight data
function getKeyMetrics(insight: EventInsight): Array<{ label: string; value: string }> {
  const { type, data } = insight;
  const metrics: Array<{ label: string; value: string }> = [];
  
  switch (type) {
    case "attendance_prediction":
      if (data.predictedAttendance !== undefined) {
        metrics.push({ label: "Predicted", value: `${data.predictedAttendance} attendees` });
      }
      if (data.currentSales !== undefined) {
        metrics.push({ label: "Current", value: `${data.currentSales} sold` });
      }
      if (data.daysUntilEvent !== undefined) {
        metrics.push({ label: "Days left", value: `${data.daysUntilEvent}` });
      }
      break;
      
    case "revenue_forecast":
      if (data.projectedRevenue !== undefined) {
        metrics.push({ label: "Projected", value: `$${data.projectedRevenue.toLocaleString()}` });
      }
      if (data.currentRevenue !== undefined) {
        metrics.push({ label: "Current", value: `$${data.currentRevenue.toLocaleString()}` });
      }
      break;
      
    case "pricing_recommendation":
      if (data.recommendedPrice !== undefined) {
        metrics.push({ label: "Recommended", value: `$${data.recommendedPrice}` });
      }
      if (data.currentPrice !== undefined) {
        metrics.push({ label: "Current", value: `$${data.currentPrice}` });
      }
      break;
      
    case "city_benchmark":
      if (data.performanceVsAverage !== undefined) {
        const percentage = ((data.performanceVsAverage - 1) * 100).toFixed(0);
        metrics.push({ 
          label: "vs City Avg", 
          value: `${Number(percentage) > 0 ? "+" : ""}${percentage}%` 
        });
      }
      break;
  }
  
  return metrics;
}

export default function InsightCard({ insight, onAction }: InsightCardProps) {
  const config = insightConfig[insight.type] || {
    icon: "💡",
    label: "Insight",
    badgeVariant: "primary" as const,
    color: "primary",
  };
  
  const confidenceDisplay = getConfidenceDisplay(insight.confidence);
  const recommendation = getRecommendation(insight);
  const keyMetrics = getKeyMetrics(insight);
  
  return (
    <div className="flex gap-3 rounded-xl bg-navy-700/60 border border-navy-600/50 p-4 hover:bg-navy-700 transition-all duration-200 hover:border-navy-500/50">
      {/* Icon */}
      <span className="shrink-0 mt-0.5">{getInsightIcon(insight.type)}</span>
      
      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white">{insight.title}</h3>
            <Badge variant={config.badgeVariant} className="text-[9px] py-0.5 px-1.5">
              {config.label}
            </Badge>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <div className={`text-[10px] font-medium ${confidenceDisplay.color}`}>
              {confidenceDisplay.label}
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-xs text-navy-300 leading-relaxed mb-3">
          {insight.description}
        </p>
        
        {/* Key Metrics */}
        {keyMetrics.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {keyMetrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[10px] text-navy-500 uppercase tracking-wide">
                  {metric.label}
                </span>
                <span className="text-xs font-semibold text-white mt-0.5">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {/* Recommendation */}
        {recommendation && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-navy-800/50 border border-navy-600/30 mb-3">
            <span className="text-xs shrink-0 mt-0.5"><Lightbulb className="h-4 w-4 inline-block" /></span>
            <p className="text-[11px] text-navy-300 leading-relaxed">
              <span className="font-semibold text-primary-400">Recommendation:</span>{" "}
              {recommendation}
            </p>
          </div>
        )}
        
        {/* Confidence Bar */}
        <div className="mb-3">
          <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                insight.confidence >= 0.8
                  ? "bg-success-500"
                  : insight.confidence >= 0.5
                  ? "bg-warning-500"
                  : "bg-navy-500"
              }`}
              style={{ width: `${insight.confidence * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-navy-500 mt-1">
            {(insight.confidence * 100).toFixed(0)}% confidence
          </p>
        </div>
        
        {/* Action */}
        {onAction && (
          <button
            onClick={onAction}
            className="text-[11px] font-semibold text-primary-400 hover:text-primary-300 transition-colors"
          >
            View details<ArrowRight className="h-4 w-4 inline" />
          </button>
        )}
      </div>
    </div>
  );
}
