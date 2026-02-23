import React from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";

type Props = {
  id?: string;
  title: string;
  date: string;
  city: string;
  category: string;
  image: string;
  description?: string;
  onAction?: () => void;
};

export default function EventHero({
  id,
  title,
  date,
  city,
  category,
  image,
  description,
  onAction,
}: Props) {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-neutral-900">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-r from-neutral-900/90 via-neutral-900/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end gap-4 px-6 py-10 sm:px-10 sm:py-14 md:max-w-xl md:py-16">
        <Badge variant="primary" className="w-fit">{category}</Badge>

        <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="text-sm leading-relaxed text-neutral-300 line-clamp-2">
            {description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-300">
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 21c-4-4-8-7.5-8-11a8 8 0 1 1 16 0c0 3.5-4 7-8 11z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {city}
          </span>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3 pt-2">
          {id ? (
            <Button size="lg" href={`/events/${id}/buy`}>Get Tickets</Button>
          ) : (
            <Button size="lg" onClick={onAction}>Get Tickets</Button>
          )}
        </div>
      </div>
    </div>
  );
}

