import crypto from "crypto";

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export function getCloudinaryConfig(): CloudinaryConfig {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured");
  }

  return { cloudName, apiKey, apiSecret };
}

export function signCloudinaryParams(
  params: Record<string, string | number | boolean | null | undefined>,
  apiSecret: string,
): string {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${payload}${apiSecret}`)
    .digest("hex");
}

export function normalizeCloudinaryFolder(value: unknown): string {
  if (typeof value !== "string") return "guestly/uploads";

  const folder = value
    .replace(/[^a-zA-Z0-9/_-]/g, "")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/|\/$/g, "");

  return folder || "guestly/uploads";
}
