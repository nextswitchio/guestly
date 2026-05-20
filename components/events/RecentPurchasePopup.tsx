'use client';
import { X } from 'lucide-react';

import { useEffect, useState } from 'react';

interface Purchase {
  id: string;
  name: string;
  city: string;
  timestamp: number;
}

interface RecentPurchasePopupProps {
  eventId: string;
}

export function RecentPurchasePopup({ eventId }: RecentPurchasePopupProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(`/api/social-proof/${eventId}/recent-purchases`);
        if (res.ok) {
          const data = await res.json();
          setPurchases(data.recentPurchases || []);
        }
      } catch (error) {
        console.error('Failed to fetch recent purchases:', error);
      }
    };

    fetchPurchases();
    const interval = setInterval(fetchPurchases, 10000);

    return () => clearInterval(interval);
  }, [eventId]);

  useEffect(() => {
    if (purchases.length === 0) return;

    const showRandomPurchase = () => {
      const randomPurchase = purchases[Math.floor(Math.random() * purchases.length)];
      setCurrentPurchase(randomPurchase);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    const interval = setInterval(showRandomPurchase, 15000);
    showRandomPurchase(); // Show immediately

    return () => clearInterval(interval);
  }, [purchases]);

  if (!currentPurchase || !isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-in">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {currentPurchase.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {currentPurchase.name} from {currentPurchase.city}
            </p>
            <p className="text-xs text-gray-600">just bought a ticket</p>
            <p className="text-xs text-gray-400 mt-1">
              {Math.floor((Date.now() - currentPurchase.timestamp) / 60000)} minutes ago
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4 inline-block" />
          </button>
        </div>
      </div>
    </div>
  );
}
