'use client';
import { RefreshCw, Package, Eye } from 'lucide-react';

import { useState, useEffect, use } from 'react';

interface MerchOrder {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  total: number;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: number;
}

export default function MerchOrdersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [orders, setOrders] = useState<MerchOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [id]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/merch/${id}/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setProductName(data.productName || 'Product');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnits = orders.reduce((sum, o) => sum + o.quantity, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Orders: {productName}</h1>
        <p className="text-neutral-500 mt-1">View and manage merchandise orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Total Orders</p>
          <p className="text-2xl font-bold mt-1 text-neutral-900">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Units Sold</p>
          <p className="text-2xl font-bold mt-1 text-neutral-900">{totalUnits}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Revenue</p>
          <p className="text-2xl font-bold mt-1 text-neutral-900">₦{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Order ID</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Qty</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Total</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-6 py-4 text-sm font-mono text-neutral-900">{order.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-neutral-900">{order.customerName}</p>
                    <p className="text-xs text-neutral-500">{order.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-900">{order.quantity}</td>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900">₦{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex h-12 w-12 mx-auto mb-3 items-center justify-center rounded-full bg-neutral-100">
                      <Package className="w-6 h-6 text-neutral-400" />
                    </div>
                    <p className="text-neutral-500">No orders yet for this product</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
