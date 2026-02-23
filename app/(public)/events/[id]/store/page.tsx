"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/features/merchandise/CartProvider";
import { useToast } from "@/components/ui/ToastProvider";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Product } from "@/types/merchandise";

// ── Icons ────────────────────────────────────────────────────────────────────

function CartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.002-.881 2.002-2V5.272M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
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

function StockIndicator({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="text-xs font-medium text-red-500">Sold out</span>;
  if (stock <= 10) return <span className="text-xs font-medium text-warning-600">Only {stock} left</span>;
  return <span className="text-xs text-success-600">In stock</span>;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function EventStorePage() {
  const { id: eventId } = useParams<{ id: string }>();
  const { addItem, count } = useCart();
  const { addToast } = useToast();

  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [eventTitle, setEventTitle] = React.useState("");
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
        setEventTitle(d.data?.title || d.event?.title || d.title || "Event");
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

  function handleAdd(product: Product) {
    if (product.stock <= 0) return;
    addItem({
      productId: product.id,
      eventId: product.eventId,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    addToast(`${product.name} added to cart`, "success");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero / header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container flex items-center justify-between py-5">
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
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="container py-6">
        {/* Category filter */}
        {categories.length > 2 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${filter === cat
                    ? "bg-primary-600 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300"
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
            <span className="text-5xl">🏪</span>
            <h2 className="text-base font-semibold text-neutral-800">No products available</h2>
            <p className="text-sm text-neutral-500">Check back closer to the event for merchandise.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image area */}
                <Link
                  href={`/events/${eventId}/store/${product.id}`}
                  className="flex h-44 items-center justify-center bg-neutral-50 text-6xl transition group-hover:bg-neutral-100"
                >
                  {product.image}
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/events/${eventId}/store/${product.id}`}
                      className="text-sm font-semibold text-neutral-900 transition hover:text-primary-600"
                    >
                      {product.name}
                    </Link>
                    <Badge variant="neutral" className="shrink-0 text-[10px]">
                      {product.category}
                    </Badge>
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                    {product.description}
                  </p>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div>
                      <p className="text-lg font-bold text-primary-600 tabular-nums">
                        ${product.price}
                      </p>
                      <StockIndicator stock={product.stock} />
                    </div>
                    <Button
                      size="sm"
                      disabled={product.stock <= 0}
                      onClick={() => handleAdd(product)}
                      className="gap-1"
                    >
                      <PlusIcon />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
