"use client";
import { ArrowRight } from 'lucide-react';
import React from "react";
import Card from "@/components/ui/Card";
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
  walletLink = "/dashboard/wallet"
}: SettlementWidgetProps) {
  return (
    <Card variant="navy" padding="lg" hoverable>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <p className="text-xs text-navy-300 mt-0.5">{subtitle}</p>
        </div>
        <Link 
          href={walletLink} 
          className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
        >
          View wallet<ArrowRight className="h-4 w-4 inline" />
        </Link>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="transition-transform duration-300 hover:scale-105">
          <p className="text-lg font-extrabold tabular-nums text-white">{data.totalEarned}</p>
          <p className="text-xs text-navy-400">Total Earned</p>
        </div>
        <div className="transition-transform duration-300 hover:scale-105">
          <p className="text-lg font-extrabold tabular-nums text-warning-400">{data.pending}</p>
          <p className="text-xs text-navy-400">Pending</p>
        </div>
        <div className="transition-transform duration-300 hover:scale-105">
          <p className="text-lg font-extrabold tabular-nums text-success-400">{data.settled}</p>
          <p className="text-xs text-navy-400">Settled</p>
        </div>
      </div>
      
      {/* Progress bar with gradient */}
      <div>
        <div className="flex justify-between text-[10px] text-navy-400 mb-1.5">
          <span>Settlement progress</span>
          <span>{data.settlementPercentage}% settled</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-navy-700">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-success-500 to-success-400 transition-all duration-700 ease-out" 
            style={{ width: `${data.settlementPercentage}%` }} 
          />
        </div>
      </div>
    </Card>
  );
}
