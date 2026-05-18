"use client";
import { motion, type Variants } from "framer-motion";
import { steps } from "@/utils/constant";
import { Blob, Blob1 } from "@/utils/icons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const numberVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.15 },
  },
};

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const alignClass =
    step.align === "left"
      ? "items-start text-left"
      : step.align === "center"
        ? "items-start text-left"
        : "items-start text-left";

  const marginClass =
    step.align === "left"
      ? "ml-0 mr-auto"
      : step.align === "center"
        ? "mx-auto"
        : "ml-auto mr-0";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "100px" }}
      className={`relative flex flex-col ${alignClass} max-w-107.75 ${marginClass}`}
    >
      {/* Large Number */}
      <motion.span
        variants={numberVariants}
        className="text-5xl sm:text-6xl lg:text-8xl leading-[100%] font-medium text-[#044D61] select-none"
        whileHover={{ scale: 1.05, color: "rgba(13, 148, 136, 0.6)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {step.number}
      </motion.span>

      {/* Content */}
      <motion.div variants={textVariants} className="mt-2 space-y-3">
        <h3 className="text-xl sm:text-[24px] font-semibold text-lime">
          {step.title}
        </h3>
        <p className="text-white text-sm sm:text-base leading-relaxed">
          {step.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section className="relative py-24 font-dm sm:py-32 bg-dark overflow-hidden">
      {/* Decorative Blob - Top Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 100 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-0 right-0 pointer-events-none"
      >
        <Blob />
      </motion.div>

      {/* Decorative Blob - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -100, y: 100 }}
        whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className="absolute -bottom-5 left-0 pointer-events-none"
      >
        <Blob1 />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-20 sm:mb-28"
        >
          <h2 className="text-2xl sm:text-4xl md:text-[50px] font-medium text-white tracking-[-1.4px]">
            How Guestly Works
          </h2>
          <p className="mt-3 text-white text-sm sm:text-base leading-[25.2px] tracking-tight max-w-160 text-center mx-auto">
            From launch to payout—three practical steps to run a better event
            with less stress.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-10">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />
    </section>
  );
}
