'use client';
import { BookOpen, Check, Gift, MessageCircle, X } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ReferralShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

export function ReferralShareModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
}: ReferralShareModalProps) {
  const [referralLink, setReferralLink] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState({ clicks: 0, conversions: 0, earned: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateReferralLink();
      fetchStats();
    }
  }, [isOpen, eventId]);

  const generateReferralLink = async () => {
    try {
      const res = await fetch('/api/referrals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });

      if (res.ok) {
        const data = await res.json();
        setReferralLink(data.url);
        setReferralCode(data.code);
      }
    } catch (error) {
      console.error('Failed to generate referral link:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/referrals/stats?eventId=${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out ${eventTitle}! ${referralLink}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(eventTitle)}&url=${encodeURIComponent(referralLink)}`,
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Share & Earn Rewards">
      <div className="space-y-6">
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="font-semibold mb-2">Gift Earn rewards for every referral!</h3>
          <p className="text-sm text-gray-700">
            Share this event with friends and earn 10% commission on every ticket they purchase.
          </p>
        </Card>

        <div>
          <label className="block text-sm font-medium mb-2">Your Referral Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-3 py-2 border rounded-lg text-sm bg-gray-50"
            />
            <Button onClick={handleCopy}>
              {copied ? 'Check Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Share on social media</h4>
          <div className="flex gap-2">
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <span><MessageCircle className="h-4 w-4 inline-block" /></span>
              <span className="text-sm font-medium">WhatsApp</span>
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <span><BookOpen className="h-4 w-4 inline-block" /></span>
              <span className="text-sm font-medium">Facebook</span>
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
            >
              <span><X className="h-4 w-4 inline-block" /></span>
              <span className="text-sm font-medium">X (Twitter)</span>
            </a>
          </div>
        </div>

        <Card className="p-4">
          <h4 className="font-semibold mb-3">Your Referral Stats</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.clicks}</p>
              <p className="text-xs text-gray-600">Clicks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.conversions}</p>
              <p className="text-xs text-gray-600">Conversions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">₦{stats.earned}</p>
              <p className="text-xs text-gray-600">Earned</p>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
}
