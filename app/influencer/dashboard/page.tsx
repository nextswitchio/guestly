"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, User, ArrowRight, Star, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function InfluencerDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [listingStatus, setListingStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/marketplace/profile").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/marketplace/profile/status").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([profileData, statusData]) => {
        setProfile(profileData);
        setListingStatus(statusData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-lime" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">Welcome back!</h1>
        <p className="text-gray-500 mt-1">Manage your influencer profile and marketplace presence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10">
              <Eye className="h-5 w-5 text-lime" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Marketplace</p>
              <p className="font-semibold text-dark">{listingStatus?.is_marketplace_visible ? "Visible" : "Hidden"}</p>
            </div>
          </div>
          <Link href="/influencer/dashboard/marketplace" className="text-sm text-lime font-medium hover:underline flex items-center gap-1">
            Manage visibility <ArrowRight className="w-3 h-3" />
          </Link>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <p className="font-semibold text-dark">{profile?.rating?.toFixed(1) || "N/A"}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">{profile?.review_count || 0} reviews</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Jobs</p>
              <p className="font-semibold text-dark">{profile?.completed_jobs || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/influencer/dashboard/profile">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime/10">
                <User className="h-6 w-6 text-dark" />
              </div>
              <div>
                <h3 className="font-semibold text-dark">Edit Profile</h3>
                <p className="text-sm text-gray-500">Update your bio, categories, and portfolio</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 ml-auto" />
            </div>
          </Card>
        </Link>

        <Link href="/influencer/dashboard/marketplace">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                <Eye className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-dark">Marketplace Visibility</h3>
                <p className="text-sm text-gray-500">Control your presence in marketplace search</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 ml-auto" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
