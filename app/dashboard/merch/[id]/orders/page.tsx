'use client';
import { RefreshCw, Package, Eye } from 'lucide-react';

import { useState, useEffect, use } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders: {productName}</h1>
        <p className="text-slate-500 mt-1">View and manage merchandise orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Total Orders</p>
          <p className="text-2xl font-bold mt-1">{orders.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Units Sold</p>
          <p className="text-2xl font-bold mt-1">{totalUnits}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="text-2xl font-bold mt-1">₦{totalRevenue.toLocaleString()}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Order ID</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Qty</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Total</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-mono">{order.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{order.quantity}</td>
                  <td className="px-6 py-4 text-sm font-medium">₦{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No orders yet for this product</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
