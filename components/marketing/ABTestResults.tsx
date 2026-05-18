'use client';
import { AlertTriangle } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface VariantResult {
  id: string;
  name: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
  isWinner?: boolean;
}

interface ABTestResultsProps {
  testId: string;
  testName: string;
  status: 'running' | 'completed';
  variants: VariantResult[];
  statisticalSignificance?: number;
  onSelectWinner?: (variantId: string) => void;
}

export function ABTestResults({
  testId,
  testName,
  status,
  variants,
  statisticalSignificance,
  onSelectWinner,
}: ABTestResultsProps) {
  const bestVariant = variants.reduce((best, current) =>
    current.conversionRate > best.conversionRate ? current : best
  );

  const hasSignificance = statisticalSignificance && statisticalSignificance >= 95;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{testName}</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Status: <span className={status === 'running' ? 'text-blue-600' : 'text-green-600'}>
              {status === 'running' ? 'Running' : 'Completed'}
            </span>
          </p>
        </div>
        
        {statisticalSignificance && (
          <div className="text-right">
            <p className="text-sm text-neutral-500">Statistical Significance</p>
            <p className={`text-2xl font-bold ${hasSignificance ? 'text-green-600' : 'text-amber-600'}`}>
              {statisticalSignificance.toFixed(1)}%
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {variants.map(variant => {
          const isBest = variant.id === bestVariant.id;
          
          return (
            <div
              key={variant.id}
              className={`p-4 border-2 rounded-2xl ${
                variant.isWinner
                  ? 'border-green-500 bg-green-50'
                  : isBest
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{variant.name}</h3>
                  {variant.isWinner && (
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                      Winner
                    </span>
                  )}
                  {!variant.isWinner && isBest && (
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      Leading
                    </span>
                  )}
                </div>
                
                {status === 'running' && hasSignificance && !variant.isWinner && isBest && onSelectWinner && (
                  <Button
                    size="sm"
                    onClick={() => onSelectWinner(variant.id)}
                  >
                    Select as Winner
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Impressions</p>
                  <p className="text-xl font-bold">{variant.impressions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Conversions</p>
                  <p className="text-xl font-bold">{variant.conversions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Conversion Rate</p>
                  <p className="text-xl font-bold">{variant.conversionRate.toFixed(2)}%</p>
                </div>
              </div>

              {isBest && variants.length > 1 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-neutral-500">
                    Improvement over other variants:{' '}
                    <span className="font-semibold text-green-600">
                      +{((variant.conversionRate / variants.filter(v => v.id !== variant.id)[0].conversionRate - 1) * 100).toFixed(1)}%
                    </span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!hasSignificance && status === 'running' && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <p className="text-sm text-amber-800">
           <AlertTriangle className="h-4 w-4 inline" /> Test has not reached statistical significance yet. Continue running to get reliable results.
          </p>
        </div>
      )}
    </Card>
  );
}
