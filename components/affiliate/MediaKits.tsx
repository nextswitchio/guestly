"use client";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Button from "@/components/Button";
import { StarIcon } from "@/utils/icons";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, x: -60, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function MediaKits() {
  return (
    <section className="py-20 sm:py-28 bg-white font-dm">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Left: Dark Image Placeholder */}
          <motion.div
            variants={imageVariants}
            className="relative aspect-square w-full max-w-144.25 mx-auto lg:mx-0"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full h-full bg-[#012E3B] rounded-2xl overflow-hidden relative group"
            >
              {/* Subtle pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,255,0,0.3) 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            variants={contentVariants}
            className="flex flex-col items-start w-full max-w-131"
          >
            {/* Label */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mb-4"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <StarIcon className="w-4.25 h-4.24 text-dark" />
              </motion.div>
              <span className="text-sm sm:text-base font-medium text-dark tracking-[-0.16px] leading-5">
                Influencer Tools
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-[72px] font-medium text-dark tracking-[-1.4px] leading-[1.1] sm:leading-22.5"
            >
              Automated Media Kits
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-dark text-sm sm:text-base leading-[25.2px] tracking-[0.18px]"
            >
              Stop manually tracking your performance. GUESTLY automatically
              generates a professional media kit showcasing your conversion
              rates and audience reach to attract high-paying event
              partnerships.
            </motion.p>

            {/* Button */}
            <Link href="/affiliate-auth/register">
              <motion.div
                variants={itemVariants}
                className="mt-8"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button variant="secondary">Join the Network</Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
