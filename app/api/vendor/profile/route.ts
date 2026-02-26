import { NextRequest, NextResponse } from "next/server";
import { createVendorProfile, getVendorProfile } from "@/lib/store";

function userId(req: NextRequest) {
  const uid = req.cookies.get("user_id")?.value;
  if (!uid) throw new Error("Unauthorized");
  return uid;
}

export async function GET(req: NextRequest) {
  try {
    const profile = getVendorProfile(userId(req));
  return NextResponse.json({ ok: true, profile });
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Basic validation
    if (!body.name || !body.description || !body.category || !body.contactEmail) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const profile = createVendorProfile(userId(req), {
      name: body.name,
      description: body.description,
      category: body.category,
      portfolio: body.portfolio || [],
      rateCard: body.rateCard || "",
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone || "",
    });

    return NextResponse.json({ ok: true, profile });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Failed to create profile" }, { status: 500 });
  }
}
