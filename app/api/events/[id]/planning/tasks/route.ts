import { NextRequest, NextResponse } from "next/server";
import { addPlanningTask, listPlanningTasks, updatePlanningTask, PlanningTask } from "@/lib/store";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = listPlanningTasks(id);
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const title: string = body?.title || "";
  const owner: string | undefined = body?.owner;
  const dueDate: string | undefined = body?.dueDate;
  if (!title.trim()) return NextResponse.json({ ok: false, error: "Title required" }, { status: 400 });
  const task = addPlanningTask(id, { title: title.trim(), owner, dueDate, status: "todo" });
  return NextResponse.json({ ok: true, data: task });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const taskId: string = body?.taskId || "";
  const patch: Partial<PlanningTask> = {};
  if (body?.status) patch.status = body.status;
  if (body?.title) patch.title = body.title;
  if (body?.owner !== undefined) patch.owner = body.owner;
  if (body?.dueDate !== undefined) patch.dueDate = body.dueDate;
  if (!taskId) return NextResponse.json({ ok: false, error: "taskId required" }, { status: 400 });
  try {
    const data = updatePlanningTask(id, taskId, patch);
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
  }
}

