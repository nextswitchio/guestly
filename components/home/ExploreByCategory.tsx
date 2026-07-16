"use client";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Heading from "@/components/Heading";
import Icon from "@/components/ui/Icon";
import { DEFAULT_PLATFORM_CATALOG, PlatformCategory, normalizeCatalog } from "@/lib/platformCatalog";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function ExploreByCategory() {
  const [categories, setCategories] = useState<PlatformCategory[]>(DEFAULT_PLATFORM_CATALOG.eventCategories.filter(category => category.isFeatured));

  useEffect(() => {
    fetch("/api/platform/catalog")
      .then(res => res.json())
      .then(data => {
        const items = normalizeCatalog(data).eventCategories.filter(category => category.isActive && category.isFeatured);
        setCategories(items.length ? items : DEFAULT_PLATFORM_CATALOG.eventCategories.filter(category => category.isFeatured));
      })
      .catch((err) => console.error("Failed to fetch event categories:", err));
  }, []);

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
            title="Explore by Category"
            desc="From concerts to networking nights—discover events that match your goals and vibe."
          />
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {categories.map((category) => (
            <a
              key={category.slug}
              href={`/explore?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col items-center gap-4 transition-colors duration-300 no-underline"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.05, rotate: [-10, 10] }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-16 h-16 sm:w-32 sm:h-32 rounded-full border border-dark group-hover:border-lime group-hover:bg-lime-hover/5 flex items-center justify-center transition-all duration-300"
              >
                <Icon name={category.icon || "briefcase"} className="text-dark group-hover:text-lime transition-colors duration-300 w-8 h-8 sm:w-16 sm:h-16" />
              </motion.div>
              <span className="text-sm sm:text-base tracking-tight text-dark text-center leading-[25.2px]">
                {category.name}
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
