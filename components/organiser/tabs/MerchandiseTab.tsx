import { ShoppingBag, Store } from 'lucide-react';
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
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const avgPrice = products.length > 0 ? totalRevenue / totalSold || 0 : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Stats Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-3xl"><ShoppingBag className="h-4 w-4 inline-block" /></span>
            <h3 className="text-lg font-semibold">Merchandise Store</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-white/80">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">${totalRevenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Items Sold</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{totalSold}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Products</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{products.length}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Avg. Price</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">${avgPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Products</h3>
          <p className="text-sm text-neutral-500">{products.length} product{products.length !== 1 ? "s" : ""} available</p>
        </div>
        <Button size="sm" className="gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </Button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-neutral-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
            <span className="text-3xl"><Store className="h-4 w-4 inline-block" /></span>
          </div>
          <div>
            <p className="text-base font-semibold text-neutral-900">No products yet</p>
            <p className="mt-1 text-sm text-neutral-500">Add merchandise to sell at this event</p>
          </div>
          <Button size="sm" className="mt-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add First Product
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const outOfStock = p.stock <= 0;
            const lowStock = p.stock > 0 && p.stock <= 10;
            const soldPercentage = Math.min(100, (p.sold / (p.sold + p.stock)) * 100);

            return (
              <Card key={p.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
                {/* Product Image/Icon */}
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
                  <span className="text-6xl transition-transform group-hover:scale-110">{p.image}</span>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <h4 className="text-base font-semibold text-neutral-900">{p.name}</h4>
                    <p className="mt-1 text-2xl font-bold text-primary-600 tabular-nums">${p.price}</p>
                  </div>

                  {/* Sales Stats */}
                  <div className="mb-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Sold</span>
                      <span className="font-semibold text-neutral-900">{p.sold} units</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Stock</span>
                      <span className={`font-semibold ${outOfStock ? "text-red-600" : lowStock ? "text-warning-600" : "text-success-600"}`}>
                        {outOfStock ? "Sold out" : `${p.stock} left`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Revenue</span>
                      <span className="font-semibold text-neutral-900">${(p.sold * p.price).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Sales Progress</span>
                      <span className="font-medium text-neutral-700">{soldPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          outOfStock ? "bg-red-500" : lowStock ? "bg-warning-500" : "bg-success-500"
                        }`}
                        style={{ width: `${soldPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" fullWidth>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" fullWidth>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View
                    </Button>
                  </div>
                </div>

                {/* Status Badge */}
                {outOfStock && (
                  <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    Sold Out
                  </div>
                )}
                {lowStock && !outOfStock && (
                  <div className="absolute right-3 top-3 rounded-full bg-warning-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    Low Stock
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Stats */}
      {products.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-gradient-to-br from-success-50 to-success-100/50">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-500 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-success-700">Total Revenue</p>
                <p className="text-2xl font-bold text-success-900 tabular-nums">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-primary-700">Items Sold</p>
                <p className="text-2xl font-bold text-primary-900 tabular-nums">{totalSold}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-warning-50 to-warning-100/50">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning-500 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-warning-700">Stock Remaining</p>
                <p className="text-2xl font-bold text-warning-900 tabular-nums">{totalStock}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

