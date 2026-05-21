'use client';

import { Card } from '@/components/ui/Card';

// Simple SVG Icons
function ExclamationTriangleIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  );
}

function MagnifyingGlassIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function CheckCircleIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function XCircleIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function CurrencyDollarIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function ClockIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

interface DisputeStats {
  total: number;
  open: number;
  investigating: number;
  resolved: number;
  rejected: number;
  totalRefunded: number;
  averageResolutionTime: number;
}

interface DisputeStatsCardsProps {
  stats: DisputeStats;
}

export function DisputeStatsCards({ stats }: DisputeStatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatTime = (hours: number) => {
    if (hours < 24) {
      return `${Math.round(hours)}h`;
    }
    const days = Math.round(hours / 24);
    return `${days}d`;
  };

  const cards = [
    {
      title: 'Total Disputes',
      value: stats.total.toString(),
      icon: ExclamationTriangleIcon,
      color: 'text-neutral-600',
      bgColor: 'bg-neutral-50',
      change: null,
    },
    {
      title: 'Open Disputes',
      value: stats.open.toString(),
      icon: ExclamationTriangleIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      change: null,
    },
    {
      title: 'Under Investigation',
      value: stats.investigating.toString(),
      icon: MagnifyingGlassIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      change: null,
    },
    {
      title: 'Resolved',
      value: stats.resolved.toString(),
      icon: CheckCircleIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      change: null,
    },
    {
      title: 'Total Refunded',
      value: formatCurrency(stats.totalRefunded),
      icon: CurrencyDollarIcon,
      color: 'text-danger-600',
      bgColor: 'bg-danger-50',
      change: null,
    },
    {
      title: 'Avg Resolution Time',
      value: formatTime(stats.averageResolutionTime),
      icon: ClockIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      change: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {card.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}