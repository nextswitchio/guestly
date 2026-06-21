'use client';

import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { DisputeStatus, DisputeReason } from '@/lib/store';

interface DisputeFiltersProps {
  filters: {
    status: DisputeStatus | '';
    reason: DisputeReason | '';
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function DisputeFilters({ filters, onFiltersChange }: DisputeFiltersProps) {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const reasonOptions = [
    { value: '', label: 'All Reasons' },
    { value: 'event_cancelled', label: 'Event Cancelled' },
    { value: 'event_changed', label: 'Event Changed' },
    { value: 'poor_experience', label: 'Poor Experience' },
    { value: 'technical_issues', label: 'Technical Issues' },
    { value: 'billing_error', label: 'Billing Error' },
    { value: 'unauthorized_charge', label: 'Unauthorized Charge' },
    { value: 'other', label: 'Other' },
  ];

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: '',
      reason: '',
      search: '',
    });
  };

  const hasActiveFilters = filters.status || filters.reason || filters.search;

  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Search
            </label>
            <Input
              placeholder="Search by dispute ID, event, or customer..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Status
            </label>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={statusOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Reason
            </label>
            <Select
              value={filters.reason}
              onChange={(e) => handleFilterChange('reason', e.target.value)}
              options={reasonOptions}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="whitespace-nowrap"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </Card>
  );
}