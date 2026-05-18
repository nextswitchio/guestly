"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";

interface SavingsGoal {
    eventName: string;
    target: number;
    current: number;
    deadline: string;
    currency?: string;
}

interface GroupSavingsCardProps {
    goal: SavingsGoal;
    contributors?: { name: string; avatar: string; amount: number }[];
    onAddFunds?: () => void;
}

export default function GroupSavingsCard({ goal, contributors = [], onAddFunds }: GroupSavingsCardProps) {
    const currency = goal.currency ?? "₦";
    const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
    const remaining = goal.target - goal.current;

    return (
        <Card padding="md">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10">
                        <Icon name="target" size={20} className="text-lime" />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-500 font-medium">Saving for</p>
                        <h3 className="text-sm font-bold text-neutral-900 leading-tight">{goal.eventName}</h3>
                    </div>
                </div>
                <Badge variant="success">{pct}% saved</Badge>
            </div>

            {/* Progress */}
            <div className="mb-4">
                <div className="flex items-end justify-between mb-2">
                    <div>
                        <p className="text-2xl font-extrabold text-neutral-900 tabular-nums">
                            {currency}{goal.current.toLocaleString()}
                        </p>
                        <p className="text-xs text-neutral-500">
                            of {currency}{goal.target.toLocaleString()} goal
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-red-600">{currency}{remaining.toLocaleString()}</p>
                        <p className="text-xs text-neutral-500">remaining</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-50 border border-neutral-200">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-lime to-green-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                    />
                </div>

                <p className="mt-2 text-xs text-neutral-500 flex items-center gap-1">
                    <Icon name="calendar" size={12} /> Deadline: {goal.deadline}
                </p>
            </div>

            {/* Contributors */}
            {contributors.length > 0 && (
                <div className="mb-4 rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                    <p className="text-xs font-semibold text-neutral-900 mb-2">
                        Group contributors ({contributors.length})
                    </p>
                    <div className="flex flex-col gap-2">
                        {contributors.slice(0, 3).map((c, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime text-[9px] font-bold text-dark">
                                        {c.avatar}
                                    </span>
                                    <span className="text-xs text-neutral-900">{c.name}</span>
                                </div>
                                <span className="text-xs font-semibold text-green-600">
                                    +{currency}{c.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action */}
            <button
                onClick={onAddFunds}
                className="w-full rounded-xl bg-lime py-2.5 text-sm font-semibold text-dark transition hover:bg-lime-hover"
            >
                Add to Savings
            </button>
        </Card>
    );
}
