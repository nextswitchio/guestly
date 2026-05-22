import { NextRequest, NextResponse } from "next/server";
import { getCloudinaryConfig, signCloudinaryParams } from "@/lib/cloudinary";

const RESOURCE_TYPES = new Set(["image", "video", "raw"]);

export async function POST(req: NextRequest) {
  try {
    if (!req.cookies.get("access_token")?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const body = await req.json().catch(() => ({}));
    const publicId = typeof body.publicId === "string" ? body.publicId : "";
    const resourceType = RESOURCE_TYPES.has(body.resourceType) ? body.resourceType : "image";

    if (!publicId) {
      return NextResponse.json({ error: "publicId is required" }, { status: 400 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signature = signCloudinaryParams({ public_id: publicId, timestamp }, apiSecret);
    const params = new URLSearchParams({
      public_id: publicId,
      timestamp: timestamp.toString(),
      api_key: apiKey,
      signature,
    });

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
      method: "POST",
      body: params,
    });
    const data = await res.json().catch(() => ({}));

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to delete Cloudinary asset" }, { status: 500 });
  }
}
