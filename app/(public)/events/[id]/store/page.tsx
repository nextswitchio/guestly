"use client";
import { Lock, PartyPopper, Store } from 'lucide-react';
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/features/merchandise/CartProvider";
import { useToast } from "@/components/ui/ToastProvider";
import ProductCard from "@/components/merchandise/ProductCard";
import type { Product } from "@/types/merchandise";

// ── Icons ────────────────────────────────────────────────────────────────────

function CartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.002-.881 2.002-2V5.272M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function EventStorePage() {
  const { id: eventId } = useParams<{ id: string }>();
  const { addItem, count } = useCart();
  const { addToast } = useToast();

  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [eventTitle, setEventTitle] = React.useState("");
  const [eventDate, setEventDate] = React.useState("");
  const [postEventMerchSales, setPostEventMerchSales] = React.useState(false);
  const [filter, setFilter] = React.useState<string>("All");

  React.useEffect(() => {
    async function load() {
      const [prodRes, evRes] = await Promise.all([
        fetch(`/api/merch?eventId=${eventId}`),
        fetch(`/api/events/${eventId}`),
      ]);
      if (prodRes.ok) {
        const d = await prodRes.json();
        setProducts(d.products);
      }
      if (evRes.ok) {
        const d = await evRes.json();
        const event = d.data || d.event || d;
        setEventTitle(event.title || "Event");
        setEventDate(event.date || "");
        setPostEventMerchSales(event.postEventMerchSales || false);
      }
      setLoading(false);
    }
    load();
  }, [eventId]);

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...cats];
  }, [products]);

  const filtered = filter === "All" ? products : products.filter((p) => p.category === filter);

  // Check if merchandise is available
  const isEventPast = eventDate && new Date(eventDate) < new Date();
  const isMerchAvailable = !isEventPast || postEventMerchSales;

  function handleAdd(product: Product, size?: string) {
    if (product.stock <= 0) return;
    addItem({
      productId: product.id,
      eventId: product.eventId,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
    });
    const sizeText = size ? ` (${size})` : '';
    addToast(`${product.name}${sizeText} added to cart`, { type: "success" });
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero / header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-5">
          <div>
            <nav className="mb-1 flex items-center gap-1.5 text-xs text-neutral-400">
              <Link href="/" className="hover:text-neutral-600">Home</Link>
              <span>/</span>
              <Link href="/explore" className="hover:text-neutral-600">Events</Link>
              <span>/</span>
              <Link href={`/events/${eventId}`} className="hover:text-neutral-600">{eventTitle || "Event"}</Link>
              <span>/</span>
              <span className="text-neutral-600">Store</span>
            </nav>
            <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">{eventTitle} Store</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Official merchandise — grab yours before it&apos;s gone!
            </p>
          </div>

          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50"
          >
            <CartIcon />
            Cart
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-lime text-[10px] font-bold text-dark">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Merchandise availability notice */}
        {!isMerchAvailable && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl"><Lock className="h-4 w-4 inline-block" /></span>
              <div>
                <h3 className="text-sm font-semibold text-amber-900">Store Closed</h3>
                <p className="mt-1 text-xs text-amber-700">
                  This event has ended and the merchandise store is no longer accepting orders.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Post-event sales notice */}
        {isEventPast && postEventMerchSales && (
          <div className="mb-6 rounded-xl border border-lime/20 bg-lime/5 p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl"><PartyPopper className="h-4 w-4 inline-block" /></span>
              <div>
                <h3 className="text-sm font-semibold text-dark">Post-Event Sales Active</h3>
                <p className="mt-1 text-xs text-dark/70">
                  The event has ended, but you can still purchase merchandise!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category filter */}
        {categories.length > 2 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${filter === cat
                    ? "bg-lime text-dark"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-lime"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-neutral-200" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <span className="text-5xl"><Store className="h-4 w-4 inline-block" /></span>
            <h2 className="text-base font-semibold text-neutral-800">No products available</h2>
            <p className="text-sm text-neutral-500">Check back closer to the event for merchandise.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                eventId={eventId}
                onAddToCart={handleAdd}
                disabled={!isMerchAvailable}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
