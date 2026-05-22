"use client";

type CloudinarySignature = {
  cloudName: string;
  apiKey: string;
  folder: string;
  resourceType: string;
  timestamp: number;
  signature: string;
};

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  resourceType: string;
  bytes: number;
  format?: string;
  originalFilename?: string;
};

type UploadOptions = {
  folder?: string;
  resourceType?: "auto" | "image" | "video" | "raw";
};

export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {},
): Promise<CloudinaryUploadResult> {
  const signatureRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      folder: options.folder || "guestly/uploads",
      resourceType: options.resourceType || "auto",
    }),
  });

  if (!signatureRes.ok) {
    const error = await signatureRes.json().catch(() => ({ error: "Failed to sign upload" }));
    throw new Error(error.error || "Failed to sign upload");
  }

  const signature = await signatureRes.json() as CloudinarySignature;
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signature.apiKey);
  form.append("timestamp", signature.timestamp.toString());
  form.append("signature", signature.signature);
  form.append("folder", signature.folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/${signature.resourceType}/upload`,
    { method: "POST", body: form },
  );
  const data = await uploadRes.json().catch(() => ({}));

  if (!uploadRes.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    bytes: data.bytes,
    format: data.format,
    originalFilename: data.original_filename,
  };
}
