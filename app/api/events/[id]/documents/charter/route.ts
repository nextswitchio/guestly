import { NextRequest, NextResponse } from "next/server";
import { listDocuments, saveCharter } from "@/lib/store";
import { BACKEND_URL } from "@/lib/api/client";

function buildCharter(input: { title: string; eventTitle: string; eventDate: string; objectives?: string; scope?: string; stakeholders?: string; risks?: string }) {
  const lines: string[] = [];
  lines.push(`# ${input.title}`);
  lines.push(``);
  lines.push(`Event: ${input.eventTitle}`);
  lines.push(`Date: ${new Date(input.eventDate).toDateString()}`);
  if (input.objectives) { lines.push(``); lines.push(`Objectives`); lines.push(input.objectives); }
  if (input.scope) { lines.push(``); lines.push(`Scope`); lines.push(input.scope); }
  if (input.stakeholders) { lines.push(``); lines.push(`Stakeholders`); lines.push(input.stakeholders); }
  if (input.risks) { lines.push(``); lines.push(`Risks & Mitigations`); lines.push(input.risks); }
  return lines.join("\n");
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docs = listDocuments(id).filter((d) => d.type === "charter");
  return NextResponse.json({ ok: true, data: docs });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  // Fetch event title/date from backend
  let eventTitle = body?.eventTitle || "Event";
  let eventDate = body?.eventDate || new Date().toISOString();
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const ev = data.data ?? data;
      eventTitle = ev.title || eventTitle;
      eventDate = ev.date || eventDate;
    }
  } catch {}

  const title: string = body?.title || `${eventTitle} Project Charter`;
  const content = buildCharter({ title, eventTitle, eventDate, objectives: body?.objectives, scope: body?.scope, stakeholders: body?.stakeholders, risks: body?.risks });
  const doc = saveCharter(id, title, content);
  return NextResponse.json({ ok: true, data: doc });
}

