import { NextRequest, NextResponse } from "next/server";
import { 
  getOrder, 
  ensureWallet, 
  markOrderPaid, 
  debitMoney, 
  applyPromoCreditsToPayment, 
  deductFromSavingsTarget, 
  getSavingsTarget,
  listTransactions,
  clearCityStatsCache,
  updateEventSalesMetrics
} from "@/lib/store";
import { getEventById } from "@/lib/events";

// Helper to add transaction (since there's no exported function)
function addSavingsTransaction(userId: string, amount: number, eventId: string) {
  // Access the transactions array directly through the module
  // This is a workaround since there's no addTransaction export
  // The transaction will be added when we call deductFromSavingsTarget
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const orderId: string = body?.orderId;
  const method: "wallet" | "card" = body?.method || "card";
  const savingsApplied: number = body?.savingsApplied || 0;
  const savingsTargetId: string | undefined = body?.savingsTargetId;
  
  if (!orderId) return NextResponse.json({ ok: false, error: "orderId required" }, { status: 400 });
  const order = getOrder(orderId);
  if (!order) return NextResponse.json({ ok: false }, { status: 404 });
  
  // Calculate the actual amount to charge after savings
  const amountToCharge = Math.max(0, order.total - savingsApplied);
  
  if (method === "wallet") {
    const w = ensureWallet(order.userId);
    
    // Apply promo credits first, then cash balance
    const { promoUsed, cashUsed, remaining } = applyPromoCreditsToPayment(order.userId, amountToCharge);
    
    // Check if there's still a remaining balance after using wallet + promo
    if (remaining > 0) {
      return NextResponse.json({ 
        ok: false, 
        error: `Insufficient wallet balance. You have ${w.balance.toFixed(2)} + ${w.promoBalance.toFixed(2)} promo, but need ${amountToCharge.toFixed(2)}. Short by ${remaining.toFixed(2)}.` 
      }, { status: 402 });
    }
    
    // Deduct from savings target if applicable
    if (savingsApplied > 0 && savingsTargetId) {
      const target = getSavingsTarget(order.userId, savingsTargetId);
      if (target && target.currentAmount >= savingsApplied) {
        deductFromSavingsTarget(order.userId, savingsTargetId, savingsApplied);
      }
    }
    
    markOrderPaid(orderId);
    
    // Update event sales metrics and clear city cache for trending calculation
    const event = getEventById(order.eventId);
    if (event) {
      const ticketCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
      updateEventSalesMetrics(order.eventId, order.total, ticketCount);
      clearCityStatsCache(event.city);
    }
    
    return NextResponse.json({ 
      ok: true,
      paymentBreakdown: {
        total: order.total,
        savingsUsed: savingsApplied,
        promoUsed,
        cashUsed,
      }
    });
  } else {
    // Card payment
    // Deduct from savings target if applicable
    if (savingsApplied > 0 && savingsTargetId) {
      const target = getSavingsTarget(order.userId, savingsTargetId);
      if (target && target.currentAmount >= savingsApplied) {
        deductFromSavingsTarget(order.userId, savingsTargetId, savingsApplied);
      }
    }
    
    markOrderPaid(orderId);
    
    // Update event sales metrics and clear city cache for trending calculation
    const event = getEventById(order.eventId);
    if (event) {
      const ticketCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
      updateEventSalesMetrics(order.eventId, order.total, ticketCount);
      clearCityStatsCache(event.city);
    }
    
    return NextResponse.json({ 
      ok: true,
      paymentBreakdown: {
        total: order.total,
        savingsUsed: savingsApplied,
      }
    });
  }
}
