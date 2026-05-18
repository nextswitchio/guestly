"use client";
import { Download, Package, Truck } from 'lucide-react';
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FulfillmentBadge from "@/components/merchandise/FulfillmentBadge";
import type { MerchOrder } from "@/types/merchandise";

function ConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = React.useState<MerchOrder | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (orderId) {
      fetch(`/api/merch/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrder(data.order);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600" />
      </div>
    );
  }

  const hasPickupItems = order?.items.some(item => item.fulfillmentType === "pickup");
  const hasDeliveryItems = order?.items.some(item => item.fulfillmentType === "delivery");
  const hasDigitalItems = order?.items.some(item => item.fulfillmentType === "digital");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto w-full max-w-2xl">
        {/* Success Header */}
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-neutral-100 bg-white p-8 text-center shadow-sm mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
            <svg className="h-8 w-8 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Order Confirmed!</h1>
            <p className="mt-1 text-sm text-neutral-600">Your merchandise order has been placed successfully.</p>
            {orderId && (
              <p className="mt-2 text-xs text-neutral-500">Order ID: <span className="font-mono font-medium">{orderId}</span></p>
            )}
          </div>
        </div>

        {/* Order Details */}
        {order && (
          <>
            {/* Items */}
            <Card className="mb-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                      {item.size && (
                        <p className="text-xs text-neutral-500">Size: {item.size}</p>
                      )}
                      <div className="mt-1">
                        <FulfillmentBadge type={item.fulfillmentType} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-neutral-900 tabular-nums">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-neutral-500">×{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between">
                <span className="text-sm font-semibold text-neutral-900">Total</span>
                <span className="text-base font-bold text-neutral-900 tabular-nums">${order.total.toFixed(2)}</span>
              </div>
            </Card>

            {/* Fulfillment Information */}
            {hasPickupItems && (
              <Card className="mb-6 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <span className="text-xl"><Package className="h-4 w-4 inline-block" /></span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900">Pickup Instructions</h3>
                    <p className="mt-1 text-xs text-blue-700">
                      Items marked for pickup can be collected at the event. Check individual product details for specific pickup locations.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {hasDeliveryItems && order.shippingAddress && (
              <Card className="mb-6 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <span className="text-xl"><Truck className="h-4 w-4 inline-block" /></span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-green-900">Delivery Address</h3>
                    <div className="mt-2 text-xs text-green-700">
                      <p className="font-medium">{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                      <p>{order.shippingAddress.country}</p>
                      <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {hasDigitalItems && (
              <Card className="mb-6 bg-purple-50 border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                    <span className="text-xl"><Download className="h-4 w-4 inline-block" /></span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-purple-900">Digital Downloads</h3>
                    <p className="mt-1 text-xs text-purple-700">
                      Download links for digital items will be sent to your email shortly.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/wallet" className="flex-1">
            <Button variant="outline" className="w-full">View Wallet</Button>
          </Link>
          <Link href="/explore" className="flex-1">
            <Button className="w-full">Browse Events</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MerchOrderConfirmation() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}

