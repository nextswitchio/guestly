"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { BarChart, LineChart } from "@/components/charts";

interface CommissionSummary {
  totalCommissions: number;
  totalSettled: number;
  totalPending: number;
  totalProcessing: number;
  totalDisputed: number;
  averageCommissionPerEvent: number;
  commissionRate: number;
  monthlyGrowth: number;
}

interface Commission {
  id: string;
  eventId: string;
  organizerId: string;
  eventTitle: string;
  eventDate: string;
  totalRevenue: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'processing' | 'paid' | 'disputed';
  createdAt: number;
  settledAt?: number;
  settlementReference?: string;
  notes?: string;
}

export default function CommissionTracker() {
  const [summary, setSummary] = React.useState<CommissionSummary | null>(null);
  const [commissions, setCommissions] = React.useState<Commission[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');

  React.useEffect(() => {
    fetchCommissionData();
  }, [selectedStatus]);

  const fetchCommissionData = async () => {
    try {
      setLoading(true);
      
      // Fetch summary
      const summaryResponse = await fetch('/api/admin/commissions?action=summary');
      const summaryData = await summaryResponse.json();
      
      if (summaryData.success) {
        setSummary(summaryData.data);
      }

      // Fetch commissions
      const statusFilter = selectedStatus !== 'all' ? `&status=${selectedStatus}` : '';
      const commissionsResponse = await fetch(`/api/admin/commissions?${statusFilter}`);
      const commissionsData = await commissionsResponse.json();
      
      if (commissionsData.success) {
        setCommissions(commissionsData.data.commissions);
      }
    } catch (error) {
      console.error('Error fetching commission data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCommissions = async () => {
    try {
      const response = await fetch('/api/admin/commissions?action=update', {
        method: 'GET',
      });
      const data = await response.json();
      
      if (data.success) {
        fetchCommissionData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating commissions:', error);
    }
  };

  const generateReport = async () => {
    try {
      const response = await fetch('/api/admin/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_report',
          reportType: 'monthly',
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        // Handle report generation success
        }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-success-600 bg-success-50';
      case 'pending': return 'text-warning-600 bg-warning-50';
      case 'processing': return 'text-primary-600 bg-primary-50';
      case 'disputed': return 'text-danger-600 bg-danger-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Commission Tracking</h2>
          <p className="text-sm text-[var(--foreground-muted)]">Monitor platform commission revenue and settlements</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={updateCommissions}>
            <Icon name="refresh-cw" size={16} />
            Update Commissions
          </Button>
          <Button variant="primary" onClick={generateReport}>
            <Icon name="file-text" size={16} />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CommissionCard
            title="Total Commission"
            value={formatCurrency(summary.totalCommissions)}
            change={`${summary.monthlyGrowth.toFixed(1)}% this month`}
            icon="trending-up"
            variant="blue"
          />
          <CommissionCard
            title="Settled"
            value={formatCurrency(summary.totalSettled)}
            change={`${((summary.totalSettled / summary.totalCommissions) * 100).toFixed(1)}% of total`}
            icon="check-circle"
            variant="green"
          />
          <CommissionCard
            title="Pending"
            value={formatCurrency(summary.totalPending)}
            change={`${((summary.totalPending / summary.totalCommissions) * 100).toFixed(1)}% of total`}
            icon="clock"
            variant="orange"
          />
          <CommissionCard
            title="Avg per Event"
            value={formatCurrency(summary.averageCommissionPerEvent)}
            change={`${summary.commissionRate.toFixed(1)}% commission rate`}
            icon="bar-chart"
            variant="purple"
          />
        </div>
      )}

      {/* Commission Status Chart */}
      {summary && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-[var(--foreground)]">Commission Status Breakdown</h3>
            </div>
            <div className="h-64">
              <BarChart 
                data={[
                  { label: "Settled", value: summary.totalSettled / 100 },
                  { label: "Pending", value: summary.totalPending / 100 },
                  { label: "Processing", value: summary.totalProcessing / 100 },
                  { label: "Disputed", value: summary.totalDisputed / 100 },
                ]}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-[var(--foreground)]">Commission Trends</h3>
              <span className="text-xs text-[var(--foreground-muted)]">Last 6 months</span>
            </div>
            <div className="h-64">
              <LineChart 
                data={[
                  { label: "Jan", value: 4500 },
                  { label: "Feb", value: 5200 },
                  { label: "Mar", value: 6100 },
                  { label: "Apr", value: 5900 },
                  { label: "May", value: 7200 },
                  { label: "Jun", value: 8500 },
                ]}
                color="#4392F1"
              />
            </div>
          </Card>
        </div>
      )}

      {/* Commission List */}
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold text-[var(--foreground)]">Recent Commissions</h3>
          <div className="flex gap-2">
            {['all', 'pending', 'processing', 'paid', 'disputed'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedStatus === status
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--surface-border)]">
                <th className="text-left py-3 px-4 font-medium text-[var(--foreground-muted)]">Event</th>
                <th className="text-left py-3 px-4 font-medium text-[var(--foreground-muted)]">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-[var(--foreground-muted)]">Commission</th>
                <th className="text-left py-3 px-4 font-medium text-[var(--foreground-muted)]">Status</th>
                <th className="text-left py-3 px-4 font-medium text-[var(--foreground-muted)]">Date</th>
                <th className="text-right py-3 px-4 font-medium text-[var(--foreground-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commissions.slice(0, 10).map((commission) => (
                <tr key={commission.id} className="border-b border-[var(--surface-border)] hover:bg-[var(--surface-hover)]">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{commission.eventTitle}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{commission.eventId}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--foreground)]">
                    {formatCurrency(commission.totalRevenue)}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{formatCurrency(commission.commissionAmount)}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{commission.commissionRate}%</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                      {commission.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--foreground-muted)]">
                    {new Date(commission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Icon name="more-horizontal" size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {commissions.length === 0 && (
          <div className="text-center py-12">
            <Icon name="file-text" size={48} className="mx-auto text-neutral-400 mb-4" />
            <p className="text-[var(--foreground-muted)]">No commissions found</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function CommissionCard({ title, value, change, icon, variant }: { 
  title: string; 
  value: string; 
  change: string; 
  icon: any;
  variant: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colors = {
    blue: 'bg-primary-50 text-primary-600',
    green: 'bg-success-50 text-success-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl ${colors[variant]}`}>
          <Icon name={icon} size={24} />
        </div>
        <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">Live</span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-[var(--foreground-muted)]">{title}</h3>
        <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{value}</p>
        <p className="text-xs font-medium text-success-600 mt-2 flex items-center gap-1">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {change}
        </p>
      </div>
    </Card>
  );
}