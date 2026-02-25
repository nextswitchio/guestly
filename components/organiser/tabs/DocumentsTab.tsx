"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Doc = { id: string; title: string; content: string; createdAt: number; type: "charter" };

export default function DocumentsTab({ eventId }: { eventId: string }) {
  const [docs, setDocs] = React.useState<Doc[]>([]);
  const [title, setTitle] = React.useState("");
  const [objectives, setObjectives] = React.useState("");
  const [scope, setScope] = React.useState("");
  const [stakeholders, setStakeholders] = React.useState("");
  const [risks, setRisks] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function load() {
    const res = await fetch(`/api/events/${eventId}/documents/charter`);
    const data = await res.json();
    if (res.ok) setDocs(data.data as Doc[]);
  }

  React.useEffect(() => { void load(); }, [eventId]);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/documents/charter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || undefined,
          objectives: objectives || undefined,
          scope: scope || undefined,
          stakeholders: stakeholders || undefined,
          risks: risks || undefined,
        }),
      });
      if (res.ok) {
        setTitle("");
        setObjectives("");
        setScope("");
        setStakeholders("");
        setRisks("");
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
          <form onSubmit={generate} className="grid grid-cols-1 gap-3">
            <Input placeholder="Document title (optional)" value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
            <textarea className="min-h-[80px] w-full rounded-lg border border-neutral-200 bg-white p-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40" placeholder="Objectives" value={objectives} onChange={(e) => setObjectives(e.currentTarget.value)} />
            <textarea className="min-h-[80px] w-full rounded-lg border border-neutral-200 bg-white p-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40" placeholder="Scope" value={scope} onChange={(e) => setScope(e.currentTarget.value)} />
            <textarea className="min-h-[80px] w-full rounded-lg border border-neutral-200 bg-white p-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40" placeholder="Stakeholders" value={stakeholders} onChange={(e) => setStakeholders(e.currentTarget.value)} />
            <textarea className="min-h-[80px] w-full rounded-lg border border-neutral-200 bg-white p-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40" placeholder="Risks and mitigations" value={risks} onChange={(e) => setRisks(e.currentTarget.value)} />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>Generate Charter</Button>
            </div>
          </form>
        </Card>
        <div className="mt-4 grid grid-cols-1 gap-3">
          {docs.map((d) => (
            <Card key={d.id}>
              <div className="mb-2 text-sm font-semibold text-neutral-900">{d.title}</div>
              <pre className="whitespace-pre-wrap text-xs text-neutral-700">{d.content}</pre>
            </Card>
          ))}
          {docs.length === 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500">
              No documents yet.
            </div>
          )}
        </div>
      </div>
      <div>
        <Card>
          <div className="text-sm font-semibold text-neutral-900">Tips</div>
          <div className="mt-2 text-xs text-neutral-600">Provide details for better drafts.</div>
        </Card>
      </div>
    </div>
  );
}
