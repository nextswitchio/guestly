"use client";
import React, { useState } from 'react';
import EventPerformanceSummary from '@/components/admin/EventPerformanceSummary';
import EventPerformanceTable from '@/components/admin/EventPerformanceTable';
import EventDetailsModal from '@/components/admin/EventDetailsModal';

export default function AdminEventsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Event Performance</h1>
        <p className="text-sm text-[var(--foreground-muted)]">
          Comprehensive breakdown of all events with key performance metrics
        </p>
      </div>

      {/* Performance Summary */}
      <EventPerformanceSummary />

      {/* Performance Table */}
      <EventPerformanceTable onEventClick={handleEventClick} />

      {/* Event Details Modal */}
      <EventDetailsModal
        eventId={selectedEventId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}