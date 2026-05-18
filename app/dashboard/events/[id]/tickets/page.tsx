'use client';
import { RefreshCw, Plus, Ticket, Trash2 } from 'lucide-react';

import { useState, useEffect, use } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ticket Management</h1>
          <p className="text-slate-500 mt-1">Manage ticket types, pricing, and availability</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Ticket Type
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Ticket Types</p>
          <p className="text-2xl font-bold mt-1">{ticketTypes.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Total Capacity</p>
          <p className="text-2xl font-bold mt-1">{totalCapacity.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Sold</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{totalSold.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Remaining</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{(totalCapacity - totalSold).toLocaleString()}</p>
        </Card>
      </div>

      <div className="space-y-4">
        {ticketTypes.map((ticket) => (
          <Card key={ticket.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Ticket className="w-6 h-6 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold">{ticket.name}</h3>
                  <p className="text-sm text-slate-500">{ticket.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">₦{ticket.price.toLocaleString()}</p>
                <p className="text-sm text-slate-500">
                  {ticket.sold} / {ticket.quantity} sold
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${(ticket.sold / ticket.quantity) * 100}%` }}
              />
            </div>

            {ticket.benefits.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {ticket.benefits.map((benefit, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                    {benefit}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                <Trash2 className="w-4 h-4 mr-1.5" />
                Remove
              </Button>
            </div>
          </Card>
        ))}

        {ticketTypes.length === 0 && (
          <Card className="p-12 text-center">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No ticket types yet</h3>
            <p className="text-slate-500 mb-4">
              Create ticket types to start selling tickets for your event.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Ticket Type
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
