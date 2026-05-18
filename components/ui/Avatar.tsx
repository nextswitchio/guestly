import React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: number;
}

export default function Avatar({ src, alt, name = "", size = 40, className = "", ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-neutral-200 text-neutral-700 ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || name} className="h-full w-full object-cover" />
      ) : (
        <span className="text-sm">{initials || "?"}</span>
      )}
    </div>
  );
}

