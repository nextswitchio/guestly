"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/lib/currency";

type ReferralStats = {
  totalReferrals: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalEarned: number;
  pendingRewards: number;
  conversionRate: number;
  topEvents: Array<{ eventId: string; conversions: number; earned: number }>;
};

type ReferralLink = {
  id: string;
  eventId: string;
  eventTitle: string;
  url: string;
  code: string;
  clicks: number;
  conversions: number;
  earnedRewards: number;
  pendingRewards: number;
  createdAt: number;
};

export default function ReferralsPage() {
  const router = useRouter();
  const { formatAmount } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [links, setLinks] = useState<ReferralLink[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [events, setEvents] = useState<Array<{ id: string; title: string }>>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch("/api/referrals/rewards");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || null);
        setLinks(data.links || []);
      } else if (res.status === 401) {
        router.push("/attendee");
      }
    } catch (err) {
      console.error("Failed to load referral data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadEvents() {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/events?page=1&pageSize=50");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoadingEvents(false);
    }
  }

  async function generateLink() {
    if (!selectedEvent) return;
    setGenerating(true);
    try {
      const selectedEv = events.find(e => e.id === selectedEvent);
      const res = await fetch("/api/referrals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: selectedEvent, eventTitle: selectedEv?.title || "" }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedLink(data.data?.url || data.url || "");
        loadData();
      }
    } catch (err) {
      console.error("Failed to generate link:", err);
    } finally {
      setGenerating(false);
    }
  }

  async function copyLink(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareVia(platform: string, url: string) {
    const encodedUrl = encodeURIComponent(url);
    const text = encodeURIComponent("Check out this event!");
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
      email: `mailto:?subject=${text}&body=${encodedUrl}`,
    };
    if (urls[platform]) window.open(urls[platform], "_blank");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  const s = stats || {
    totalReferrals: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    totalEarned: 0,
    pendingRewards: 0,
    conversionRate: 0,
    topEvents: [],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Referral Program</h1>
        <p className="mt-2 text-neutral-500">Share events with friends and earn rewards for every ticket they purchase</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Total Referrals</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{s.totalReferrals}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Total Clicks</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{s.totalClicks}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Conversions</p>
          <p className="mt-1 text-2xl font-bold text-lime-600">{s.totalConversions}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Total Earned</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{formatAmount(s.totalEarned, { noConvert: true })}</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-2xl bg-gradient-to-r from-lime/10 to-lime/5 border border-lime/20 p-6">
        <h3 className="text-lg font-semibold mb-4">How Referrals Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime text-dark font-bold">1</div>
            <div>
              <h4 className="font-semibold mb-1">Share Your Link</h4>
              <p className="text-sm text-neutral-600">Generate a unique referral link for any event and share it with friends</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime text-dark font-bold">2</div>
            <div>
              <h4 className="font-semibold mb-1">Friends Purchase</h4>
              <p className="text-sm text-neutral-600">When they buy tickets using your link, you earn a commission</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime text-dark font-bold">3</div>
            <div>
              <h4 className="font-semibold mb-1">Get Rewarded</h4>
              <p className="text-sm text-neutral-600">Rewards are credited to your wallet automatically</p>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Link */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">Generate Referral Link</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            onFocus={() => { if (events.length === 0) loadEvents(); }}
            className="flex-1 h-12 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-900 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
          >
            <option value="">Select an event</option>
            {loadingEvents ? <option disabled>Loading events...</option> : null}
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
          <button
            onClick={generateLink}
            disabled={generating || !selectedEvent}
            className="h-12 rounded-xl bg-lime px-6 text-sm font-bold text-dark hover:bg-lime-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? "Generating..." : "Generate Link"}
          </button>
        </div>

        {generatedLink && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <input
                readOnly
                value={generatedLink}
                className="flex-1 h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-mono text-neutral-700"
              />
              <button
                onClick={() => copyLink(generatedLink)}
                className="h-12 rounded-xl border border-neutral-200 px-4 text-sm font-medium hover:bg-neutral-50 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-2">Share via:</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => shareVia("whatsapp", generatedLink)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50 transition-colors">WhatsApp</button>
                <button onClick={() => shareVia("facebook", generatedLink)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50 transition-colors">Facebook</button>
                <button onClick={() => shareVia("twitter", generatedLink)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50 transition-colors">Twitter</button>
                <button onClick={() => shareVia("email", generatedLink)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50 transition-colors">Email</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* My Referral Links */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">My Referral Links</h3>
        {links.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-neutral-500">No referral links yet. Generate one above to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div key={link.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{link.eventTitle || `Event #${link.eventId}`}</p>
                  <p className="text-sm text-neutral-500 font-mono truncate">{link.url}</p>
                  <div className="mt-1 flex gap-4 text-xs text-neutral-500">
                    <span>{link.clicks} clicks</span>
                    <span>{link.conversions} conversions</span>
                    <span className="text-green-600 font-medium">{formatAmount(link.earnedRewards, { noConvert: true })} earned</span>
                  </div>
                </div>
                <button
                  onClick={() => copyLink(link.url)}
                  className="shrink-0 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-white transition-colors"
                >
                  Copy Link
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Rewards */}
      {s.pendingRewards > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-semibold mb-2">Pending Rewards</h3>
          <p className="text-3xl font-bold text-amber-600">{formatAmount(s.pendingRewards, { noConvert: true })}</p>
          <p className="mt-1 text-sm text-amber-700">Rewards will be credited to your wallet once conversions are confirmed</p>
        </div>
      )}
    </div>
  );
}
