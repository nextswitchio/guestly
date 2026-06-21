'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import type { EmailTemplate } from './EmailTemplateLibrary';

interface OrganizerEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  image?: string;
  attendeeCount: number;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  eventId: string;
  engagementLevel: 'high' | 'medium' | 'low';
  lastInteraction: number;
}

interface EmailCampaignComposerProps {
  organizerId: string;
  template: EmailTemplate;
  onBack: () => void;
  onSend: (data: CampaignSendData) => void;
}

export interface CampaignSendData {
  templateId: string;
  subject: string;
  previewText: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  recipientType: 'all-attendees' | 'event-specific' | 'past-engagers' | 'custom-list';
  eventId?: string;
  engagementFilter?: 'all' | 'high' | 'medium' | 'low';
  ticketTypeFilter?: string;
  scheduledAt?: number;
  sendImmediately: boolean;
  blocks: any[];
  estimatedRecipients: number;
}

const AVAILABLE_TAGS = [
  { tag: '{{attendee_name}}', label: 'Attendee Name', category: 'Recipient' },
  { tag: '{{attendee_email}}', label: 'Attendee Email', category: 'Recipient' },
  { tag: '{{ticket_type}}', label: 'Ticket Type', category: 'Recipient' },
  { tag: '{{event_name}}', label: 'Event Name', category: 'Event' },
  { tag: '{{event_date}}', label: 'Event Date', category: 'Event' },
  { tag: '{{event_time}}', label: 'Event Time', category: 'Event' },
  { tag: '{{event_location}}', label: 'Event Location', category: 'Event' },
  { tag: '{{event_image}}', label: 'Event Image URL', category: 'Event' },
  { tag: '{{organizer_name}}', label: 'Organizer Name', category: 'Organizer' },
  { tag: '{{ticket_link}}', label: 'Ticket Purchase Link', category: 'Event' },
  { tag: '{{tickets_remaining}}', label: 'Tickets Remaining', category: 'Event' },
  { tag: '{{discount_code}}', label: 'Discount Code', category: 'Promo' },
  { tag: '{{promo_code}}', label: 'Promo Code', category: 'Promo' },
  { tag: '{{order_id}}', label: 'Order ID', category: 'Transaction' },
];

// Mock data — replace with real API calls
function mockFetchEvents(): Promise<OrganizerEvent[]> {
  return Promise.resolve([
    { id: 'evt-1', name: 'Lagos Music Festival 2026', date: '2026-07-15', location: 'Eko Convention Centre, Lagos', image: '/events/music-fest.jpg', attendeeCount: 1240 },
    { id: 'evt-2', name: 'Tech Summit Abuja', date: '2026-08-20', location: 'International Conference Centre, Abuja', image: '/events/tech-summit.jpg', attendeeCount: 580 },
    { id: 'evt-3', name: 'Accra Art & Culture Night', date: '2026-06-10', location: 'Alliance Francaise, Accra', image: '/events/art-night.jpg', attendeeCount: 320 },
    { id: 'evt-4', name: 'Nairobi Startup Mixer', date: '2026-09-05', location: 'Kenyatta Convention Centre, Nairobi', image: '/events/startup-mixer.jpg', attendeeCount: 210 },
  ]);
}

function mockFetchAttendees(): Promise<Attendee[]> {
  return Promise.resolve([
    { id: 'att-1', name: 'Emeka Obi', email: 'emeka@example.com', ticketType: 'VIP', eventId: 'evt-1', engagementLevel: 'high', lastInteraction: Date.now() - 86400000 },
    { id: 'att-2', name: 'Amara Okafor', email: 'amara@example.com', ticketType: 'Regular', eventId: 'evt-1', engagementLevel: 'medium', lastInteraction: Date.now() - 172800000 },
    { id: 'att-3', name: 'Kofi Mensah', email: 'kofi@example.com', ticketType: 'VIP', eventId: 'evt-2', engagementLevel: 'high', lastInteraction: Date.now() - 3600000 },
    { id: 'att-4', name: 'Nala Kimani', email: 'nala@example.com', ticketType: 'Regular', eventId: 'evt-2', engagementLevel: 'low', lastInteraction: Date.now() - 604800000 },
    { id: 'att-5', name: 'Fatima Hassan', email: 'fatima@example.com', ticketType: 'Early Bird', eventId: 'evt-3', engagementLevel: 'high', lastInteraction: Date.now() - 7200000 },
    { id: 'att-6', name: 'David Mwangi', email: 'david@example.com', ticketType: 'Regular', eventId: 'evt-3', engagementLevel: 'medium', lastInteraction: Date.now() - 259200000 },
    { id: 'att-7', name: 'Zara Adeyemi', email: 'zara@example.com', ticketType: 'VIP', eventId: 'evt-1', engagementLevel: 'high', lastInteraction: Date.now() - 1800000 },
    { id: 'att-8', name: 'Tunde Bakare', email: 'tunde@example.com', ticketType: 'Regular', eventId: 'evt-4', engagementLevel: 'low', lastInteraction: Date.now() - 1209600000 },
  ]);
}

export function EmailCampaignComposer({ organizerId, template, onBack, onSend }: EmailCampaignComposerProps) {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState(template.subject);
  const [previewText, setPreviewText] = useState('');
  const [fromName, setFromName] = useState('Guestly Events');
  const [fromEmail, setFromEmail] = useState('noreply@guestly.com');
  const [replyTo, setReplyTo] = useState('');
  const [recipientType, setRecipientType] = useState<CampaignSendData['recipientType']>('event-specific');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [engagementFilter, setEngagementFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [ticketTypeFilter, setTicketTypeFilter] = useState('');
  const [sendImmediately, setSendImmediately] = useState(true);
  const [scheduledAt, setScheduledAt] = useState<number | undefined>(undefined);
  const [blocks, setBlocks] = useState(template.blocks);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [tagInsertTarget, setTagInsertTarget] = useState<'subject' | 'body' | null>(null);

  useEffect(() => {
    Promise.all([mockFetchEvents(), mockFetchAttendees()]).then(([evts, atts]) => {
      setEvents(evts);
      setAttendees(atts);
      setLoading(false);
      if (evts.length > 0) setSelectedEventId(evts[0].id);
    });
  }, []);

  const selectedEvent = events.find(e => e.id === selectedEventId);

  const filteredAttendees = useMemo(() => {
    let result = attendees;
    if (recipientType === 'event-specific' && selectedEventId) {
      result = result.filter(a => a.eventId === selectedEventId);
    }
    if (recipientType === 'past-engagers') {
      result = result.filter(a => a.engagementLevel === 'high' || a.engagementLevel === 'medium');
    }
    if (engagementFilter !== 'all') {
      result = result.filter(a => a.engagementLevel === engagementFilter);
    }
    if (ticketTypeFilter) {
      result = result.filter(a => a.ticketType === ticketTypeFilter);
    }
    return result;
  }, [attendees, recipientType, selectedEventId, engagementFilter, ticketTypeFilter]);

  const ticketTypes = useMemo(() => {
    const types = new Set(filteredAttendees.map(a => a.ticketType));
    return Array.from(types);
  }, [filteredAttendees]);

  const insertTag = (tag: string) => {
    if (tagInsertTarget === 'subject') {
      setSubject(prev => prev + tag);
    } else {
      // For body blocks, append to first text block
      const textBlockIndex = blocks.findIndex(b => b.type === 'text');
      if (textBlockIndex !== -1) {
        const updated = [...blocks];
        updated[textBlockIndex] = { ...updated[textBlockIndex], content: updated[textBlockIndex].content + ' ' + tag };
        setBlocks(updated);
      }
    }
    setShowTagPicker(false);
    setTagInsertTarget(null);
  };

  const replaceTags = (text: string, event?: OrganizerEvent, attendee?: Attendee) => {
    let result = text;
    const evt = event || selectedEvent;
    const att = attendee || filteredAttendees[0];
    result = result.replace(/{{attendee_name}}/g, att?.name || 'Valued Guest');
    result = result.replace(/{{attendee_email}}/g, att?.email || '');
    result = result.replace(/{{ticket_type}}/g, att?.ticketType || '');
    result = result.replace(/{{event_name}}/g, evt?.name || '');
    result = result.replace(/{{event_date}}/g, evt ? new Date(evt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '');
    result = result.replace(/{{event_time}}/g, '7:00 PM');
    result = result.replace(/{{event_location}}/g, evt?.location || '');
    result = result.replace(/{{event_image}}/g, evt?.image || '');
    result = result.replace(/{{organizer_name}}/g, fromName);
    result = result.replace(/{{ticket_link}}/g, evt ? `https://guestly.com/events/${evt.id}` : '');
    result = result.replace(/{{tickets_remaining}}/g, String(Math.floor(Math.random() * 200 + 50)));
    result = result.replace(/{{discount_code}}/g, 'GUESTLY20');
    result = result.replace(/{{promo_code}}/g, 'EARLYBIRD');
    result = result.replace(/{{order_id}}/g, 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase());
    return result;
  };

  const handleSend = () => {
    onSend({
      templateId: template.id,
      subject,
      previewText,
      fromName,
      fromEmail,
      replyTo,
      recipientType,
      eventId: selectedEventId,
      engagementFilter,
      ticketTypeFilter,
      scheduledAt,
      sendImmediately,
      blocks,
      estimatedRecipients: filteredAttendees.length,
    });
  };

  const steps = [
    { num: 1, title: 'Recipients' },
    { num: 2, title: 'Compose' },
    { num: 3, title: 'Preview' },
    { num: 4, title: 'Send' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors">
            <Icon name="arrow-left" className="w-5 h-5 text-neutral-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Send Email Campaign</h2>
            <p className="text-sm text-neutral-500">Using template: <span className="font-medium text-lime">{template.name}</span></p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 flex-1 ${step >= s.num ? 'text-lime' : 'text-neutral-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s.num ? 'bg-lime text-dark' : 'bg-neutral-100 text-neutral-400'
                }`}>
                  {step > s.num ? <Icon name="check" className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{s.title}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 ${step > s.num ? 'bg-lime' : 'bg-neutral-200'}`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step 1: Recipients */}
      {step === 1 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-1">Choose Recipients</h3>
          <p className="text-sm text-neutral-500 mb-6">Select who will receive this email campaign</p>

          <div className="space-y-4">
            {/* Recipient Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: 'event-specific' as const, label: 'Event Attendees', desc: 'Target attendees of a specific event', icon: 'calendar' },
                { value: 'all-attendees' as const, label: 'All Attendees', desc: 'Everyone who has ever bought a ticket', icon: 'users' },
                { value: 'past-engagers' as const, label: 'Past Engagers', desc: 'People who interacted with your events', icon: 'star' },
                { value: 'custom-list' as const, label: 'Custom Filter', desc: 'Filter by engagement or ticket type', icon: 'filter' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setRecipientType(opt.value)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    recipientType === opt.value
                      ? 'border-lime bg-lime/5'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    recipientType === opt.value ? 'bg-lime text-dark' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    <Icon name={opt.icon as any} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-neutral-900">{opt.label}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Event Selector */}
            {recipientType === 'event-specific' && (
              <div className="mt-4 p-4 bg-neutral-50 rounded-xl space-y-3">
                <label className="block text-sm font-medium text-neutral-700">Select Event</label>
                <select
                  value={selectedEventId}
                  onChange={e => setSelectedEventId(e.target.value)}
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-white text-neutral-900 px-3.5 text-sm"
                >
                  {events.map(evt => (
                    <option key={evt.id} value={evt.id}>
                      {evt.name} — {evt.attendeeCount} attendees
                    </option>
                  ))}
                </select>
                {selectedEvent && (
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Icon name="calendar" className="w-3.5 h-3.5" />
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="location" className="w-3.5 h-3.5" />
                      {selectedEvent.location}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Filters */}
            {(recipientType === 'custom-list' || recipientType === 'event-specific') && (
              <div className="mt-4 p-4 bg-neutral-50 rounded-xl space-y-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Engagement Level</label>
                  <select
                    value={engagementFilter}
                    onChange={e => setEngagementFilter(e.target.value as any)}
                    className="w-full h-10 rounded-xl border border-neutral-200 bg-white text-neutral-900 px-3.5 text-sm"
                  >
                    <option value="all">All levels</option>
                    <option value="high">High engagement</option>
                    <option value="medium">Medium engagement</option>
                    <option value="low">Low engagement</option>
                  </select>
                </div>
                {ticketTypes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Ticket Type</label>
                    <select
                      value={ticketTypeFilter}
                      onChange={e => setTicketTypeFilter(e.target.value)}
                      className="w-full h-10 rounded-xl border border-neutral-200 bg-white text-neutral-900 px-3.5 text-sm"
                    >
                      <option value="">All ticket types</option>
                      {ticketTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Recipient Count */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-lime/10 border border-lime/20">
              <div className="flex items-center gap-2">
                <Icon name="users" className="w-5 h-5 text-lime" />
                <span className="text-sm font-medium text-dark">Estimated Recipients</span>
              </div>
              <span className="text-2xl font-black text-dark">{filteredAttendees.length}</span>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={() => setStep(2)}>
              Next: Compose
              <Icon name="arrow-right" className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Compose */}
      {step === 2 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-1">Compose Email</h3>
          <p className="text-sm text-neutral-500 mb-6">Customize your subject line and message content</p>

          <div className="space-y-5">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Subject Line</label>
              <div className="flex gap-2">
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="flex-1 h-10 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 px-3.5 text-sm"
                  placeholder="Enter subject line..."
                />
                <button
                  onClick={() => { setTagInsertTarget('subject'); setShowTagPicker(!showTagPicker); }}
                  className="h-10 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-medium text-lime hover:bg-neutral-100 transition-colors"
                >
                  {'{{ }}'}
                </button>
              </div>
            </div>

            {/* Preview Text */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Preview Text</label>
              <input
                value={previewText}
                onChange={e => setPreviewText(e.target.value)}
                className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 px-3.5 text-sm"
                placeholder="Shown in inbox preview (optional)"
              />
            </div>

            {/* From */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">From Name</label>
                <input
                  value={fromName}
                  onChange={e => setFromName(e.target.value)}
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 px-3.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">From Email</label>
                <input
                  value={fromEmail}
                  onChange={e => setFromEmail(e.target.value)}
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 px-3.5 text-sm"
                  type="email"
                />
              </div>
            </div>

            {/* Reply To */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Reply-To Email</label>
              <input
                value={replyTo}
                onChange={e => setReplyTo(e.target.value)}
                className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 px-3.5 text-sm"
                type="email"
                placeholder="Same as from email if empty"
              />
            </div>

            {/* Tag Picker */}
            {showTagPicker && (
              <div className="p-4 rounded-xl border border-lime/30 bg-lime/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-dark">Insert Dynamic Tag</span>
                  <button onClick={() => setShowTagPicker(false)} className="text-neutral-400 hover:text-neutral-600">
                    <Icon name="x" className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_TAGS.map(t => (
                    <button
                      key={t.tag}
                      onClick={() => insertTag(t.tag)}
                      className="flex flex-col items-start p-2 rounded-lg bg-white border border-neutral-200 hover:border-lime hover:bg-lime/5 transition-colors group"
                    >
                      <code className="text-xs font-mono text-lime group-hover:text-dark">{t.tag}</code>
                      <span className="text-[10px] text-neutral-400">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Body Preview */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Message Content</label>
              <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
                <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-500">Template Preview</span>
                  <button
                    onClick={() => { setTagInsertTarget('body'); setShowTagPicker(!showTagPicker); }}
                    className="text-xs font-medium text-lime hover:text-lime-hover"
                  >
                    Insert Tag
                  </button>
                </div>
                <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                  {blocks.map(block => (
                    <div key={block.id} className="text-sm">
                      {block.type === 'header' && (
                        <h4 className="text-lg font-bold text-neutral-900">{block.content}</h4>
                      )}
                      {block.type === 'text' && (
                        <textarea
                          value={block.content}
                          onChange={e => {
                            const updated = blocks.map(b => b.id === block.id ? { ...b, content: e.target.value } : b);
                            setBlocks(updated);
                          }}
                          className="w-full min-h-[80px] p-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 text-sm resize-y"
                        />
                      )}
                      {block.type === 'button' && (
                        <div className="text-center">
                          <input
                            value={block.content}
                            onChange={e => {
                              const updated = blocks.map(b => b.id === block.id ? { ...b, content: e.target.value } : b);
                              setBlocks(updated);
                            }}
                            className="inline-block px-6 py-2 rounded-xl bg-lime text-dark text-sm font-semibold"
                          />
                        </div>
                      )}
                      {block.type === 'divider' && <hr className="border-neutral-200" />}
                      {block.type === 'image' && (
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <Icon name="camera" className="w-4 h-4" />
                          <span className="truncate">{block.content}</span>
                        </div>
                      )}
                      {block.type === 'footer' && (
                        <p className="text-xs text-neutral-400 text-center">{block.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(1)}>
              <Icon name="arrow-left" className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setStep(3)}>
              Next: Preview
              <Icon name="arrow-right" className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-1">Preview Email</h3>
          <p className="text-sm text-neutral-500 mb-6">See how your email will look with real data</p>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
            {/* Email Header */}
            <div className="bg-dark px-6 py-4">
              <div className="text-sm text-white/60">
                From: <span className="text-white font-medium">{fromName}</span> &lt;{fromEmail}&gt;
              </div>
              <div className="text-sm text-white/60 mt-1">
                Subject: <span className="text-white font-medium">{replaceTags(subject)}</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-8 space-y-4">
              {blocks.map(block => (
                <div key={block.id}>
                  {block.type === 'header' && (
                    <h2 className="text-2xl font-bold text-neutral-900">{replaceTags(block.content)}</h2>
                  )}
                  {block.type === 'text' && (
                    <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">{replaceTags(block.content)}</p>
                  )}
                  {block.type === 'button' && (
                    <div className="text-center">
                      <span className="inline-block px-8 py-3 rounded-xl bg-lime text-dark font-semibold">
                        {replaceTags(block.content)}
                      </span>
                    </div>
                  )}
                  {block.type === 'divider' && <hr className="border-neutral-200" />}
                  {block.type === 'image' && block.content && (
                    <img src={block.content} alt="" className="w-full rounded-lg" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                  {block.type === 'footer' && (
                    <p className="text-xs text-neutral-400 text-center">{block.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recipient Summary */}
          <div className="mt-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-neutral-700">Sending to</span>
                <span className="text-2xl font-black text-dark ml-2">{filteredAttendees.length}</span>
                <span className="text-sm text-neutral-500 ml-1">recipients</span>
              </div>
              <div className="text-right text-xs text-neutral-500">
                <div>{recipientType === 'event-specific' ? selectedEvent?.name : recipientType}</div>
                {engagementFilter !== 'all' && <div>Engagement: {engagementFilter}</div>}
                {ticketTypeFilter && <div>Ticket type: {ticketTypeFilter}</div>}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(2)}>
              <Icon name="arrow-left" className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setStep(4)}>
              Next: Review & Send
              <Icon name="arrow-right" className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Review & Send */}
      {step === 4 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-1">Review & Send</h3>
          <p className="text-sm text-neutral-500 mb-6">Confirm details before sending your campaign</p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-2xl">
              <div>
                <div className="text-xs text-neutral-500">Recipients</div>
                <div className="font-semibold">{filteredAttendees.length} people</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Subject</div>
                <div className="font-semibold text-sm">{replaceTags(subject)}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Template</div>
                <div className="font-semibold">{template.name}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">From</div>
                <div className="font-semibold text-sm">{fromName}</div>
              </div>
            </div>

            {/* Schedule */}
            <div className="p-4 bg-neutral-50 rounded-2xl space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={sendImmediately}
                  onChange={() => { setSendImmediately(true); setScheduledAt(undefined); }}
                  className="w-4 h-4 border-neutral-200 text-lime focus:ring-lime/20"
                />
                <div>
                  <div className="font-medium text-sm">Send Immediately</div>
                  <div className="text-xs text-neutral-500">Campaign will be sent right away</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={!sendImmediately}
                  onChange={() => setSendImmediately(false)}
                  className="w-4 h-4 border-neutral-200 text-lime focus:ring-lime/20"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">Schedule for Later</div>
                  {!sendImmediately && (
                    <input
                      type="datetime-local"
                      value={scheduledAt ? new Date(scheduledAt).toISOString().slice(0, 16) : ''}
                      onChange={e => setScheduledAt(new Date(e.target.value).getTime())}
                      className="mt-2 w-full h-10 rounded-xl border border-neutral-200 bg-white text-neutral-900 px-3.5 text-sm"
                    />
                  )}
                </div>
              </label>
            </div>

            {/* Warning */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="flex gap-3">
                <Icon name="bell" className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <div className="font-medium mb-1">Before you send</div>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Check subject line for typos</li>
                    <li>Verify recipient count is correct</li>
                    <li>Ensure all tags resolve properly</li>
                    <li>Test links in the preview above</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(3)}>
              <Icon name="arrow-left" className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleSend}>
              <Icon name="rocket" className="w-4 h-4 mr-2" />
              {sendImmediately ? 'Send Campaign' : 'Schedule Campaign'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
