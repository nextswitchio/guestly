import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

type MerchProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  sold: number;
  category: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, status, ok } = await fetchBackendJson(req, `/api/v1/merchandise/events/${id}/products?page_size=100`);
  if (!ok) return NextResponse.json(data, { status });

  const products = (data?.products || []) as MerchProduct[];
  const unitsSold = products.reduce((sum: number, p: MerchProduct) => sum + (p.sold || 0), 0);
  const totalRevenue = products.reduce((sum: number, p: MerchProduct) => sum + ((p.sold || 0) * (p.price || 0)), 0);

  // Calculate conversion rate
  // For now, we'll use a simple metric: merch orders / total products viewed
  // In a real app, this would be merch purchases / event page views or ticket purchases
  const totalStock = products.reduce((sum: number, p: MerchProduct) => sum + p.stock + p.sold, 0);
  const conversionRate = totalStock > 0 ? ((unitsSold / totalStock) * 100).toFixed(1) : "0.0";

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
    totalRevenue,
    totalProducts: products.length,
    unitsSold,
    conversionRate: parseFloat(conversionRate),
    bestSellers: productsSold.slice(0, 5),
    productsSold,
  });
}
