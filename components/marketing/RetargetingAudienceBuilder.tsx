'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface AudienceRule {
  type: 'viewed_event' | 'added_to_cart' | 'started_checkout' | 'visited_page';
  eventId?: string;
  pageUrl?: string;
  daysAgo: number;
  excludeConverted: boolean;
}

interface RetargetingAudienceBuilderProps {
  onSave?: (audience: { name: string; rules: AudienceRule[]; estimatedSize: number }) => void;
}

export default function RetargetingAudienceBuilder({ onSave }: RetargetingAudienceBuilderProps) {
  const [audienceName, setAudienceName] = useState('');
  const [rules, setRules] = useState<AudienceRule[]>([
    {
      type: 'viewed_event',
      daysAgo: 7,
      excludeConverted: true,
    },
  ]);
  const [estimatedSize, setEstimatedSize] = useState(0);

  const addRule = () => {
    setRules([
      ...rules,
      {
        type: 'viewed_event',
        daysAgo: 7,
        excludeConverted: true,
      },
    ]);
  };

  const updateRule = (index: number, updates: Partial<AudienceRule>) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], ...updates };
    setRules(newRules);
    calculateEstimatedSize(newRules);
  };

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
    calculateEstimatedSize(newRules);
  };

  const calculateEstimatedSize = (currentRules: AudienceRule[]) => {
    // Mock calculation - in real implementation, call API
    const baseSize = 1000;
    const sizePerRule = currentRules.length * 200;
    setEstimatedSize(baseSize + sizePerRule);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        name: audienceName,
        rules,
        estimatedSize,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Audience Name */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Audience Name
        </label>
        <input
          type="text"
          value={audienceName}
          onChange={(e) => setAudienceName(e.target.value)}
          placeholder="e.g., Event Viewers - Last 7 Days"
          className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-white text-neutral-900"
        />
      </div>

      {/* Rules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-neutral-700">
            Audience Rules
          </label>
          <Button onClick={addRule} variant="outline" size="sm">
            + Add Rule
          </Button>
        </div>

        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="p-4 border border-neutral-200 rounded-lg bg-neutral-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rule Type */}
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">
                    Action
                  </label>
                  <select
                    value={rule.type}
                    onChange={(e) =>
                      updateRule(index, { type: e.target.value as AudienceRule['type'] })
                    }
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-900"
                  >
                    <option value="viewed_event">Viewed Event</option>
                    <option value="added_to_cart">Added to Cart</option>
                    <option value="started_checkout">Started Checkout</option>
                    <option value="visited_page">Visited Page</option>
                  </select>
                </div>

                {/* Days Ago */}
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">
                    Within Last
                  </label>
                  <select
                    value={rule.daysAgo}
                    onChange={(e) => updateRule(index, { daysAgo: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-900"
                  >
                    <option value={1}>1 day</option>
                    <option value={3}>3 days</option>
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                  </select>
                </div>

                {/* Exclude Converted */}
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.excludeConverted}
                      onChange={(e) => updateRule(index, { excludeConverted: e.target.checked })}
                      className="w-4 h-4 text-lime border-neutral-200 rounded focus:ring-lime/20 focus:border-lime"
                    />
                    <span className="text-sm text-neutral-700">
                      Exclude converters
                    </span>
                  </label>
                </div>
              </div>

              {/* Remove Button */}
              {rules.length > 1 && (
                <button
                  onClick={() => removeRule(index)}
                  className="mt-3 text-xs text-red-600 hover:text-red-700"
                >
                  Remove Rule
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Size */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-blue-900">
              Estimated Audience Size
            </div>
            <div className="text-xs text-blue-700 mt-1">
              Based on current rules and historical data
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {estimatedSize.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={!audienceName}>
          Create Audience
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}
