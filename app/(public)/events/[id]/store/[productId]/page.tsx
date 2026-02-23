"use client";
import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/features/merchandise/CartProvider";
import { useToast } from "@/components/ui/ToastProvider";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Product } from "@/types/merchandise";

// ── Icons ────────────────────────────────────────────────────────────────────

function MinusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.002-.881 2.002-2V5.272M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id: eventId, productId } = useParams<{ id: string; productId: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [qty, setQty] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState<string | undefined>();

  React.useEffect(() => {
    async function load() {
      const res = await fetch(`/api/merch?id=${productId}`);
      if (res.ok) {
        const d = await res.json();
        setProduct(d.product);
        if (d.product?.sizes?.length) setSelectedSize(d.product.sizes[0]);
      }
      setLoading(false);
    }
    load();
  }, [productId]);

  function handleAdd() {
    if (!product || product.stock <= 0) return;
    addItem(
      {
        productId: product.id,
        eventId: product.eventId,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
      },
      qty
    );
    addToast(`${qty}× ${product.name} added to cart`, "success");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="container py-10">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-neutral-200" />
            <div className="space-y-4">
              <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200" />
              <div className="h-5 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="h-20 animate-pulse rounded-xl bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 text-center">
        <span className="text-5xl">😕</span>
        <h1 className="text-lg font-bold text-neutral-900">Product not found</h1>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-neutral-400">
          <Link href="/" className="hover:text-neutral-600">Home</Link>
          <span>/</span>
          <Link href={`/events/${eventId}`} className="hover:text-neutral-600">Event</Link>
          <span>/</span>
          <Link href={`/events/${eventId}/store`} className="hover:text-neutral-600">Store</Link>
          <span>/</span>
          <span className="text-neutral-600 truncate max-w-40">{product.name}</span>
        </nav>

        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-neutral-100 bg-white text-8xl shadow-sm">
            {product.image}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <Badge variant="neutral" className="mb-2 w-fit">{product.category}</Badge>
            <h1 className="text-2xl font-bold text-neutral-900">{product.name}</h1>
            <p className="mt-2 text-base font-bold text-primary-600 tabular-nums">${product.price}</p>

            <p className="mt-4 text-sm leading-relaxed text-neutral-600">{product.description}</p>

            {/* Stock */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              {outOfStock ? (
                <span className="font-medium text-red-500">Out of stock</span>
              ) : product.stock <= 10 ? (
                <span className="font-medium text-warning-600">Only {product.stock} left</span>
              ) : (
                <span className="text-success-600">{product.stock} in stock</span>
              )}
              <span className="text-neutral-300">·</span>
              <span className="text-neutral-400">{product.sold} sold</span>
            </div>

            {/* Size picker */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${selectedSize === s
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Quantity</p>
              <div className="inline-flex items-center rounded-xl border border-neutral-200 bg-white">
                <button
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center text-neutral-500 transition hover:text-neutral-900 disabled:opacity-30"
                >
                  <MinusIcon />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-neutral-900 tabular-nums">
                  {qty}
                </span>
                <button
                  disabled={qty >= product.stock}
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="flex h-10 w-10 items-center justify-center text-neutral-500 transition hover:text-neutral-900 disabled:opacity-30"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                disabled={outOfStock}
                onClick={handleAdd}
                className="flex-1 gap-2"
              >
                <CartIcon />
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push(`/events/${eventId}/store`)}
                className="gap-2"
              >
                <ArrowLeftIcon />
                Back to Store
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
