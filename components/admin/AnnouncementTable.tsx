"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

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

interface AnnouncementTableProps {
  announcements: Announcement[];
  loading: boolean;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onView: (announcement: Announcement) => void;
}

export function AnnouncementTable({ 
  announcements, 
  loading, 
  onUpdate, 
  onDelete, 
  onView 
}: AnnouncementTableProps) {
  const [viewStats, setViewStats] = React.useState<Record<string, any>>({});

  // Fetch view stats for each announcement
  React.useEffect(() => {
    const fetchStats = async () => {
      const statsPromises = announcements.map(async (announcement) => {
        try {
          const response = await fetch(`/api/admin/announcements/${announcement.id}?stats=true`);
          const data = await response.json();
          if (data.success && data.data.stats) {
            return { id: announcement.id, stats: data.data.stats };
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
        return { id: announcement.id, stats: null };
      });

      const results = await Promise.all(statsPromises);
      const statsMap = results.reduce((acc, { id, stats }) => {
        acc[id] = stats;
        return acc;
      }, {} as Record<string, any>);

      setViewStats(statsMap);
    };

    if (announcements.length > 0) {
      fetchStats();
    }
  }, [announcements]);

  const handleStatusChange = (announcement: Announcement, newStatus: string) => {
    const updates: any = { status: newStatus };
    
    if (newStatus === 'published' && announcement.status !== 'published') {
      updates.publishedAt = Date.now();
    }
    
    onUpdate(announcement.id, updates);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-success-100 text-success-700';
      case 'scheduled': return 'bg-warning-100 text-warning-700';
      case 'draft': return 'bg-neutral-100 text-neutral-700';
      case 'expired': return 'bg-danger-100 text-danger-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-danger-100 text-danger-700';
      case 'high': return 'bg-warning-100 text-warning-700';
      case 'medium': return 'bg-primary-100 text-primary-700';
      case 'low': return 'bg-neutral-100 text-neutral-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case 'all': return 'All Users';
      case 'attendee': return 'Attendees';
      case 'organiser': return 'Organisers';
      case 'vendor': return 'Vendors';
      default: return targetType;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-lg"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (announcements.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Icon name="megaphone" size={48} className="mx-auto text-slate-500 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No announcements found
        </h3>
        <p className="text-slate-500">
          Create your first platform announcement to communicate with users.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Announcement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Target & Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {announcements.map((announcement) => {
              const stats = viewStats[announcement.id];
              const isExpired = announcement.expiresAt && announcement.expiresAt < Date.now();
              
              return (
                <tr key={announcement.id} className="hover:bg-white">
                  <td className="px-6 py-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 truncate max-w-xs">
                        {announcement.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate max-w-xs">
                        {announcement.content}
                      </p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                        {getTargetTypeLabel(announcement.targetType)}
                      </span>
                      <br />
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <select
                      value={isExpired ? 'expired' : announcement.status}
                      onChange={(e) => handleStatusChange(announcement, e.target.value)}
                      disabled={!!isExpired}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(isExpired ? 'expired' : announcement.status)}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                      {isExpired && <option value="expired">Expired</option>}
                    </select>
                  </td>
                  
                  <td className="px-6 py-4">
                    {stats ? (
                      <div className="text-xs text-slate-500">
                        <div>{stats.views} views</div>
                        <div>{stats.dismissals} dismissed</div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500">
                        Loading...
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-500">
                      <div>Created: {new Date(announcement.createdAt).toLocaleDateString()}</div>
                      {announcement.scheduledAt && (
                        <div>Scheduled: {new Date(announcement.scheduledAt).toLocaleDateString()}</div>
                      )}
                      {announcement.expiresAt && (
                        <div>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(announcement)}
                      >
                        <Icon name="eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(announcement.id)}
                        className="text-danger-600 hover:text-danger-700"
                      >
                        <Icon name="x-circle" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}