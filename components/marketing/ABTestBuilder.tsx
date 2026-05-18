'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface Variant {
  id: string;
  name: string;
  description: string;
  trafficAllocation: number;
}

interface ABTestBuilderProps {
  campaignId: string;
  onCreateTest: (data: any) => Promise<void>;
}

export function ABTestBuilder({ campaignId, onCreateTest }: ABTestBuilderProps) {
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState<'email' | 'ad' | 'landing-page'>('email');
  const [variants, setVariants] = useState<Variant[]>([
    { id: '1', name: 'Variant A', description: '', trafficAllocation: 50 },
    { id: '2', name: 'Variant B', description: '', trafficAllocation: 50 },
  ]);

  const addVariant = () => {
    const newVariant: Variant = {
      id: Date.now().toString(),
      name: `Variant ${String.fromCharCode(65 + variants.length)}`,
      description: '',
      trafficAllocation: 0,
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (id: string) => {
    if (variants.length > 2) {
      setVariants(variants.filter(v => v.id !== id));
    }
  };

  const updateVariant = (id: string, field: keyof Variant, value: any) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleCreate = async () => {
    await onCreateTest({
      campaignId,
      name: testName,
      type: testType,
      variants,
    });
  };

  const totalAllocation = variants.reduce((sum, v) => sum + v.trafficAllocation, 0);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Create A/B Test</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Test Name</label>
          <Input
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="e.g., Subject Line Test"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Test Type</label>
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value as any)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="email">Email Subject/Content</option>
            <option value="ad">Ad Creative</option>
            <option value="landing-page">Landing Page</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium">Variants</label>
            <Button size="sm" onClick={addVariant}>+ Add Variant</Button>
          </div>

          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div key={variant.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{variant.name}</h4>
                  {variants.length > 2 && (
                    <button
                      onClick={() => removeVariant(variant.id)}
                      className="text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    value={variant.description}
                    onChange={(e) => updateVariant(variant.id, 'description', e.target.value)}
                    placeholder="Describe this variant"
                  />
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Traffic Allocation (%)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={variant.trafficAllocation}
                      onChange={(e) => updateVariant(variant.id, 'trafficAllocation', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalAllocation !== 100 && (
            <p className="text-sm text-amber-600 mt-2">
              Total allocation: {totalAllocation}% (should be 100%)
            </p>
          )}
        </div>

        <Button
          onClick={handleCreate}
          disabled={!testName || totalAllocation !== 100}
          className="w-full"
        >
          Create A/B Test
        </Button>
      </div>
    </Card>
  );
}
