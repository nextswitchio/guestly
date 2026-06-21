import { NextRequest, NextResponse } from "next/server";
import { getCloudinaryConfig, normalizeCloudinaryFolder, signCloudinaryParams } from "@/lib/cloudinary";

const RESOURCE_TYPES = new Set(["auto", "image", "video", "raw"]);

function getAuthToken(req: NextRequest): string | null {
  // Support both cookie-based and Bearer token authentication
  let accessToken = req.cookies.get("access_token")?.value ?? null;
  if (!accessToken) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      accessToken = authHeader.substring(7);
    }
  }
  return accessToken;
}

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAuthToken(req);
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const { searchParams } = new URL(req.url);
    const folder = normalizeCloudinaryFolder(searchParams.get("folder") || "");
    const resourceType = RESOURCE_TYPES.has(searchParams.get("resourceType") || "") 
      ? searchParams.get("resourceType") || "auto" 
      : "auto";
    const timestamp = Math.round(Date.now() / 1000);
    
    // Signature must include all parameters that will be sent to Cloudinary
    const signature = signCloudinaryParams({
      folder,
      timestamp,
      api_key: apiKey,
      resource_type: resourceType,
      upload_preset: 'guestly_uploads'
    }, apiSecret);

    const response = NextResponse.json({
      cloudName,
      apiKey,
      folder,
      resourceType,
      timestamp,
      signature,
      uploadPreset: 'guestly_uploads'
    });
    
    // Add CORS headers for mobile app access
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    
    return response;
  } catch {
    return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  return response;
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = getAuthToken(req);
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const body = await req.json().catch(() => ({}));
    const timestamp = Math.round(Date.now() / 1000);
    const folder = normalizeCloudinaryFolder(body.folder);
    const resourceType = RESOURCE_TYPES.has(body.resourceType) ? body.resourceType : "auto";
    
    // Signature must include all parameters that will be sent to Cloudinary
    const signature = signCloudinaryParams({
      folder,
      timestamp,
      api_key: apiKey,
      resource_type: resourceType,
      upload_preset: 'guestly_uploads'
    }, apiSecret);

    const response = NextResponse.json({
      cloudName,
      apiKey,
      folder,
      resourceType,
      timestamp,
      signature,
      uploadPreset: 'guestly_uploads'
    });
    
    // Add CORS headers for mobile app access
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    
    return response;
  } catch {
    return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 });
  }
}
