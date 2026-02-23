import React from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

export type EventCardProps = {
  id: string;
  title: string;
  date: string;
  city: string;
  category: string;
  image: string;
  description?: string;
};

export default function EventCard(props: EventCardProps) {
  const formattedDate = new Date(props.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/events/${props.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        <img
          src={props.image}
          alt={props.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Category pill */}
        <div className="absolute left-3 top-3">
          <Badge variant="primary" className="shadow-sm">{props.category}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="text-sm font-semibold leading-snug text-neutral-900 group-hover:text-primary-600 transition-colors">
          {props.title}
        </h3>

        {props.description && (
          <p className="text-xs leading-relaxed text-neutral-500 line-clamp-2">
            {props.description}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-neutral-400">
          {/* Calendar icon */}
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span>{formattedDate}</span>

          <span className="text-neutral-200">·</span>

          {/* Pin icon */}
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 21c-4-4-8-7.5-8-11a8 8 0 1 1 16 0c0 3.5-4 7-8 11z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{props.city}</span>
        </div>
      </div>
    </Link>
  );
}

