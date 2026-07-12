"use client";
import React from "react";
import MarketplaceVisibilityToggle from "@/components/marketplace/MarketplaceVisibilityToggle";

export default function OrganizerMarketplacePage() {
  return (
    <div className="max-w-3xl">
      <MarketplaceVisibilityToggle userType="organizer" />
    </div>
  );
}
