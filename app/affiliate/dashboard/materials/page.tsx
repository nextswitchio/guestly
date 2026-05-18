'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Image, FileText, Download, Copy, Check, ExternalLink, RefreshCw, Megaphone, Palette, Share2 } from 'lucide-react';

interface PromoMaterial {
  id: string;
  eventId: string;
  eventName: string;
  organizerName: string;
  organizerBio: string;
  assets: { id: string; type: 'logo' | 'event-image' | 'social-graphic' | 'banner' | 'video'; url: string; dimensions?: string; format: string }[];
  copyTemplates: { id: string; type: 'headline' | 'social-caption' | 'email-subject' | 'press-release'; content: string; platform?: string }[];
  trackingLink: string;
  promoCode?: string;
  eventStats: { expectedAttendance: number; pastEventAttendance?: number; audienceDemographics: string[]; socialFollowing: { platform: string; count: number }[] };
  brandGuidelines?: { primaryColor: string; secondaryColor: string; fonts: string[] };
  createdAt: string;
}

type MaterialTab = 'assets' | 'copy' | 'stats' | 'brand';

export default function PromoMaterialsPage() {
  const [materials, setMaterials] = useState<PromoMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MaterialTab>('assets');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/affiliates/materials');
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials || []);
        if (data.materials?.length > 0) {
          setSelectedEvent(data.materials[0].eventId);
        }
      }
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const selected = materials.find(m => m.eventId === selectedEvent);

  const assetIcons: Record<string, React.ReactNode> = {
    'logo': <Palette className="h-5 w-5" />,
    'event-image': <Image className="h-5 w-5" />,
    'social-graphic': <Share2 className="h-5 w-5" />,
    'banner': <Image className="h-5 w-5" />,
    'video': <FileText className="h-5 w-5" />,
  };

  const tabs = [
    { id: 'assets' as const, label: 'Media Assets', icon: <Image className="h-4 w-4" /> },
    { id: 'copy' as const, label: 'Copy Templates', icon: <FileText className="h-4 w-4" /> },
    { id: 'stats' as const, label: 'Event Stats', icon: <Megaphone className="h-4 w-4" /> },
    { id: 'brand' as const, label: 'Brand Guidelines', icon: <Palette className="h-4 w-4" /> },
  ];

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
          <h1 className="text-2xl font-bold text-neutral-900">Promotional Materials</h1>
          <p className="text-neutral-500 mt-1">Media kits, assets, and copy templates from your collaborations</p>
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
          <Package className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No promotional materials yet</h3>
          <p className="text-neutral-500 mb-4">Accept a collaboration to access media kits and promotional assets</p>
          <Link href="/affiliate/dashboard/collaborations" className="inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors">
            View Collaborations
          </Link>
        </div>
      ) : (
        <>
          {/* Event Selector */}
          <div className="flex gap-2 flex-wrap">
            {materials.map((m) => (
              <button
                key={m.eventId}
                onClick={() => { setSelectedEvent(m.eventId); setActiveTab('assets'); }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedEvent === m.eventId ? 'bg-lime text-dark' : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {m.eventName}
              </button>
            ))}
          </div>

          {selected && (
            <div className="space-y-6">
              {/* Event Info */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">{selected.eventName}</h2>
                    <p className="text-sm text-neutral-500 mt-1">by {selected.organizerName}</p>
                  </div>
                  {selected.promoCode && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-lime/10 rounded-lg">
                      <span className="text-sm font-medium text-lime">Code: {selected.promoCode}</span>
                      <button onClick={() => copyText(selected.promoCode!)} className="text-lime hover:text-dark transition-colors">
                        {copiedText === selected.promoCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id ? 'bg-lime text-dark' : 'text-neutral-500 hover:bg-neutral-100'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'assets' && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Media Assets</h3>
                  {selected.assets.length === 0 ? (
                    <p className="text-sm text-neutral-500 text-center py-8">No assets uploaded yet</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selected.assets.map((asset) => (
                        <div key={asset.id} className="rounded-xl border border-neutral-200 p-4 hover:bg-neutral-50 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500">
                              {assetIcons[asset.type]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-neutral-900 capitalize">{asset.type.replace('-', ' ')}</p>
                              <p className="text-xs text-neutral-500">{asset.format}{asset.dimensions ? ` • ${asset.dimensions}` : ''}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <a href={asset.url} download className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                              <Download className="h-3 w-3" /> Download
                            </a>
                            <button onClick={() => copyText(asset.url)} className="flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                              {copiedText === asset.url ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'copy' && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Copy Templates</h3>
                  {selected.copyTemplates.length === 0 ? (
                    <p className="text-sm text-neutral-500 text-center py-8">No copy templates yet</p>
                  ) : (
                    <div className="space-y-4">
                      {selected.copyTemplates.map((template) => (
                        <div key={template.id} className="rounded-xl border border-neutral-200 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-neutral-900 capitalize">{template.type.replace('-', ' ')}</p>
                              {template.platform && (
                                <p className="text-xs text-neutral-500 capitalize">{template.platform}</p>
                              )}
                            </div>
                            <button
                              onClick={() => copyText(template.content)}
                              className="flex items-center gap-1 rounded-lg bg-lime px-3 py-1.5 text-xs font-semibold text-dark hover:bg-lime-hover transition-colors"
                            >
                              {copiedText === template.content ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              {copiedText === template.content ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-sm text-neutral-700 bg-neutral-50 rounded-lg p-3">{template.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Event Statistics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <p className="text-sm text-neutral-500">Expected Attendance</p>
                      <p className="text-2xl font-bold text-neutral-900">{selected.eventStats.expectedAttendance.toLocaleString()}</p>
                    </div>
                    {selected.eventStats.pastEventAttendance && (
                      <div className="p-4 bg-neutral-50 rounded-xl">
                        <p className="text-sm text-neutral-500">Past Attendance</p>
                        <p className="text-2xl font-bold text-neutral-900">{selected.eventStats.pastEventAttendance.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {selected.eventStats.audienceDemographics.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-neutral-900 mb-2">Audience Demographics</p>
                      <div className="flex flex-wrap gap-2">
                        {selected.eventStats.audienceDemographics.map((d, i) => (
                          <span key={i} className="px-3 py-1.5 bg-neutral-100 rounded-lg text-sm text-neutral-700">{d}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.eventStats.socialFollowing.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-neutral-900 mb-2">Social Following</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selected.eventStats.socialFollowing.map((s, i) => (
                          <div key={i} className="p-3 bg-neutral-50 rounded-lg text-center">
                            <p className="text-lg font-bold text-neutral-900">{s.count.toLocaleString()}</p>
                            <p className="text-xs text-neutral-500 capitalize">{s.platform}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'brand' && selected.brandGuidelines && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Brand Guidelines</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1 p-4 bg-neutral-50 rounded-xl">
                        <p className="text-sm text-neutral-500 mb-2">Primary Color</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: selected.brandGuidelines.primaryColor }} />
                          <code className="text-sm font-mono text-neutral-900">{selected.brandGuidelines.primaryColor}</code>
                        </div>
                      </div>
                      <div className="flex-1 p-4 bg-neutral-50 rounded-xl">
                        <p className="text-sm text-neutral-500 mb-2">Secondary Color</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: selected.brandGuidelines.secondaryColor }} />
                          <code className="text-sm font-mono text-neutral-900">{selected.brandGuidelines.secondaryColor}</code>
                        </div>
                      </div>
                    </div>
                    {selected.brandGuidelines.fonts.length > 0 && (
                      <div className="p-4 bg-neutral-50 rounded-xl">
                        <p className="text-sm text-neutral-500 mb-2">Recommended Fonts</p>
                        <div className="flex flex-wrap gap-2">
                          {selected.brandGuidelines.fonts.map((f, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700">{f}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'brand' && !selected.brandGuidelines && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
                  <Palette className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500">No brand guidelines provided for this event</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
