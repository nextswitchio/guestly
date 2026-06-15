import { MapPin, User } from 'lucide-react';
"use client";
import React from "react";
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

interface TimelineVisualizationProps {
  items: RundownItem[];
}

export default function TimelineVisualization({ items }: TimelineVisualizationProps) {
  // Sort items by time
  const sortedItems = [...items].sort((a, b) => {
    const timeA = a.time.split(":").map(Number);
    const timeB = b.time.split(":").map(Number);
    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
  });

  if (sortedItems.length === 0) {
    return (
      <Card>
        <div className="text-center py-8 text-foreground-muted">
          Add schedule items to see the timeline visualization
        </div>
      </Card>
    );
  }

  // Calculate total duration
  const totalDuration = sortedItems.reduce((sum, item) => sum + item.duration, 0);

  // Calculate end time for each item
  const itemsWithEndTime = sortedItems.map((item) => {
    const [hours, minutes] = item.time.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + item.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
    
    return {
      ...item,
      endTime,
    };
  });

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Timeline View</h3>
          <div className="text-sm text-foreground-muted">
            Total Duration: {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
          </div>
        </div>

        <div className="relative">
          {/* Timeline */}
          <div className="space-y-0">
            {itemsWithEndTime.map((item, index) => {
              const isLast = index === itemsWithEndTime.length - 1;
              
              return (
                <div key={item.id} className="relative flex gap-4">
                  {/* Time column */}
                  <div className="flex-shrink-0 w-24 pt-1">
                    <div className="text-sm font-semibold text-foreground">{item.time}</div>
                    <div className="text-xs text-foreground-muted">{item.endTime}</div>
                  </div>

                  {/* Timeline indicator */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary-500 border-2 border-white shadow-sm" />
                    {!isLast && (
                      <div className="w-0.5 flex-1 bg-primary-200 min-h-[60px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="bg-surface-card border border-surface-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">{item.activity}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700 whitespace-nowrap">
                          {item.duration} min
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-foreground-muted mb-2">{item.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-3 text-xs text-foreground-muted">
                        {item.responsible && (
                          <div className="flex items-center gap-1">
                            <span><User className="h-4 w-4 inline-block" /></span>
                            <span>{item.responsible}</span>
                          </div>
                        )}
                        {item.location && (
                          <div className="flex items-center gap-1">
                            <span><MapPin className="h-4 w-4 inline-block" /></span>
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
