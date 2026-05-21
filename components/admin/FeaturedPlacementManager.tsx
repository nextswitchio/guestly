'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';

interface FeaturedPlacement {
  id: string;
  eventId: string;
  position: number;
  startDate: number;
  endDate: number;
  sponsorshipFee?: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'expired' | 'cancelled';
  notes?: string;
}

interface FeaturedEvent {
  placement: FeaturedPlacement;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    image: string;
    category: string;
  };
  position: number;
}

interface PlacementStats {
  totalPlacements: number;
  activePlacements: number;
  expiredPlacements: number;
  cancelledPlacements: number;
  totalRevenue: number;
  averageRevenue: number;
  positionUtilization: Record<number, number>;
  upcomingExpirations: FeaturedPlacement[];
}

export default function FeaturedPlacementManager() {
  const [placements, setPlacements] = React.useState<FeaturedPlacement[]>([]);
  const [featuredEvents, setFeaturedEvents] = React.useState<FeaturedEvent[]>([]);
  const [stats, setStats] = React.useState<PlacementStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedPlacement, setSelectedPlacement] = React.useState<FeaturedPlacement | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'active' | 'expired' | 'cancelled'>('all');

  // Form state for create/edit
  const [formData, setFormData] = React.useState({
    eventId: '',
    position: 1,
    startDate: '',
    endDate: '',
    sponsorshipFee: '',
    notes: '',
  });

  const [availablePositions, setAvailablePositions] = React.useState<number[]>([]);
  const [events, setEvents] = React.useState<any[]>([]);
  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch placements
      const placementsResponse = await fetch('/api/admin/featured');
      const placementsData = await placementsResponse.json();
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/featured?action=stats');
      const statsData = await statsResponse.json();
      
      // Fetch featured events
      const eventsResponse = await fetch('/api/admin/featured?action=featured-events');
      const eventsData = await eventsResponse.json();
      
      if (placementsData.success) {
        setPlacements(placementsData.data);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
      if (eventsData.success) {
        setFeaturedEvents(eventsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events for dropdown
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Check available positions when dates change
  const checkAvailablePositions = async (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return;
    
    try {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      
      const response = await fetch(
        `/api/admin/featured?action=available-positions&startDate=${start}&endDate=${end}`
      );
      const data = await response.json();
      
      if (data.success) {
        setAvailablePositions(data.data);
      }
    } catch (error) {
      console.error('Error checking available positions:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
    fetchEvents();
  }, []);

  React.useEffect(() => {
    if (formData.startDate && formData.endDate) {
      checkAvailablePositions(formData.startDate, formData.endDate);
    }
  }, [formData.startDate, formData.endDate]);

  const handleCreatePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: formData.eventId,
          position: parseInt(formData.position.toString()),
          startDate: new Date(formData.startDate).getTime(),
          endDate: new Date(formData.endDate).getTime(),
          sponsorshipFee: formData.sponsorshipFee ? parseFloat(formData.sponsorshipFee) : undefined,
          notes: formData.notes || undefined,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowCreateModal(false);
        setFormData({
          eventId: '',
          position: 1,
          startDate: '',
          endDate: '',
          sponsorshipFee: '',
          notes: '',
        });
        fetchData();
      } else {
        alert(data.error?.message || 'Failed to create placement');
      }
    } catch (error) {
      console.error('Error creating placement:', error);
      alert('Failed to create placement');
    }
  };

  const handleEditPlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlacement) return;
    
    try {
      const response = await fetch(`/api/admin/featured/${selectedPlacement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: parseInt(formData.position.toString()),
          startDate: new Date(formData.startDate).getTime(),
          endDate: new Date(formData.endDate).getTime(),
          sponsorshipFee: formData.sponsorshipFee ? parseFloat(formData.sponsorshipFee) : undefined,
          notes: formData.notes || undefined,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowEditModal(false);
        setSelectedPlacement(null);
        fetchData();
      } else {
        alert(data.error?.message || 'Failed to update placement');
      }
    } catch (error) {
      console.error('Error updating placement:', error);
      alert('Failed to update placement');
    }
  };

  const handleCancelPlacement = async (placementId: string) => {
    if (!confirm('Are you sure you want to cancel this placement?')) return;
    
    try {
      const response = await fetch(`/api/admin/featured/${placementId}?action=cancel`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchData();
      } else {
        alert(data.error?.message || 'Failed to cancel placement');
      }
    } catch (error) {
      console.error('Error cancelling placement:', error);
      alert('Failed to cancel placement');
    }
  };

  const handleDeletePlacement = async (placementId: string) => {
    if (!confirm('Are you sure you want to permanently delete this placement?')) return;
    
    try {
      const response = await fetch(`/api/admin/featured/${placementId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchData();
      } else {
        alert(data.error?.message || 'Failed to delete placement');
      }
    } catch (error) {
      console.error('Error deleting placement:', error);
      alert('Failed to delete placement');
    }
  };

  const openEditModal = (placement: FeaturedPlacement) => {
    setSelectedPlacement(placement);
    setFormData({
      eventId: placement.eventId,
      position: placement.position,
      startDate: new Date(placement.startDate).toISOString().slice(0, 16),
      endDate: new Date(placement.endDate).toISOString().slice(0, 16),
      sponsorshipFee: placement.sponsorshipFee?.toString() || '',
      notes: placement.notes || '',
    });
    setShowEditModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: FeaturedPlacement['status']) => {
    const variants = {
      active: 'success',
      expired: 'warning',
      cancelled: 'danger',
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const filteredPlacements = placements.filter(placement => {
    if (filter === 'all') return true;
    return placement.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading featured placements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Placements</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalPlacements}</p>
              </div>
              <Icon name="star" className="h-8 w-8 text-primary-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Active</p>
                <p className="text-2xl font-bold text-success-500">{stats.activePlacements}</p>
              </div>
              <Icon name="check-circle" className="h-8 w-8 text-success-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <Icon name="trending-up" className="h-8 w-8 text-primary-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Avg Revenue</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.averageRevenue)}</p>
              </div>
              <Icon name="calculator" className="h-8 w-8 text-primary-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Currently Featured Events */}
      {featuredEvents.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Currently Featured Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredEvents.map(({ placement, event, position }) => (
              <div key={placement.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="primary">Position {position}</Badge>
                  {placement.sponsorshipFee && (
                    <span className="text-sm font-medium text-success-500">
                      {formatCurrency(placement.sponsorshipFee)}
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-slate-900 mb-1">{event.title}</h4>
                <p className="text-sm text-slate-500 mb-2">{event.category}</p>
                <p className="text-xs text-slate-500">
                  Ends: {formatDate(placement.endDate)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Placements Management */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Featured Placements</h3>
          <Button onClick={() => setShowCreateModal(true)}>
            <Icon name="plus" size={16} />
            Create Placement
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6">
          {(['all', 'active', 'expired', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === status
                  ? 'bg-primary-500 text-white'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-neutral-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Placements Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Position</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Event</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlacements.map((placement) => {
                const event = events.find(e => e.id === placement.eventId);
                return (
                  <tr key={placement.id} className="border-b border-neutral-200">
                    <td className="py-3 px-4">
                      <Badge variant="primary">#{placement.position}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {event?.title || 'Unknown Event'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {event?.category || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-slate-900">{formatDate(placement.startDate)}</p>
                        <p className="text-slate-500">to {formatDate(placement.endDate)}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {placement.sponsorshipFee ? (
                        <span className="font-medium text-success-500">
                          {formatCurrency(placement.sponsorshipFee)}
                        </span>
                      ) : (
                        <span className="text-slate-500">Free</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(placement.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(placement)}
                        >
                          <Icon name="edit" size={14} />
                        </Button>
                        {placement.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelPlacement(placement.id)}
                          >
                            <Icon name="x" size={14} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePlacement(placement.id)}
                        >
                          <Icon name="x" size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredPlacements.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">No placements found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Create Placement Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Featured Placement"
        size="lg"
      >
        <form onSubmit={handleCreatePlacement} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Event
            </label>
            <select
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded-md bg-white text-slate-900"
              required
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} - {event.category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Start Date
              </label>
              <Input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                End Date
              </label>
              <Input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Position
            </label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-neutral-200 rounded-md bg-white text-slate-900"
              required
            >
              {availablePositions.length > 0 ? (
                availablePositions.map((pos) => (
                  <option key={pos} value={pos}>
                    Position {pos}
                  </option>
                ))
              ) : (
                <option value={1}>Position 1</option>
              )}
            </select>
            {availablePositions.length === 0 && formData.startDate && formData.endDate && (
              <p className="text-sm text-warning-500 mt-1">
                No available positions for the selected time period
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Sponsorship Fee (optional)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.sponsorshipFee}
              onChange={(e) => setFormData({ ...formData, sponsorshipFee: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Notes (optional)
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this placement..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Placement</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Placement Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Featured Placement"
        size="lg"
      >
        <form onSubmit={handleEditPlacement} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Start Date
              </label>
              <Input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                End Date
              </label>
              <Input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Position
            </label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-neutral-200 rounded-md bg-white text-slate-900"
              required
            >
              {availablePositions.length > 0 ? (
                availablePositions.map((pos) => (
                  <option key={pos} value={pos}>
                    Position {pos}
                  </option>
                ))
              ) : (
                <option value={formData.position}>Position {formData.position}</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Sponsorship Fee (optional)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.sponsorshipFee}
              onChange={(e) => setFormData({ ...formData, sponsorshipFee: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Notes (optional)
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this placement..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Placement</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}