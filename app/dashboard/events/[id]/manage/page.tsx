'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  RefreshCw, XCircle, Edit, Eye, Ticket, Users, BarChart2,
  Megaphone, DollarSign, UserCheck, CheckCircle, AlertCircle,
  Clock, Ban, Play, ChevronDown, Plus, Trash2, Send, Star,
  MapPin, Calendar, Tag, Globe, Building2, Layers, Check, Handshake,
  ClipboardList, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import MobileTabs from '@/components/ui/MobileTabs';

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
  name: string;
  category: string;
  city: string;
  rating: number;
  pricing: string;
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

function OverviewTab({ event, id, onStatusChange, statusChanging, statusError, statusSuccess }: {
  event: Event;
  id: string;
  onStatusChange: (s: string) => void;
  statusChanging: boolean;
  statusError: string | null;
  statusSuccess: string | null;
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
          {statusError && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />{statusError}
            </div>
          )}
          {statusSuccess && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-lime-50 border border-lime-200 text-lime-700 text-sm px-4 py-3">
              <CheckCircle className="w-4 h-4 shrink-0" />{statusSuccess}
            </div>
          )}
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
  const [predictions, setPredictions] = useState<{ title: string; value: string; desc: string }[]>([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  const save = (updated: BudgetItem[]) => {
    setItems(updated);
    localStorage.setItem(`budget_${id}`, JSON.stringify(updated));
  };

  const addItem = () => {
    if (!form.label || !form.amount) return;
    save([...items, { id: crypto.randomUUID(), label: form.label, amount: parseFloat(form.amount), category: form.category, paid: form.paid }]);
    setForm({ label: '', amount: '', category: BUDGET_CATEGORIES[0], paid: false });
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

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Budget Item">
        <div className="space-y-4 p-4">
          <Input label="Description" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Venue deposit" />
          <Input label="Amount (₦)" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
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
            <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Vendors Tab ──────────────────────────────────────────────────────────────

function VendorsTab({ id }: { id: string }) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [invitations, setInvitations] = useState<VendorInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [inviting, setInviting] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [vRes, iRes] = await Promise.all([
          fetch('/api/vendors'),
          fetch(`/api/proxy/events/${id}/vendors`, { credentials: 'include' }),
        ]);
        if (vRes.ok) { const d = await vRes.json(); setVendors(d.vendors || d.data || []); }
        if (iRes.ok) { const d = await iRes.json(); setInvitations(Array.isArray(d) ? d : []); }
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

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
        setToast('Vendor invited successfully');
      } else {
        const d = await res.json().catch(() => ({}));
        setToast(d.detail || 'Failed to invite vendor');
      }
    } finally {
      setInviting(null);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const invitedIds = new Set(invitations.map(i => i.vendor_id));
  const filtered = vendors.filter(v =>
    (!search || v.name?.toLowerCase().includes(search.toLowerCase())) &&
    (!category || v.category === category)
  );
  const categories = [...new Set(vendors.map(v => v.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {toast && (
        <div className="rounded-xl bg-lime-50 border border-lime-200 text-lime-800 text-sm px-4 py-3">{toast}</div>
      )}

      {/* Invited vendors */}
      {invitations.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <div className="p-4 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900">Invited Vendors ({invitations.length})</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {invitations.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-4">
                <p className="text-sm text-neutral-700">Vendor ID: {inv.vendor_id.slice(0, 8)}…</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  inv.status === 'accepted' ? 'bg-lime-100 text-lime-700' :
                  inv.status === 'declined' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'}`}>
                  {inv.status}
                </span>
              </div>
            ))}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(v => (
            <div key={v.id} className="rounded-2xl border border-neutral-200 bg-white p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-neutral-900 truncate">{v.name}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{v.category} · {v.city}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-neutral-600">{v.rating?.toFixed(1) ?? '—'}</span>
                  {v.pricing && <span className="text-xs text-neutral-400 ml-2">{v.pricing}</span>}
                </div>
              </div>
              <Button size="sm" variant={invitedIds.has(v.id) ? 'outline' : 'default'}
                disabled={invitedIds.has(v.id)} loading={inviting === v.id}
                onClick={() => invite(v.id)}>
                {invitedIds.has(v.id) ? 'Invited' : <><Send className="w-3.5 h-3.5 mr-1" />Invite</>}
              </Button>
            </div>
          ))}
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
    fetch(`/api/proxy/events/${id}/metrics`)
      .then(r => r.json())
      .then(d => setMetrics(d))
      .catch(() => {});
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Views', value: metrics?.views ?? '—', icon: <Eye className="w-4 h-4" /> },
          { label: 'Saves', value: metrics?.saves ?? '—', icon: <Star className="w-4 h-4" /> },
          { label: 'Reactions', value: metrics?.reactions ?? '—', icon: <CheckCircle className="w-4 h-4" /> },
          { label: 'Tickets Sold', value: metrics?.tickets_sold ?? '—', icon: <Ticket className="w-4 h-4" /> },
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusChanging, setStatusChanging] = useState(false);

  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

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
    setStatusError(null);
    setStatusSuccess(null);
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
        setStatusSuccess(`Status changed to ${STATUS_CONFIG[newStatus]?.label ?? newStatus}`);
        setTimeout(() => setStatusSuccess(null), 3000);
      } else if (res.status === 401) {
        setStatusError('Session expired — please log in again.');
      } else if (res.status === 403) {
        setStatusError('You are not authorised to change this event\'s status.');
      } else {
        setStatusError(data?.detail || `Failed to update status (${res.status})`);
      }
    } catch {
      setStatusError('Network error. Please try again.');
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
      content: <OverviewTab event={event} id={id} onStatusChange={handleStatusChange} statusChanging={statusChanging} statusError={statusError} statusSuccess={statusSuccess} />,
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
      id: 'vendors', label: 'Vendors', title: 'Vendors', icon: 'building-2',
      description: 'Source and invite vendors',
      content: <VendorsTab id={id} />,
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
      id: 'insights', label: 'Insights', title: 'Insights', icon: 'bar-chart-2',
      description: 'Performance analytics',
      content: <InsightsTab id={id} />,
    },
    {
      id: 'marketing', label: 'Marketing', title: 'Marketing', icon: 'megaphone',
      description: 'Promote your event',
      content: <MarketingTab id={id} />,
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
