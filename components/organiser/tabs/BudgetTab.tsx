"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Item = { id: string; name: string; category?: string; unitCost: number; quantity: number };

export default function BudgetTab({ eventId }: { eventId: string }) {
  const [items, setItems] = React.useState<Item[]>([]);
  const [total, setTotal] = React.useState(0);
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [unitCost, setUnitCost] = React.useState("");
  const [quantity, setQuantity] = React.useState("1");
  const [loading, setLoading] = React.useState(false);

  async function load() {
    const res = await fetch(`/api/events/${eventId}/budget`);
    const data = await res.json();
    if (res.ok) {
      setItems(data.data.items as Item[]);
      setTotal(data.data.total as number);
    }
  }

  React.useEffect(() => { void load(); }, [eventId]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const uc = Number(unitCost);
    const qty = Number(quantity);
    if (!(uc >= 0) || !(qty > 0)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category: category || undefined, unitCost: uc, quantity: qty }),
      });
      if (res.ok) {
        setName("");
        setCategory("");
        setUnitCost("");
        setQuantity("1");
        await load();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <form onSubmit={add} className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <Input placeholder="Item" value={name} onChange={(e) => setName(e.currentTarget.value)} />
            </div>
            <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.currentTarget.value)} />
            <Input placeholder="Unit cost" value={unitCost} onChange={(e) => setUnitCost(e.currentTarget.value)} />
            <Input placeholder="Qty" value={quantity} onChange={(e) => setQuantity(e.currentTarget.value)} />
            <div className="sm:col-span-5 flex justify-end">
              <Button type="submit" disabled={loading || !name.trim()}>Add Item</Button>
            </div>
          </form>
        </Card>
        <div className="mt-4 grid grid-cols-1 gap-2">
          {items.map((it) => (
            <Card key={it.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{it.name}</div>
                  <div className="text-xs text-neutral-500">{it.category || "General"}</div>
                </div>
                <div className="text-sm text-neutral-900">
                  {it.quantity} × {it.unitCost.toLocaleString()} = {(it.quantity * it.unitCost).toLocaleString()}
                </div>
              </div>
            </Card>
          ))}
          {items.length === 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500">
              No budget items yet.
            </div>
          )}
        </div>
      </div>
      <div>
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-neutral-900">Total</div>
            <div className="text-base font-bold text-neutral-900">{total.toLocaleString()}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
