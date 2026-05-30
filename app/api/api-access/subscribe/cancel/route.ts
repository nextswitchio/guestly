import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendJson } from '@/lib/api/proxy';

export async function POST(req: NextRequest) {
  try {
    // The backend might have a specific endpoint for canceling subscriptions
    // For now, we'll try to find and patch the subscription
    const { data: subscriptions, status: subStatus, ok: subOk } = await fetchBackendJson(
      req,
      '/api/v1/api-access/billing/subscriptions'
    );
    
    if (!subOk) return NextResponse.json(subscriptions, { status: subStatus });
    
    // Find the first active subscription and mark it for cancellation
    const activeSubscriptions = Array.isArray(subscriptions) ? subscriptions.filter((sub: any) => sub.status === 'active') : [];
    
    if (activeSubscriptions.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }
    
    const subscriptionId = activeSubscriptions[0].id;
    
    // Cancel the subscription (this might need to be implemented in the backend)
    const { data, status, ok } = await fetchBackendJson(
      req,
      `/api/v1/api-access/billing/subscriptions/${subscriptionId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ auto_renew: false }),
      }
    );
    
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}