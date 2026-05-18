import { NextRequest, NextResponse } from "next/server";
import { registerDeviceToken } from "@/lib/marketing";

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Login required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { token, platform } = body;

    if (!token || !platform) {
      return NextResponse.json(
        { error: "Missing required fields: token, platform" },
        { status: 400 }
      );
    }

    if (!["web", "ios", "android"].includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform. Must be: web, ios, or android" },
        { status: 400 }
      );
    }

    registerDeviceToken(userId, token, platform as "web" | "ios" | "android");

    return NextResponse.json({
      success: true,
      message: "Device token registered successfully",
    });
  } catch (error) {
    console.error("Error registering device token:", error);
    return NextResponse.json(
      { error: "Failed to register device token" },
      { status: 500 }
    );
  }
}
