'use client';
import { Briefcase, Building2, GraduationCap, Theater } from 'lucide-react';
import React from 'react';

import { useState, useEffect } from "react";

interface Community {
  name: string;
  type?: "campus" | "neighborhood" | "professional" | "cultural";
  count: number;
}

interface CommunityType {
  type: "campus" | "neighborhood" | "professional" | "cultural";
  count: number;
}

interface CommunityFilterProps {
  city?: string;
  selectedCommunity?: string;
  selectedCommunityType?: string;
  onCommunityChange: (community: string | undefined) => void;
  onCommunityTypeChange: (type: string | undefined) => void;
  isDark?: boolean;
}

const communityTypeLabels: Record<string, string> = {
  campus: "Campus",
  neighborhood: "Neighborhood",
  professional: "Professional",
  cultural: "Cultural",
};

const communityTypeIcons: Record<string, React.ReactNode> = {
  campus: <GraduationCap className="h-4 w-4" />,
  neighborhood: <Building2 className="h-4 w-4" />,
  professional: <Briefcase className="h-4 w-4" />,
  cultural: <Theater className="h-4 w-4" />,
};

export default function CommunityFilter({
  city,
  selectedCommunity,
  selectedCommunityType,
  onCommunityChange,
  onCommunityTypeChange,
  isDark = false,
}: CommunityFilterProps) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityTypes, setCommunityTypes] = useState<CommunityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        setLoading(true);
        const url = city
          ? `/api/communities?city=${encodeURIComponent(city)}`
          : "/api/communities";
        const res = await fetch(url);
        const json = await res.json();
        if (json.success) {
          setCommunities(json.data.communities);
          setCommunityTypes(json.data.communityTypes);
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCommunities();
  }, [city]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className={`h-8 animate-pulse rounded-lg ${isDark ? "bg-[#1e6470]" : "bg-surface-card"}`} />
        <div className={`h-8 animate-pulse rounded-lg ${isDark ? "bg-[#1e6470]" : "bg-surface-card"}`} />
      </div>
    );
  }

  if (communities.length === 0 && communityTypes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Community Type Filter */}
      {communityTypes.length > 0 && (
        <div>
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-foreground"}`}>
            Community Type
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCommunityTypeChange(undefined)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !selectedCommunityType
                  ? isDark
                    ? "bg-lime text-dark shadow-md"
                    : "bg-primary-500 text-white shadow-md"
                  : isDark
                  ? "bg-[#1e6470] text-[#d4e8eb] hover:bg-[#3d8993]"
                  : "bg-surface-card text-foreground-muted hover:bg-surface-hover"
              }`}
            >
              All Types
            </button>
            {communityTypes.map((ct) => (
              <button
                key={ct.type}
                onClick={() => onCommunityTypeChange(ct.type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCommunityType === ct.type
                    ? isDark
                      ? "bg-lime text-dark shadow-md"
                      : "bg-primary-500 text-white shadow-md"
                    : isDark
                    ? "bg-[#1e6470] text-[#d4e8eb] hover:bg-[#3d8993]"
                    : "bg-surface-card text-foreground-muted hover:bg-surface-hover"
                }`}
              >
                <span>{communityTypeIcons[ct.type]}</span>
                <span>{communityTypeLabels[ct.type]}</span>
                <span className="text-xs opacity-75">({ct.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Specific Communities Filter */}
      {communities.length > 0 && (
        <div>
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-foreground"}`}>
            Communities
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCommunityChange(undefined)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !selectedCommunity
                  ? isDark
                    ? "bg-lime text-dark shadow-md"
                    : "bg-primary-500 text-white shadow-md"
                  : isDark
                  ? "bg-[#1e6470] text-[#d4e8eb] hover:bg-[#3d8993]"
                  : "bg-surface-card text-foreground-muted hover:bg-surface-hover"
              }`}
            >
              All Communities
            </button>
            {communities.map((community) => (
              <button
                key={community.name}
                onClick={() => onCommunityChange(community.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCommunity === community.name
                    ? isDark
                      ? "bg-lime text-dark shadow-md"
                      : "bg-primary-500 text-white shadow-md"
                    : isDark
                    ? "bg-[#1e6470] text-[#d4e8eb] hover:bg-[#3d8993]"
                    : "bg-surface-card text-foreground-muted hover:bg-surface-hover"
                }`}
              >
                {community.type && (
                  <span className="text-xs">{communityTypeIcons[community.type]}</span>
                )}
                <span>{community.name}</span>
                <span className="text-xs opacity-75">({community.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
