"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/ui/Icon";

export type EventCardProps = {
  id: string;
  title: string;
  date: string;
  city: string;
  category: string;
  image: string;
  description?: string;
  price?: string | number;
  eventType?: "physical" | "virtual" | "hybrid";
  ticketsLeft?: number;
  totalTickets?: number;
  isLive?: boolean;
  isTrending?: boolean;
  distanceKm?: number;
  distanceUnit?: 'km' | 'miles';
  community?: string;
  communityType?: "campus" | "neighborhood" | "professional" | "cultural";
};

export default function EventCard(props: EventCardProps) {
  const formattedDate = new Date(props.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const eventType = props.eventType ?? "physical";
  const price = props.price != null ? (props.price === 0 || props.price === "0" ? "Free" : `₦${Number(props.price).toLocaleString()}`) : null;

  return (
    <Link
      href={`/events/${props.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={props.image}
          alt={props.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Subtle gradient for text readability if badges are present */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Badges - Top Left */}
        <div className="absolute left-3 top-3 flex gap-2">
          {props.isTrending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              <Icon name="fire" size={10} /> Trending
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm">
            {eventType === "physical" ? (
              <><Icon name="map-pin" size={10} /> In-person</>
            ) : eventType === "virtual" ? (
              <><Icon name="globe" size={10} /> Virtual</>
            ) : (
              <><Icon name="link" size={10} /> Hybrid</>
            )}
          </span>
        </div>

        {/* Category & Price - Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="inline-flex items-center rounded-lg bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {props.category}
          </span>
          {price && (
            <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm ${
              price === "Free" ? "bg-lime text-dark" : "bg-white text-slate-900"
            }`}>
              {price}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-bold leading-tight text-slate-900 group-hover:text-slate-600 transition-colors">
          {props.title}
        </h3>

        <div className="mt-4 flex flex-col gap-2">
          {/* Date Highlight */}
          <div className="inline-flex w-fit items-center gap-2 rounded-md bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
            <Icon name="calendar" size={14} className="text-slate-400" />
            {formattedDate}
          </div>

          {/* Location Highlight */}
          <div className="inline-flex w-fit items-center gap-2 rounded-md bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
            <Icon name="map-pin" size={14} className="text-slate-400" />
            <span className="truncate max-w-[200px]">{props.city}</span>
          </div>
        </div>

        {/* Pseudo-Button */}
        <div className="mt-6 mt-auto pt-4 border-t border-slate-100">
          <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-all group-hover:bg-slate-800">
            Get Tickets
          </div>
        </div>
      </div>
    </Link>
  );
}
