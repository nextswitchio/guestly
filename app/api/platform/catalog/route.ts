import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";
import { DEFAULT_PLATFORM_CATALOG, normalizeCatalog } from "@/lib/platformCatalog";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/catalog`, { cache: "no-store" });
    if (!res.ok) throw new Error("Catalog backend unavailable");
    const data = await res.json();
    return NextResponse.json(normalizeCatalog(data));
  } catch {
    return NextResponse.json(DEFAULT_PLATFORM_CATALOG);
  }
}
