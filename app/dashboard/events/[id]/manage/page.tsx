'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  RefreshCw, XCircle, Edit, Eye, Ticket, Users, BarChart2,
  Megaphone, UserCheck, CheckCircle, AlertCircle,
  Clock, Ban, Play, ChevronDown, Plus, Trash2, Send, Star,
  MapPin, Calendar, Tag, Globe, Layers, Check, Handshake,
  ClipboardList, Sparkles, Mail, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import MobileTabs from '@/components/ui/MobileTabs';
import { useToast } from '@/components/ui/ToastProvider';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ticket {
  id: string;
  name: string;
  ticket_type: string;
  price: number;
  available: number;
  total: number;
  is_active: boolean;
}

interface VendorInvitation {
  id: string;
  vendor_id: string;
  status: string;
  created_at: string;
}

interface BudgetItem {
  id: string;
  label: string;
  amount: number;
  category: string;
  paid: boolean;
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  response: string | null;
  created_at: string;
}

interface Vendor {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  category: string;
  city?: string;
  rating: number;
  pricing?: string;
  contactEmail?: string;
  contactPhone?: string;
  completedEvents?: number;
  reviewCount?: number;
  portfolio?: string[];
  rateCard?: string;
  services?: string[];
  status?: string;
  subscriptionPlan?: string;
  review_count?: number;
  completed_events?: number;
}

interface ServiceProfile {
  id: string;
  vendorId?: string;
  vendor_id?: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  pricing: string;
  pricingModel?: string;
  pricing_model?: string;
  minBudget?: number;
  min_budget?: number;
  maxBudget?: number;
  max_budget?: number;
  bannerImage?: string;
  banner_image?: string;
  rateCardUrl?: string;
  rate_card_url?: string;
  portfolioUrl?: string;
  portfolio_url?: string;
  socialUrl?: string;
  social_url?: string;
  images?: string[];
  tags?: string[];
  isActive?: boolean;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  end_date: string | null;
  venue: string | null;
  city: string;
  state: string | null;
  country: string;
  status: string;
  event_type: string;
  category: string;
  image: string | null;
  banner_image: string | null;
  is_featured: boolean;
  capacity: number | null;
  tags: string[];
  organizer_id: string;
  tickets: Ticket[];
}

interface InfluencerCollab {
  id: string;
  eventId: string;
  influencerId: string;
  influencerName: string;
  influencerPlatform?: string;
  influencerHandle?: string;
  status: string;
  compensationType: string;
  compensationAmount?: number;
  commissionRate?: number;
  freeTicketCount?: number;
  trackingCode?: string;
  promoCode?: string;
  invitedAt?: string | number;
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const getDefaultTemplate = (template: string): string => {
  const templates: Record<string, string> = {
    checklist: `EVENT CHECKLIST

PRE-EVENT (4-6 weeks before)
☐ Confirm venue and capacity
☐ Finalize date and time
☐ Create event page and description
☐ Set up ticketing system
☐ Plan marketing strategy
☐ Identify key vendors (catering, AV, security)

VENDOR COORDINATION (2-3 weeks before)
☐ Confirm all vendor contracts
☐ Share event timeline with vendors
☐ Arrange delivery schedules
☐ Confirm staffing needs
☐ Plan logistics and parking

MARKETING & PROMOTION (Throughout)
☐ Create social media calendar
☐ Launch email campaigns
☐ Reach out to key stakeholders
☐ Create event graphics and materials
☐ Monitor ticket sales

EVENT DAY PREPARATION
☐ Arrive early for setup
☐ Do sound and AV checks
☐ Set up registration/check-in
☐ Brief staff on their roles
☐ Test all systems

POST-EVENT
☐ Thank attendees and vendors
☐ Collect feedback and reviews
☐ Process payments and settlements
☐ Archive event materials
☐ Plan next event`,
    timeline: `EVENT TIMELINE

Weeks 12-10: Planning Phase
- Finalize event concept and goals
- Reserve venue and date
- Create budget

Weeks 8-6: Development Phase
- Design event marketing materials
- Launch ticket sales
- Begin vendor outreach
- Set up event website/page

Weeks 4-2: Promotion Phase
- Heavy marketing push
- Vendor confirmations
- Attendee communication
- Staff recruitment

Week 1: Final Preparations
- Confirm all logistics
- Final vendor checks
- Setup and rehearsals
- Staff briefing

Event Day
- Doors open 30 min early
- Welcome attendees
- Execute program
- Monitor operations

Post-Event (Within 1 week)
- Send thank you messages
- Collect feedback
- Process settlements`,
    vendor: `VENDOR COORDINATION PLAN

VENDOR CATEGORIES
1. Catering & Beverages
2. Sound & Lighting (AV)
3. Security & Safety
4. Photography/Videography
5. Decoration & Setup
6. Transportation & Parking

VENDOR COMMUNICATION TIMELINE
T-30 days: Initial contact and proposal review
T-21 days: Confirm and sign contracts
T-14 days: Share detailed event brief
T-7 days: Final coordination and timeline
T-1 day: Confirm arrival times and logistics
Day of event: Check-ins and support

ESSENTIAL INFORMATION TO SHARE
- Event date, time, and location
- Expected attendance
- Load-in and setup times
- Technical requirements
- Emergency contacts
- Parking and access instructions

CONTINGENCY PLANNING
- Have backup vendors identified
- Confirm cancellation policies
- Maintain emergency contact list
- Plan for weather/technical issues`,
    marketing: `MARKETING STRATEGY

TARGET AUDIENCE
- Primary: [Define your main attendee]
- Secondary: [Additional audience]

MARKETING CHANNELS
- Social Media (Facebook, Instagram, TikTok, Twitter)
- Email Marketing
- Word of Mouth & Referrals
- Influencer Partnerships
- Press & Media Coverage
- Paid Advertising (budget: ₦___)

CONTENT CALENDAR
Week 1-2: Awareness phase - Teasers and announcements
Week 3-4: Interest phase - Event details and benefits
Week 5-6: Decision phase - Social proof and limited offers
Week 7-8: Action phase - Urgency and final push

KEY MESSAGING
- Event benefits and unique value
- Speaker/entertainer highlights
- Testimonials and social proof
- Early bird and special offers

PROMOTION MILESTONES
- T-45 days: Soft launch
- T-30 days: Full campaign launch
- T-14 days: Retargeting campaign
- T-7 days: Final push
- T-3 days: Last call messaging`,
    runsheet: `EVENT RUN SHEET - [EVENT NAME]

VENUE: ___________________
DATE: ____________________
TIME: Start _____ End _____

SETUP & ARRIVAL (30 min before doors open)
Time | Task | Owner | Status
---- | ---- | ----- | ------
[  ] | Setup registration desk
[  ] | Test AV equipment
[  ] | Final walkthrough
[  ] | Brief all staff

EVENT TIMELINE
Time | Segment | Speaker/Lead | Duration | Notes
---- | ------- | ------------ | -------- | -----
[  ] | Doors open
[  ] | Welcome & intro
[  ] | Main program
[  ] | Q&A/Interaction
[  ] | Break
[  ] | Closing remarks
[  ] | Networking

CONTINGENCIES
- Weather delays: [Plan]
- Technical issues: [Contact: ___]
- Medical emergency: [Procedure]
- Late speakers: [Timeline]

CLOSING (Last 30 minutes)
[  ] | Wind down activities
[  ] | Final announcements
[  ] | Thank attendees
[  ] | Distribute materials

POST-EVENT
[  ] | Collect feedback
[  ] | Pack equipment
[  ] | Final venue check
[  ] | Settle with vendors`,
  };
  return templates[template] || 'Create your planning document here...';
};
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft:     { label: 'Draft',     color: 'bg-neutral-100 text-neutral-600', icon: <Clock className="w-3.5 h-3.5" /> },
  published: { label: 'Published', color: 'bg-lime-100 text-lime-700',       icon: <CheckCircle className="w-3.5 h-3.5" /> },
  ongoing:   { label: 'Ongoing',   color: 'bg-blue-100 text-blue-700',       icon: <Play className="w-3.5 h-3.5" /> },
  completed: { label: 'Completed', color: 'bg-purple-100 text-purple-700',   icon: <Star className="w-3.5 h-3.5" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700',         icon: <Ban className="w-3.5 h-3.5" /> },
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  draft:     ['published', 'cancelled'],
  published: ['ongoing', 'cancelled'],
  ongoing:   ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ event, id, onStatusChange, statusChanging }: {
  event: Event;
  id: string;
  onStatusChange: (s: string) => void;
  statusChanging: boolean;
}) {
  const router = useRouter();
  const transitions = STATUS_TRANSITIONS[event.status] ?? [];

  return (
    <div className="space-y-6">
      {/* Hero image + key info */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        {event.image && (
          <div className="relative h-48 w-full bg-neutral-100">
            <Image src={event.image} alt={event.title} fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <StatusBadge status={event.status} />
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
              <Layers className="w-3 h-3" />{event.event_type}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
              <Tag className="w-3 h-3" />{event.category}
            </span>
            {event.is_featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                <Star className="w-3 h-3" />Featured
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2 text-neutral-600">
              <Calendar className="w-4 h-4 mt-0.5 shrink-0 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">{new Date(event.date).toLocaleString()}</p>
                {event.end_date && <p className="text-xs text-neutral-500">Ends {new Date(event.end_date).toLocaleString()}</p>}
              </div>
            </div>
            <div className="flex items-start gap-2 text-neutral-600">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-neutral-400" />
              <p className="font-medium text-neutral-900">
                {[event.venue, event.city, event.state, event.country].filter(Boolean).join(', ')}
              </p>
            </div>
            {event.capacity && (
              <div className="flex items-center gap-2 text-neutral-600">
                <Users className="w-4 h-4 shrink-0 text-neutral-400" />
                <p><span className="font-medium text-neutral-900">{event.capacity}</span> capacity</p>
              </div>
            )}
            {event.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {event.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-neutral-100 rounded-full text-xs text-neutral-600">{t}</span>
                ))}
              </div>
            )}
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">{event.description}</p>
        </div>
      </div>

      {/* Status management */}
      {transitions.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Change Status</h3>
          <div className="flex flex-wrap gap-2">
            {transitions.map(s => (
              <Button key={s} variant="outline" size="sm" loading={statusChanging} onClick={() => onStatusChange(s)}>
                {STATUS_CONFIG[s]?.icon}
                <span className="ml-1.5">Set to {STATUS_CONFIG[s]?.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => router.push(`/dashboard/events/${id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />Edit Event
        </Button>
        <Button variant="outline" onClick={() => router.push(`/events/${id}`)}>
          <Eye className="w-4 h-4 mr-2" />View Public Page
        </Button>
      </div>
    </div>
  );
}

// ─── Tickets Tab ──────────────────────────────────────────────────────────────

function TicketsTab({ event, id, onRefresh }: { event: Event; id: string; onRefresh: () => void }) {
  const router = useRouter();
  const sold = event.tickets.reduce((s, t) => s + (t.total - t.available), 0);
  const revenue = event.tickets.reduce((s, t) => s + (t.total - t.available) * t.price, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Ticket Types', value: event.tickets.length },
          { label: 'Tickets Sold', value: sold },
          { label: 'Revenue', value: `₦${revenue.toLocaleString()}` },
        ].map(m => (
          <div key={m.label} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-xs text-neutral-500 mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-neutral-900">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Ticket list */}
      <div className="rounded-2xl border border-neutral-200 bg-white divide-y divide-neutral-100">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold text-neutral-900">Ticket Types</h3>
          <Button size="sm" onClick={() => router.push(`/dashboard/events/${id}/tickets`)}>
            <Plus className="w-4 h-4 mr-1" />Manage
          </Button>
        </div>
        {event.tickets.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">No tickets created yet.</div>
        ) : event.tickets.map(t => (
          <div key={t.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-neutral-900">{t.name}</p>
              <p className="text-xs text-neutral-500">{t.ticket_type} · {t.available}/{t.total} available</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-neutral-900">₦{t.price.toLocaleString()}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${t.is_active ? 'bg-lime-100 text-lime-700' : 'bg-neutral-100 text-neutral-500'}`}>
                {t.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Planning Tab ────────────────────────────────────────────────────────────

const PLANNING_TEMPLATES = [
  { id: 'checklist', name: 'Event Checklist', desc: 'Pre-event and day-of checklist', icon: Check, color: 'bg-blue-100 text-blue-700' },
  { id: 'timeline', name: 'Event Timeline', desc: 'Schedule and milestone planning', icon: Calendar, color: 'bg-purple-100 text-purple-700' },
  { id: 'vendor', name: 'Vendor Coordination', desc: 'Vendor communication plan', icon: Handshake, color: 'bg-orange-100 text-orange-700' },
  { id: 'marketing', name: 'Marketing Strategy', desc: 'AI-generated marketing plan', icon: Megaphone, color: 'bg-pink-100 text-pink-700' },
  { id: 'runsheet', name: 'Event Run Sheet', desc: 'Detailed event execution plan', icon: ClipboardList, color: 'bg-teal-100 text-teal-700' },
];

function PlanningTab({ id, eventTitle }: { id: string; eventTitle: string }) {
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; template: string; content: string; created_at: string }>>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(`planning_${id}`) || '[]'); } catch { return []; }
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [docName, setDocName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const save = (updated: typeof documents) => {
    setDocuments(updated);
    localStorage.setItem(`planning_${id}`, JSON.stringify(updated));
  };

  const generateDocument = async () => {
    if (!selectedTemplate || !docName) return;
    setGenerating(true);
    try {
      const prompt = `Generate a detailed ${selectedTemplate} document for an event called "${eventTitle}". Format it as a well-structured document with sections, bullet points, and actionable items.`;
      const response = await fetch('/api/proxy/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      }).catch(() => null);

      let content = '';
      if (response?.ok) {
        const data = await response.json();
        content = data.content || getDefaultTemplate(selectedTemplate);
      } else {
        content = getDefaultTemplate(selectedTemplate);
      }

      const newDoc = {
        id: crypto.randomUUID(),
        name: docName,
        template: selectedTemplate,
        content: content,
        created_at: new Date().toISOString(),
      };
      save([...documents, newDoc]);
      setSelectedTemplate(null);
      setDocName('');
    } finally {
      setGenerating(false);
    }
  };

  const deleteDocument = (docId: string) => save(documents.filter(d => d.id !== docId));

  const saveEdit = (docId: string) => {
    save(documents.map(d => d.id === docId ? { ...d, content: editContent } : d));
    setEditingDoc(null);
  };

  return (
    <div className="space-y-6">
      {/* Templates */}
      <div className="space-y-3">
        <h3 className="font-semibold text-neutral-900">Planning Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLANNING_TEMPLATES.map(t => {
            const IconComponent = t.icon;
            return (
            <button key={t.id} onClick={() => {
              setSelectedTemplate(t.id);
              setDocName(`${t.name} - ${new Date().toLocaleDateString()}`);
            }}
              className={`rounded-2xl border border-neutral-200 p-4 text-left hover:border-lime-400 hover:bg-lime-50/50 transition-colors ${selectedTemplate === t.id ? 'border-lime-400 bg-lime-50' : ''}`}>
              <div className={`w-10 h-10 rounded-lg ${t.color} flex items-center justify-center mb-2`}><IconComponent className="w-5 h-5" /></div>
              <p className="font-medium text-neutral-900 text-sm">{t.name}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{t.desc}</p>
            </button>
            );
          })}
        </div>
      </div>

      {/* Template creation form */}
      {selectedTemplate && (
        <div className="rounded-2xl border border-lime-200 bg-lime-50 p-4 space-y-3">
          <p className="text-sm font-medium text-neutral-900">Create new document</p>
          <Input label="Document Name" value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. Event Day Checklist" />
          <div className="flex gap-2">
            <Button loading={generating} onClick={generateDocument} className="flex-1">
              <Sparkles className="w-4 h-4 mr-2" />Generate with AI
            </Button>
            <Button variant="outline" onClick={() => setSelectedTemplate(null)} className="flex-1">Cancel</Button>
          </div>
        </div>
      )}

      {/* Documents list */}
      {documents.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <p className="text-neutral-500 text-sm mb-4">No planning documents yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-semibold text-neutral-900">Your Documents</h3>
          {documents.map(doc => (
            <div key={doc.id} className="rounded-2xl border border-neutral-200 bg-white">
              {editingDoc === doc.id ? (
                <div className="p-4 space-y-3">
                  <div className="max-h-96 overflow-auto bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                      className="w-full h-64 p-0 bg-transparent text-sm text-neutral-700 focus:outline-none resize-none font-mono"
                      placeholder="Edit your document here..." />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => saveEdit(doc.id)} className="flex-1">Save Changes</Button>
                    <Button variant="outline" onClick={() => setEditingDoc(null)} className="flex-1">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-neutral-900">{doc.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{new Date(doc.created_at).toLocaleString()}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600 shrink-0">{doc.template}</span>
                  </div>
                  <div className="max-h-48 overflow-auto bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 whitespace-pre-wrap line-clamp-4">
                    {doc.content}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      setEditingDoc(doc.id);
                      setEditContent(doc.content);
                    }} className="flex-1"><Edit className="w-4 h-4 mr-1" />Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => deleteDocument(doc.id)} className="flex-1 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Budget Tab ───────────────────────────────────────────────────────────────

const BUDGET_CATEGORIES = ['Venue', 'Catering', 'Security', 'Sound & AV', 'Decoration', 'Photography', 'Logistics', 'Marketing', 'Staffing', 'Miscellaneous'];

function BudgetTab({ id, eventTickets }: { id: string; eventTickets: Ticket[] }) {
  const [items, setItems] = useState<BudgetItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(`budget_${id}`) || '[]'); } catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ label: '', amount: '', category: BUDGET_CATEGORIES[0], paid: false });
  const [formErrors, setFormErrors] = useState<{ label?: string; amount?: string }>({});
  const [predictions, setPredictions] = useState<{ title: string; value: string; desc: string }[]>([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  const genId = () => Math.random().toString(36).substring(2, 11);

  const save = (updated: BudgetItem[]) => {
    setItems(updated);
    localStorage.setItem(`budget_${id}`, JSON.stringify(updated));
  };

  const addItem = () => {
    const errors: { label?: string; amount?: string } = {};
    if (!form.label.trim()) errors.label = 'Description is required';
    if (!form.amount.trim()) errors.amount = 'Amount is required';
    else if (isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) errors.amount = 'Enter a valid amount';
    setFormErrors(errors);
    if (Object.keys(errors).length) return;
    save([...items, { id: genId(), label: form.label.trim(), amount: parseFloat(form.amount), category: form.category, paid: form.paid }]);
    setForm({ label: '', amount: '', category: BUDGET_CATEGORIES[0], paid: false });
    setFormErrors({});
    setShowAdd(false);
  };

  const togglePaid = (itemId: string) => save(items.map(i => i.id === itemId ? { ...i, paid: !i.paid } : i));
  const removeItem = (itemId: string) => save(items.filter(i => i.id !== itemId));

  const generatePredictions = async () => {
    setLoadingPredictions(true);
    try {
      const totalExpenses = items.reduce((s, i) => s + i.amount, 0);
      const revenue = eventTickets.reduce((s, t) => s + (t.total - t.available) * t.price, 0);
      const avgTicketPrice = eventTickets.length > 0 ? eventTickets.reduce((s, t) => s + t.price, 0) / eventTickets.length : 0;

      // Mock AI predictions (in production, call actual AI endpoint)
      setPredictions([
        { title: 'Projected Revenue', value: `₦${(revenue + (eventTickets.reduce((s, t) => s + t.available, 0) * avgTicketPrice * 0.5)).toLocaleString()}`, desc: 'Based on current sales and 50% conversion of remaining tickets' },
        { title: 'Break-even Point', value: `${Math.ceil((totalExpenses / (avgTicketPrice * 0.8)) * 100 / 10)}%`, desc: 'Percentage of total capacity needed to break even' },
        { title: 'Profit Margin', value: `₦${Math.max(0, (revenue - totalExpenses) * 0.7).toLocaleString()}`, desc: 'After deducting platform fees (30%)' },
        { title: 'Cost per Attendee', value: `₦${totalExpenses > 0 ? Math.ceil(totalExpenses / Math.max(1, eventTickets.reduce((s, t) => s + t.total - t.available, 0) || 100)) : 0}`, desc: 'Average expense per attendee' },
      ]);
    } finally {
      setLoadingPredictions(false);
    }
  };

  const total = items.reduce((s, i) => s + i.amount, 0);
  const paid = items.filter(i => i.paid).reduce((s, i) => s + i.amount, 0);
  const remaining = total - paid;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Budget', value: `₦${total.toLocaleString()}`, color: 'text-neutral-900' },
          { label: 'Paid', value: `₦${paid.toLocaleString()}`, color: 'text-lime-700' },
          { label: 'Remaining', value: `₦${remaining.toLocaleString()}`, color: remaining > 0 ? 'text-orange-600' : 'text-neutral-400' },
        ].map(m => (
          <div key={m.label} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-xs text-neutral-500 mb-1">{m.label}</p>
            <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* AI Predictions */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
            <span>✨ Budget Intelligence</span>
          </h3>
          <Button size="sm" loading={loadingPredictions} onClick={generatePredictions}>
            {predictions.length > 0 ? 'Refresh' : 'Generate'} Predictions
          </Button>
        </div>
        
        {predictions.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {predictions.map((p, i) => (
              <div key={i} className="bg-gradient-to-br from-lime-50 to-transparent p-4 rounded-lg border border-lime-100">
                <p className="text-xs text-neutral-500 mb-1">{p.title}</p>
                <p className="text-lg font-bold text-lime-700">{p.value}</p>
                <p className="text-xs text-neutral-600 mt-2">{p.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Click "Generate Predictions" to see revenue forecasts, break-even analysis, and cost insights.</p>
        )}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-900">Budget Items</h3>
          <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 mr-1" />Add Item</Button>
        </div>
        {items.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">No budget items yet. Add your first expense.</div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <input type="checkbox" checked={item.paid} onChange={() => togglePaid(item.id)}
                  className="w-4 h-4 rounded accent-lime-500 cursor-pointer" />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${item.paid ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>{item.label}</p>
                  <p className="text-xs text-neutral-500">{item.category}</p>
                </div>
                <p className="font-semibold text-sm text-neutral-900 shrink-0">₦{item.amount.toLocaleString()}</p>
                <button onClick={() => removeItem(item.id)} className="text-neutral-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={showAdd} onClose={() => {
        setShowAdd(false);
        setFormErrors({});
      }} title="Add Budget Item">
        <div className="space-y-4">
          <Input label="Description" value={form.label} onChange={e => { setForm({ ...form, label: e.target.value }); setFormErrors(prev => ({ ...prev, label: undefined })); }} placeholder="e.g. Venue deposit" error={formErrors.label} />
          <Input label="Amount (₦)" value={form.amount} onChange={e => { setForm({ ...form, amount: e.target.value }); setFormErrors(prev => ({ ...prev, amount: undefined })); }} placeholder="0" error={formErrors.amount} />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-lime-400/40">
              {BUDGET_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
            <input type="checkbox" checked={form.paid} onChange={e => setForm({ ...form, paid: e.target.checked })} className="accent-lime-500" />
            Already paid
          </label>
          <div className="flex gap-2 pt-2">
            <Button onClick={addItem} className="flex-1">Add Item</Button>
            <Button variant="outline" onClick={() => { setShowAdd(false); setFormErrors({}); }} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Vendors Tab ──────────────────────────────────────────────────────────────

function VendorsTab({ event, id }: { event: Event; id: string }) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [servicesByVendor, setServicesByVendor] = useState<Record<string, ServiceProfile[]>>({});
  const [servicesLoading, setServicesLoading] = useState(false);
  const [invitations, setInvitations] = useState<VendorInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [inviting, setInviting] = useState<string | null>(null);
  const { addToast } = useToast();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, { rating: number; comment: string }>>({});
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [vRes, iRes] = await Promise.all([
          fetch('/api/vendors'),
          fetch(`/api/proxy/events/${id}/vendors`, { credentials: 'include' }),
        ]);
        if (vRes.ok) {
          const d = await vRes.json();
          const vendorList = (d.vendors || d.data || []).map((v: Record<string, unknown>) => ({
            ...v,
            reviewCount: (v as any).reviewCount ?? (v as any).review_count,
            completedEvents: (v as any).completedEvents ?? (v as any).completed_events,
          }));
          setVendors(vendorList);
          fetchServicesForVendors(vendorList.map((v: Vendor) => v.id));
        }
        if (iRes.ok) { const d = await iRes.json(); setInvitations(Array.isArray(d) ? d : []); }
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const fetchServicesForVendors = async (vendorIds: string[]) => {
    setServicesLoading(true);
    const results: Record<string, ServiceProfile[]> = {};
    await Promise.all(vendorIds.map(async (vid) => {
      try {
        const res = await fetch(`/api/vendors/${vid}`);
        if (res.ok) {
          const data = await res.json();
          const sp = (data.vendor?.serviceProfiles || data.data?.vendor?.serviceProfiles || []);
          results[vid] = sp;
        }
      } catch { /* best-effort */ }
    }));
    setServicesByVendor(results);
    setServicesLoading(false);
  };

  const invite = async (vendorId: string) => {
    setInviting(vendorId);
    try {
      const res = await fetch(`/api/proxy/events/${id}/vendors/invite`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor_user_id: vendorId }),
      });
      if (res.ok) {
        setInvitations(prev => [...prev, { id: crypto.randomUUID(), vendor_id: vendorId, status: 'pending', created_at: new Date().toISOString() }]);
        addToast('Vendor invited successfully', { type: 'success' });
      } else {
        const d = await res.json().catch(() => ({}));
        addToast(d.detail || 'Failed to invite vendor', { type: 'error' });
      }
    } finally {
      setInviting(null);
    }
  };

  const submitReview = async (vendorId: string) => {
    const draft = reviewDrafts[vendorId] || { rating: 5, comment: '' };
    if (!draft.comment.trim()) { addToast('Please write a review comment', { type: 'warning' }); return; }
    setReviewingId(vendorId);
    try {
      const res = await fetch(`/api/vendors/${vendorId}/reviews`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: id, rating: draft.rating, comment: draft.comment.trim() }),
      });
      if (res.ok) {
        setReviewDrafts(prev => ({ ...prev, [vendorId]: { rating: 5, comment: '' } }));
        addToast('Review submitted', { type: 'success' });
      } else {
        const err = await res.json().catch(() => ({ detail: 'Failed to submit review' }));
        addToast(err.detail || err.error || 'Failed to submit review', { type: 'error' });
      }
    } catch { addToast('Network error', { type: 'error' }); }
    finally { setReviewingId(null); }
  };

  const invitedIds = new Set(invitations.map(i => i.vendor_id));
  const eventCity = event.city?.toLowerCase().trim() || '';

  const sorted = [...vendors].sort((a, b) => {
    const aCity = a.city?.toLowerCase().trim() || '';
    const bCity = b.city?.toLowerCase().trim() || '';
    if (aCity === eventCity && bCity !== eventCity) return -1;
    if (bCity === eventCity && aCity !== eventCity) return 1;
    return 0;
  });

  const filtered = sorted.filter(v =>
    (!search || v.name?.toLowerCase().includes(search.toLowerCase())) &&
    (!category || v.category === category)
  );
  const categories = [...new Set(vendors.map(v => v.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Invited vendors */}
      {invitations.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <div className="p-4 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900">Invited Vendors ({invitations.length})</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {invitations.map(inv => {
              const v = vendors.find(v => v.id === inv.vendor_id);
              const draft = reviewDrafts[inv.vendor_id] || { rating: 5, comment: '' };
              return (
              <div key={inv.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900 truncate">{v?.name || `Vendor`}</p>
                    <p className="text-xs text-neutral-500">{v?.category}{v?.city ? ` · ${v.city}` : ''}</p>
                  </div>
                  <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${
                    inv.status === 'accepted' ? 'bg-lime-100 text-lime-700' :
                    inv.status === 'declined' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'}`}>
                    {inv.status}
                  </span>
                </div>
                {inv.status === 'accepted' && v && (
                  <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <select value={draft.rating} onChange={e => setReviewDrafts(prev => ({ ...prev, [inv.vendor_id]: { rating: Number(e.target.value), comment: prev[inv.vendor_id]?.comment || '' } }))}
                        className="h-9 rounded-lg border border-neutral-200 bg-white px-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-lime-400/40">
                        {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} star{r === 1 ? '' : 's'}</option>)}
                      </select>
                      <Button size="sm" disabled={reviewingId === inv.vendor_id} onClick={() => submitReview(inv.vendor_id)}>
                        {reviewingId === inv.vendor_id ? '...' : 'Review'}
                      </Button>
                    </div>
                    <textarea value={draft.comment} onChange={e => setReviewDrafts(prev => ({ ...prev, [inv.vendor_id]: { rating: prev[inv.vendor_id]?.rating || 5, comment: e.target.value } }))}
                      rows={2} placeholder="Rate this vendor after the event"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime-400/40" />
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search & filter */}
      <div className="flex gap-3 flex-wrap">
        <Input placeholder="Search vendors…" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 min-w-[180px]" />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-lime-400/40">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Vendor directory */}
      {loading ? (
        <div className="flex justify-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-neutral-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500 text-sm">No vendors found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(v => {
            const isInvited = invitedIds.has(v.id);
            const profiles = servicesByVendor[v.id] || [];
            const isNearby = v.city?.toLowerCase().trim() === eventCity;
            return (
            <div key={v.id} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
              {/* Main card header */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-neutral-900">{v.name}</p>
                      {isNearby && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-lime-100 text-lime-700 font-medium inline-flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />Nearby
                        </span>
                      )}
                      {v.status === 'approved' && (
                        <CheckCircle className="w-3.5 h-3.5 text-lime-500" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {v.category}
                      {v.city ? ` · ${v.city}` : ''}
                      {v.subscriptionPlan ? ` · ${v.subscriptionPlan}` : ''}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-neutral-600">{v.rating?.toFixed(1) ?? '—'}</span>
                        {v.reviewCount !== undefined && (
                          <span className="text-xs text-neutral-400">({v.reviewCount})</span>
                        )}
                      </div>
                      {v.pricing && <span className="text-xs font-medium text-neutral-500">{v.pricing}</span>}
                      {v.completedEvents !== undefined && (
                        <span className="text-xs text-neutral-500">{v.completedEvents} event{v.completedEvents !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant={isInvited ? 'outline' : 'default'}
                    disabled={isInvited} loading={inviting === v.id}
                    onClick={() => invite(v.id)}>
                    {isInvited ? 'Invited' : <><Send className="w-3.5 h-3.5 mr-1" />Invite</>}
                  </Button>
                </div>

                {v.description && (
                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">{v.description}</p>
                )}

                {/* Services / tags */}
                {(v.services && v.services.length > 0) && (
                  <div className="flex flex-wrap gap-1.5">
                    {v.services.map(s => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">{s}</span>
                    ))}
                  </div>
                )}

                {/* Contact info */}
                {(v.contactEmail || v.contactPhone) && (
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    {v.contactEmail && (
                      <a href={`mailto:${v.contactEmail}`} className="flex items-center gap-1 hover:text-lime transition-colors">
                        <Mail className="w-3 h-3" />
                        {v.contactEmail}
                      </a>
                    )}
                    {v.contactPhone && (
                      <a href={`tel:${v.contactPhone}`} className="flex items-center gap-1 hover:text-lime transition-colors">
                        <Phone className="w-3 h-3" />
                        {v.contactPhone}
                      </a>
                    )}
                  </div>
                )}

                {/* Portfolio / Rate card links */}
                {(v.portfolio?.length || v.rateCard) && (
                  <div className="flex gap-2 flex-wrap">
                    {v.rateCard && (
                      <a href={v.rateCard} target="_blank" rel="noopener noreferrer"
                        className="text-xs inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-50 text-lime-700 hover:bg-lime-100 transition-colors">
                        <Eye className="w-3 h-3" />Rate Card
                      </a>
                    )}
                    {v.portfolio?.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                        className="text-xs inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors">
                        <Globe className="w-3 h-3" />Portfolio {i + 1}
                      </a>
                    ))}
                  </div>
                )}

                {/* View details */}
                <button onClick={() => setSelectedVendor(v)}
                  className="text-xs text-lime-600 hover:text-lime-700 font-medium text-left">
                  View full profile →
                </button>
              </div>

              {/* Service profiles section */}
              {profiles.length > 0 && (
                <div className="border-t border-neutral-100 bg-neutral-50/50 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                    <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Service Profiles</h4>
                    {servicesLoading && <RefreshCw className="w-3 h-3 animate-spin text-neutral-400" />}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profiles.map(sp => (
                      <ServiceProfileCard key={sp.id} profile={sp} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}

      {/* Vendor detail modal */}
      <Modal open={!!selectedVendor} onClose={() => setSelectedVendor(null)} title={selectedVendor?.name || ''}>
        {selectedVendor && (
          <VendorDetailModal vendor={selectedVendor} profiles={servicesByVendor[selectedVendor.id] || []} onInvite={invite} isInvited={invitedIds.has(selectedVendor.id)} inviting={inviting === selectedVendor.id} />
        )}
      </Modal>
    </div>
  );
}

function ServiceProfileCard({ profile }: { profile: ServiceProfile }) {
  const model = profile.pricingModel || profile.pricing_model || '';
  const minB = profile.minBudget ?? profile.min_budget;
  const maxB = profile.maxBudget ?? profile.max_budget;
  const tags = profile.tags || [];
  const images = profile.images || [];
  const rateCardUrl = profile.rateCardUrl || profile.rate_card_url;
  const portfolioUrl = profile.portfolioUrl || profile.portfolio_url;
  const socialUrl = profile.socialUrl || profile.social_url;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3 space-y-2">
      {profile.bannerImage && (
        <div className="relative h-20 w-full rounded-lg overflow-hidden bg-neutral-100">
          <img src={profile.bannerImage} alt={profile.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <div>
        <p className="font-medium text-sm text-neutral-900">{profile.name}</p>
        {profile.subcategory && (
          <p className="text-[11px] text-neutral-500">{profile.subcategory}</p>
        )}
      </div>
      {profile.description && (
        <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">{profile.description}</p>
      )}
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <span className="font-semibold text-neutral-900">{profile.pricing}</span>
        {model && (
          <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 text-[10px] uppercase">{model}</span>
        )}
        {minB !== undefined && maxB !== undefined && (
          <span className="text-neutral-500">₦{minB.toLocaleString()} – ₦{maxB.toLocaleString()}</span>
        )}
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map(t => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-lime-50 text-lime-700">{t}</span>
          ))}
        </div>
      )}
      {(rateCardUrl || portfolioUrl || socialUrl) && (
        <div className="flex gap-1.5 flex-wrap">
          {rateCardUrl && (
            <a href={rateCardUrl} target="_blank" rel="noopener noreferrer"
              className="text-[10px] inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
              Rate Card
            </a>
          )}
          {portfolioUrl && (
            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer"
              className="text-[10px] inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">
              Portfolio
            </a>
          )}
          {socialUrl && (
            <a href={socialUrl} target="_blank" rel="noopener noreferrer"
              className="text-[10px] inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors">
              Social
            </a>
          )}
        </div>
      )}
      {images.length > 0 && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <img key={i} src={img} alt="" className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0" loading="lazy" />
          ))}
        </div>
      )}
    </div>
  );
}

function VendorDetailModal({ vendor, profiles, onInvite, isInvited, inviting }: {
  vendor: Vendor;
  profiles: ServiceProfile[];
  onInvite: (id: string) => void;
  isInvited: boolean;
  inviting: boolean;
}) {
  return (
    <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-neutral-900">{vendor.name}</h2>
            {vendor.status === 'approved' && <CheckCircle className="w-4 h-4 text-lime-500" />}
          </div>
          <p className="text-sm text-neutral-500 mt-0.5">{vendor.category}{vendor.city ? ` · ${vendor.city}` : ''}</p>
        </div>
        <Button size="sm" variant={isInvited ? 'outline' : 'default'}
          disabled={isInvited} loading={inviting}
          onClick={() => onInvite(vendor.id)}>
          {isInvited ? 'Invited' : <><Send className="w-3.5 h-3.5 mr-1" />Invite</>}
        </Button>
      </div>

      {/* Rating & stats */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-semibold text-neutral-900">{vendor.rating?.toFixed(1) ?? '—'}</span>
          <span className="text-neutral-500">({vendor.reviewCount ?? 0} reviews)</span>
        </div>
        {vendor.completedEvents !== undefined && (
          <span className="text-neutral-600">{vendor.completedEvents} events completed</span>
        )}
        {vendor.pricing && <span className="text-neutral-600">{vendor.pricing}</span>}
        {vendor.subscriptionPlan && (
          <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-xs">{vendor.subscriptionPlan}</span>
        )}
      </div>

      {/* Description */}
      {vendor.description && (
        <div>
          <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">About</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">{vendor.description}</p>
        </div>
      )}

      {/* Services */}
      {vendor.services && vendor.services.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Services</h3>
          <div className="flex flex-wrap gap-1.5">
            {vendor.services.map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio */}
      {vendor.portfolio && vendor.portfolio.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Portfolio</h3>
          <div className="flex flex-wrap gap-2">
            {vendor.portfolio.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors">
                <Globe className="w-3.5 h-3.5" />Portfolio {i + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Rate card */}
      {vendor.rateCard && (
        <div>
          <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Rate Card</h3>
          <a href={vendor.rateCard} target="_blank" rel="noopener noreferrer"
            className="text-sm inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-50 text-lime-700 hover:bg-lime-100 transition-colors">
            <Eye className="w-4 h-4" />View Rate Card
          </a>
        </div>
      )}

      {/* Contact */}
      <div>
        <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Contact</h3>
        <div className="space-y-1 text-sm text-neutral-600">
          {vendor.contactEmail && (
            <a href={`mailto:${vendor.contactEmail}`} className="flex items-center gap-2 hover:text-lime transition-colors">
              <Mail className="w-4 h-4 text-neutral-400" />{vendor.contactEmail}
            </a>
          )}
          {vendor.contactPhone && (
            <a href={`tel:${vendor.contactPhone}`} className="flex items-center gap-2 hover:text-lime transition-colors">
              <Phone className="w-4 h-4 text-neutral-400" />{vendor.contactPhone}
            </a>
          )}
        </div>
      </div>

      {/* Service Profiles */}
      {profiles.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">Service Profiles</h3>
          <div className="grid grid-cols-1 gap-3">
            {profiles.map(sp => (
              <ServiceProfileCard key={sp.id} profile={sp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Attendees Tab ────────────────────────────────────────────────────────────

function AttendeesTab({ id }: { id: string }) {
  const router = useRouter();
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
      <h3 className="font-semibold text-neutral-900">Attendee Management</h3>
      <p className="text-sm text-neutral-500">View check-in status, export attendee lists, and manage registrations.</p>
      <Button onClick={() => router.push(`/dashboard/events/${id}/attendees`)}>
        <Users className="w-4 h-4 mr-2" />View Attendees
      </Button>
    </div>
  );
}

// ─── Reviews Tab ──────────────────────────────────────────────────────────────

function ReviewsTab({ id }: { id: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/proxy/events/${id}/reviews`)
      .then(r => r.json())
      .then(d => setReviews(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const submitResponse = async (reviewId: string) => {
    if (!responseText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/proxy/events/reviews/${reviewId}/response`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: responseText }),
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, response: responseText } : r));
        setResponding(null);
        setResponseText('');
      }
    } finally { setSubmitting(false); }
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—';

  if (loading) return <div className="flex justify-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-neutral-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex items-center gap-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-neutral-900">{avg}</p>
          <div className="flex gap-0.5 mt-1 justify-center">
            {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${parseFloat(avg) >= s ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200'}`} />)}
          </div>
          <p className="text-xs text-neutral-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500 text-sm">No reviews yet.</div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-neutral-900 text-sm">{r.user_name || 'Anonymous'}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${r.rating >= s ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200'}`} />)}
                  </div>
                </div>
                <p className="text-xs text-neutral-400">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              {r.comment && <p className="text-sm text-neutral-700">{r.comment}</p>}
              {r.response ? (
                <div className="bg-lime-50 border border-lime-100 rounded-xl p-3">
                  <p className="text-xs font-medium text-lime-700 mb-1">Your response</p>
                  <p className="text-sm text-neutral-700">{r.response}</p>
                </div>
              ) : (
                responding === r.id ? (
                  <div className="space-y-2">
                    <textarea value={responseText} onChange={e => setResponseText(e.target.value)}
                      placeholder="Write your response…" rows={3}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400/40" />
                    <div className="flex gap-2">
                      <Button size="sm" loading={submitting} onClick={() => submitResponse(r.id)}>Submit</Button>
                      <Button size="sm" variant="outline" onClick={() => { setResponding(null); setResponseText(''); }}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setResponding(r.id)}>
                    <Send className="w-3.5 h-3.5 mr-1.5" />Respond
                  </Button>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Insights Tab ─────────────────────────────────────────────────────────────

function InsightsTab({ id }: { id: string }) {
  const router = useRouter();
  const [metrics, setMetrics] = useState<{ views: number; saves: number; reactions: number; tickets_sold: number; revenue: number } | null>(null);

  useEffect(() => {
    fetch(`/api/events/${id}/insights`)
      .then(r => r.json())
      .then(d => {
        const payload = d.data ?? d;
        setMetrics(payload);
      })
      .catch(() => {});
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Views', value: metrics?.views ?? '—', icon: <Eye className="w-4 h-4" /> },
          { label: 'Saves', value: metrics?.saves ?? '—', icon: <Star className="w-4 h-4" /> },
          { label: 'Reactions', value: metrics?.reactions ?? '—', icon: <CheckCircle className="w-4 h-4" /> },
          { label: 'Tickets Sold', value: metrics?.tickets_sold ?? '—', icon: <Ticket className="w-4 h-4" /> },
          { label: 'Revenue', value: metrics?.revenue != null ? `₦${metrics.revenue.toLocaleString()}` : '—', icon: <BarChart2 className="w-4 h-4" /> },
        ].map(m => (
          <div key={m.label} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-2 text-neutral-400 mb-2">{m.icon}<span className="text-xs">{m.label}</span></div>
            <p className="text-2xl font-bold text-neutral-900">{m.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center space-y-3">
        <BarChart2 className="w-10 h-10 text-neutral-300 mx-auto" />
        <p className="text-sm text-neutral-500">Full analytics including revenue trends, conversion rates, and attendee demographics.</p>
        <Button variant="outline" onClick={() => router.push(`/dashboard/events/${id}/insights`)}>
          <BarChart2 className="w-4 h-4 mr-2" />View Full Insights
        </Button>
      </div>
    </div>
  );
}

// ─── Marketing Tab ────────────────────────────────────────────────────────────

function MarketingTab({ id }: { id: string }) {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
        <h3 className="font-semibold text-neutral-900">Promote Your Event</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Marketing Campaigns', desc: 'Email, SMS & push campaigns', icon: <Megaphone className="w-5 h-5" />, path: `/dashboard/marketing?eventId=${id}` },
            { label: 'Featured Placement', desc: 'Boost visibility on the platform', icon: <Star className="w-5 h-5" />, path: `/dashboard/featured?eventId=${id}` },
          ].map(a => (
            <button key={a.label} onClick={() => router.push(a.path)}
              className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 hover:border-lime-400 hover:bg-lime-50/50 transition-colors text-left">
              <span className="text-lime-600 mt-0.5">{a.icon}</span>
              <div>
                <p className="font-medium text-sm text-neutral-900">{a.label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{a.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Influencers Tab ───────────────────────────────────────────────────────

interface DiscoveredUser {
  id: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  locationCity: string | null;
  locationCountry: string | null;
  socialInstagram: string | null;
  socialTwitter: string | null;
  socialFacebook: string | null;
  socialLinkedin: string | null;
  website: string | null;
  interests: string[];
}

function SocialLink({ href, label, icon }: { href: string | null; label: string; icon: React.ReactNode }) {
  if (!href) return null;
  const url = href.startsWith('http') ? href : `https://${href}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-1 text-xs text-lime-700 hover:underline">
      {icon}{label}
    </a>
  );
}

function InfluencerCard({ user, onInvite, inviting }: { user: DiscoveredUser; onInvite: (u: DiscoveredUser) => void; inviting: boolean }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        {user.avatar
          ? <img src={user.avatar} alt={user.displayName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          : <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0 text-lime-700 font-bold text-lg">{user.displayName[0]?.toUpperCase()}</div>
        }
        <div className="min-w-0">
          <p className="font-semibold text-sm text-neutral-900 truncate">{user.displayName}</p>
          {(user.locationCity || user.locationCountry) && (
            <p className="text-xs text-neutral-500 mt-0.5">📍 {[user.locationCity, user.locationCountry].filter(Boolean).join(', ')}</p>
          )}
        </div>
      </div>
      {user.bio && <p className="text-xs text-neutral-600 line-clamp-2">{user.bio}</p>}
      {user.interests.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {user.interests.slice(0, 4).map(i => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-xs">{i}</span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <SocialLink href={user.socialInstagram} label="Instagram" icon={<span>📸</span>} />
        <SocialLink href={user.socialTwitter} label="Twitter / X" icon={<span>🐦</span>} />
        <SocialLink href={user.socialFacebook} label="Facebook" icon={<span>👤</span>} />
        <SocialLink href={user.socialLinkedin} label="LinkedIn" icon={<span>💼</span>} />
        {user.website && (
          <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-lime-700 hover:underline">🌐 Website</a>
        )}
      </div>
      <Button size="sm" loading={inviting} onClick={() => onInvite(user)} className="w-full mt-1">
        Invite to Collaborate
      </Button>
    </div>
  );
}

function InfluencersTab({ id, event }: { id: string; event: { city?: string; country?: string } | null }) {
  const [collabs, setCollabs] = useState<InfluencerCollab[]>([]);
  const [collabsLoading, setCollabsLoading] = useState(true);
  const [selectedCollab, setSelectedCollab] = useState<InfluencerCollab | null>(null);
  const [messages, setMessages] = useState<Array<{ id: string; senderId: string; content: string; createdAt: string }>>([]);
  const [messageInput, setMessageInput] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [discoverUsers, setDiscoverUsers] = useState<DiscoveredUser[]>([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [discoverQuery, setDiscoverQuery] = useState('');
  const [discoverCity, setDiscoverCity] = useState(event?.city ?? '');
  const [discoverCountry, setDiscoverCountry] = useState(event?.country ?? '');
  const [discoverPage, setDiscoverPage] = useState(1);
  const [discoverTotal, setDiscoverTotal] = useState(0);
  const [discoverPageCount, setDiscoverPageCount] = useState(1);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [inviteTarget, setInviteTarget] = useState<DiscoveredUser | null>(null);
  const [inviteForm, setInviteForm] = useState({ compensationType: 'paid', compensationAmount: '', commissionRate: '', freeTicketCount: '' });
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      setCollabsLoading(true);
      try {
        const res = await fetch('/api/influencers/collaborations');
        if (res.ok) {
          const d = await res.json();
          setCollabs((d.collaborations || []).filter((c: any) => c.eventId === id));
        }
      } catch { /* best-effort */ }
      finally { setCollabsLoading(false); }
    };
    load();
  }, [id]);

  const discover = async (page = 1) => {
    setDiscoverLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), page_size: '12' });
      if (discoverQuery) qs.set('q', discoverQuery);
      if (discoverCity) qs.set('city', discoverCity);
      if (discoverCountry) qs.set('country', discoverCountry);
      const res = await fetch(`/api/influencers/discover?${qs.toString()}`);
      if (res.ok) {
        const d = await res.json();
        setDiscoverUsers(d.users || []);
        setDiscoverTotal(d.total || 0);
        setDiscoverPageCount(d.pageCount || 1);
        setDiscoverPage(page);
      }
    } catch { /* best-effort */ }
    finally { setDiscoverLoading(false); }
  };

  useEffect(() => { discover(1); }, []);

  const openInviteModal = (user: DiscoveredUser) => {
    setInviteTarget(user);
    setInviteForm({ compensationType: 'paid', compensationAmount: '', commissionRate: '', freeTicketCount: '' });
  };

  const submitInvite = async () => {
    if (!inviteTarget) return;
    setInvitingId(inviteTarget.id);
    try {
      const payload = {
        influencerId: inviteTarget.id,
        eventId: id,
        influencerName: inviteTarget.displayName,
        influencerPlatform: inviteTarget.socialInstagram ? 'instagram' : inviteTarget.socialTwitter ? 'twitter' : 'other',
        influencerHandle: inviteTarget.socialInstagram || inviteTarget.socialTwitter || '',
        compensationType: inviteForm.compensationType,
        compensationAmount: inviteForm.compensationAmount ? Number(inviteForm.compensationAmount) : undefined,
        commissionRate: inviteForm.commissionRate ? Number(inviteForm.commissionRate) : undefined,
        freeTicketCount: inviteForm.freeTicketCount ? Number(inviteForm.freeTicketCount) : undefined,
      };
      const res = await fetch('/api/influencers/invite', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        setCollabs(prev => [d, ...prev]);
        setInviteTarget(null);
        addToast(`${inviteTarget.displayName} invited successfully`, { type: 'success' });
      } else {
        const err = await res.json().catch(() => ({}));
        addToast(err.error || 'Failed to invite', { type: 'error' });
      }
    } catch { addToast('Network error', { type: 'error' }); }
    finally { setInvitingId(null); }
  };

  const openMessages = async (c: InfluencerCollab) => {
    setSelectedCollab(c);
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/influencers/collaborations/${c.id}/messages`);
      if (res.ok) {
        const d = await res.json();
        setMessages(Array.isArray(d.messages) ? d.messages : []);
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const closeMessages = () => {
    setSelectedCollab(null);
    setMessages([]);
    setMessageInput('');
  };

  const sendMessage = async () => {
    if (!selectedCollab || !messageInput.trim()) return;
    try {
      const res = await fetch(`/api/influencers/collaborations/${selectedCollab.id}/messages`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageInput.trim() }),
      });
      if (res.ok) {
        const d = await res.json();
        setMessages(prev => [...prev, d.message]);
        setMessageInput('');
      } else {
        const err = await res.json().catch(() => ({}));
        addToast(err.error || 'Failed to send message', { type: 'error' });
      }
    } catch {
      addToast('Network error', { type: 'error' });
    }
  };

  const acceptCollab = async (collabId: string) => {
    try {
      const res = await fetch(`/api/influencers/collaborations/${collabId}/accept`, { method: 'POST' });
      if (res.ok) { setCollabs(prev => prev.map(c => c.id === collabId ? { ...c, status: 'accepted' } : c)); addToast('Collaboration accepted', { type: 'success' }); }
    } catch { addToast('Failed to accept', { type: 'error' }); }
  };

  const declineCollab = async (collabId: string) => {
    try {
      const res = await fetch(`/api/influencers/collaborations/${collabId}/decline`, { method: 'POST' });
      if (res.ok) { setCollabs(prev => prev.map(c => c.id === collabId ? { ...c, status: 'declined' } : c)); addToast('Collaboration declined', { type: 'info' }); }
    } catch { addToast('Failed to decline', { type: 'error' }); }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { accepted: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', invited: 'bg-amber-100 text-amber-700', declined: 'bg-red-100 text-red-600', rejected: 'bg-red-100 text-red-600' };
    return map[s] ?? 'bg-neutral-100 text-neutral-600';
  };

  return (
    <div className="space-y-6">
      {/* ── Discover Panel ── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h3 className="font-semibold text-neutral-900 mb-1">Discover Influencers</h3>
        <p className="text-sm text-neutral-500 mb-4">Browse platform users near your event. Click their social links to check their profiles before inviting.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <input className="h-10 flex-1 min-w-[160px] rounded-xl border border-neutral-200 px-3 text-sm"
            placeholder="Search by name or @handle…" value={discoverQuery}
            onChange={e => setDiscoverQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && discover(1)} />
          <input className="h-10 w-36 rounded-xl border border-neutral-200 px-3 text-sm"
            placeholder="City" value={discoverCity}
            onChange={e => setDiscoverCity(e.target.value)} onKeyDown={e => e.key === 'Enter' && discover(1)} />
          <input className="h-10 w-36 rounded-xl border border-neutral-200 px-3 text-sm"
            placeholder="Country" value={discoverCountry}
            onChange={e => setDiscoverCountry(e.target.value)} onKeyDown={e => e.key === 'Enter' && discover(1)} />
          <Button onClick={() => discover(1)} loading={discoverLoading} size="sm">Search</Button>
        </div>
        {discoverLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="rounded-xl border border-neutral-100 bg-neutral-50 h-48 animate-pulse" />)}
          </div>
        ) : discoverUsers.length === 0 ? (
          <p className="text-sm text-neutral-400 py-6 text-center">No users found. Try a different search or city.</p>
        ) : (
          <>
            <p className="text-xs text-neutral-400 mb-3">{discoverTotal} user{discoverTotal !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {discoverUsers.map(u => (
                <InfluencerCard key={u.id} user={u} onInvite={openInviteModal} inviting={invitingId === u.id} />
              ))}
            </div>
            {discoverPageCount > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => discover(discoverPage - 1)} disabled={discoverPage <= 1}>← Prev</Button>
                <span className="text-sm text-neutral-500">Page {discoverPage} of {discoverPageCount}</span>
                <Button variant="outline" size="sm" onClick={() => discover(discoverPage + 1)} disabled={discoverPage >= discoverPageCount}>Next →</Button>
              </div>
            )}
          </>
        )}
      </div>
      {selectedCollab && (
        <Modal open={!!selectedCollab} onClose={closeMessages} title={`Messages — ${selectedCollab.influencerName}`}>
          <div className="space-y-3 max-h-[60vh] overflow-auto">
            {messagesLoading ? <div className="text-sm text-neutral-500">Loading...</div> : (
              messages.length === 0 ? <div className="text-sm text-neutral-500">No messages yet.</div> : (
                <div className="space-y-2">
                  {messages.map(m => (
                    <div key={m.id} className="p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                      <p className="text-xs text-neutral-500">{new Date(m.createdAt).toLocaleString()}</p>
                      <p className="text-sm text-neutral-900">{m.content}</p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
          <div className="mt-3">
            <textarea value={messageInput} onChange={e => setMessageInput(e.target.value)} rows={3}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" placeholder="Write a message..." />
            <div className="flex gap-2 mt-2">
              <Button onClick={sendMessage}>Send</Button>
              <Button variant="outline" onClick={() => { if (selectedCollab) acceptCollab(selectedCollab.id); }}>Accept</Button>
              <Button variant="outline" onClick={() => { if (selectedCollab) declineCollab(selectedCollab.id); }}>Decline</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusChanging, setStatusChanging] = useState(false);
  const { addToast } = useToast();

  const fetchEvent = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/events/${id}`);
      if (response.ok) {
        setEvent(await response.json());
      } else {
        const d = await response.json().catch(() => ({}));
        setError(d.detail || `Error ${response.status}`);
      }
    } catch {
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvent(); }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!event) return;
    setStatusChanging(true);
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setEvent(data);
        addToast(`Status changed to ${STATUS_CONFIG[newStatus]?.label ?? newStatus}`, { type: 'success' });
      } else if (res.status === 401) {
        addToast('Session expired — please log in again.', { type: 'error' });
      } else if (res.status === 403) {
        addToast('You are not authorised to change this event\'s status.', { type: 'error' });
      } else {
        addToast(data?.detail || `Failed to update status (${res.status})`, { type: 'error' });
      }
    } catch {
      addToast('Network error. Please try again.', { type: 'error' });
    } finally {
      setStatusChanging(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
          <XCircle className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Event Not Found</h2>
          <p className="text-neutral-500 mb-6">{error || "This event doesn't exist or has been deleted."}</p>
          <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'overview', label: 'Overview', title: 'Overview', icon: 'home',
      description: 'Event details and status',
      content: <OverviewTab event={event} id={id} onStatusChange={handleStatusChange} statusChanging={statusChanging} />,
    },
    {
      id: 'planning', label: 'Planning', title: 'Planning', icon: 'clipboard',
      description: 'Plan with documents and AI assistance',
      content: <PlanningTab id={id} eventTitle={event.title} />,
    },
    {
      id: 'tickets', label: 'Tickets', title: 'Tickets', icon: 'ticket',
      description: 'Ticket types and sales',
      content: <TicketsTab event={event} id={id} onRefresh={fetchEvent} />,
    },
    {
      id: 'budget', label: 'Budget', title: 'Budget', icon: 'dollar-sign',
      description: 'Track event expenses and revenue',
      content: <BudgetTab id={id} eventTickets={event.tickets} />,
    },
    {
      id: 'vendors', label: 'Vendors', title: 'Vendors', icon: 'store',
      description: 'Source and invite vendors',
      content: <VendorsTab event={event} id={id} />,
    },
    {
      id: 'attendees', label: 'Attendees', title: 'Attendees', icon: 'users',
      description: 'Manage registrations',
      content: <AttendeesTab id={id} />,
    },
    {
      id: 'reviews', label: 'Reviews', title: 'Reviews', icon: 'star',
      description: 'Ratings and feedback',
      content: <ReviewsTab id={id} />,
    },
    {
      id: 'insights', label: 'Insights', title: 'Insights', icon: 'bar-chart',
      description: 'Performance analytics',
      content: <InsightsTab id={id} />,
    },
    {
      id: 'marketing', label: 'Marketing', title: 'Marketing', icon: 'megaphone',
      description: 'Promote your event',
      content: <MarketingTab id={id} />,
    },
    {
      id: 'influencers', label: 'Influencers', title: 'Influencers', icon: 'users',
      description: 'Invite and manage influencer collaborations',
      content: <InfluencersTab id={id} />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="shrink-0 mt-1">
          ← Back
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 truncate">{event.title}</h1>
            <StatusBadge status={event.status} />
          </div>
          <p className="text-sm text-neutral-500">
            {[event.venue, event.city, event.country].filter(Boolean).join(', ')} · {new Date(event.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <MobileTabs items={tabs} defaultTab="overview" />
    </div>
  );
}
