"use client";
import { ArrowRight } from 'lucide-react';
import React from "react";
import Link from "next/link";

interface SettlementData {
  totalEarned: string;
  pending: string;
  settled: string;
  settlementPercentage: number;
}

interface SettlementWidgetProps {
  data: SettlementData;
  title?: string;
  subtitle?: string;
  walletLink?: string;
}

export function SettlementWidget({ 
  data, 
  title = "Settlement Tracker", 
  subtitle = "Your earnings and payout status",
  walletLink = "/organizer/dashboard/wallet"
}: SettlementWidgetProps) {
  return (
    <div className="rounded-2xl bg-dark p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>
        </div>
        <Link 
          href={walletLink} 
          className="text-xs font-semibold text-lime hover:text-lime-hover transition-colors"
        >
          View wallet<ArrowRight className="h-4 w-4 inline" />
        </Link>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="transition-transform duration-300 hover:scale-105">
          <p className="text-lg font-extrabold tabular-nums text-white">{data.totalEarned}</p>
          <p className="text-xs text-white/40">Total Earned</p>
        </div>
        <div className="transition-transform duration-300 hover:scale-105">
          <p className="text-lg font-extrabold tabular-nums text-amber-400">{data.pending}</p>
          <p className="text-xs text-white/40">Pending</p>
        </div>
        <div className="transition-transform duration-300 hover:scale-105">
          <p className="text-lg font-extrabold tabular-nums text-green-400">{data.settled}</p>
          <p className="text-xs text-white/40">Settled</p>
        </div>
      </div>
      
      {/* Progress bar with gradient */}
      <div>
        <div className="flex justify-between text-[10px] text-white/40 mb-1.5">
          <span>Settlement progress</span>
          <span>{data.settlementPercentage}% settled</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-700 ease-out" 
            style={{ width: `${data.settlementPercentage}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
