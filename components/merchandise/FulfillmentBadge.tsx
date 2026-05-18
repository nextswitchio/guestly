"use client";
import { Download, Package, Truck } from 'lucide-react';
import React from "react";
import Badge from "@/components/ui/Badge";
import type { FulfillmentType } from "@/types/merchandise";

interface FulfillmentBadgeProps {
  type: FulfillmentType;
  className?: string;
}

export default function FulfillmentBadge({ type, className }: FulfillmentBadgeProps) {
  const config: Record<string, { label: string; icon: React.ReactNode; variant: "primary" | "success" | "warning" | "danger" }> = {
    pickup: {
      label: "Pickup at Event",
      icon: <Package className="h-3.5 w-3.5" />,
      variant: "primary" as const,
    },
    delivery: {
      label: "Delivery",
      icon: <Truck className="h-3.5 w-3.5" />,
      variant: "success" as const,
    },
    digital: {
      label: "Digital Download",
      icon: <Download className="h-3.5 w-3.5" />,
      variant: "warning" as const,
    },
  };

  const { label, icon, variant } = config[type] || config.pickup;

  return (
    <Badge variant={variant} className={className}>
      <span className="mr-1">{icon}</span>
      {label}
    </Badge>
  );
}
