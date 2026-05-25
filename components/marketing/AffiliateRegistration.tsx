'use client';
import { RefreshCw } from 'lucide-react';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/ToastProvider';

interface AffiliateRegistrationProps {
  userId: string;
  onSuccess?: () => void;
}

export default function AffiliateRegistration({ userId, onSuccess }: AffiliateRegistrationProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    website: '',
    promotionalChannels: [] as string[],
    paymentMethod: 'bank' as 'bank' | 'mobile-money' | 'paypal',
    paymentDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      routingNumber: '',
    },
  });

  const channelOptions = [
    { value: 'blog', label: 'Blog/Website', icon: 'globe' },
    { value: 'youtube', label: 'YouTube', icon: 'video' },
    { value: 'instagram', label: 'Instagram', icon: 'instagram' },
    { value: 'facebook', label: 'Facebook', icon: 'facebook' },
    { value: 'twitter', label: 'Twitter', icon: 'twitter' },
    { value: 'tiktok', label: 'TikTok', icon: 'video' },
    { value: 'email', label: 'Email List', icon: 'mail' },
    { value: 'other', label: 'Other', icon: 'more-horizontal' },
  ];

  const toggleChannel = (channel: string) => {
    if (formData.promotionalChannels.includes(channel)) {
      setFormData({
        ...formData,
        promotionalChannels: formData.promotionalChannels.filter((c) => c !== channel),
      });
    } else {
      setFormData({
        ...formData,
        promotionalChannels: [...formData.promotionalChannels, channel],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/affiliates/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      });

      if (response.ok) {
        onSuccess?.();
      } else {
        const error = await response.json();
        addToast(error.error || 'Failed to register as affiliate', { type: 'error' });
      }
    } catch (error) {
      console.error('Failed to register:', error);
      addToast('Failed to register as affiliate', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Become an Affiliate Partner</h1>
          <p className="text-neutral-500">
            Earn commissions by promoting events on Guestly
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-lime/10 rounded-2xl">
            <Icon name="dollar-sign" className="w-8 h-8 mx-auto text-lime mb-2" />
            <h3 className="font-semibold mb-1">Earn Commission</h3>
            <p className="text-sm text-neutral-500">
              Up to 10% on every sale
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-2xl">
            <Icon name="trending-up" className="w-8 h-8 mx-auto text-blue-500 mb-2" />
            <h3 className="font-semibold mb-1">Track Performance</h3>
            <p className="text-sm text-neutral-500">
              Real-time analytics dashboard
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-2xl">
            <Icon name="credit-card" className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <h3 className="font-semibold mb-1">Fast Payouts</h3>
            <p className="text-sm text-neutral-500">
              Monthly payments via bank or mobile money
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div
            className={`flex items-center gap-2 ${
              step === 'info' ? 'text-lime' : 'text-neutral-500'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'info'
                  ? 'bg-lime text-dark'
                  : 'bg-neutral-200'
              }`}
            >
              1
            </div>
            <span className="font-medium">Business Info</span>
          </div>
          <div className="w-12 h-1 bg-neutral-200" />
          <div
            className={`flex items-center gap-2 ${
              step === 'payment' ? 'text-lime' : 'text-neutral-500'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'payment'
                  ? 'bg-lime text-dark'
                  : 'bg-neutral-200'
              }`}
            >
              2
            </div>
            <span className="font-medium">Payment Details</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 'info' ? (
            <>
              <Input
                label="Business Name"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Your Company or Personal Brand"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="affiliate@example.com"
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  required
                />
              </div>

              <Input
                label="Website (Optional)"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://yourwebsite.com"
              />

              <div>
                <label className="block text-sm font-medium mb-3">
                  Promotional Channels (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {channelOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleChannel(option.value)}
                      className={`p-3 rounded-2xl border-2 transition-all ${
                        formData.promotionalChannels.includes(option.value)
                          ? 'border-lime bg-lime/10'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <Icon name={option.icon as any} className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs font-medium">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setStep('payment')}
                disabled={
                  !formData.businessName ||
                  !formData.email ||
                  !formData.phone ||
                  formData.promotionalChannels.length === 0
                }
                className="w-full"
              >
                Continue to Payment Details
              </Button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-3">Payment Method</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'bank', label: 'Bank Transfer', icon: 'credit-card' },
                    { value: 'mobile-money', label: 'Mobile Money', icon: 'smartphone' },
                    { value: 'paypal', label: 'PayPal', icon: 'dollar-sign' },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          paymentMethod: method.value as typeof formData.paymentMethod,
                        })
                      }
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        formData.paymentMethod === method.value
                          ? 'border-lime bg-lime/10'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <Icon name={method.icon as any} className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">{method.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {formData.paymentMethod === 'bank' && (
                <>
                  <Input
                    label="Account Name"
                    value={formData.paymentDetails.accountName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentDetails: {
                          ...formData.paymentDetails,
                          accountName: e.target.value,
                        },
                      })
                    }
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Account Number"
                      value={formData.paymentDetails.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentDetails: {
                            ...formData.paymentDetails,
                            accountNumber: e.target.value,
                          },
                        })
                      }
                      required
                    />
                    <Input
                      label="Bank Name"
                      value={formData.paymentDetails.bankName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentDetails: {
                            ...formData.paymentDetails,
                            bankName: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('info')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" loading={loading} disabled={loading} className="flex-1">
                    Submit Application
                </Button>
              </div>
            </>
          )}
        </form>

        {/* Terms */}
        <p className="text-xs text-neutral-500 text-center mt-6">
          By submitting this application, you agree to our Affiliate Terms and Conditions
        </p>
      </Card>
    </div>
  );
}
