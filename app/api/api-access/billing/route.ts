import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendJson } from '@/lib/api/proxy';

export async function GET(req: NextRequest) {
  try {
    // Get user's billing info and subscriptions
    const { data: subscriptions, status: subStatus, ok: subOk } = await fetchBackendJson(
      req,
      '/api/v1/api-access/billing/subscriptions'
    );
    
    if (!subOk) return NextResponse.json(subscriptions, { status: subStatus });
    
    // Get billing plans
    const { data: plans, status: plansStatus, ok: plansOk } = await fetchBackendJson(
      req,
      '/api/v1/api-access/billing/plans'
    );
    
    if (!plansOk) return NextResponse.json(plans, { status: plansStatus });
    
    // For now, return a simplified response that matches what the frontend expects
    const currentSubscription = Array.isArray(subscriptions) && subscriptions.length > 0 ? subscriptions[0] : null;
    const currentPlan = currentSubscription ? plans.find((p: any) => p.id === currentSubscription.plan_id) : null;
    
    return NextResponse.json({
      current_plan: currentPlan || null,
      subscription_id: currentSubscription?.id || null,
      subscription_status: currentSubscription?.status || 'active',
      current_period_start: currentSubscription?.billing_cycle_start || null,
      current_period_end: currentSubscription?.billing_cycle_end || null,
      cancel_at_period_end: currentSubscription?.auto_renew !== true,
      payment_method: currentSubscription?.payment_method || null,
      invoice_count: 0, // Would need to fetch from another endpoint
      total_billed: 0, // Would need to fetch from another endpoint
    });
  } catch (error) {
    console.error('Error fetching billing info:', error);
    return NextResponse.json({
      current_plan: null,
      subscription_id: null,
      subscription_status: 'active',
      current_period_start: null,
      current_period_end: null,
      cancel_at_period_end: false,
      payment_method: null,
      invoice_count: 0,
      total_billed: 0,
    }, { status: 200 }); // Return default empty billing info
  }
}