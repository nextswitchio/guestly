"use client";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Button from "@/components/Button";
import { StarIcon } from "@/utils/icons";

const features = [
  {
    title: "Instant Payouts",
    description:
      "No more waiting weeks. Access your funds as you sell tickets.",
  },
  {
    title: "Virtual & Hybrid",
    description: "Host professional streams with interactive tools built-in.",
  },
  {
    title: "AI Assistant",
    description:
      "Generate event copy and forecast revenue with our AI co-pilot.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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

const imageVariants: Variants = {
  hidden: { opacity: 0, x: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const featureVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const dotVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.8, 1, 0.8],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export function ScaleSection() {
  return (
    <section className="py-20 sm:py-28 bg-white font-dm">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          {/* Label */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <StarIcon className="w-4.5 h-4.5 text-[#012E3B]" />
            </motion.div>
            <span className="text-sm sm:text-base font-medium text-dark tracking-[-0.16px] leading-5">
              Influencer Tools
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-[82.09px] font-medium text-dark tracking-[-1.4px] leading-[1.1] sm:leading-22.5 max-w-172.5 mx-auto"
          >
            Everything you need to scale.
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className=" text-dark text-sm sm:text-base leading-[25.2px] tracking-[0.18px] max-w-174.25 mx-auto"
          >
            Stop juggling spreadsheets and manual transfers. Our unified
            dashboard brings your ticketing, payouts, and marketing into one
            seamless workflow.
          </motion.p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-282.5 mx-auto">
          {/* Left: Dark Image Placeholder */}
          <motion.div
            variants={imageVariants}
            className="relative h-122.5 w-full max-w-125.5 mx-auto lg:mx-0"
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

          {/* Right: Features List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-10 w-full"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={featureVariants}
                custom={index}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-start gap-4 group cursor-pointer"
              >
                {/* Lime Dot */}
                <motion.div
                  variants={dotVariants}
                  animate="animate"
                  transition={{ delay: index * 0.5 }}
                  className="w-6 h-6 bg-lime rounded-full shrink-0 mt-1.5 group-hover:scale-125 transition-transform"
                />

                <div>
                  <h3 className="text-xl sm:text-[32px] font-medium text-[#012E3B] group-hover:text-lime transition-colors duration-300 leading-[100%]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[#012E3B] text-sm sm:text-base leading-[25.2px] tracking-[0.18px]">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Button */}
            <motion.div
              variants={itemVariants}
              className="pt-4 w-full max-w-[205.5px]"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href="/explore"><Button variant="teal">Find Event</Button></Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
