'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';

interface Targeting {
  locations: string[];
  ageMin: number;
  ageMax: number;
  interests: string[];
  behaviors: string[];
}

interface AdTargetingFormProps {
  targeting: Targeting;
  onChange: (targeting: Targeting) => void;
}

const popularLocations = [
  'Lagos, Nigeria',
  'Abuja, Nigeria',
  'Accra, Ghana',
  'Nairobi, Kenya',
  'Cape Town, South Africa',
  'Johannesburg, South Africa',
];

const popularInterests = [
  'Music & Concerts',
  'Nightlife',
  'Arts & Culture',
  'Food & Dining',
  'Sports & Fitness',
  'Technology',
  'Business & Networking',
  'Fashion',
  'Travel',
  'Entertainment',
];

const popularBehaviors = [
  'Event Attendees',
  'Online Shoppers',
  'Mobile Users',
  'Social Media Engagers',
  'Early Adopters',
  'Frequent Travelers',
];

export default function AdTargetingForm({ targeting, onChange }: AdTargetingFormProps) {
  const [locationInput, setLocationInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [behaviorInput, setBehaviorInput] = useState('');

  const addLocation = (location: string) => {
    if (location && !targeting.locations.includes(location)) {
      onChange({ ...targeting, locations: [...targeting.locations, location] });
      setLocationInput('');
    }
  };

  const removeLocation = (location: string) => {
    onChange({ ...targeting, locations: targeting.locations.filter((l) => l !== location) });
  };

  const addInterest = (interest: string) => {
    if (interest && !targeting.interests.includes(interest)) {
      onChange({ ...targeting, interests: [...targeting.interests, interest] });
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    onChange({ ...targeting, interests: targeting.interests.filter((i) => i !== interest) });
  };

  const addBehavior = (behavior: string) => {
    if (behavior && !targeting.behaviors.includes(behavior)) {
      onChange({ ...targeting, behaviors: [...targeting.behaviors, behavior] });
      setBehaviorInput('');
    }
  };

  const removeBehavior = (behavior: string) => {
    onChange({ ...targeting, behaviors: targeting.behaviors.filter((b) => b !== behavior) });
  };

  const estimatedReach = () => {
    let base = 1000000;
    if (targeting.locations.length > 0) base *= 0.3;
    const ageRange = targeting.ageMax - targeting.ageMin;
    base *= ageRange / 47;
    if (targeting.interests.length > 0) base *= 0.5;
    if (targeting.behaviors.length > 0) base *= 0.7;
    return Math.round(base);
  };

  return (
    <div className="space-y-6">
      {/* Locations */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Icon name="map-pin" className="w-5 h-5" />
          Locations
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Target specific cities or regions
        </p>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter city or country"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLocation(locationInput);
                }
              }}
            />
            <button
              onClick={() => addLocation(locationInput)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              <Icon name="plus" className="w-5 h-5" />
            </button>
          </div>

          {targeting.locations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {targeting.locations.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                >
                  {location}
                  <button onClick={() => removeLocation(location)}>
                    <Icon name="x" className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 mb-2">Popular locations:</p>
            <div className="flex flex-wrap gap-2">
              {popularLocations
                .filter((loc) => !targeting.locations.includes(loc))
                .map((location) => (
                  <button
                    key={location}
                    onClick={() => addLocation(location)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    + {location}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Age Range */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Icon name="users" className="w-5 h-5" />
          Age Range
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Minimum Age"
            type="number"
            value={targeting.ageMin}
            onChange={(e) => onChange({ ...targeting, ageMin: parseInt(e.target.value) || 18 })}
            min={13}
            max={65}
          />
          <Input
            label="Maximum Age"
            type="number"
            value={targeting.ageMax}
            onChange={(e) => onChange({ ...targeting, ageMax: parseInt(e.target.value) || 65 })}
            min={18}
            max={65}
          />
        </div>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Targeting ages {targeting.ageMin} - {targeting.ageMax}
        </div>
      </Card>

      {/* Interests */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Icon name="heart" className="w-5 h-5" />
          Interests
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Target people based on their interests
        </p>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              placeholder="Enter interest"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addInterest(interestInput);
                }
              }}
            />
            <button
              onClick={() => addInterest(interestInput)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              <Icon name="plus" className="w-5 h-5" />
            </button>
          </div>

          {targeting.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {targeting.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                >
                  {interest}
                  <button onClick={() => removeInterest(interest)}>
                    <Icon name="x" className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 mb-2">Popular interests:</p>
            <div className="flex flex-wrap gap-2">
              {popularInterests
                .filter((int) => !targeting.interests.includes(int))
                .map((interest) => (
                  <button
                    key={interest}
                    onClick={() => addInterest(interest)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    + {interest}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Behaviors */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Icon name="activity" className="w-5 h-5" />
          Behaviors
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Target based on user behaviors and activities
        </p>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={behaviorInput}
              onChange={(e) => setBehaviorInput(e.target.value)}
              placeholder="Enter behavior"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addBehavior(behaviorInput);
                }
              }}
            />
            <button
              onClick={() => addBehavior(behaviorInput)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              <Icon name="plus" className="w-5 h-5" />
            </button>
          </div>

          {targeting.behaviors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {targeting.behaviors.map((behavior) => (
                <span
                  key={behavior}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                >
                  {behavior}
                  <button onClick={() => removeBehavior(behavior)}>
                    <Icon name="x" className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 mb-2">Popular behaviors:</p>
            <div className="flex flex-wrap gap-2">
              {popularBehaviors
                .filter((beh) => !targeting.behaviors.includes(beh))
                .map((behavior) => (
                  <button
                    key={behavior}
                    onClick={() => addBehavior(behavior)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    + {behavior}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Estimated Reach */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="target" className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Estimated Audience Reach
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {estimatedReach().toLocaleString()}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              people match your targeting criteria
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
