'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { InfluencerMessaging } from './InfluencerMessaging';

interface Collaboration {
  id: string;
  influencerName: string;
  influencerEmail: string;
  influencerAvatar?: string;
  eventId: string;
  eventName: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'rejected';
  compensationType: 'free-tickets' | 'fixed-payment' | 'commission';
  compensationValue: string;
  deliverables: string[];
  completedDeliverables: string[];
  deadline?: string;
  trackingLink?: string;
  promoCode?: string;
  metrics: {
    reach: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  createdAt: string;
}

interface InfluencerCollaborationProps {
  organizerId: string;
}

export function InfluencerCollaboration({ organizerId }: InfluencerCollaborationProps) {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
  const [selectedCollab, setSelectedCollab] = useState<Collaboration | null>(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCollaborations();
    fetchUnreadMessages();
  }, [organizerId]);

  const fetchCollaborations = async () => {
    try {
      const response = await fetch('/api/influencers/collaborations');
      if (response.ok) {
        const data = await response.json();
        setCollaborations(data.collaborations || []);
      }
    } catch (error) {
      console.error('Failed to fetch collaborations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const response = await fetch('/api/influencers/messages');
      if (response.ok) {
        const data = await response.json();
        const unreadMap: Record<string, number> = {};
        data.threads?.forEach((thread: any) => {
          unreadMap[thread.collaborationId] = thread.unreadCount.organizer || 0;
        });
        setUnreadMessages(unreadMap);
      }
    } catch (error) {
      console.error('Failed to fetch unread messages:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-warning-100 text-warning-700',
      accepted: 'bg-primary-100 text-primary-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      completed: 'bg-success-100 text-success-700',
      rejected: 'bg-danger-100 text-danger-700',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const filteredCollaborations = collaborations.filter(collab => {
    if (filter === 'all') return true;
    if (filter === 'pending') return collab.status === 'pending';
    if (filter === 'active') return ['accepted', 'in-progress'].includes(collab.status);
    if (filter === 'completed') return collab.status === 'completed';
    return true;
  });

  const getCompletionPercentage = (collab: Collaboration) => {
    if (collab.deliverables.length === 0) return 0;
    return (collab.completedDeliverables.length / collab.deliverables.length) * 100;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Influencer Collaborations</h3>
          <button
            onClick={fetchCollaborations}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <Icon name="arrow-right" className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'pending', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Collaborations List */}
      <div className="space-y-4">
        {filteredCollaborations.map(collab => (
          <div key={collab.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  {collab.influencerAvatar && (
                    <img
                      src={collab.influencerAvatar}
                      alt={collab.influencerName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-semibold text-gray-900">{collab.influencerName}</h4>
                    {getStatusBadge(collab.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{collab.eventName}</p>

                  {/* Compensation */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Icon name="money" className="w-4 h-4" />
                      {collab.compensationType === 'free-tickets' && `${collab.compensationValue} tickets`}
                      {collab.compensationType === 'fixed-payment' && `$${collab.compensationValue}`}
                      {collab.compensationType === 'commission' && `${collab.compensationValue}% commission`}
                    </span>
                    {collab.deadline && (
                      <span className="flex items-center gap-1">
                        <Icon name="calendar" className="w-4 h-4" />
                        Due {new Date(collab.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Progress */}
                  {collab.status !== 'pending' && collab.status !== 'rejected' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Deliverables Progress</span>
                        <span className="font-medium text-gray-900">
                          {collab.completedDeliverables.length} / {collab.deliverables.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all"
                          style={{ width: `${getCompletionPercentage(collab)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Metrics */}
                  {(collab.status === 'in-progress' || collab.status === 'completed') && (
                    <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Reach</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatNumber(collab.metrics.reach)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Clicks</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatNumber(collab.metrics.clicks)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Conversions</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatNumber(collab.metrics.conversions)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Revenue</div>
                        <div className="text-sm font-semibold text-gray-900">
                          ${formatNumber(collab.metrics.revenue)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setSelectedCollab(collab);
                      setShowMessaging(false);
                    }}
                    className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCollab(collab);
                      setShowMessaging(true);
                    }}
                    className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 relative"
                  >
                    <Icon name="message-circle" className="w-4 h-4 inline mr-1" />
                    Message
                    {unreadMessages[collab.id] > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadMessages[collab.id]}
                      </span>
                    )}
                  </button>
                  {collab.trackingLink && (
                    <button
                      onClick={() => navigator.clipboard.writeText(collab.trackingLink!)}
                      className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      <Icon name="link" className="w-4 h-4 inline mr-1" />
                      Copy Link
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredCollaborations.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Icon name="users" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-2">No collaborations found</p>
            <p className="text-sm text-gray-400">
              {filter === 'all'
                ? 'Start by inviting influencers to collaborate'
                : `No ${filter} collaborations at the moment`}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCollab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {showMessaging ? 'Messages' : 'Collaboration Details'}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMessaging(false)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      !showMessaging
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setShowMessaging(true)}
                    className={`px-3 py-1 text-sm rounded-lg relative ${
                      showMessaging
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Messages
                    {unreadMessages[selectedCollab.id] > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadMessages[selectedCollab.id]}
                      </span>
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCollab(null);
                  setShowMessaging(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            {showMessaging ? (
              <div className="p-6">
                <InfluencerMessaging
                  collaborationId={selectedCollab.id}
                  currentUserId={organizerId}
                  currentUserRole="organizer"
                  organizerName="You"
                  influencerName={selectedCollab.influencerName}
                />
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Influencer Info */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Influencer</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">{selectedCollab.influencerName}</div>
                      <div className="text-sm text-gray-600">{selectedCollab.influencerEmail}</div>
                    </div>
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Deliverables</h4>
                  <div className="space-y-2">
                    {selectedCollab.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Icon
                          name={
                            selectedCollab.completedDeliverables.includes(deliverable)
                              ? 'check'
                              : 'plus'
                          }
                          className={`w-5 h-5 ${
                            selectedCollab.completedDeliverables.includes(deliverable)
                              ? 'text-success-500'
                              : 'text-gray-300'
                          }`}
                        />
                        <span className="text-sm text-gray-700">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking Info */}
                {selectedCollab.trackingLink && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Tracking</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Tracking Link</div>
                        <div className="text-sm text-gray-900 font-mono break-all">
                          {selectedCollab.trackingLink}
                        </div>
                      </div>
                      {selectedCollab.promoCode && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Promo Code</div>
                          <div className="text-sm text-gray-900 font-mono">{selectedCollab.promoCode}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setSelectedCollab(null);
                  setShowMessaging(false);
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
