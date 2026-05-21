"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

type FraudAlert = {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  createdAt: number;
};

type FraudStats = {
  activeAlerts: number;
  criticalAlerts: number;
  recentAlerts: FraudAlert[];
};

export default function FraudAlertWidget() {
  const [stats, setStats] = useState<FraudStats>({
    activeAlerts: 0,
    criticalAlerts: 0,
    recentAlerts: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/fraud?action=stats');
      const result = await response.json();
      if (result.success) {
        setStats({
          activeAlerts: result.data.activeAlerts,
          criticalAlerts: result.data.criticalAlerts,
          recentAlerts: result.data.recentAlerts.slice(0, 3),
        });
      }
    } catch (error) {
      console.error('Error fetching fraud stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger-50 text-danger-600';
      case 'high': return 'bg-orange-50 text-orange-600';
      case 'medium': return 'bg-warning-50 text-warning-600';
      case 'low': return 'bg-primary-50 text-primary-600';
      default: return 'bg-neutral-50 text-neutral-600';
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-neutral-200 rounded"></div>
            <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Fraud Detection</h3>
        <Link href="/admin/fraud" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          View All
        </Link>
      </div>

      {/* Critical Alert Banner */}
      {stats.criticalAlerts > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-danger-50 border border-danger-200">
          <div className="flex items-center gap-2">
            <Icon name="alert-triangle" size={16} className="text-danger-600" />
            <span className="text-sm font-medium text-danger-800">
              {stats.criticalAlerts} Critical Alert{stats.criticalAlerts !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-white border border-neutral-200">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${stats.activeAlerts > 0 ? 'bg-danger-50 text-danger-600' : 'bg-success-50 text-success-600'}`}>
            <Icon name={stats.activeAlerts > 0 ? 'alert-triangle' : 'shield'} size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              {stats.activeAlerts > 0 ? `${stats.activeAlerts} Active Alerts` : 'All Clear'}
            </p>
            <p className="text-xs text-slate-500">
              {stats.criticalAlerts > 0 ? `${stats.criticalAlerts} critical` : 'No threats detected'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="space-y-3">
        {stats.recentAlerts.length > 0 ? (
          stats.recentAlerts.map((alert) => (
            <div key={alert.id} className="flex gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getSeverityColor(alert.severity)}`}>
                <Icon name="alert-triangle" size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">{alert.title}</p>
                <p className="text-xs text-slate-500 truncate">{alert.description}</p>
                <p className="mt-1 text-[10px] text-navy-400 uppercase font-bold tracking-wider">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <Icon name="shield" size={32} className="mx-auto text-success-500 mb-2" />
            <p className="text-sm text-slate-500">No recent alerts</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <Link href="/admin/fraud">
          <Button variant="primary" size="sm" fullWidth>
            <Icon name="shield" size={16} className="mr-2" />
            Manage Fraud Detection
          </Button>
        </Link>
      </div>
    </Card>
  );
}