import { NextRequest, NextResponse } from "next/server";
import { getMerchStatsByEvent, getProductsByEvent } from "@/lib/store";
import { getEventById } from "@/lib/events";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const event = getEventById(id);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const stats = getMerchStatsByEvent(id);
  const products = getProductsByEvent(id);

  // Calculate conversion rate
  // For now, we'll use a simple metric: merch orders / total products viewed
  // In a real app, this would be merch purchases / event page views or ticket purchases
  const totalStock = products.reduce((sum, p) => sum + p.stock + p.sold, 0);
  const conversionRate = totalStock > 0 ? ((stats.unitsSold / totalStock) * 100).toFixed(1) : "0.0";

  // Get products with units sold
  const productsSold = products
    .filter((p) => p.sold > 0)
    .map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      unitsSold: p.sold,
      revenue: p.sold * p.price,
      stock: p.stock,
      category: p.category,
    }))
    .sort((a, b) => b.unitsSold - a.unitsSold);

  return NextResponse.json({
    totalRevenue: stats.revenue,
    totalProducts: stats.totalProducts,
    unitsSold: stats.unitsSold,
    conversionRate: parseFloat(conversionRate),
    bestSellers: stats.bestSellers,
    productsSold,
  });
}
