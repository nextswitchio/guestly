"use client";
import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

interface EventDetailsModalProps {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

type EventDetails = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  city: string;
  country: string;
  eventType: string;
  venue?: string;
  status: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  orders: number;
  conversionRate: number;
  averageOrderValue: number;
  attendanceRate?: number;
  createdAt: number;
};

export default function EventDetailsModal({ eventId, isOpen, onClose }: EventDetailsModalProps) {
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [baseEvent, setBaseEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch event performance data
      const performanceResponse = await fetch(`/api/admin/events/performance?eventId=${id}`);
      const performanceResult = await performanceResponse.json();
      
      if (performanceResult.success && performanceResult.data.events.length > 0) {
        setEvent(performanceResult.data.events[0]);
        
        // Fetch base event data for additional details
        const eventResponse = await fetch(`/api/events/${id}`);
        const eventResult = await eventResponse.json();
        
        if (eventResult.success) {
          setBaseEvent(eventResult.data);
        }
      } else {
        setError('Event not found');
      }
    } catch (err) {
      setError('Failed to fetch event details');
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId && isOpen) {
      fetchEventDetails(eventId);
    }
  }, [eventId, isOpen]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Event Details"
      size="lg"
    >
      {loading && (
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-neutral-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-6 text-center">
          <Icon name="alert-circle" size={48} className="mx-auto mb-4 text-danger-500" />
          <p className="text-lg font-medium text-danger-600">Error</p>
          <p className="text-sm text-neutral-600 mt-2">{error}</p>
        </div>
      )}

      {event && !loading && !error && (
        <div className="p-6 space-y-6">
          {/* Event Header */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {event.title}
            </h2>
            <p className="text-slate-500 mb-4">
              {baseEvent?.description || event.description || 'No description available'}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Icon name="calendar" size={16} />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="map-pin" size={16} />
                {baseEvent?.venue || event.venue ? `${baseEvent?.venue || event.venue}, ` : ''}{event.city}, {event.country}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="tag" size={16} />
                {event.category}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="monitor" size={16} />
                {event.eventType}
              </span>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                  <Icon name="ticket" size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tickets Sold</p>
                  <p className="text-xl font-bold text-slate-900">
                    {(event.ticketsSold ?? 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    of {(event.totalTickets ?? 0).toLocaleString()} available
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success-50 text-success-600">
                  <Icon name="dollar-sign" size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Revenue</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(event.revenue)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {event.orders} orders
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Icon name="trending-up" size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Conversion Rate</p>
                  <p className="text-xl font-bold text-slate-900">
                    {event.conversionRate.toFixed(2)}%
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatCurrency(event.averageOrderValue)} avg order
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Event Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Type:</span>
                  <span className="text-slate-900">{event.eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-slate-900 capitalize">{event.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="text-slate-900">{event.category}</span>
                </div>
                {baseEvent?.community && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Community:</span>
                    <span className="text-slate-900">{baseEvent.community}</span>
                  </div>
                )}
                {event.attendanceRate !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Attendance Rate:</span>
                    <span className="text-slate-900">{event.attendanceRate.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Performance Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Orders:</span>
                  <span className="text-slate-900">{event.orders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Average Order Value:</span>
                  <span className="text-slate-900">{formatCurrency(event.averageOrderValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Revenue per Ticket:</span>
                  <span className="text-slate-900">
                    {event.ticketsSold > 0 ? formatCurrency(event.revenue / event.ticketsSold) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sell-through Rate:</span>
                  <span className="text-slate-900">
                    {event.totalTickets > 0 ? ((event.ticketsSold / event.totalTickets) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                {baseEvent?.streamingConfig && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Streaming:</span>
                    <span className="text-slate-900">{baseEvent.streamingConfig.provider}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={() => window.open(`/events/${event.id}`, '_blank')}
              rightIcon={<Icon name="external-link" size={16} />}
            >
              View Public Page
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}