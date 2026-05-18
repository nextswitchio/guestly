import { NextRequest, NextResponse } from "next/server";
import { createWallet } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: string = body?.email || "";
  const role: "attendee" | "organiser" | "vendor" = body?.role || "attendee";
  if (!email) {
    return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
  }
  
  // Generate a unique user ID for the new user
  // In a real system, this would come from the database after user creation
  const userId = `user_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
  
  try {
    // Create wallet automatically for the new user
    createWallet(userId);
    
    return NextResponse.json({ 
      ok: true, 
      role, 
      userId,
      message: "Registered. Check your email to verify." 
    });
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Failed to create wallet" 
    }, { status: 500 });
  }
}
