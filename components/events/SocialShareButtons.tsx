'use client';
import { BookOpen, Briefcase, Check, Copy, Mail, MessageCircle, X } from 'lucide-react';

import { useState } from 'react';

interface SocialShareButtonsProps {
  eventId: string;
  eventTitle: string;
  eventUrl: string;
  referralCode?: string;
}

export function SocialShareButtons({
  eventId,
  eventTitle,
  eventUrl,
  referralCode,
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = referralCode
    ? `${eventUrl}?ref=${referralCode}`
    : eventUrl;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(eventTitle);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=Check%20out%20this%20event:%20${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      // Track share event
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          action: 'share',
          channel: 'copy-link',
          referralCode,
        }),
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = (platform: string) => {
    // Track share event
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        action: 'share',
        channel: platform,
        referralCode,
      }),
    });
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-700">Share this event</h4>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-wrap gap-2">
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleShare('whatsapp')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">WhatsApp</span>
          </a>

          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Facebook</span>
          </a>

          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
          >
            <X className="h-4 w-4" />
            <span className="text-sm font-medium">X (Twitter)</span>
          </a>

          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleShare('linkedin')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            <Briefcase className="h-4 w-4" />
            <span className="text-sm font-medium">LinkedIn</span>
          </a>

          <a
            href={shareLinks.email}
            onClick={() => handleShare('email')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
          >
            <Mail className="h-4 w-4" />
            <span className="text-sm font-medium">Email</span>
          </a>
        </div>

      <div className="flex gap-2 flex-1">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 px-3 py-2 border rounded-lg text-sm bg-slate-50 text-slate-900"
        />
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-sm font-medium"
        >
          {copied ? (
            <><Check className="w-4 h-4" /> Copied!</>
          ) : (
            <><Copy className="w-4 h-4" /> Copy Link</>
          )}
        </button>
      </div>
      </div>
    </div>
  );
}
