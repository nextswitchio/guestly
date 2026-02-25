import { NextRequest, NextResponse } from "next/server";
import { listDocuments, saveCharter } from "@/lib/store";
import { getEventById } from "@/lib/events";

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
  const e = getEventById(id);
  if (!e) return NextResponse.json({ ok: false, error: "Event not found" }, { status: 404 });
  const title: string = body?.title || `${e.title} Project Charter`;
  const objectives: string | undefined = body?.objectives;
  const scope: string | undefined = body?.scope;
  const stakeholders: string | undefined = body?.stakeholders;
  const risks: string | undefined = body?.risks;
  const content = buildCharter({ title, eventTitle: e.title, eventDate: e.date, objectives, scope, stakeholders, risks });
  const doc = saveCharter(id, title, content);
  return NextResponse.json({ ok: true, data: doc });
}

