import { ArrowDown, ArrowUp } from 'lucide-react';
"use client";
import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export type RundownItem = {
  id: string;
  time: string;
  duration: number;
  activity: string;
  description?: string;
  responsible?: string;
  location?: string;
};

interface RundownBuilderProps {
  items: RundownItem[];
  onChange: (items: RundownItem[]) => void;
}

export default function RundownBuilder({ items, onChange }: RundownBuilderProps) {
  function addItem() {
    const newItem: RundownItem = {
      id: `item_${Date.now()}`,
      time: "09:00",
      duration: 30,
      activity: "",
      description: "",
      responsible: "",
      location: "",
    };
    onChange([...items, newItem]);
  }

  function updateItem(id: string, updates: Partial<RundownItem>) {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function moveItem(index: number, direction: "up" | "down") {
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= items.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    onChange(newItems);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Schedule Items</h3>
        <Button onClick={addItem} size="sm">
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-foreground-muted mb-4">No schedule items yet</p>
            <Button onClick={addItem} variant="secondary">
              Add First Item
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={item.id} className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Time and Duration */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground-muted mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) => updateItem(item.id, { time: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground-muted mb-1">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      value={item.duration}
                      onChange={(e) =>
                        updateItem(item.id, { duration: parseInt(e.target.value) || 0 })
                      }
                      min="1"
                      className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                    />
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Activity *
                  </label>
                  <input
                    type="text"
                    value={item.activity}
                    onChange={(e) => updateItem(item.id, { activity: e.target.value })}
                    placeholder="e.g., Registration & Welcome"
                    className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Description
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    placeholder="Additional details about this activity"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 resize-none"
                  />
                </div>

                {/* Responsible and Location */}
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Responsible Person
                  </label>
                  <input
                    type="text"
                    value={item.responsible}
                    onChange={(e) => updateItem(item.id, { responsible: e.target.value })}
                    placeholder="e.g., John Doe"
                    className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={item.location}
                    onChange={(e) => updateItem(item.id, { location: e.target.value })}
                    placeholder="e.g., Main Hall"
                    className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-surface-border">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4 inline-block" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => moveItem(index, "down")}
                  disabled={index === items.length - 1}
                >
                  <ArrowDown className="h-4 w-4 inline-block" />
                </Button>
                <div className="flex-1" />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
