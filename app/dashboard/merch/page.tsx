'use client';
import { RefreshCw, ShoppingBag } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Merchandise</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your event merchandise and track sales
          </p>
        </div>
        <Button href="/dashboard/merch/new" className="flex items-center gap-2">
          <Icon name="plus" className="w-5 h-5" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">In Stock</p>
          <p className="text-2xl font-bold mt-1 text-success-500">{stats.inStock}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Out of Stock</p>
          <p className="text-2xl font-bold mt-1 text-danger-500">{stats.outOfStock}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Sold</p>
          <p className="text-2xl font-bold mt-1">{stats.totalSold}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
          <p className="text-2xl font-bold mt-1">₦{stats.totalRevenue.toLocaleString()}</p>
        </Card>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-4xl animate-spin"><RefreshCw className="h-4 w-4 inline-block" /></span>
        </div>
      ) : products.length === 0 ? (
        <Card className="p-12 text-center">
          <span className="text-6xl mb-4 block"><ShoppingBag className="h-4 w-4 inline-block" /></span>
          <h3 className="text-xl font-semibold mb-2">No products yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start selling merchandise for your events
          </p>
          <Button href="/dashboard/merch/new">Add Your First Product</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    <ShoppingBag className="h-4 w-4 inline-block" />
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-danger-500 text-white px-4 py-2 rounded-lg font-semibold">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold">₦{product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>Sold: {product.sold}</span>
                  <span>Revenue: ₦{(product.price * product.sold).toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/merch/${product.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/merch/${product.id}/orders`)}
                  >
                    Orders
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
