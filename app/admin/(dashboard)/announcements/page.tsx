"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { AnnouncementCreationForm } from "@/components/admin/AnnouncementCreationForm";
import { AnnouncementTable } from "@/components/admin/AnnouncementTable";
import { AnnouncementStatsCards } from "@/components/admin/AnnouncementStatsCards";

type Announcement = {
  id: string;
  title: string;
  content: string;
  targetType: 'all' | 'attendee' | 'organiser' | 'vendor';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'scheduled' | 'published' | 'expired';
  scheduledAt?: number;
  publishedAt?: number;
  expiresAt?: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
};

type AnnouncementStats = {
  totalAnnouncements: number;
  activeAnnouncements: number;
  scheduledAnnouncements: number;
  expiredAnnouncements: number;
  totalViews: number;
  totalDismissals: number;
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [stats, setStats] = React.useState<AnnouncementStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState<Announcement | null>(null);
  const [filters, setFilters] = React.useState({
    status: '',
    targetType: '',
    priority: '',
  });

  const fetchAnnouncements = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.targetType) params.append('targetType', filters.targetType);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await fetch(`/api/admin/announcements?${params}`);
      const data = await response.json();

      if (data.success) {
        setAnnouncements(data.data.announcements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = React.useCallback(async () => {
    try {
      const response = await fetch('/api/admin/announcements?stats=true');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  React.useEffect(() => {
    fetchAnnouncements();
    fetchStats();
  }, [fetchAnnouncements, fetchStats]);

  const handleCreateAnnouncement = async (announcementData: any) => {
    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementData),
      });

      const data = await response.json();
      if (data.success) {
        setShowCreateModal(false);
        fetchAnnouncements();
        fetchStats();
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const handleUpdateAnnouncement = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        fetchAnnouncements();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchAnnouncements();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Platform Announcements</h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            Create and manage platform-wide announcements for users
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Icon name="plus" size={16} />
          New Announcement
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && <AnnouncementStatsCards stats={stats} />}

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--surface-border)] rounded-lg bg-[var(--surface-bg)] text-[var(--foreground)]"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Target Type
            </label>
            <select
              value={filters.targetType}
              onChange={(e) => setFilters({ ...filters, targetType: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--surface-border)] rounded-lg bg-[var(--surface-bg)] text-[var(--foreground)]"
            >
              <option value="">All Users</option>
              <option value="all">All Users</option>
              <option value="attendee">Attendees</option>
              <option value="organiser">Organisers</option>
              <option value="vendor">Vendors</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--surface-border)] rounded-lg bg-[var(--surface-bg)] text-[var(--foreground)]"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Announcements Table */}
      <AnnouncementTable
        announcements={announcements}
        loading={loading}
        onUpdate={handleUpdateAnnouncement}
        onDelete={handleDeleteAnnouncement}
        onView={setSelectedAnnouncement}
      />

      {/* Create Announcement Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Announcement"
        size="lg"
      >
        <AnnouncementCreationForm
          onSubmit={handleCreateAnnouncement}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* View Announcement Modal */}
      {selectedAnnouncement && (
        <Modal
          open={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          title="Announcement Details"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {selectedAnnouncement.title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  selectedAnnouncement.status === 'published' 
                    ? 'bg-success-100 text-success-700' 
                    : selectedAnnouncement.status === 'scheduled'
                    ? 'bg-warning-100 text-warning-700'
                    : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {selectedAnnouncement.status}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  selectedAnnouncement.priority === 'urgent'
                    ? 'bg-danger-100 text-danger-700'
                    : selectedAnnouncement.priority === 'high'
                    ? 'bg-warning-100 text-warning-700'
                    : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {selectedAnnouncement.priority} priority
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {selectedAnnouncement.targetType === 'all' ? 'All Users' : selectedAnnouncement.targetType}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-[var(--foreground)] mb-2">Content</h4>
              <div className="p-4 bg-[var(--surface-bg)] rounded-lg border border-[var(--surface-border)]">
                <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-[var(--foreground)]">Created:</span>
                <p className="text-[var(--foreground-muted)]">
                  {new Date(selectedAnnouncement.createdAt).toLocaleString()}
                </p>
              </div>
              {selectedAnnouncement.scheduledAt && (
                <div>
                  <span className="font-medium text-[var(--foreground)]">Scheduled:</span>
                  <p className="text-[var(--foreground-muted)]">
                    {new Date(selectedAnnouncement.scheduledAt).toLocaleString()}
                  </p>
                </div>
              )}
              {selectedAnnouncement.publishedAt && (
                <div>
                  <span className="font-medium text-[var(--foreground)]">Published:</span>
                  <p className="text-[var(--foreground-muted)]">
                    {new Date(selectedAnnouncement.publishedAt).toLocaleString()}
                  </p>
                </div>
              )}
              {selectedAnnouncement.expiresAt && (
                <div>
                  <span className="font-medium text-[var(--foreground)]">Expires:</span>
                  <p className="text-[var(--foreground-muted)]">
                    {new Date(selectedAnnouncement.expiresAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}