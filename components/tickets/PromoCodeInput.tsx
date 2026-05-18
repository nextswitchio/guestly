'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface PromoCodeInputProps {
  eventId: string;
  onApply: (code: string, discount: number) => void;
  onRemove: () => void;
  appliedCode?: string;
  appliedDiscount?: number;
}

export function PromoCodeInput({
  eventId,
  onApply,
  onRemove,
  appliedCode,
  appliedDiscount,
}: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsValidating(true);
    setError('');

    try {
      const res = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase(), eventId }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        onApply(code.toUpperCase(), data.discount);
        setCode('');
      } else {
        setError(data.message || 'Invalid promo code');
      }
    } catch (error) {
      setError('Failed to validate promo code');
    } finally {
      setIsValidating(false);
    }
  };

  if (appliedCode) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-green-800">
              Promo code applied: {appliedCode}
            </p>
            <p className="text-sm text-green-700">
              You saved ₦{appliedDiscount?.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Have a promo code?</label>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError('');
          }}
          placeholder="Enter code"
          className="flex-1"
          disabled={isValidating}
        />
        <Button
          onClick={handleApply}
          disabled={!code.trim() || isValidating}
        >
          {isValidating ? 'Validating...' : 'Apply'}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
