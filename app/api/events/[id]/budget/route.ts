import { NextRequest, NextResponse } from "next/server";
import { addBudgetItem, listBudget, updateBudgetItem, getAvailability, getEventOrders } from "@/lib/store";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const budgetData = listBudget(id);
  
  // Calculate revenue projection
  const availability = getAvailability(id);
  
  let projectedRevenue = 0;
  let actualRevenue = 0;
  let ticketsSold = 0;
  let totalCapacity = 0;
  
  if (availability && availability.tickets) {
    // Calculate projected revenue from all available tickets
    availability.tickets.forEach(ticket => {
      const ticketCapacity = ticket.available;
      totalCapacity += ticketCapacity;
      projectedRevenue += ticketCapacity * ticket.price;
    });
    
    // Calculate actual revenue from paid orders
    const eventOrders = getEventOrders(id);
    
    eventOrders.forEach((order) => {
      if (order.status === 'paid') {
        actualRevenue += order.total;
        order.items.forEach((item) => {
          ticketsSold += item.quantity;
        });
      }
    });
  }
  
  // Calculate profit margin and break-even
  const totalCosts = budgetData.totalBudgeted;
  const profitMargin = projectedRevenue > 0 
    ? ((projectedRevenue - totalCosts) / projectedRevenue) * 100 
    : 0;
  
  const averageTicketPrice = totalCapacity > 0 ? projectedRevenue / totalCapacity : 0;
  const breakEvenTickets = averageTicketPrice > 0
    ? Math.ceil(totalCosts / averageTicketPrice)
    : 0;
  
  const data = {
    ...budgetData,
    projectedRevenue,
    actualRevenue,
    ticketsSold,
    totalCapacity,
    profitMargin,
    breakEvenTickets,
    projectedProfit: projectedRevenue - totalCosts,
  };
  
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const name: string = body?.name || "";
  const category: string | undefined = body?.category;
  const unitCost: number = Number(body?.unitCost || 0);
  const quantity: number = Number(body?.quantity || 1);
  if (!name.trim()) return NextResponse.json({ ok: false, error: "Name required" }, { status: 400 });
  if (!(unitCost >= 0) || !(quantity > 0)) return NextResponse.json({ ok: false, error: "Invalid values" }, { status: 400 });
  const item = addBudgetItem(id, { name: name.trim(), category, unitCost, quantity });
  return NextResponse.json({ ok: true, data: item });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const itemId: string = body?.itemId || "";
  const actualSpent: number | undefined = body?.actualSpent !== undefined ? Number(body.actualSpent) : undefined;
  
  if (!itemId) return NextResponse.json({ ok: false, error: "Item ID required" }, { status: 400 });
  if (actualSpent !== undefined && !(actualSpent >= 0)) {
    return NextResponse.json({ ok: false, error: "Invalid actual spent value" }, { status: 400 });
  }
  
  try {
    const item = updateBudgetItem(id, itemId, { actualSpent });
    return NextResponse.json({ ok: true, data: item });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 404 });
  }
}

