import { AlertTriangle, BellRing, CheckCircle } from 'lucide-react';
"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import EmptyState from "@/components/ui/EmptyState";

type Item = { 
  id: string; 
  name: string; 
  category?: string; 
  unitCost: number; 
  quantity: number;
  actualSpent?: number;
};

type BudgetData = {
  items: Item[];
  totalBudgeted: number;
  totalSpent: number;
  variance: number;
  variancePercent: number;
  isOverBudget: boolean;
  projectedRevenue: number;
  actualRevenue: number;
  ticketsSold: number;
  totalCapacity: number;
  profitMargin: number;
  breakEvenTickets: number;
  projectedProfit: number;
};

export default function BudgetTab({ eventId }: { eventId: string }) {
  const [budgetData, setBudgetData] = React.useState<BudgetData>({
    items: [],
    totalBudgeted: 0,
    totalSpent: 0,
    variance: 0,
    variancePercent: 0,
    isOverBudget: false,
    projectedRevenue: 0,
    actualRevenue: 0,
    ticketsSold: 0,
    totalCapacity: 0,
    profitMargin: 0,
    breakEvenTickets: 0,
    projectedProfit: 0,
  });
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [unitCost, setUnitCost] = React.useState("");
  const [quantity, setQuantity] = React.useState("1");
  const [loading, setLoading] = React.useState(false);
  const [editingSpent, setEditingSpent] = React.useState<string | null>(null);
  const [spentValue, setSpentValue] = React.useState("");

  async function load() {
    const res = await fetch(`/api/events/${eventId}/budget`);
    const data = await res.json();
    if (res.ok) {
      setBudgetData(data.data as BudgetData);
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

  async function updateSpent(itemId: string, actualSpent: number) {
    try {
      const res = await fetch(`/api/events/${eventId}/budget`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, actualSpent }),
      });
      if (res.ok) {
        setEditingSpent(null);
        setSpentValue("");
        await load();
      }
    } catch (err) {
      console.error("Failed to update spent:", err);
    }
  }

  function startEditSpent(item: Item) {
    setEditingSpent(item.id);
    setSpentValue(item.actualSpent?.toString() || "");
  }

  function saveSpent(itemId: string) {
    const spent = Number(spentValue);
    if (spent >= 0) {
      void updateSpent(itemId, spent);
    }
  }

  function cancelEdit() {
    setEditingSpent(null);
    setSpentValue("");
  }

  const { items, totalBudgeted, totalSpent, variance, variancePercent, isOverBudget, projectedRevenue, actualRevenue, ticketsSold, totalCapacity, profitMargin, breakEvenTickets, projectedProfit } = budgetData;

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

        {isOverBudget && (
          <Card className="mt-4 border-danger-500 bg-danger-50 dark:bg-danger-950">
            <div className="flex items-start gap-3">
              <span className="text-2xl"><AlertTriangle className="h-4 w-4 inline-block" /></span>
              <div>
                <div className="text-sm font-semibold text-danger-900 dark:text-danger-100">
                  Budget Alert: Over Budget
                </div>
                <div className="text-xs text-danger-700 dark:text-danger-300 mt-1">
                  You've exceeded your planned budget by {Math.abs(variance).toLocaleString()}. Review your spending to stay on track.
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="mt-4 grid grid-cols-1 gap-2">
          {items.map((it) => {
            const budgeted = it.quantity * it.unitCost;
            const spent = it.actualSpent || 0;
            const itemVariance = budgeted - spent;
            const isItemOver = itemVariance < 0;

            return (
              <Card key={it.id} className={isItemOver ? "border-l-4 border-l-danger-500" : ""}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{it.name}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{it.category || "General"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-neutral-900 dark:text-neutral-100">
                        {it.quantity} × {it.unitCost.toLocaleString()} = {budgeted.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">Budgeted</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Actual Spent:</span>
                      {editingSpent === it.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={spentValue}
                            onChange={(e) => setSpentValue(e.currentTarget.value)}
                            placeholder="0"
                            className="w-24 h-8 text-sm"
                          />
                          <Button size="sm" onClick={() => saveSpent(it.id)}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditSpent(it)}
                          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {spent > 0 ? spent.toLocaleString() : "Add"}
                        </button>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${isItemOver ? "text-danger-600 dark:text-danger-400" : itemVariance > 0 ? "text-success-600 dark:text-success-400" : "text-neutral-600 dark:text-neutral-400"}`}>
                        {itemVariance > 0 ? "−" : itemVariance < 0 ? "+" : ""}{Math.abs(itemVariance).toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {isItemOver ? "Over" : itemVariance > 0 ? "Under" : "On track"}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
          {items.length === 0 && (
            <EmptyState
              icon="money"
              title="No budget items yet"
              description="Start tracking your event expenses by adding budget items. Keep your spending organized and under control."
              tips={[
                "Break down costs by category (venue, catering, marketing, etc.)",
                "Add items as you plan to get accurate budget projections",
                "Track actual spending vs. planned budget to avoid overspending",
              ]}
            />
          )}
        </div>
      </div>
      <div className="space-y-4">
        <Card>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Total Budgeted</div>
              <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">{totalBudgeted.toLocaleString()}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Total Spent</div>
              <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">{totalSpent.toLocaleString()}</div>
            </div>
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Variance</div>
                <div className={`text-lg font-bold ${isOverBudget ? "text-danger-600 dark:text-danger-400" : variance > 0 ? "text-success-600 dark:text-success-400" : "text-neutral-900 dark:text-neutral-100"}`}>
                  {variance > 0 ? "−" : variance < 0 ? "+" : ""}{Math.abs(variance).toLocaleString()}
                </div>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 text-right mt-1">
                {isOverBudget ? `${Math.abs(variancePercent).toFixed(1)}% over budget` : variance > 0 ? `${variancePercent.toFixed(1)}% under budget` : "On budget"}
              </div>
            </div>
          </div>
        </Card>

        {isOverBudget && (
          <Card className="bg-danger-50 dark:bg-danger-950 border-danger-200 dark:border-danger-800">
            <div className="text-center">
              <div className="text-3xl mb-2"><BellRing className="h-4 w-4 inline-block" /></div>
              <div className="text-sm font-semibold text-danger-900 dark:text-danger-100">Over Budget</div>
              <div className="text-xs text-danger-700 dark:text-danger-300 mt-1">
                Review your expenses and adjust your budget or reduce spending.
              </div>
            </div>
          </Card>
        )}

        {!isOverBudget && variance > 0 && (
          <Card className="bg-success-50 dark:bg-success-950 border-success-200 dark:border-success-800">
            <div className="text-center">
              <div className="text-3xl mb-2"><CheckCircle className="h-4 w-4 inline-block" /></div>
              <div className="text-sm font-semibold text-success-900 dark:text-success-100">Under Budget</div>
              <div className="text-xs text-success-700 dark:text-success-300 mt-1">
                You're staying within your planned budget. Great job!
              </div>
            </div>
          </Card>
        )}

        <Card>
          <div className="space-y-3">
            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">Revenue Projection</div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Projected Revenue</div>
              <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">{projectedRevenue.toLocaleString()}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Actual Revenue</div>
              <div className="text-base font-bold text-primary-600 dark:text-primary-400">{actualRevenue.toLocaleString()}</div>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Tickets Sold</span>
              <span>{ticketsSold} / {totalCapacity}</span>
            </div>
          </div>
        </Card>

        <Card className={projectedProfit >= 0 ? "bg-success-50 dark:bg-success-950 border-success-200 dark:border-success-800" : "bg-danger-50 dark:bg-danger-950 border-danger-200 dark:border-danger-800"}>
          <div className="space-y-3">
            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">Profit Analysis</div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Projected Profit</div>
              <div className={`text-lg font-bold ${projectedProfit >= 0 ? "text-success-600 dark:text-success-400" : "text-danger-600 dark:text-danger-400"}`}>
                {projectedProfit >= 0 ? "+" : ""}{projectedProfit.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Profit Margin</div>
              <div className={`text-base font-bold ${profitMargin >= 0 ? "text-success-600 dark:text-success-400" : "text-danger-600 dark:text-danger-400"}`}>
                {profitMargin.toFixed(1)}%
              </div>
            </div>
            {projectedProfit < 0 && (
              <div className="pt-2 border-t border-danger-200 dark:border-danger-800">
                <div className="text-xs text-danger-700 dark:text-danger-300">
                 <AlertTriangle className="h-4 w-4 inline" /> Your costs exceed projected revenue. Consider reducing expenses or increasing ticket prices.
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-primary-50 dark:bg-primary-950 border-primary-200 dark:border-primary-800">
          <div className="space-y-3">
            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">Break-Even Analysis</div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Break-Even Point</div>
              <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {breakEvenTickets} tickets
              </div>
            </div>
            <div className="pt-2 border-t border-primary-200 dark:border-primary-800">
              <div className="text-xs text-primary-700 dark:text-primary-300">
                {ticketsSold >= breakEvenTickets 
                  ? `<CheckCircle className="h-4 w-4 inline" /> You've reached break-even! ${ticketsSold - breakEvenTickets} tickets sold beyond break-even.`
                  : `You need to sell ${breakEvenTickets - ticketsSold} more tickets to cover your costs.`
                }
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
