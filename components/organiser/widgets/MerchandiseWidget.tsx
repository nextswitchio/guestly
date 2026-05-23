"use client";
import { ArrowRight, ShoppingBag } from 'lucide-react';
import React from "react";
import Card from "@/components/ui/Card";
import Link from "next/link";

interface BestSellerItem {
  id: string;
  name: string;
  sold: number;
  revenue: number;
  image: string;
  eventId: string;
}

interface MerchandiseWidgetProps {
  totalProducts: number;
  unitsSold: number;
  revenue: number;
  bestSellers: BestSellerItem[];
}

export function MerchandiseWidget({
  totalProducts = 0,
  unitsSold = 0,
  revenue = 0,
  bestSellers = [],
}: MerchandiseWidgetProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card variant="elevated" padding="lg" hoverable className="lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Merchandise Sales
          </h2>
          <p className="text-xs text-[var(--foreground-muted)]">
            Separate from ticket revenue
          </p>
        </div>
        <Link
          href="/dashboard/merch"
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          View all<ArrowRight className="h-4 w-4 inline" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg bg-[var(--surface-bg)] p-3 border border-[var(--surface-border)]">
          <p className="text-xs text-[var(--foreground-muted)]">Revenue</p>
          <p className="text-lg font-bold text-[var(--foreground)] mt-1">
            {formatCurrency(revenue)}
          </p>
        </div>
        <div className="rounded-lg bg-[var(--surface-bg)] p-3 border border-[var(--surface-border)]">
          <p className="text-xs text-[var(--foreground-muted)]">Units Sold</p>
          <p className="text-lg font-bold text-[var(--foreground)] mt-1">
            {unitsSold.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg bg-[var(--surface-bg)] p-3 border border-[var(--surface-border)]">
          <p className="text-xs text-[var(--foreground-muted)]">Products</p>
          <p className="text-lg font-bold text-[var(--foreground)] mt-1">
            {totalProducts}
          </p>
        </div>
      </div>

      {/* Best Sellers */}
      {bestSellers.length > 0 ? (
        <div>
          <h3 className="text-xs font-semibold text-[var(--foreground-muted)] mb-3">
            Best Selling Items
          </h3>
          <div className="space-y-2">
            {bestSellers.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors group"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-600 text-sm font-bold shrink-0">
                  #{index + 1}
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--surface-bg)] border border-[var(--surface-border)] text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {item.sold} sold · {formatCurrency(item.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2"><ShoppingBag className="h-4 w-4 inline-block" /></div>
          <p className="text-sm text-[var(--foreground-muted)]">
            No merchandise sales yet
          </p>
          <Link
            href="/dashboard/merch"
            className="inline-block mt-2 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Add products to your store
          </Link>
        </div>
      )}
    </Card>
  );
}
