'use client';

import { useState, useEffect, use } from 'react';
import { MapPin, Star, Mail, Phone, Calendar, Shield, CheckCircle, ArrowLeft, RefreshCw, FileText, ExternalLink, Link as LinkIcon, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface VendorDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  city: string;
  contactEmail: string;
  contactPhone: string;
  rating: number;
  reviewCount: number;
  completedEvents: number;
  services: string[];
  portfolio: string[];
  serviceProfiles?: ServiceProfileDetail[];
  subscription?: {
    plan: string;
    expiresAt: number;
  };
}

interface ServiceProfileDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  pricing: string;
  pricingModel: string;
  bannerImage?: string;
  rateCardUrl?: string;
  portfolioUrl?: string;
  socialUrl?: string;
  images?: string[];
  tags?: string[];
}

export default function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const fetchVendor = async () => {
    try {
      const response = await fetch(`/api/vendors/${id}`);
      if (response.ok) {
        const data = await response.json();
        setVendor(data.vendor || data.data?.vendor || data);
      }
    } catch (error) {
      console.error('Failed to fetch vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <Card className="p-12 text-center max-w-md rounded-2xl border-slate-100 shadow-sm">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Vendor Not Found</h2>
          <p className="text-slate-500 mb-6">The vendor you're looking for doesn't exist.</p>
          <Button href="/vendors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Browse Vendors
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {vendor.subscription && vendor.subscription.expiresAt > Date.now() && (
                  <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-lime text-dark rounded-full">
                    <Star className="w-3 h-3" />
                    Premium Vendor
                  </span>
                )}
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                  {vendor.category}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-2">
                {vendor.name}
              </h1>
              {vendor.city && (
                <p className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  {vendor.city}
                </p>
              )}
            </div>

            <div className="flex items-center gap-6">
              {vendor.rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-bold text-slate-900">{vendor.rating.toFixed(1)}</span>
                  {vendor.reviewCount && (
                    <span className="text-sm text-slate-500">({vendor.reviewCount} reviews)</span>
                  )}
                </div>
              )}
              {vendor.completedEvents && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>{vendor.completedEvents} events completed</span>
                </div>
              )}
            </div>

            {vendor.description && (
              <Card className="p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-3">About</h2>
                <p className="text-slate-600 leading-relaxed">{vendor.description}</p>
              </Card>
            )}

            {vendor.services && vendor.services.length > 0 && (
              <Card className="p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Services</h2>
                <div className="flex flex-wrap gap-2">
                  {vendor.services.map((service, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-lime/10 text-dark rounded-full text-sm font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {service}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {vendor.serviceProfiles && vendor.serviceProfiles.length > 0 && (
              <Card className="p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Service Profiles</h2>
                <div className="grid grid-cols-1 gap-4">
                  {vendor.serviceProfiles.map((service) => {
                    const image = service.bannerImage || service.images?.[0];
                    return (
                      <div key={service.id} className="overflow-hidden rounded-xl border border-slate-100 bg-white">
                        {image && (
                          <img src={image} alt="" className="h-44 w-full object-cover bg-slate-100" />
                        )}
                        <div className="p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="font-bold text-slate-900">{service.name}</h3>
                              <p className="text-sm text-slate-500">{service.subcategory || service.category}</p>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="font-bold text-slate-900">{service.pricing}</p>
                              <p className="text-xs capitalize text-slate-400">{service.pricingModel}</p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
                          {service.tags && service.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {service.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{tag}</span>
                              ))}
                            </div>
                          )}
                          {(service.rateCardUrl || service.portfolioUrl || service.socialUrl) && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {service.rateCardUrl && (
                                <a href={service.rateCardUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                  <FileText className="w-4 h-4" />
                                  Rate card
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {service.portfolioUrl && (
                                <a href={service.portfolioUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                  <LinkIcon className="w-4 h-4" />
                                  Portfolio
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {service.socialUrl && (
                                <a href={service.socialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                  <Share2 className="w-4 h-4" />
                                  Social
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {vendor.portfolio && vendor.portfolio.length > 0 && (
              <Card className="p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Portfolio</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {vendor.portfolio.map((img, idx) => (
                    <div key={idx} className="aspect-square bg-gradient-to-br from-lime/10 to-lime/5 rounded-xl" />
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Contact</h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${vendor.contactEmail}`}
                  className="flex items-center gap-3 text-sm text-slate-600 hover:text-lime transition-colors"
                >
                  <div className="w-9 h-9 bg-lime/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-dark" />
                  </div>
                  {vendor.contactEmail}
                </a>
                <a
                  href={`tel:${vendor.contactPhone}`}
                  className="flex items-center gap-3 text-sm text-slate-600 hover:text-lime transition-colors"
                >
                  <div className="w-9 h-9 bg-lime/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-dark" />
                  </div>
                  {vendor.contactPhone}
                </a>
              </div>
            </Card>

            <Button className="w-full" href={`mailto:${vendor.contactEmail}`}>
              Send Inquiry
            </Button>
            <Button variant="outline" className="w-full" href="/explore">
              View Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
