'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface DateRange {
  start: string;
  end: string;
}

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateRangeSelector({ value, onChange }: Props) {
  const safeValue = value ?? { start: '', end: '' };
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState(safeValue.start);
  const [customEnd, setCustomEnd] = useState(safeValue.end);

  const presets = [
    {
      label: 'Last 7 days',
      getValue: () => ({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      }),
    },
    {
      label: 'Last 30 days',
      getValue: () => ({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      }),
    },
    {
      label: 'Last 90 days',
      getValue: () => ({
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      }),
    },
    {
      label: 'This month',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return {
          start: start.toISOString().split('T')[0],
          end: now.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'Last month',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'This year',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        return {
          start: start.toISOString().split('T')[0],
          end: now.toISOString().split('T')[0],
        };
      },
    },
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    const range = preset.getValue();
    onChange(range);
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    if (customStart && customEnd && customStart <= customEnd) {
      onChange({ start: customStart, end: customEnd });
      setIsOpen(false);
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 focus:ring-2 focus:ring-lime focus:border-transparent transition-colors"
      >
        <Icon name="calendar" className="w-4 h-4 text-neutral-500" />
        <span className="text-sm text-neutral-900">
          {safeValue.start ? formatDisplayDate(safeValue.start) : 'Start'} - {safeValue.end ? formatDisplayDate(safeValue.end) : 'End'}
        </span>
        <Icon name="chevron-down" className={`w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown content */}
          <div className="absolute right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              {/* Presets */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-neutral-900 mb-2">Quick Select</h4>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetClick(preset)}
                      className="px-3 py-2 text-sm text-neutral-900 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors text-left"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom range */}
              <div className="pt-4 border-t border-neutral-200">
                <h4 className="text-sm font-semibold text-neutral-900 mb-3">Custom Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      max={customEnd}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:ring-2 focus:ring-lime focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      min={customStart}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:ring-2 focus:ring-lime focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleCustomApply}
                    disabled={!customStart || !customEnd || customStart > customEnd}
                    className="w-full px-4 py-2 bg-lime text-white rounded-lg hover:bg-lime-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Apply Custom Range
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
