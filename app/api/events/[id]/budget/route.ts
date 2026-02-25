import { NextRequest, NextResponse } from "next/server";
import { addBudgetItem, listBudget } from "@/lib/store";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = listBudget(id);
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

