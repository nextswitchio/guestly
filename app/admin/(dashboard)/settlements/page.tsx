'use client';

import { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';

interface Settlement {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  initiatedAt: number;
  completedAt?: number;
  transactionRef: string;
}

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      const response = await fetch('/api/admin/settlements');
      if (response.ok) {
        const data = await response.json();
        setSettlements(data.settlements || []);
      }
    } catch (error) {
      console.error('Failed to fetch settlements:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPending = settlements.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0);
  const totalCompleted = settlements.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.amount, 0);
  const totalProcessing = settlements.filter(s => s.status === 'processing').reduce((sum, s) => sum + s.amount, 0);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };

  const tabs = [
    {
      id: 'all',
      label: 'All Settlements',
      content: (
        <div className="space-y-4">
          {settlements.map((s) => (
            <Card key={s.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{s.vendorName}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[s.status]}`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">Ref: {s.transactionRef}</p>
                  <p className="text-sm text-slate-500">
                    Initiated: {new Date(s.initiatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₦{s.amount.toLocaleString()}</p>
                  {s.completedAt && (
                    <p className="text-xs text-slate-400 mt-1">
                      Completed: {new Date(s.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {settlements.length === 0 && (
            <Card className="p-12 text-center">
              <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No settlements yet</h3>
              <p className="text-slate-500">Settlements will appear here once vendors process payments.</p>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: 'pending',
      label: 'Pending',
      content: (
        <div className="space-y-4">
          {settlements.filter(s => s.status === 'pending').map((s) => (
            <Card key={s.id} className="p-6 border-yellow-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{s.vendorName}</h3>
                  <p className="text-sm text-slate-500">Ref: {s.transactionRef}</p>
                </div>
                <p className="text-xl font-bold">₦{s.amount.toLocaleString()}</p>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settlements</h1>
          <p className="text-slate-500 mt-1">Manage vendor payments and settlements</p>
        </div>
        <Button variant="outline" onClick={fetchSettlements}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-yellow-600 mb-1">
            <ArrowDownLeft className="w-4 h-4" />
            <p className="text-sm text-slate-500">Pending</p>
          </div>
          <p className="text-2xl font-bold">₦{totalPending.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <RefreshCw className="w-4 h-4" />
            <p className="text-sm text-slate-500">Processing</p>
          </div>
          <p className="text-2xl font-bold">₦{totalProcessing.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <ArrowUpRight className="w-4 h-4" />
            <p className="text-sm text-slate-500">Completed</p>
          </div>
          <p className="text-2xl font-bold">₦{totalCompleted.toLocaleString()}</p>
        </Card>
      </div>

      <Tabs tabs={tabs} defaultTabId="all" />
    </div>
  );
}
