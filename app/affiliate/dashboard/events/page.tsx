'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Clock, Link as LinkIcon, Copy, Check, ExternalLink, Search, Filter, RefreshCw } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  price: number;
  image?: string;
  bannerImage?: string;
  organizerName: string;
  city?: string;
  state?: string;
  country?: string;
  venue?: string;
  commissionRate: number;
  totalTickets: number;
  soldTickets: number;
  affiliateLink?: string;
  affiliateCode?: string;
}

export default function AffiliateEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedLinks, setGeneratedLinks] = useState<Record<string, { url: string; code: string }>>({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events?status=published&page_size=50');
      if (res.ok) {
        const data = await res.json();
        setEvents(
          (data.events || []).map((event: any) => {
            const totalTickets = event.tickets?.reduce((sum: number, ticket: any) => sum + (ticket.total ?? 0), 0) || 0;
            const soldTickets = event.tickets?.reduce(
              (sum: number, ticket: any) => sum + ((ticket.total ?? 0) - (ticket.available ?? 0)),
              0
            ) || 0;

            return {
              id: event.id,
              title: event.title,
              date: event.date,
              location: [event.venue, event.city, event.state, event.country].filter(Boolean).join(', '),
              category: event.category,
              price: event.tickets?.[0]?.price ?? 0,
                image: event.image,
                bannerImage: event.banner_image || event.bannerImage || event.banner || undefined,
              organizerName:
                event.organizer_name ||
                event.organizer?.display_name ||
                event.organizer?.name ||
                event.organizerName ||
                'Organizer',
              city: event.city,
              state: event.state,
              country: event.country,
              venue: event.venue,
              commissionRate: event.commissionRate ?? 10,
              totalTickets,
              soldTickets,
              affiliateLink: event.affiliateLink,
              affiliateCode: event.affiliateCode,
            };
          })
        );
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateLink = async (eventId: string) => {
    try {
      const res = await fetch('/api/referrals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });
      if (res.ok) {
        const data = await res.json();
        const linkUrl = data.link?.url || data.url || data.referralLink?.url || '';
        const code = data.link?.code || data.code || data.referralLink?.code || '';

        if (linkUrl && code) {
          setGeneratedLinks(prev => ({
            ...prev,
            [eventId]: { url: linkUrl, code },
          }));
        } else {
          console.error('Referral generate response missing URL or code', data);
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to generate referral link:', errorData);
      }
    } catch (error) {
      console.error('Failed to generate link:', error);
    }
  };

  const copyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['all', ...Array.from(new Set(events.map((e) => e.category || '')))].filter((c) => c);
  const normalizedSearch = search.toLowerCase();
  const filtered = events.filter((e) => {
    const title = (e.title || '').toLowerCase();
    const organizer = (e.organizerName || '').toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      title.includes(normalizedSearch) ||
      organizer.includes(normalizedSearch);
    const matchesCategory = category === 'all' || e.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/affiliate/dashboard" className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Events to Promote</h1>
          <p className="text-neutral-500 mt-1">Browse events, generate affiliate links, and start earning</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search events or organizers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 rounded-xl border border-neutral-200 bg-white pl-10 pr-8 text-sm text-neutral-900 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all appearance-none"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
          <Calendar className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No events found</h3>
          <p className="text-neutral-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => {
            const hasLink = generatedLinks[event.id] || event.affiliateLink;
            const linkData = generatedLinks[event.id] || { url: event.affiliateLink || '', code: event.affiliateCode || '' };

            return (
              <div key={event.id} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
                {/* Event Image Placeholder */}
                { (event.bannerImage || event.image) ? (
                  <img
                    src={event.bannerImage || event.image}
                    alt={event.title}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 bg-gradient-to-br from-lime/20 to-neutral-100 flex items-center justify-center">
                    <Calendar className="h-10 w-10 text-neutral-400" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-neutral-900 line-clamp-2">{event.title}</h3>
                    <span className="px-2 py-1 text-xs font-medium bg-lime/10 text-lime rounded-lg shrink-0 ml-2">
                      {event.commissionRate}%
                    </span>
                  </div>

                  <p className="text-sm text-neutral-500 mb-3">by {event.organizerName}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Clock className="h-4 w-4" />
                      <span>{event.soldTickets}/{event.totalTickets} tickets sold</span>
                    </div>
                  </div>

                  {/* Ticket Progress */}
                  <div className="mb-4">
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-lime rounded-full transition-all"
                        style={{ width: `${(event.soldTickets / event.totalTickets) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Affiliate Link Section */}
                  {hasLink ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-neutral-50 rounded-lg text-xs text-neutral-700 border border-neutral-200 truncate font-mono">
                          {linkData.url}
                        </code>
                        <button
                          onClick={() => copyLink(linkData.url, event.id)}
                          className="flex items-center gap-1 rounded-lg bg-lime px-3 py-2 text-xs font-semibold text-dark hover:bg-lime-hover transition-colors shrink-0"
                        >
                          {copiedId === event.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500">Code: <span className="font-mono font-medium text-neutral-900">{linkData.code}</span></p>
                    </div>
                  ) : (
                    <button
                      onClick={() => generateLink(event.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors"
                    >
                      <LinkIcon className="h-4 w-4" /> Generate Affiliate Link
                    </button>
                  )}

                  <Link
                    href={`/events/${event.id}`}
                    target="_blank"
                    className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    View Event <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
