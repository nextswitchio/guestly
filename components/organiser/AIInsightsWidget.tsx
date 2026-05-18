import { ArrowRight, Bot, Clock, Lightbulb, TrendingUp } from 'lucide-react';
"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const insights = [
    {
        type: "pricing",
        icon: <Lightbulb className="h-4 w-4" />,
        title: "Increase VIP ticket price",
        body: "VIP tickets sold out 3x faster than Regular. Based on demand, you could increase the VIP price by 15–20% and still sell out.",
        action: "Adjust pricing",
        href: "#",
        badge: "Pricing",
        badgeVariant: "primary" as const,
    },
    {
        type: "timing",
        icon: <Clock className="h-4 w-4" />,
        title: "Best time to promote",
        body: "Your audience engages most on Thursday evenings. Schedule your next announcement for Thursday 7–9 PM for maximum reach.",
        action: "Schedule post",
        href: "#",
        badge: "Timing",
        badgeVariant: "success" as const,
    },
    {
        type: "forecast",
        icon: <TrendingUp className="h-4 w-4" />,
        title: "Attendance forecast",
        body: "Based on current sales velocity, you are on track to sell 94% of capacity 5 days before the event.",
        action: "View analytics",
        href: "/dashboard/analytics",
        badge: "Forecast",
        badgeVariant: "warning" as const,
    },
];

export default function AIInsightsWidget() {
    return (
        <Card padding="md" variant="navy">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/20">
                    <Bot className="h-5 w-5 text-primary-300" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-white">AI Insights</h2>
                    <p className="text-xs text-navy-400">Smart recommendations for your events</p>
                </div>
                <Badge variant="live" dot>Beta</Badge>
            </div>

            {/* Insights */}
            <div className="flex flex-col gap-3">
                {insights.map((insight) => (
                    <div
                        key={insight.type}
                        className="flex gap-3 rounded-xl bg-navy-700/60 border border-navy-600/50 p-4 hover:bg-navy-700 transition-colors"
                    >
                        <span className="text-xl shrink-0 mt-0.5">{insight.icon}</span>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-semibold text-white">{insight.title}</p>
                                <Badge variant={insight.badgeVariant} className="text-[9px] py-0">
                                    {insight.badge}
                                </Badge>
                            </div>
                            <p className="text-xs text-navy-300 leading-relaxed">{insight.body}</p>
                            <a href={insight.href} className="mt-2 inline-block text-[11px] font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                                {insight.action}<ArrowRight className="h-4 w-4 inline" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-4 text-center text-[10px] text-navy-500">
                Powered by Guestly Intelligence · Updated every 6 hours
            </p>
        </Card>
    );
}
