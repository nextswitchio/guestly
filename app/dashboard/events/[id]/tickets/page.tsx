'use client';
import { RefreshCw, Plus, Ticket, Trash2 } from 'lucide-react';

import { useState, useEffect, use } from 'react';
import { Icon } from '@/components/ui/Icon';

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  description: string;
  benefits: string[];
}

export default function EventTicketsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, [id]);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`/api/events/${id}/tickets`);
      if (response.ok) {
        const data = await response.json();
        setTicketTypes(data.tickets || []);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCapacity = ticketTypes.reduce((sum, t) => sum + t.quantity, 0);
  const totalSold = ticketTypes.reduce((sum, t) => sum + t.sold, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Ticket Management</h1>
          <p className="text-neutral-500 mt-1">Manage ticket types, pricing, and availability</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors">
          <Plus className="w-4 h-4" />
          Add Ticket Type
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Ticket Types</p>
          <p className="text-2xl font-bold mt-1 text-neutral-900">{ticketTypes.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Total Capacity</p>
          <p className="text-2xl font-bold mt-1 text-neutral-900">{totalCapacity.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Sold</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{totalSold.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Remaining</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{(totalCapacity - totalSold).toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        {ticketTypes.map((ticket) => (
          <div key={ticket.id} className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10">
                  <Ticket className="w-5 h-5 text-lime" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{ticket.name}</h3>
                  <p className="text-sm text-neutral-500">{ticket.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-neutral-900">₦{ticket.price.toLocaleString()}</p>
                <p className="text-sm text-neutral-500">
                  {ticket.sold} / {ticket.quantity} sold
                </p>
              </div>
            </div>

            <div className="w-full bg-neutral-100 rounded-full h-2 mb-4">
              <div
                className="bg-lime h-2 rounded-full transition-all"
                style={{ width: `${(ticket.sold / ticket.quantity) * 100}%` }}
              />
            </div>

            {ticket.benefits.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {ticket.benefits.map((benefit, idx) => (
                  <span key={idx} className="px-3 py-1 bg-lime/10 text-dark rounded-lg text-xs font-medium">
                    {benefit}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                Edit
              </button>
              <button className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4 mr-1.5 inline" />
                Remove
              </button>
            </div>
          </div>
        ))}

        {ticketTypes.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
            <div className="flex h-12 w-12 mx-auto mb-4 items-center justify-center rounded-full bg-neutral-100">
              <Ticket className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No ticket types yet</h3>
            <p className="text-neutral-500 mb-4">
              Create ticket types to start selling tickets for your event.
            </p>
            <button className="flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors mx-auto">
              <Plus className="w-4 h-4" />
              Add Ticket Type
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
