'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import PromoCodeForm from './PromoCodeForm';
import PromoCodeStats from './PromoCodeStats';
import type { PromoCode } from '@/lib/marketing';

interface PromoCodeManagerProps {
  organizerId: string;
  eventId?: string;
}

export default function PromoCodeManager({ organizerId, eventId }: PromoCodeManagerProps) {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);

  useEffect(() => {
    fetchPromoCodes();
  }, [organizerId, eventId]);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ organizerId });
      if (eventId) params.append('eventId', eventId);
      const response = await fetch(`/api/promo-codes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data.promoCodes || []);
      }
    } catch (error) {
      console.error('Failed to fetch promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (promoCodeId: string) => {
    if (!confirm('Deactivate this promo code?')) return;
    try {
      const response = await fetch(`/api/promo-codes/${promoCodeId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchPromoCodes();
      }
    } catch (error) {
      console.error('Failed to deactivate promo code:', error);
    }
  };

  const filteredPromoCodes = promoCodes.filter((code) =>
    code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    code.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeLabel = (type: PromoCode['type']) => {
    switch (type) {
      case 'percentage':
        return 'Percentage';
      case 'fixed':
        return 'Fixed Amount';
      case 'free':
        return 'Free Ticket';
      default:
        return type;
    }
  };

  const getTypeColor = (type: PromoCode['type']) => {
    switch (type) {
      case 'percentage':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'fixed':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'free':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Promo Codes</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage discount codes for your events
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Icon name="plus" className="w-5 h-5" />
          Create Promo Code
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search promo codes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        leftIcon={<Icon name="search" className="w-5 h-5 text-gray-400" />}
      />

      {/* Promo Codes List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="loader" className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : filteredPromoCodes.length === 0 ? (
        <Card className="p-12 text-center">
          <Icon name="tag" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No promo codes found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first promo code to incentivize ticket purchases
          </p>
          <Button onClick={() => setShowCreateModal(true)}>Create Promo Code</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPromoCodes.map((promoCode) => (
            <Card key={promoCode.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-lg font-bold text-primary-500">
                      {promoCode.code}
                    </code>
                    {!promoCode.active && (
                      <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {promoCode.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPromoCode(promoCode)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Icon name="more-vertical" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(promoCode.type)}`}>
                    {getTypeLabel(promoCode.type)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Value:</span>
                  <span className="font-medium">
                    {promoCode.type === 'percentage'
                      ? `${promoCode.value}%`
                      : promoCode.type === 'fixed'
                      ? `$${promoCode.value}`
                      : 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Used:</span>
                  <span className="font-medium">
                    {promoCode.usageCount}
                    {promoCode.usageLimit ? ` / ${promoCode.usageLimit}` : ''}
                  </span>
                </div>
                {promoCode.expiresAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Expires:</span>
                    <span className="font-medium">
                      {new Date(promoCode.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedPromoCode(promoCode)}
                >
                  View Stats
                </Button>
                {promoCode.active && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeactivate(promoCode.id)}
                  >
                    <Icon name="x" className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Promo Code"
        size="xl"
      >
        <PromoCodeForm
          organizerId={organizerId}
          eventId={eventId}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchPromoCodes();
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Stats Modal */}
      <Modal
        open={!!selectedPromoCode}
        onClose={() => setSelectedPromoCode(null)}
        title={`Promo Code: ${selectedPromoCode?.code}`}
      >
        {selectedPromoCode && <PromoCodeStats promoCodeId={selectedPromoCode.id} />}
      </Modal>
    </div>
  );
}
