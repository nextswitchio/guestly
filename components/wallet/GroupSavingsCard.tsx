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
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                        <Icon name="target" size={20} className="text-primary-600" />
                    </div>
                    <div>
                        <p className="text-xs text-[var(--foreground-muted)] font-medium">Saving for</p>
                        <h3 className="text-sm font-bold text-[var(--foreground)] leading-tight">{goal.eventName}</h3>
                    </div>
                </div>
                <Badge variant="success">{pct}% saved</Badge>
            </div>

            {/* Progress */}
            <div className="mb-4">
                <div className="flex items-end justify-between mb-2">
                    <div>
                        <p className="text-2xl font-extrabold text-[var(--foreground)] tabular-nums">
                            {currency}{goal.current.toLocaleString()}
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                            of {currency}{goal.target.toLocaleString()} goal
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-danger-600">{currency}{remaining.toLocaleString()}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">remaining</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--surface-bg)] border border-[var(--surface-border)]">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-success-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                    />
                </div>

                <p className="mt-2 text-xs text-[var(--foreground-muted)] flex items-center gap-1">
                    <Icon name="calendar" size={12} /> Deadline: {goal.deadline}
                </p>
            </div>

            {/* Contributors */}
            {contributors.length > 0 && (
                <div className="mb-4 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] p-3">
                    <p className="text-xs font-semibold text-[var(--foreground)] mb-2">
                        Group contributors ({contributors.length})
                    </p>
                    <div className="flex flex-col gap-2">
                        {contributors.slice(0, 3).map((c, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-[9px] font-bold text-white">
                                        {c.avatar}
                                    </span>
                                    <span className="text-xs text-[var(--foreground)]">{c.name}</span>
                                </div>
                                <span className="text-xs font-semibold text-success-600">
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
                className="w-full rounded-xl bg-primary-500 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 btn-glow-blue"
            >
                Add to Savings
            </button>
        </Card>
    );
}
