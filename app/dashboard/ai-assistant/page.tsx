"use client";
import { Zap } from 'lucide-react';
import React from "react";
import AIAssistant from "@/components/organiser/AIAssistant";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

export default function AIAssistantPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">AI Planning Assistant</h1>
        <p className="text-sm text-[var(--foreground-muted)]">Get smart advice and automated content for your event</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AIAssistant />
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-primary-600 text-white border-none shadow-xl shadow-primary-900/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl">
                <Zap className="h-4 w-4 inline-block" />
              </div>
              <h3 className="font-bold">AI Pro Tips</h3>
            </div>
            <ul className="space-y-4 text-sm font-medium text-primary-50 text-left">
              <li className="flex gap-2">
                <span className="text-primary-300">✦</span>
                <span>Ask for "pricing advice" to see competitive rates in your city.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-300">✦</span>
                <span>"Generate social media captions" to save hours on promotion.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-300">✦</span>
                <span>"Create a vendor checklist" for smooth event logistics.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-[var(--foreground)] mb-4">Saved Suggestions</h3>
            <div className="space-y-3">
              {[
                { title: "Summer Music Fest Promo", date: "Yesterday", type: "Email" },
                { title: "VIP Experience Strategy", date: "2 days ago", type: "Pricing" },
                { title: "Influencer Outreach Template", date: "3 days ago", type: "Marketing" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--surface-border)] hover:bg-[var(--surface-card)] transition-colors cursor-pointer group">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)] group-hover:text-primary-600 transition-colors">{item.title}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)]">{item.type} • {item.date}</p>
                  </div>
                  <Icon name="chevron-right" size={14} className="text-[var(--foreground-muted)] group-hover:text-primary-500 transition-all" />
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-center text-xs font-bold text-primary-600 hover:text-primary-700 py-2 border border-dashed border-primary-200 rounded-xl hover:bg-primary-50 transition-all">
              View all saved suggestions
            </button>
          </Card>

          <Card className="p-6 border-navy-700 bg-navy-800">
            <h3 className="font-semibold text-white mb-4">AI Model Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-navy-300">Response Tone</span>
                <span className="text-xs font-bold text-primary-400 bg-primary-500/10 px-2 py-1 rounded-lg">Professional</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-navy-300">Creativity Level</span>
                <span className="text-xs font-bold text-primary-400 bg-primary-500/10 px-2 py-1 rounded-lg">High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-navy-300">Data Context</span>
                <span className="text-xs font-bold text-success-400 bg-success-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" /> Live
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
