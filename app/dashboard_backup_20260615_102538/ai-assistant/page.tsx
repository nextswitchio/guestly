"use client";
import { Zap } from 'lucide-react';
import React from "react";
import AIAssistant from "@/components/organiser/AIAssistant";
import Icon from "@/components/ui/Icon";

export default function AIAssistantPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">AI Planning Assistant</h1>
        <p className="text-sm text-neutral-500">Get smart advice and automated content for your event</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AIAssistant />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-lime p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark/20">
                <Zap className="h-4 w-4 text-dark" />
              </div>
              <h3 className="font-bold text-dark">AI Pro Tips</h3>
            </div>
            <ul className="space-y-4 text-sm font-medium text-dark/80 text-left">
              <li className="flex gap-2">
                <span className="text-dark/60">✦</span>
                <span>Ask for "pricing advice" to see competitive rates in your city.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-dark/60">✦</span>
                <span>"Generate social media captions" to save hours on promotion.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-dark/60">✦</span>
                <span>"Create a vendor checklist" for smooth event logistics.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Saved Suggestions</h3>
            <div className="space-y-3">
              {[
                { title: "Summer Music Fest Promo", date: "Yesterday", type: "Email" },
                { title: "VIP Experience Strategy", date: "2 days ago", type: "Pricing" },
                { title: "Influencer Outreach Template", date: "3 days ago", type: "Marketing" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer group">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 group-hover:text-lime transition-colors">{item.title}</p>
                    <p className="text-[10px] text-neutral-500">{item.type} • {item.date}</p>
                  </div>
                  <Icon name="chevron-right" size={14} className="text-neutral-400 group-hover:text-lime transition-all" />
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-center text-xs font-bold text-lime hover:text-lime-hover py-2 border border-dashed border-lime/30 rounded-xl hover:bg-lime/5 transition-all">
              View all saved suggestions
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">AI Model Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Response Tone</span>
                <span className="text-xs font-bold text-lime bg-lime/10 px-2 py-1 rounded-lg">Professional</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Creativity Level</span>
                <span className="text-xs font-bold text-lime bg-lime/10 px-2 py-1 rounded-lg">High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Data Context</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" /> Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
