"use client";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { getImageSrc } from "@/utils/imageUtils";
import Button from "@/components/Button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const circuitVariants: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: "easeOut",
    },
  },
};

const glowVariants: Variants = {
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.02, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const AISection = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-white font-dm">
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-360 mx-auto bg-dark min-h-105.5 p-4 flex flex-col items-center justify-center relative gap-6 rounded-xl overflow-hidden"
      >
        {/* Animated glow behind circuit board */}
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-lime/10 rounded-full blur-3xl pointer-events-none"
        />

        {/* Circuit board with float animation */}
        <motion.div
          variants={circuitVariants}
          className="absolute bottom-0 left-0 right-0"
        >
          <motion.img
            src={getImageSrc("circuit_board.svg")}
            alt=""
            className="w-full h-full"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-[32px] text-center sm:text-4xl md:text-[50px] text-white font-medium relative"
        >
          <motion.span
            className="inline-block"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Let AI handle the hard work
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-center max-w-169.5 mx-auto text-sm sm:text-base leading-[150%] relative text-white/90"
        >
          Use AI to draft event descriptions, improve ticket strategy, and
          identify momentum early. You focus on the experience—we help with the
          heavy lifting.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="w-full flex flex-col gap-6 sm:flex-row items-center justify-center relative"
        >
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full sm:w-auto"
          >
            <Link href="/dashboard/ai-assistant"><Button variant="primary">Try AI Assistant</Button></Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full sm:w-auto"
          >
            <Link href="/register"><Button variant="white">Create Event</Button></Link>
          </motion.div>
        </motion.div>

        {/* Subtle particle dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-lime/30 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default AISection;
