'use client';
import { RefreshCw, Plus, Ticket, Trash2, X } from 'lucide-react';

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
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
  });
  const [error, setError] = useState('');

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

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.price || !formData.quantity) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/events/${id}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          description: formData.description,
          ticket_type: formData.name,
          attendance_type: 'physical',
          available: parseInt(formData.quantity),
          total: parseInt(formData.quantity),
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ name: '', price: '', quantity: '', description: '' });
        await fetchTickets();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create ticket type');
      }
    } catch (err) {
      setError('Failed to create ticket type');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

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
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors">
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
          <p className="text-2xl font-bold mt-1 text-neutral-900">{(ticketTypes.reduce((sum, t) => sum + t.quantity, 0)).toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Sold</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{(ticketTypes.reduce((sum, t) => sum + t.sold, 0)).toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Remaining</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{(ticketTypes.reduce((sum, t) => sum + t.quantity - t.sold, 0)).toLocaleString()}</p>
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
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors mx-auto">
              <Plus className="w-4 h-4" />
              Add Ticket Type
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900">Add Ticket Type</h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setError('');
                }}
                className="text-neutral-400 hover:text-neutral-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddTicket} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Ticket Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., General Admission"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Price (₦) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                  step="100"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Add details about this ticket type..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-lime text-dark rounded-lg font-bold hover:bg-lime-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
