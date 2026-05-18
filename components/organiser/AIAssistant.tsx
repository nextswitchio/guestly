"use client";

import { Bot } from 'lucide-react';
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export default function AIAssistant() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your GUESTLY AI assistant. I can help you plan your event, generate marketing copy, or provide pricing advice. What's on your mind?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMsg: Message = {
        role: "assistant",
        content: getSimulatedResponse(input),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    }, 1000);
  }

  function getSimulatedResponse(query: string): string {
    const q = query.toLowerCase();
    if (q.includes("pricing")) return "Based on similar tech events in Lagos, a 'Regular' ticket at $50 and 'VIP' at $150 would be competitive. Would you like me to calculate potential revenue?";
    if (q.includes("marketing") || q.includes("promote")) return "I recommend a 4-week campaign: Week 1: Teaser & Early Bird; Week 2: Influencer collaborations; Week 3: Speaker reveals; Week 4: Final countdown with scarcity alerts.";
    if (q.includes("description")) return "Here's a draft: 'Join us for an immersive experience where technology meets culture. Network with industry leaders and discover the future of African innovation.'";
    return "That's a great question. I'm analyzing your event data to give you the best advice. Could you provide more details about your target audience?";
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[800px]">
      <Card className="flex-1 flex flex-col overflow-hidden border-navy-700 bg-navy-800 p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20 text-xl">
              Bot
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Planning Assistant</h2>
              <p className="text-[10px] text-navy-400 font-medium uppercase tracking-wider">Online • Beta</p>
            </div>
          </div>
          <Badge variant="live" dot>Powered by Guestly AI</Badge>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-navy-600"
        >
          {messages.map((m, i) => (
            <div 
              key={i} 
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                m.role === "user" 
                  ? "bg-primary-600 text-white rounded-tr-none shadow-lg shadow-primary-900/20" 
                  : "bg-navy-700 text-navy-50 rounded-tl-none border border-navy-600"
              }`}>
                <p className="text-sm leading-relaxed">{m.content}</p>
                <p className={`mt-2 text-[10px] ${m.role === "user" ? "text-primary-200" : "text-navy-400"}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-navy-700 rounded-2xl p-4 rounded-tl-none border border-navy-600">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-3 bg-navy-900/50 border-t border-navy-700 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <QuickActionButton 
              label="Generate Description" 
              onClick={() => setInput("Can you generate a compelling event description for me?")} 
            />
            <QuickActionButton 
              label="Pricing Strategy" 
              onClick={() => setInput("What's the best pricing strategy for my event?")} 
            />
            <QuickActionButton 
              label="Marketing Plan" 
              onClick={() => setInput("Create a 4-week marketing plan")} 
            />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-navy-800">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask me anything about your event..."
              className="w-full rounded-xl bg-navy-700 border-none px-4 py-3.5 pr-12 text-sm text-white placeholder:text-navy-400 focus:ring-2 focus:ring-primary-500 transition-all shadow-inner"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-white shadow-lg shadow-primary-900/20 hover:bg-primary-400 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Icon name="send" size={18} />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-navy-500">
            AI can make mistakes. Please verify important details.
          </p>
        </div>
      </Card>
    </div>
  );
}

function QuickActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-1.5 text-[11px] font-semibold text-navy-300 hover:bg-navy-700 hover:text-white hover:border-navy-500 transition-all"
    >
      {label}
    </button>
  );
}