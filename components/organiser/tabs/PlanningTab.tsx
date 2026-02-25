"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Task = { id: string; title: string; owner?: string; dueDate?: string; status: "todo" | "in_progress" | "done" };

export default function PlanningTab({ eventId }: { eventId: string }) {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [title, setTitle] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [due, setDue] = React.useState("");
  const [loading, setLoading] = React.useState(false);

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
        body: JSON.stringify({ title, owner: owner || undefined, dueDate: due || undefined }),
      });
      if (res.ok) {
        setTitle("");
        setOwner("");
        setDue("");
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

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <form onSubmit={add} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
            </div>
            <Input placeholder="Owner" value={owner} onChange={(e) => setOwner(e.currentTarget.value)} />
            <Input placeholder="Due date" value={due} onChange={(e) => setDue(e.currentTarget.value)} />
            <div className="sm:col-span-4 flex justify-end">
              <Button type="submit" disabled={loading || !title.trim()}>Add Task</Button>
            </div>
          </form>
        </Card>
        <div className="mt-4 grid grid-cols-1 gap-3">
          {tasks.map((t) => (
            <Card key={t.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{t.title}</div>
                  <div className="text-xs text-neutral-500">{t.owner || "Unassigned"}{t.dueDate ? ` · ${t.dueDate}` : ""}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${t.status === "done" ? "bg-success-50 text-success-700" : t.status === "in_progress" ? "bg-warning-50 text-warning-700" : "bg-neutral-100 text-neutral-700"}`}>{t.status}</span>
                  {t.status !== "todo" && <Button size="sm" variant="outline" onClick={() => mark(t.id, "todo")}>To-do</Button>}
                  {t.status !== "in_progress" && <Button size="sm" variant="outline" onClick={() => mark(t.id, "in_progress")}>In progress</Button>}
                  {t.status !== "done" && <Button size="sm" onClick={() => mark(t.id, "done")}>Done</Button>}
                </div>
              </div>
            </Card>
          ))}
          {tasks.length === 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500">
              No tasks yet.
            </div>
          )}
        </div>
      </div>
      <div>
        <Card>
          <div className="text-sm font-semibold text-neutral-900">Checklist</div>
          <ul className="mt-2 list-disc pl-5 text-xs text-neutral-600">
            <li>Define goals and scope</li>
            <li>Set budget</li>
            <li>Source vendors</li>
            <li>Publish schedule</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
