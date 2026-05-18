'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Icon from '@/components/ui/Icon';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'announcement' | 'reminder' | 'follow-up' | 'promotional' | 'transactional';
  thumbnail: string;
  description: string;
  blocks: any[];
  createdAt: number;
  isCustom: boolean;
}

interface EmailTemplateLibraryProps {
  templates: EmailTemplate[];
  onSelectTemplate: (template: EmailTemplate) => void;
  onCreateNew: () => void;
  onDeleteTemplate?: (templateId: string) => void;
}

const PRESET_TEMPLATES: EmailTemplate[] = [
  {
    id: 'preset-1',
    name: 'Event Announcement',
    subject: 'Exciting News: {{event_name}} is Coming!',
    category: 'announcement',
    thumbnail: '/templates/announcement.png',
    description: 'Perfect for announcing new events to your audience',
    blocks: [
      { id: '1', type: 'header', content: '{{event_name}}' },
      { id: '2', type: 'image', content: '{{event_image}}' },
      { id: '3', type: 'text', content: 'We\'re thrilled to announce {{event_name}} happening on {{event_date}} at {{event_location}}!' },
      { id: '4', type: 'button', content: 'Get Your Tickets' },
      { id: '5', type: 'footer', content: '© 2024 Guestly. All rights reserved.' },
    ],
    createdAt: Date.now(),
    isCustom: false,
  },
  {
    id: 'preset-2',
    name: 'Event Reminder',
    subject: 'Don\'t Forget: {{event_name}} is Tomorrow!',
    category: 'reminder',
    thumbnail: '/templates/reminder.png',
    description: 'Remind attendees about upcoming events',
    blocks: [
      { id: '1', type: 'header', content: 'See You Tomorrow!' },
      { id: '2', type: 'text', content: 'This is a friendly reminder that {{event_name}} is happening tomorrow at {{event_time}}.' },
      { id: '3', type: 'text', content: 'Location: {{event_location}}' },
      { id: '4', type: 'button', content: 'View Event Details' },
      { id: '5', type: 'footer', content: '© 2024 Guestly. All rights reserved.' },
    ],
    createdAt: Date.now(),
    isCustom: false,
  },
  {
    id: 'preset-3',
    name: 'Last Chance',
    subject: 'Last Chance: {{event_name}} Tickets Selling Fast!',
    category: 'promotional',
    thumbnail: '/templates/last-chance.png',
    description: 'Create urgency for events with limited tickets',
    blocks: [
      { id: '1', type: 'header', content: 'Last Chance!' },
      { id: '2', type: 'text', content: 'Only {{tickets_remaining}} tickets left for {{event_name}}!' },
      { id: '3', type: 'image', content: '{{event_image}}' },
      { id: '4', type: 'text', content: 'Don\'t miss out on this incredible event. Secure your spot now!' },
      { id: '5', type: 'button', content: 'Buy Tickets Now' },
      { id: '6', type: 'footer', content: '© 2024 Guestly. All rights reserved.' },
    ],
    createdAt: Date.now(),
    isCustom: false,
  },
  {
    id: 'preset-4',
    name: 'Thank You',
    subject: 'Thank You for Attending {{event_name}}!',
    category: 'follow-up',
    thumbnail: '/templates/thank-you.png',
    description: 'Follow up with attendees after the event',
    blocks: [
      { id: '1', type: 'header', content: 'Thank You!' },
      { id: '2', type: 'text', content: 'We hope you enjoyed {{event_name}}! Your presence made it special.' },
      { id: '3', type: 'text', content: 'We\'d love to hear your feedback. Please take a moment to rate your experience.' },
      { id: '4', type: 'button', content: 'Leave a Review' },
      { id: '5', type: 'divider', content: '' },
      { id: '6', type: 'text', content: 'Stay tuned for more exciting events!' },
      { id: '7', type: 'footer', content: '© 2024 Guestly. All rights reserved.' },
    ],
    createdAt: Date.now(),
    isCustom: false,
  },
  {
    id: 'preset-5',
    name: 'Early Bird Special',
    subject: 'Early Bird Discount: Save on {{event_name}}!',
    category: 'promotional',
    thumbnail: '/templates/early-bird.png',
    description: 'Promote early bird discounts and special offers',
    blocks: [
      { id: '1', type: 'header', content: 'Early Bird Special!' },
      { id: '2', type: 'text', content: 'Get {{discount_percentage}}% off tickets to {{event_name}} when you book before {{deadline}}!' },
      { id: '3', type: 'image', content: '{{event_image}}' },
      { id: '4', type: 'text', content: 'Use code: {{promo_code}}' },
      { id: '5', type: 'button', content: 'Claim Your Discount' },
      { id: '6', type: 'footer', content: '© 2024 Guestly. All rights reserved.' },
    ],
    createdAt: Date.now(),
    isCustom: false,
  },
  {
    id: 'preset-6',
    name: 'Ticket Confirmation',
    subject: 'Your Tickets for {{event_name}}',
    category: 'transactional',
    thumbnail: '/templates/confirmation.png',
    description: 'Send ticket confirmations to purchasers',
    blocks: [
      { id: '1', type: 'header', content: 'Ticket Confirmed!' },
      { id: '2', type: 'text', content: 'Thank you for purchasing tickets to {{event_name}}!' },
      { id: '3', type: 'text', content: 'Event Details:\nDate: {{event_date}}\nTime: {{event_time}}\nLocation: {{event_location}}' },
      { id: '4', type: 'button', content: 'View Your Tickets' },
      { id: '5', type: 'divider', content: '' },
      { id: '6', type: 'text', content: 'Order #{{order_id}}' },
      { id: '7', type: 'footer', content: '© 2024 Guestly. All rights reserved.' },
    ],
    createdAt: Date.now(),
    isCustom: false,
  },
];

export function EmailTemplateLibrary({ 
  templates, 
  onSelectTemplate, 
  onCreateNew,
  onDeleteTemplate 
}: EmailTemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allTemplates = [...PRESET_TEMPLATES, ...templates];

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'reminder', label: 'Reminders' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'follow-up', label: 'Follow-ups' },
    { value: 'transactional', label: 'Transactional' },
  ];

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'reminder': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'promotional': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'follow-up': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'transactional': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Templates</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Choose from pre-designed templates or create your own
          </p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Icon name="plus" className="w-4 h-4" />
          Create New Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] transition-all"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="p-12 text-center">
          <Icon name="document" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filters
          </p>
          <Button onClick={onCreateNew} variant="outline">
            Create New Template
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center">
                <Icon name="megaphone" className="w-16 h-16 text-primary-600 dark:text-primary-400" />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {template.description}
                    </p>
                  </div>
                  {template.isCustom && onDeleteTemplate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this template?')) {
                          onDeleteTemplate(template.id);
                        }
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Icon name="x" className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                  {!template.isCustom && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                      Preset
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Subject: {template.subject}
                </div>

                <Button
                  onClick={() => onSelectTemplate(template)}
                  variant="outline"
                  className="w-full"
                >
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
