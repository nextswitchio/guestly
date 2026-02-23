"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Product } from "@/types/merchandise";

// ── Icons ────────────────────────────────────────────────────────────────────

function PackageIcon() {
  return (
    <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.002-.881 2.002-2V5.272M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="h-5 w-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function MerchPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [stats, setStats] = React.useState({ totalProducts: 0, unitsSold: 0, revenue: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      const [pRes, sRes] = await Promise.all([
        fetch("/api/merch"),
        fetch("/api/merch?stats=true"),
      ]);
      if (pRes.ok) {
        const d = await pRes.json();
        setProducts(d.products);
      }
      if (sRes.ok) {
        const d = await sRes.json();
        setStats(d);
      }
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: <PackageIcon />, bg: "bg-primary-50" },
    { label: "Units Sold", value: stats.unitsSold.toLocaleString(), icon: <CartIcon />, bg: "bg-success-50" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: <DollarIcon />, bg: "bg-warning-50" },
  ];

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Merchandise</h1>
            <p className="mt-1 text-sm text-neutral-500">Manage products linked to your events</p>
          </div>
          <Button className="gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {statCards.map((s) => (
            <Card key={s.label} className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-lg font-bold text-neutral-900 tabular-nums">{s.value}</p>
                <p className="text-xs text-neutral-500">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => {
              const lowStock = p.stock > 0 && p.stock <= 10;
              const outOfStock = p.stock <= 0;

              return (
                <Card key={p.id} className="group flex flex-col items-center p-5 text-center transition hover:shadow-md">
                  <span className="text-5xl">{p.image}</span>
                  <h3 className="mt-3 text-sm font-semibold text-neutral-900">{p.name}</h3>
                  <p className="mt-1 text-lg font-bold text-primary-600 tabular-nums">${p.price}</p>

                  <Badge variant="neutral" className="mt-1.5 text-[10px]">
                    {p.category}
                  </Badge>

                  {/* Stock bar */}
                  <div className="mt-3 w-full">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Sold: <span className="font-medium text-neutral-900">{p.sold}</span></span>
                      <span className={outOfStock ? "font-medium text-red-500" : lowStock ? "font-medium text-warning-600" : "text-neutral-500"}>
                        {outOfStock ? "Out of stock" : `Stock: ${p.stock}`}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className={`h-full rounded-full transition-all ${outOfStock ? "bg-red-400" : lowStock ? "bg-warning-400" : "bg-success-400"
                          }`}
                        style={{ width: `${Math.min(100, (p.sold / (p.sold + p.stock)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
                    Edit Product
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

