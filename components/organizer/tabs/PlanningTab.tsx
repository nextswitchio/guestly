import { Check, CheckCircle, Circle, RefreshCw } from 'lucide-react';
"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Icon from "@/components/ui/Icon";
import EmptyState from "@/components/ui/EmptyState";
import DeadlineReminders from "@/components/organizer/DeadlineReminders";

type Task = { 
  id: string; 
  title: string; 
  description?: string;
  category?: "marketing" | "logistics" | "technical" | "content";
  assignee?: string;
  owner?: string; 
  dueDate?: string; 
  status: "todo" | "in_progress" | "done" 
};

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "marketing", label: "Marketing" },
  { value: "logistics", label: "Logistics" },
  { value: "technical", label: "Technical" },
  { value: "content", label: "Content" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function PlanningTab({ eventId }: { eventId: string }) {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<string>("");
  const [assignee, setAssignee] = React.useState("");
  const [due, setDue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  
  // Filters
  const [filterCategory, setFilterCategory] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");

  async function load() {
    const res = await fetch(`/api/events/${eventId}/planning/tasks`);
    const data = await res.json();
    if (res.ok) setTasks(data.data as Task[]);
  }

  React.useEffect(() => { void load(); }, [eventId]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/planning/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description: description || undefined,
          category: category || undefined,
          assignee: assignee || undefined, 
          dueDate: due || undefined 
        }),
      });
      if (res.ok) {
        setTitle("");
        setDescription("");
        setCategory("");
        setAssignee("");
        setDue("");
        setShowForm(false);
        await load();
      }
    } finally {
      setLoading(false);
    }
  }

  async function mark(id: string, status: Task["status"]) {
    await fetch(`/api/events/${eventId}/planning/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: id, status }),
    });
    await load();
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filterCategory && task.category !== filterCategory) return false;
    if (filterStatus && task.status !== filterStatus) return false;
    return true;
  });

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case "marketing": return "bg-primary-50 text-primary-700 border-primary-200";
      case "logistics": return "bg-warning-50 text-warning-700 border-warning-200";
      case "technical": return "bg-navy-50 text-navy-700 border-navy-200";
      case "content": return "bg-success-50 text-success-700 border-success-200";
      default: return "bg-neutral-50 text-neutral-700 border-neutral-200";
    }
  };

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case "marketing": return "megaphone";
      case "logistics": return "package";
      case "technical": return "settings";
      case "content": return "edit";
      default: return "clipboard";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {/* Deadline Reminders */}
        <DeadlineReminders eventId={eventId} />
        
        {/* Header with Add Task Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Tasks</h2>
              {/* Completion badge */}
              {totalTasks > 0 && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  completionPercentage === 100 
                    ? "bg-success-100 text-success-700 border border-success-300" 
                    : completionPercentage >= 50 
                    ? "bg-primary-100 text-primary-700 border border-primary-300" 
                    : "bg-neutral-100 text-neutral-700 border border-neutral-300"
                }`}>
                  {completionPercentage === 100 && <span><Check className="h-4 w-4 inline-block" /></span>}
                  {completedTasks}/{totalTasks} Complete
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--foreground-muted)]">
              {totalTasks === 0 ? "No tasks yet" : `${inProgressTasks} in progress · ${tasks.filter(t => t.status === "todo").length} to do`}
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add Task"}
          </Button>
        </div>

        {/* Task Creation Form */}
        {showForm && (
          <Card>
            <form onSubmit={add} className="space-y-4">
              <Input 
                label="Task Title"
                placeholder="e.g., Create social media campaign" 
                value={title} 
                onChange={(e) => setTitle(e.currentTarget.value)}
                required
              />
              
              <Textarea
                label="Description (optional)"
                placeholder="Add more details about this task..."
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
                autoResize
                rows={3}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.currentTarget.value)}
                >
                  <option value="">No category</option>
                  <option value="marketing">Marketing</option>
                  <option value="logistics">Logistics</option>
                  <option value="technical">Technical</option>
                  <option value="content">Content</option>
                </Select>

                <Input 
                  label="Assignee"
                  placeholder="Team member name" 
                  value={assignee} 
                  onChange={(e) => setAssignee(e.currentTarget.value)} 
                />

                <Input 
                  label="Due Date"
                  type="date"
                  value={due} 
                  onChange={(e) => setDue(e.currentTarget.value)} 
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !title.trim()}>
                  {loading ? "Adding..." : "Add Task"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filters */}
        {tasks.length > 0 && (
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-[var(--foreground)]">Filter:</span>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.currentTarget.value)}
                className="w-auto min-w-[150px]"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </Select>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.currentTarget.value)}
                className="w-auto min-w-[150px]"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </Select>
              {(filterCategory || filterStatus) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setFilterCategory("");
                    setFilterStatus("");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.map((t) => (
            <Card key={t.id} className="hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-[var(--foreground)]">{t.title}</h3>
                      {t.category && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border ${getCategoryColor(t.category)}`}>
                          <Icon name={getCategoryIcon(t.category) as any} size={12} /> {t.category}
                        </span>
                      )}
                    </div>
                    {t.description && (
                      <p className="mt-1 text-xs text-[var(--foreground-muted)] line-clamp-2">{t.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-[var(--foreground-muted)]">
                      <span className="flex items-center gap-1"><Icon name="user" size={12} /> {t.assignee || t.owner || "Unassigned"}</span>
                      {t.dueDate && <span className="flex items-center gap-1"><Icon name="calendar" size={12} /> {t.dueDate}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${
                      t.status === "done" 
                        ? "bg-success-50 text-success-700" 
                        : t.status === "in_progress" 
                        ? "bg-warning-50 text-warning-700" 
                        : "bg-neutral-100 text-neutral-700"
                    }`}>
                      {t.status === "done" ? <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Done</span> : t.status === "in_progress" ? <span className="flex items-center gap-1"><RefreshCw className="h-3.5 w-3.5" /> In Progress</span> : <span className="flex items-center gap-1"><Circle className="h-3.5 w-3.5" /> To Do</span>}
                    </span>
                  </div>
                </div>
                
                {/* Quick Completion Checkbox and Action Buttons */}
                <div className="flex items-center gap-3 pt-2 border-t border-[var(--surface-border)]">
                  {/* Quick completion checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={t.status === "done"}
                      onChange={(e) => mark(t.id, e.target.checked ? "done" : "todo")}
                      className="w-4 h-4 rounded border-2 border-neutral-300 text-success-600 focus:ring-2 focus:ring-success-500 focus:ring-offset-1 cursor-pointer transition-all group-hover:border-success-500"
                    />
                    <span className="text-xs text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]">
                      {t.status === "done" ? "Completed" : "Mark complete"}
                    </span>
                  </label>
                  
                  <div className="flex-1" />
                  
                  {/* Status change buttons */}
                  {t.status !== "in_progress" && t.status !== "done" && (
                    <Button size="sm" variant="ghost" onClick={() => mark(t.id, "in_progress")}>
                      Start Progress
                    </Button>
                  )}
                  {t.status === "in_progress" && (
                    <Button size="sm" variant="primary" onClick={() => mark(t.id, "done")}>
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
          
          {filteredTasks.length === 0 && tasks.length > 0 && (
            <Card>
              <div className="text-center py-8">
                <p className="text-sm text-[var(--foreground-muted)]">
                  No tasks match your filters. Try adjusting the filters above.
                </p>
              </div>
            </Card>
          )}

          {tasks.length === 0 && (
            <EmptyState
              icon={<Icon name="clipboard" size={48} className="text-neutral-400" />}
              title="No tasks yet"
              description="Create a task list to organize your event planning. Break down your work into manageable steps and track progress."
              tips={[
                "Assign tasks to team members with clear due dates",
                "Use categories like Marketing, Logistics, Technical, Content",
                "Update task status regularly to keep everyone aligned",
              ]}
            />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Progress Card */}
        <Card>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Task Progress</h3>
          <div className="space-y-4">
            {/* Completion percentage with large visual */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-2">
                {/* Background circle */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-neutral-200"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                    className={`transition-all duration-700 ${
                      completionPercentage === 100 
                        ? "text-success-500" 
                        : completionPercentage >= 50 
                        ? "text-primary-500" 
                        : "text-warning-500"
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Percentage text */}
                <div className="relative">
                  <div className={`text-2xl font-bold ${
                    completionPercentage === 100 
                      ? "text-success-600" 
                      : completionPercentage >= 50 
                      ? "text-primary-600" 
                      : "text-warning-600"
                  }`}>
                    {completionPercentage}%
                  </div>
                </div>
              </div>
              <div className="text-xs text-[var(--foreground-muted)]">
                {completedTasks} of {totalTasks} tasks completed
              </div>
              {completionPercentage === 100 && totalTasks > 0 && (
                <div className="mt-2 text-xs font-semibold text-success-600 flex items-center justify-center gap-1">
                  <Icon name="party" size={16} /> All tasks complete!
                </div>
              )}
            </div>

            {/* Linear progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[var(--foreground-muted)]">Overall Progress</span>
                <span className="font-semibold text-[var(--foreground)]">{completionPercentage}%</span>
              </div>
              <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${
                    completionPercentage === 100 
                      ? "bg-gradient-to-r from-success-500 to-success-600" 
                      : "bg-gradient-to-r from-primary-500 to-primary-600"
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Status breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="text-xl font-bold text-neutral-700">{tasks.filter(t => t.status === "todo").length}</div>
                <div className="text-[10px] text-neutral-500 font-medium">To Do</div>
              </div>
              <div className="p-2.5 bg-warning-50 rounded-lg border border-warning-200">
                <div className="text-xl font-bold text-warning-700">{inProgressTasks}</div>
                <div className="text-[10px] text-warning-600 font-medium">In Progress</div>
              </div>
              <div className="p-2.5 bg-success-50 rounded-lg border border-success-200">
                <div className="text-xl font-bold text-success-700">{completedTasks}</div>
                <div className="text-[10px] text-success-600 font-medium">Done</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        {tasks.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">By Category</h3>
            <div className="space-y-2">
              {["marketing", "logistics", "technical", "content"].map(cat => {
                const count = tasks.filter(t => t.category === cat).length;
                if (count === 0) return null;
                return (
                  <div key={cat} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <Icon name={getCategoryIcon(cat) as any} size={14} />
                      <span className="capitalize text-[var(--foreground)]">{cat}</span>
                    </span>
                    <span className="font-semibold text-[var(--foreground-muted)]">{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Planning Checklist */}
        <Card>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Planning Checklist</h3>
          <ul className="space-y-1.5 text-xs text-[var(--foreground-muted)]">
            <li className="flex items-start gap-2">
              <span className="text-success-500 mt-0.5"><Check className="h-4 w-4 inline-block" /></span>
              <span>Define goals and scope</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success-500 mt-0.5"><Check className="h-4 w-4 inline-block" /></span>
              <span>Set budget</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-400 mt-0.5">○</span>
              <span>Source vendors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-400 mt-0.5">○</span>
              <span>Publish schedule</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-400 mt-0.5">○</span>
              <span>Launch marketing campaign</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
