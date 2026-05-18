'use client';
import { AlertTriangle } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Icon } from '@/components/ui/Icon';

interface Creative {
  headline: string;
  description: string;
  imageUrl: string;
  callToAction: string;
}

interface AdCreativeUploaderProps {
  creative: Creative;
  onChange: (creative: Creative) => void;
}

const callToActionOptions = [
  'Learn More',
  'Buy Tickets',
  'Get Tickets',
  'Sign Up',
  'Register Now',
  'Book Now',
  'Shop Now',
  'Download',
  'Apply Now',
  'Contact Us',
];

export default function AdCreativeUploader({ creative, onChange }: AdCreativeUploaderProps) {
  const headlineLength = creative.headline.length;
  const descriptionLength = creative.description.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <div className="space-y-4">
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Icon name="edit" className="w-5 h-5" />
            Ad Copy
          </h4>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Headline</label>
                <span
                  className={`text-xs ${
                    headlineLength > 40 ? 'text-red-500' : 'text-neutral-500'
                  }`}
                >
                  {headlineLength}/40
                </span>
              </div>
              <Input
                value={creative.headline}
                onChange={(e) => onChange({ ...creative, headline: e.target.value })}
                placeholder="Grab attention with a compelling headline"
                maxLength={40}
              />
              {headlineLength > 40 && (
                <p className="text-xs text-red-500 mt-1">
                  Headline may be truncated on some platforms
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Description</label>
                <span
                  className={`text-xs ${
                    descriptionLength > 125 ? 'text-red-500' : 'text-neutral-500'
                  }`}
                >
                  {descriptionLength}/125
                </span>
              </div>
              <Textarea
                value={creative.description}
                onChange={(e) => onChange({ ...creative, description: e.target.value })}
                placeholder="Describe your event and what makes it special"
                rows={4}
                maxLength={125}
              />
              {descriptionLength > 125 && (
                <p className="text-xs text-red-500 mt-1">
                  Description may be truncated on some platforms
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Icon name="image" className="w-5 h-5" />
            Ad Image
          </h4>

          <div className="space-y-4">
            <Input
              label="Image URL"
              value={creative.imageUrl}
              onChange={(e) => onChange({ ...creative, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />

            <div className="bg-neutral-50 p-4 rounded-2xl">
              <p className="text-xs text-neutral-500 mb-2">
                Recommended specifications:
              </p>
              <ul className="text-xs text-neutral-500 space-y-1">
                <li>• Aspect ratio: 1.91:1 (1200x628px)</li>
                <li>• Format: JPG or PNG</li>
                <li>• File size: Under 5MB</li>
                <li>• Text in image: Less than 20%</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Icon name="target" className="w-5 h-5" />
            Call to Action
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {callToActionOptions.map((cta) => (
              <button
                key={cta}
                onClick={() => onChange({ ...creative, callToAction: cta })}
                className={`px-4 py-2 rounded-2xl border-2 text-sm font-medium transition-all ${
                  creative.callToAction === cta
                    ? 'border-lime bg-lime/10 text-lime'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {cta}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Icon name="eye" className="w-5 h-5" />
            Ad Preview
          </h4>
          <p className="text-sm text-neutral-500 mb-4">
            See how your ad will appear
          </p>

          {/* Facebook/Instagram Style Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* Header */}
            <div className="p-3 flex items-center gap-3 border-b border-neutral-200">
              <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center text-dark font-semibold">
                G
              </div>
              <div>
                <div className="font-semibold text-sm">Guestly</div>
                <div className="text-xs text-neutral-500">Sponsored</div>
              </div>
            </div>

            {/* Image */}
            {creative.imageUrl ? (
              <img
                src={creative.imageUrl}
                alt="Ad preview"
                className="w-full aspect-[1.91/1] object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/1200x628?text=Ad+Image';
                }}
              />
            ) : (
              <div className="w-full aspect-[1.91/1] bg-neutral-100 flex items-center justify-center">
                <div className="text-center text-neutral-400">
                  <Icon name="image" className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Add an image to preview</p>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">
                {creative.headline || 'Your headline here'}
              </h3>
              <p className="text-sm text-neutral-500 mb-3">
                {creative.description || 'Your description will appear here'}
              </p>
              <button className="w-full bg-lime text-dark py-2 px-4 rounded-2xl font-medium hover:bg-lime/90 transition-colors">
                {creative.callToAction}
              </button>
            </div>
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <Icon name="lightbulb" className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-sm text-green-900">
              <p className="font-medium mb-2">Tips for better ads:</p>
              <ul className="space-y-1 text-green-800">
                <li>• Use high-quality, eye-catching images</li>
                <li>• Keep headlines short and compelling</li>
                <li>• Include a clear call-to-action</li>
                <li>• Highlight what makes your event unique</li>
                <li>• Test multiple variations</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Validation */}
        {(!creative.headline || !creative.description || !creative.imageUrl) && (
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-xl"><AlertTriangle className="h-4 w-4 inline-block" /></span>
              <div className="text-sm text-amber-900">
                <p className="font-medium mb-1">Complete your ad creative</p>
                <ul className="space-y-1">
                  {!creative.headline && <li>• Add a headline</li>}
                  {!creative.description && <li>• Add a description</li>}
                  {!creative.imageUrl && <li>• Add an image</li>}
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
