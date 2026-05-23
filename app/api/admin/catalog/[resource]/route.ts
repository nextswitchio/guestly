import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";
import { toSnakeCatalogPayload } from "@/lib/platformCatalog";

const RESOURCE_PATHS = new Set(["countries", "cities", "event-categories", "vendor-categories"]);

function authHeaders(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function resourcePath(params: Promise<{ resource: string }>) {
  const { resource } = await params;
  if (!RESOURCE_PATHS.has(resource)) return null;
  return resource;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const resource = await resourcePath(params);
  if (!resource) return NextResponse.json({ error: "Unknown catalog resource" }, { status: 404 });

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/catalog/${resource}`, {
      headers: authHeaders(req),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const resource = await resourcePath(params);
  if (!resource) return NextResponse.json({ error: "Unknown catalog resource" }, { status: 404 });

  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/catalog/${resource}`, {
      method: "POST",
      headers: authHeaders(req),
      body: JSON.stringify(toSnakeCatalogPayload(body)),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
