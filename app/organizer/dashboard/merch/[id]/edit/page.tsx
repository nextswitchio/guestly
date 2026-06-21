'use client';
import { RefreshCw } from 'lucide-react';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import CloudinaryUploadField from '@/components/ui/CloudinaryUploadField';
import { useToast } from '@/components/ui/ToastProvider';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  eventId?: string;
}

export default function EditMerchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/merch/${id}`);
      if (response.ok) {
        const data = await response.json();
        setForm(data.product || data);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/merch/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        addToast('Product updated successfully!', { type: 'success' });
        router.push('/dashboard/merch');
      } else {
        const data = await response.json();
        const msg = data.error || 'Failed to update product';
        setError(msg);
        addToast(msg, { type: 'error' });
      }
    } catch {
      const msg = 'Network error. Please try again.';
      setError(msg);
      addToast(msg, { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Edit Product</h1>
        <p className="text-neutral-500 mt-1">Update merchandise product details</p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={4}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Price (₦)</label>
                <input
                  type="number"
                  value={form.price.toString()}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  required
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Stock</label>
                <input
                  type="number"
                  value={form.stock.toString()}
                  onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                  required
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                />
              </div>
            </div>
            <CloudinaryUploadField
              label="Product Image"
              value={form.imageUrl}
              onChange={(imageUrl) => setForm({ ...form, imageUrl })}
              folder="guestly/merch/products"
              accept="image/*"
              placeholder="Upload product image"
            />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={saving}>
                Save Changes
              </Button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/merch')}
                className="rounded-xl border border-neutral-200 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}
