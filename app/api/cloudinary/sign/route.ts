import { NextRequest, NextResponse } from "next/server";
import { getCloudinaryConfig, normalizeCloudinaryFolder, signCloudinaryParams } from "@/lib/cloudinary";

const RESOURCE_TYPES = new Set(["auto", "image", "video", "raw"]);

export async function POST(req: NextRequest) {
  try {
    if (!req.cookies.get("access_token")?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const body = await req.json().catch(() => ({}));
    const timestamp = Math.round(Date.now() / 1000);
    const folder = normalizeCloudinaryFolder(body.folder);
    const resourceType = RESOURCE_TYPES.has(body.resourceType) ? body.resourceType : "auto";
    const signature = signCloudinaryParams({ folder, timestamp }, apiSecret);

    return NextResponse.json({
      cloudName,
      apiKey,
      folder,
      resourceType,
      timestamp,
      signature,
    });
  } catch {
    return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 });
  }
}
