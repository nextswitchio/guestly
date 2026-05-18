"use client";
import React, { useRef, useState } from "react";
import Progress from "./Progress";

interface FileWithProgress {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onUpload?: (files: File[]) => Promise<void>;
  onChange?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
}

export default function FileUpload({
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  onUpload,
  onChange,
  disabled = false,
  className = "",
  showPreview = true,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }

    if (accept) {
      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const mimeType = file.type;

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileExtension === type.toLowerCase();
        }
        if (type.endsWith("/*")) {
          return mimeType.startsWith(type.replace("/*", ""));
        }
        return mimeType === type;
      });

      if (!isAccepted) {
        return `File type not accepted. Accepted types: ${accept}`;
      }
    }

    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles || disabled) return;

    const fileArray = Array.from(newFiles);

    // Check max files limit
    if (maxFiles && files.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`);
      return;
    }

    const validatedFiles: FileWithProgress[] = fileArray.map((file) => {
      const error = validateFile(file);
      return {
        file,
        progress: 0,
        status: error ? "error" : "pending",
        error: error || undefined,
      };
    });

    const validFiles = validatedFiles.filter((f) => f.status !== "error");
    const newFileList = [...files, ...validatedFiles];
    setFiles(newFileList);

    // Call onChange with valid files
    if (onChange && validFiles.length > 0) {
      onChange(validFiles.map((f) => f.file));
    }

    // Auto-upload if onUpload is provided
    if (onUpload && validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (filesToUpload: FileWithProgress[]) => {
    if (!onUpload) return;

    for (const fileWithProgress of filesToUpload) {
      try {
        // Update status to uploading
        setFiles((prev) =>
          prev.map((f) =>
            f.file === fileWithProgress.file
              ? { ...f, status: "uploading", progress: 0 }
              : f
          )
        );

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.file === fileWithProgress.file && f.progress < 90
                ? { ...f, progress: f.progress + 10 }
                : f
            )
          );
        }, 200);

        // Perform actual upload
        await onUpload([fileWithProgress.file]);

        clearInterval(progressInterval);

        // Update status to success
        setFiles((prev) =>
          prev.map((f) =>
            f.file === fileWithProgress.file
              ? { ...f, status: "success", progress: 100 }
              : f
          )
        );
      } catch (error) {
        // Update status to error
        setFiles((prev) =>
          prev.map((f) =>
            f.file === fileWithProgress.file
              ? {
                  ...f,
                  status: "error",
                  error: error instanceof Error ? error.message : "Upload failed",
                }
              : f
          )
        );
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onChange) {
      onChange(newFiles.map((f) => f.file));
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const isImage = (file: File) => {
    return file.type.startsWith("image/");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center
          min-h-[200px] px-6 py-8
          border-2 border-dashed rounded-xl
          transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? "border-primary-500 bg-primary-50"
              : "border-surface-border bg-surface-card hover:border-primary-400 hover:bg-surface-hover"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
          aria-label="File upload input"
        />

        {/* Upload Icon */}
        <div
          className={`
          mb-4 p-3 rounded-full
          ${
            isDragging
              ? "bg-primary-100"
              : "bg-surface-hover"
          }
        `}
        >
          <svg
            className={`w-8 h-8 ${
              isDragging ? "text-primary-500" : "text-foreground-muted"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-sm font-medium text-foreground mb-1">
            {isDragging ? "Drop files here" : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-foreground-muted">
            {accept && `Accepted formats: ${accept}`}
            {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
            {maxFiles && ` • Max ${maxFiles} file${maxFiles > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          {files.map((fileWithProgress, index) => (
            <div
              key={`${fileWithProgress.file.name}-${index}`}
              className="flex items-start gap-3 p-3 rounded-lg bg-surface-card border border-surface-border"
            >
              {/* Preview or Icon */}
              {showPreview && isImage(fileWithProgress.file) ? (
                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-surface-hover">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(fileWithProgress.file)}
                    alt={fileWithProgress.file.name}
                    className="w-full h-full object-cover"
                    onLoad={(e) => {
                      // Revoke object URL after image loads to free memory
                      setTimeout(() => {
                        URL.revokeObjectURL((e.target as HTMLImageElement).src);
                      }, 100);
                    }}
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-hover flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-foreground-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {fileWithProgress.file.name}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {formatFileSize(fileWithProgress.file.size)}
                    </p>
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {fileWithProgress.status === "success" && (
                      <div className="w-5 h-5 rounded-full bg-success-100 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-success-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                    {fileWithProgress.status === "error" && (
                      <div className="w-5 h-5 rounded-full bg-danger-100 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-danger-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    )}
                    {fileWithProgress.status !== "error" &&
                      fileWithProgress.status !== "success" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="w-5 h-5 rounded-full hover:bg-surface-hover flex items-center justify-center transition-colors"
                          aria-label="Remove file"
                        >
                          <svg
                            className="w-3 h-3 text-foreground-muted"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                  </div>
                </div>

                {/* Progress Bar */}
                {fileWithProgress.status === "uploading" && (
                  <Progress
                    value={fileWithProgress.progress}
                    size="sm"
                    color="primary"
                    className="mt-2"
                  />
                )}

                {/* Error Message */}
                {fileWithProgress.error && (
                  <p className="text-xs text-danger-600 mt-1">
                    {fileWithProgress.error}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
