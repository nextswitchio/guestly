"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import Button from "@/components/Button";
import { ArrowRightIcon, CalendarIcon, LocationIcon } from "@/utils/icons";
import Heading from "@/components/Heading";
import { getImageSrc } from "@/utils/imageUtils";
import { slugify } from "@/lib/utils";

type HomeFeaturedEvent = {
  id: string | number;
  title: string;
  description: string;
  date: string;
  rawDate: string;
  location: string;
  image: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function EventCard({ event }: { event: HomeFeaturedEvent }) {
  const ref = useRef<HTMLDivElement>(null);
  const isPast = new Date(event.rawDate) < new Date();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);
  const imageScale = useTransform(mouseYSpring, [-0.5, 0.5], [1.06, 1.02]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={cardVariants}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-56 sm:h-80 rounded-xl overflow-hidden">
        {/* Background Image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{
            scale: imageScale,
            translateZ: "40px",
          }}
        >
          <img
            src={getImageSrc(event.image)}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

        {/* Lime tint on hover */}
        <div className="absolute inset-0 bg-lime/0 group-hover:bg-lime/5 transition-colors duration-500" />
      </div>

      {/* Text Info Below */}
      <div className="mt-3 space-y-1.5 transform transition-transform duration-300 group-hover:translate-y-1">
        <h3 className="text-lg sm:text-[22px] font-medium text-dark transition-colors duration-300 line-clamp-2">
          {event.title}
        </h3>
        {/* Tags Row */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="inline-flex w-fit items-center gap-1.5 px-2 py-1 text-sm sm:text-base sm:leading-[22px] bg-[#D6F8EE] text-dark">
            <CalendarIcon />
            {event.date}
          </span>
          <span className="inline-flex w-fit items-center gap-1.5 px-2 py-1 text-sm sm:text-base sm:leading-[22px] bg-[#D6F8EE] text-dark">
            <LocationIcon />
            {event.location}
          </span>
        </div>

        {/* Get Ticket Button */}
        <div className="pt-1">
          <Link href={`/events/${slugify(event.title)}`}>
            <Button variant={isPast ? "outline" : "secondary"}>{isPast ? "View Event" : "Get Ticket"}</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedEvents() {
  const [featuredEvents, setFeaturedEvents] = useState<HomeFeaturedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ pageSize: "8" });
    try {
      const savedCity = localStorage.getItem("near:city");
      const savedLocation = localStorage.getItem("near:location");
      if (savedCity) params.set("city", savedCity);
      if (savedLocation) {
        const location = JSON.parse(savedLocation);
        if (typeof location.latitude === "number" && typeof location.longitude === "number") {
          params.set("latitude", String(location.latitude));
          params.set("longitude", String(location.longitude));
        }
      }
    } catch {}

    fetch(`/api/events/featured?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const apiEvents = (data.events || data.data || []).map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: new Date(event.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
          rawDate: event.date,
          location: [event.city, event.country].filter(Boolean).join(", "),
          image: event.image || "/globe.svg",
        }));
        setFeaturedEvents(apiEvents);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !featuredEvents.length) return null;

  return (
    <section className="py-20 bg-white font-aeonik">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Heading
            title="Featured Events"
            desc="Discover what's happening around you"
            element={
              <a href="/explore" className="border-none bg-transparent cursor-pointer flex items-center gap-2.5 text-dark text-sm sm:text-base no-underline">
                See All
                <ArrowRightIcon />
              </a>
            }
          />
        </motion.div>

        {/* Events Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-y-10"
          style={{ perspective: "1000px" }}
        >
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
