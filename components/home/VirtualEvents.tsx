"use client";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Button from "@/components/Button";
import { GlobeFillIcon } from "@/utils/icons";
import { virtualfeatures } from "@/utils/constant";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const iconContainerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function VirtualEvents() {
  return (
    <section className="py-20 sm:py-28 bg-white font-aeonik">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Top Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-6"
        >
          <GlobeFillIcon className="text-[#012E3B]" />
          <span className="text-sm sm:text-base font-medium text-[#012E3B] uppercase tracking-tight">
            Virtual & Hybrid
          </span>
        </motion.div>

        {/* Header + Buttons Row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-[50px] font-medium text-[#012E3B] tracking-[-1.4px] max-w-160"
            >
              Host anywhere. Reach everyone.
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-3 text-[#012E3B] text-sm sm:text-base leading-[25.2px] tracking-tight max-w-160"
            >
              Run virtual or hybrid experiences with streaming, chat, polls, and
              Q&A. Reach global audiences without venue limitations.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap gap-4"
          >
            <motion.div variants={itemVariants}>
              <Link href="/register">
                <Button variant="teal">Create Virtual Event</Button>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/explore">
                <Button variant="outline">Explore Virtual</Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid items-center justify-center grid-col-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {virtualfeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={iconContainerVariants}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group cursor-pointer flex flex-col items-center justify-center xs:items-start xs:justify-start"
            >
              {/* Icon Circle */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#E7E7E7] flex items-center justify-center mb-4 duration-300"
              >
                <feature.icon className="w-6 h-6 sm:w-12 sm:h-12 text-[#012E3B]" />
              </motion.div>

              <h3 className="text-xl sm:text-[24px] font-medium text-dark mb-1 text-center xs:text-left">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-dark text-center xs:text-left">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
