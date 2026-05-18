'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: number;
}

interface EventReviewsProps {
  eventId: string;
}

export function EventReviews({ eventId }: EventReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/social-proof/${eventId}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
          setAverageRating(data.averageRating || 0);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchReviews();
  }, [eventId]);

  if (reviews.length === 0) return null;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Reviews</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name="star"
                className={`w-6 h-6 ${
                  i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div>
            <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
            <p className="text-sm text-gray-600">{reviews.length} reviews</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.slice(0, 5).map(review => (
          <div key={review.id} className="pb-4 border-b last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{review.userName}</p>
                  {review.verified && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                      <Icon name="check" className="w-3 h-3" />
                      Verified Attendee
                    </span>
                  )}
                </div>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="star"
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>

      {reviews.length > 5 && (
        <button className="mt-4 text-sm text-blue-600 hover:underline">
          View all {reviews.length} reviews
        </button>
      )}
    </Card>
  );
}
