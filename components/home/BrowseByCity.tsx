"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Heading from "@/components/Heading";
import { getImageSrc } from "@/utils/imageUtils";
import { cities } from "@/utils/constant";
import { DEFAULT_PLATFORM_CATALOG, normalizeCatalog } from "@/lib/platformCatalog";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

type CityCardData = {
  name: string;
  tagline: string;
  image: string;
  slug?: string;
};

function CityCard({ city }: { city: CityCardData }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  const imageScale = useTransform(mouseYSpring, [-0.5, 0.5], [1.08, 1.02]);

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
            src={getImageSrc(city.image)}
            alt={city.name}
            className="w-full h-full object-cover object-bottom "
          />
        </motion.div>

        {/* Gradient Overlay - Always visible */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Lime glow on hover */}
        <div className="absolute inset-0 bg-lime/0 group-hover:bg-lime/5 transition-colors duration-500" />

        {/* Top Right Arrow - 3D float */}
        <div
          className="absolute top-4 right-4 z-10"
          style={{ transform: "translateZ('80px')" }}
        >
          <div
            className="w-10 h-10 rounded-full border border-white/30 backdrop-blur-sm
                       flex items-center justify-center
                       opacity-0 translate-x-2 -translate-y-2 scale-75
                       group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100
                       group-hover:border-lime group-hover:bg-lime/20
                       transition-all duration-500 ease-out"
          >
            <ArrowUpRight
              size={20}
              className="text-white group-hover:text-lime transition-colors"
            />
          </div>
        </div>
      </div>

      {/* text below */}
      <div className="mt-4 transform transition-transform duration-300 group-hover:translate-y-1">
        <h3 className="text-xl sm:text-[24px] font-medium text-dark group-hover:text-lime transition-colors duration-300 tracking-[-1px]">
          {city.name}
        </h3>
        <p className="mt-1 text-sm sm:text-base leading-[25.2px] text-dark">
          {city.tagline}
        </p>
      </div>
    </motion.div>
  );
}

export function BrowseByCity() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [featuredCities, setFeaturedCities] = useState<CityCardData[]>(
    cities.map(c => ({ ...c, slug: c.name.toLowerCase() })),
  );

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    fetch("/api/platform/catalog")
      .then(res => res.json())
      .then(data => {
        const catalog = normalizeCatalog(data);
        const fallbackTaglines = new Map(cities.map(city => [city.name, city.tagline]));
        const items = catalog.cities
          .filter(city => city.isActive && city.isFeatured)
          .map(city => ({
            name: city.name,
            slug: city.slug,
            tagline: fallbackTaglines.get(city.name) || `${city.countryName} events and experiences`,
            image: city.image || `${city.slug}.jpg`,
          }));
        setFeaturedCities(items.length ? items : DEFAULT_PLATFORM_CATALOG.cities.filter(city => city.isFeatured).map(city => ({
          name: city.name,
          slug: city.slug,
          tagline: fallbackTaglines.get(city.name) || `${city.countryName} events and experiences`,
          image: city.image || `${city.slug}.jpg`,
        })));
      })
      .catch((err) => console.error("Failed to fetch cities:", err));
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

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
            title="Browse by City"
            desc="Discover what's happening in your neighborhood"
          />
        </motion.div>

        {/* Scrollable cities carousel */}
        <div className="relative">
          {/* Desktop scroll arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg items-center justify-center hover:bg-slate-50 transition-all"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg items-center justify-center hover:bg-slate-50 transition-all"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory hidden-scroll pb-2 pl-4 md:pl-0 pr-4 md:pr-0"
            style={{ perspective: "1000px", scrollPaddingLeft: "1rem", scrollPaddingRight: "1rem" }}
          >
            {featuredCities.map((city) => (
              <div
                key={city.name}
                className="snap-start shrink-0 w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[23.5%]"
              >
                <Link href={`/cities/${city.slug || city.name.toLowerCase()}`}>
                  <CityCard city={city} />
                </Link>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
