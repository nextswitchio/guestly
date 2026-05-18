"use client";
import React from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import FulfillmentBadge from "@/components/merchandise/FulfillmentBadge";
import type { Product } from "@/types/merchandise";

/**
 * ProductCard Component
 * 
 * Displays merchandise products with attractive card design featuring:
 * - Product image with gradient background and hover effects
 * - Product name, description, category badge
 * - Fulfillment type indicator (pickup/delivery/digital)
 * - Size/color variant selector with visual feedback
 * - Stock availability indicator (in stock/low stock/sold out)
 * - Add to cart button with loading state
 * - Responsive design with hover elevation
 * 
 * Used in: Event merchandise store page
 * Requirements: 8.9 - Display merchandise prominently with attractive product cards
 */

// ── Icons ────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

// ── Stock Indicator ──────────────────────────────────────────────────────────

interface StockIndicatorProps {
  stock: number;
}

function StockIndicator({ stock }: StockIndicatorProps) {
  if (stock <= 0) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-danger-500" />
        <span className="text-xs font-medium text-danger-600">Sold out</span>
      </div>
    );
  }
  if (stock <= 10) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-warning-500" />
        <span className="text-xs font-medium text-warning-600">Only {stock} left</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
      <span className="text-xs font-medium text-success-600">In stock</span>
    </div>
  );
}

// ── Variant Selector ─────────────────────────────────────────────────────────

interface VariantSelectorProps {
  sizes?: string[];
  selectedSize?: string;
  onSizeChange: (size: string) => void;
  disabled?: boolean;
}

function VariantSelector({ sizes, selectedSize, onSizeChange, disabled }: VariantSelectorProps) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-neutral-700">Size</label>
      <div className="flex flex-wrap gap-1.5">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            disabled={disabled}
            className={`
              flex h-8 min-w-[2rem] items-center justify-center rounded-lg border px-2.5 text-xs font-medium
              transition-all duration-200
              ${selectedSize === size
                ? "border-primary-600 bg-primary-600 text-white shadow-sm"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50"
              }
              ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            `}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Product Card Component ───────────────────────────────────────────────────

export interface ProductCardProps {
  product: Product;
  eventId: string;
  onAddToCart: (product: Product, size?: string) => void;
  disabled?: boolean;
  showLink?: boolean;
}

export default function ProductCard({
  product,
  eventId,
  onAddToCart,
  disabled = false,
  showLink = true,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = React.useState<string | undefined>(
    product.sizes?.[0]
  );
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async () => {
    if (product.stock <= 0 || disabled) return;
    
    // If product has sizes but none selected, don't add
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return;
    }

    setIsAdding(true);
    
    // Simulate a brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onAddToCart(product, selectedSize);
    setIsAdding(false);
  };

  const isOutOfStock = product.stock <= 0;
  const isDisabled = disabled || isOutOfStock;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image area */}
      {showLink ? (
        <Link
          href={`/events/${eventId}/store/${product.id}`}
          className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 text-7xl transition-all duration-300 group-hover:scale-105"
        >
          {product.image}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900">
                Sold Out
              </span>
            </div>
          )}
        </Link>
      ) : (
        <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 text-7xl">
          {product.image}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900">
                Sold Out
              </span>
            </div>
          )}
        </div>
      )}

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          {showLink ? (
            <Link
              href={`/events/${eventId}/store/${product.id}`}
              className="text-sm font-semibold text-neutral-900 transition hover:text-primary-600 line-clamp-2"
            >
              {product.name}
            </Link>
          ) : (
            <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2">
              {product.name}
            </h3>
          )}
          <Badge variant="neutral" className="shrink-0 text-[10px]">
            {product.category}
          </Badge>
        </div>

        {/* Description */}
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-500">
          {product.description}
        </p>

        {/* Fulfillment badge */}
        <div className="mt-2.5">
          <FulfillmentBadge type={product.fulfillmentType} />
        </div>

        {/* Variant selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-3">
            <VariantSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              disabled={isDisabled}
            />
          </div>
        )}

        {/* Price and stock */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xl font-bold text-primary-600 tabular-nums">
                ${product.price.toFixed(2)}
              </p>
              <StockIndicator stock={product.stock} />
            </div>
          </div>

          {/* Add to cart button */}
          <Button
            variant="primary"
            size="md"
            disabled={isDisabled}
            onClick={handleAddToCart}
            className="mt-3 w-full gap-2 transition-all duration-200"
          >
            {isAdding ? (
              <>
                <CheckIcon />
                Added!
              </>
            ) : (
              <>
                <PlusIcon />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
