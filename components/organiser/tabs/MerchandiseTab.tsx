"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { Product } from "@/types/merchandise";

interface MerchandiseTabProps {
  eventId: string;
}

export default function MerchandiseTab({ eventId }: MerchandiseTabProps) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      const res = await fetch(`/api/merch?eventId=${eventId}`);
      if (res.ok) {
        const d = await res.json();
        setProducts(d.products);
      }
      setLoading(false);
    }
    load();
  }, [eventId]);

  const totalRevenue = products.reduce((s, p) => s + p.sold * p.price, 0);
  const totalSold = products.reduce((s, p) => s + p.sold, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{products.length} product{products.length !== 1 ? "s" : ""} linked to this event</p>
        <Button size="sm" className="gap-1 text-xs">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </Button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl bg-neutral-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-8 text-center">
          <span className="text-4xl">🏪</span>
          <p className="text-sm font-medium text-neutral-700">No products yet</p>
          <p className="text-xs text-neutral-400">Add merchandise to sell at this event.</p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          {products.map((p) => {
            const outOfStock = p.stock <= 0;
            const lowStock = p.stock > 0 && p.stock <= 10;

            return (
              <Card key={p.id} className="flex flex-col items-center p-5 text-center">
                <span className="text-4xl">{p.image}</span>
                <h4 className="mt-2 text-sm font-semibold text-neutral-900">{p.name}</h4>
                <p className="text-lg font-bold text-primary-600 tabular-nums">${p.price}</p>
                <div className="mt-2 w-full">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Sold: <span className="font-medium text-neutral-900">{p.sold}</span></span>
                    <span className={outOfStock ? "font-medium text-red-500" : lowStock ? "font-medium text-warning-600" : "text-neutral-500"}>
                      {outOfStock ? "Sold out" : `Left: ${p.stock}`}
                    </span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={`h-full rounded-full ${outOfStock ? "bg-red-400" : lowStock ? "bg-warning-400" : "bg-success-400"
                        }`}
                      style={{ width: `${Math.min(100, (p.sold / (p.sold + p.stock)) * 100)}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Revenue Note */}
      <Card className="bg-neutral-50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-50">
            <svg className="h-4 w-4 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900">Merch Revenue: ${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-neutral-500">Total across {totalSold} items sold</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

