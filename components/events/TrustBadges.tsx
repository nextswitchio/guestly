'use client';
import { CheckCircle, Lock } from 'lucide-react';

interface TrustBadgesProps {
  features?: {
    securePayment?: boolean;
    refundPolicy?: boolean;
    verifiedOrganizer?: boolean;
    customerSupport?: boolean;
  };
}

export function TrustBadges({ features = {} }: TrustBadgesProps) {
  const {
    securePayment = true,
    refundPolicy = true,
    verifiedOrganizer = false,
    customerSupport = true,
  } = features;

  const badges = [
    {
      id: 'secure',
      show: securePayment,
      icon: 'Lock',
      label: 'Secure Payment',
      description: 'SSL encrypted checkout',
    },
    {
      id: 'refund',
      show: refundPolicy,
      icon: '↩️',
      label: 'Refund Policy',
      description: '7-day money back guarantee',
    },
    {
      id: 'verified',
      show: verifiedOrganizer,
      icon: '<CheckCircle className="h-4 w-4 inline-block" />',
      label: 'Verified Organizer',
      description: 'Identity confirmed',
    },
    {
      id: 'support',
      show: customerSupport,
      icon: '💬',
      label: '24/7 Support',
      description: 'Always here to help',
    },
  ];

  const visibleBadges = badges.filter(b => b.show);

  if (visibleBadges.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {visibleBadges.map(badge => (
        <div
          key={badge.id}
          className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <span className="text-2xl mb-1">{badge.icon}</span>
          <p className="text-xs font-semibold text-gray-900">{badge.label}</p>
          <p className="text-xs text-gray-600 mt-0.5">{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
