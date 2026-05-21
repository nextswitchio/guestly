"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";

type FraudAlertType = 
  | 'suspicious_refund_rate'
  | 'duplicate_accounts'
  | 'unusual_payment_pattern'
  | 'rapid_account_creation'
  | 'suspicious_login_activity'
  | 'high_value_transactions'
  | 'velocity_abuse'
  | 'geographic_anomaly';

type FraudAlertSeverity = 'low' | 'medium' | 'high' | 'critical';

type FraudAlert = {
  id: string;
  type: FraudAlertType;
  severity: FraudAlertSeverity;
  title: string;
  description: string;
  affectedUsers: string[];
  affectedEvents?: string[];
  affectedOrders?: string[];
  metadata: Record<string, any>;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  resolution?: string;
};

type FraudStats = {
  totalAlerts: number;
  activeAlerts: number;
  criticalAlerts: number;
  resolvedAlerts: number;
  falsePositives: number;
  alertsByType: Record<FraudAlertType, number>;
  alertsBySeverity: Record<FraudAlertSeverity, number>;
  recentAlerts: FraudAlert[];
};

export default function FraudDetectionAlerts() {
  const [stats, setStats] = useState<FraudStats | null>(null);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningDetection, setRunningDetection] = useState(false);
  const [filter, setFilter] = useState<{
    status?: string;
    severity?: FraudAlertSeverity;
  }>({});

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/fraud?action=stats');
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching fraud stats:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.severity) params.append('severity', filter.severity);
      params.append('limit', '20');

      const response = await fetch(`/api/admin/fraud?${params}`);
      const result = await response.json();
      if (result.success) {
        setAlerts(result.data);
      }
    } catch (error) {
      console.error('Error fetching fraud alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const runFraudDetection = async () => {
    setRunningDetection(true);
    try {
      const response = await fetch('/api/admin/fraud?action=run-detection');
      const result = await response.json();
      if (result.success) {
        // Refresh data after running detection
        await Promise.all([fetchStats(), fetchAlerts()]);
        
        if (result.data.newAlerts.length > 0) {
          alert(`Fraud detection complete. Found ${result.data.newAlerts.length} new alerts.`);
        } else {
          alert('Fraud detection complete. No new alerts found.');
        }
      }
    } catch (error) {
      console.error('Error running fraud detection:', error);
      alert('Error running fraud detection');
    } finally {
      setRunningDetection(false);
    }
  };

  const updateAlertStatus = async (alertId: string, status: string, resolution?: string) => {
    try {
      const response = await fetch(`/api/admin/fraud/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolution }),
      });
      
      const result = await response.json();
      if (result.success) {
        // Refresh data
        await Promise.all([fetchStats(), fetchAlerts()]);
        setSelectedAlert(null);
      }
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAlerts();
  }, [filter]);

  const getSeverityColor = (severity: FraudAlertSeverity) => {
    switch (severity) {
      case 'critical': return 'text-danger-600 bg-danger-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-warning-600 bg-warning-50';
      case 'low': return 'text-primary-600 bg-primary-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-danger-600 bg-danger-50';
      case 'investigating': return 'text-warning-600 bg-warning-50';
      case 'resolved': return 'text-success-600 bg-success-50';
      case 'false_positive': return 'text-neutral-600 bg-neutral-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getTypeIcon = (type: FraudAlertType) => {
    switch (type) {
      case 'suspicious_refund_rate': return 'refresh-cw';
      case 'duplicate_accounts': return 'users';
      case 'velocity_abuse': return 'zap';
      case 'high_value_transactions': return 'dollar-sign';
      case 'rapid_account_creation': return 'user-plus';
      default: return 'alert-triangle';
    }
  };

  const formatAlertType = (type: FraudAlertType) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Fraud Detection</h2>
          <p className="text-sm text-slate-500">Monitor and manage suspicious activity</p>
        </div>
        <Button 
          onClick={runFraudDetection}
          loading={runningDetection}
          icon="shield"
          variant="primary"
        >
          Run Detection
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Alerts"
            value={stats.activeAlerts}
            icon="alert-triangle"
            variant="danger"
            subtitle={`${stats.criticalAlerts} critical`}
          />
          <StatCard
            title="Total Alerts"
            value={stats.totalAlerts}
            icon="shield"
            variant="primary"
            subtitle="All time"
          />
          <StatCard
            title="Resolved"
            value={stats.resolvedAlerts}
            icon="check-circle"
            variant="success"
            subtitle="Successfully handled"
          />
          <StatCard
            title="False Positives"
            value={stats.falsePositives}
            icon="x-circle"
            variant="neutral"
            subtitle="Incorrectly flagged"
          />
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-900">Status:</label>
            <select
              value={filter.status || ''}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value || undefined }))}
              className="px-3 py-1 text-sm border border-neutral-200 rounded-lg bg-white text-slate-900"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="false_positive">False Positive</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-900">Severity:</label>
            <select
              value={filter.severity || ''}
              onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value as FraudAlertSeverity || undefined }))}
              className="px-3 py-1 text-sm border border-neutral-200 rounded-lg bg-white text-slate-900"
            >
              <option value="">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-slate-900">Recent Alerts</h3>
          <p className="text-sm text-slate-500">
            {alerts.length} alert{alerts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="shield" size={48} className="mx-auto text-success-500 mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">No Alerts Found</h4>
            <p className="text-slate-500">
              No fraud alerts match your current filters. The platform is secure.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200 hover:bg-neutral-100 cursor-pointer transition-colors"
                onClick={() => setSelectedAlert(alert)}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getSeverityColor(alert.severity)}`}>
                  <Icon name={getTypeIcon(alert.type) as any} size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-slate-900 truncate">{alert.title}</h4>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                        {alert.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 mb-2 line-clamp-2">
                    {alert.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{formatAlertType(alert.type)}</span>
                    <span>•</span>
                    <span>{alert.affectedUsers.length} user{alert.affectedUsers.length !== 1 ? 's' : ''} affected</span>
                    <span>•</span>
                    <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Icon name="chevron-right" size={16} className="text-slate-500" />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <Modal
          open={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title="Fraud Alert Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Alert Header */}
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${getSeverityColor(selectedAlert.severity)}`}>
                <Icon name={getTypeIcon(selectedAlert.type) as any} size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {selectedAlert.title}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(selectedAlert.severity)}`}>
                    {selectedAlert.severity.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedAlert.status)}`}>
                    {selectedAlert.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-500">
                  {selectedAlert.description}
                </p>
              </div>
            </div>

            {/* Alert Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Alert Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Type:</span>
                    <span className="text-slate-900">{formatAlertType(selectedAlert.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Created:</span>
                    <span className="text-slate-900">{new Date(selectedAlert.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Updated:</span>
                    <span className="text-slate-900">{new Date(selectedAlert.updatedAt).toLocaleString()}</span>
                  </div>
                  {selectedAlert.assignedTo && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned to:</span>
                      <span className="text-slate-900">{selectedAlert.assignedTo}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Affected Entities</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Users:</span>
                    <span className="text-slate-900">{selectedAlert.affectedUsers.length}</span>
                  </div>
                  {selectedAlert.affectedEvents && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Events:</span>
                      <span className="text-slate-900">{selectedAlert.affectedEvents.length}</span>
                    </div>
                  )}
                  {selectedAlert.affectedOrders && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Orders:</span>
                      <span className="text-slate-900">{selectedAlert.affectedOrders.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Metadata */}
            {Object.keys(selectedAlert.metadata).length > 0 && (
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Additional Details</h4>
                <div className="bg-white rounded-lg p-4">
                  <pre className="text-xs text-slate-500 whitespace-pre-wrap">
                    {JSON.stringify(selectedAlert.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Resolution */}
            {selectedAlert.resolution && (
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Resolution</h4>
                <p className="text-sm text-slate-500 bg-white rounded-lg p-4">
                  {selectedAlert.resolution}
                </p>
              </div>
            )}

            {/* Actions */}
            {selectedAlert.status === 'active' && (
              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <Button
                  variant="primary"
                  onClick={() => updateAlertStatus(selectedAlert.id, 'investigating')}
                >
                  Start Investigation
                </Button>
                <Button
                  variant="success"
                  onClick={() => {
                    const resolution = prompt('Enter resolution details:');
                    if (resolution) {
                      updateAlertStatus(selectedAlert.id, 'resolved', resolution);
                    }
                  }}
                >
                  Mark Resolved
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => updateAlertStatus(selectedAlert.id, 'false_positive', 'Marked as false positive')}
                >
                  False Positive
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  variant, 
  subtitle 
}: { 
  title: string; 
  value: number; 
  icon: string; 
  variant: 'primary' | 'success' | 'danger' | 'neutral';
  subtitle?: string;
}) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    danger: 'bg-danger-50 text-danger-600',
    neutral: 'bg-neutral-50 text-neutral-600',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl ${colors[variant]}`}>
          <Icon name={icon as any} size={24} />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{(value ?? 0).toLocaleString()}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}