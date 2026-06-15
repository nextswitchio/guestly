'use client';
import { RefreshCw, ShoppingBag } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useRouter } from 'next/navigation';

interface MerchProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sold: number;
  imageUrl: string;
  eventId?: string;
}

export default function MerchDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<MerchProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/merch');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalSold: products.reduce((sum, p) => sum + p.sold, 0),
    totalRevenue: products.reduce((sum, p) => sum + (p.price * p.sold), 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Merchandise</h1>
          <p className="text-neutral-500 mt-1">
            Manage your event merchandise and track sales
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/merch/new')}
          className="flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors"
        >
          <Icon name="plus" size={18} />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Total Products</p>
          <p className="text-2xl font-bold mt-1 text-neutral-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">In Stock</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{stats.inStock}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Out of Stock</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{stats.outOfStock}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Total Sold</p>
          <p className="text-2xl font-bold mt-1 text-neutral-900">{stats.totalSold}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 col-span-2 sm:col-span-1">
          <p className="text-sm text-neutral-500">Revenue</p>
          <p className="text-2xl font-bold mt-1 text-neutral-900">₦{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
          <div className="flex h-16 w-16 mx-auto mb-4 items-center justify-center rounded-full bg-neutral-100">
            <ShoppingBag className="h-8 w-8 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">No products yet</h3>
          <p className="text-neutral-500 mb-4">
            Start selling merchandise for your events
          </p>
          <button
            onClick={() => router.push('/dashboard/merch/new')}
            className="rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
              <div className="aspect-square bg-neutral-100 relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-neutral-300" />
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-neutral-900 mb-1">{product.name}</h3>
                <p className="text-sm text-neutral-500 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-neutral-900">₦{product.price.toLocaleString()}</span>
                  <span className="text-sm text-neutral-500">
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                  <span>Sold: {product.sold}</span>
                  <span>Revenue: ₦{(product.price * product.sold).toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/merch/${product.id}/edit`)}
                    className="flex-1 rounded-xl border border-neutral-200 bg-white py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/merch/${product.id}/orders`)}
                    className="flex-1 rounded-xl border border-neutral-200 bg-white py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Orders
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
