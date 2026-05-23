"use client";

import { useRef, useState } from "react";
import { FileText, Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinaryClient";

type CloudinaryUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  folder?: string;
  placeholder?: string;
  preview?: "image" | "file";
  allowManualUrl?: boolean;
};

export default function CloudinaryUploadField({
  label,
  value,
  onChange,
  accept = "image/*",
  folder = "guestly/uploads",
  placeholder = "https://...",
  preview = "image",
  allowManualUrl = false,
}: CloudinaryUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");

    try {
      const result = await uploadToCloudinary(file, { folder, resourceType: "auto" });
      onChange(result.secureUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-dark">{label}</label>
      {value && preview === "image" && (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
          <img src={value} alt="" className="h-40 w-full object-cover" />
        </div>
      )}
      {value && preview === "file" && (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-dark hover:bg-gray-100"
        >
          <FileText className="h-4 w-4" />
          View uploaded file
        </a>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        {allowManualUrl ? (
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {preview === "image" ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            </span>
            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              type="url"
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-dark placeholder:text-gray-400 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-dark"
                aria-label={`Clear ${label}`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : value ? (
          <div className="flex min-h-11 flex-1 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600">
            <span className="truncate">{value.split("/").pop() || "Uploaded file"}</span>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-dark"
              aria-label={`Clear ${label}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex min-h-11 flex-1 items-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 text-sm text-gray-400">
            {placeholder}
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-dark px-4 text-sm font-medium text-dark transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading" : "Upload"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void handleUpload(file);
        }}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
