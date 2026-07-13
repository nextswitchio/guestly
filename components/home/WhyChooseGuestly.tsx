"use client";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { features } from "@/utils/constant";
import Heading from "@/components/Heading";
import { getImageSrc } from "@/utils/imageUtils";

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: i * 0.15,
    },
  }),
};

export function WhyChooseGuestly() {
  const [activeIndex, setActiveIndex] = useState(2); // Third card active by default

  return (
    <section className="py-20 sm:py-28 bg-white font-aeonik">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 sm:mb-16"
        >
          <Heading
            title="Why teams choose Guestly"
            desc="Built for modern African events with the tools organizers need to
            launch confidently and scale sustainably."
          />
        </motion.div>

        {/* Stacked Cards */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              onMouseEnter={() => setActiveIndex(index)}
              className="group relative cursor-pointer"
            >
              <motion.div
                animate={{
                  scale: activeIndex === index ? 1.01 : 1,
                  y: activeIndex === index ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`relative rounded-xl overflow-hidden transition-all duration-500`}
              >
                {/* Background Image */}
                <div className="relative h-44.75 md:h-92.5">
                  <motion.img
                    src={getImageSrc(feature.image)}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    animate={{
                      scale: activeIndex === index ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />

                  {/* Dark Overlay */}
                  <div
                    className={`absolute inset-0 transition-all duration-500
                    ${activeIndex === index ? "bg-dark/75" : "bg-dark/80"}`}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <motion.h3
                      animate={{
                        y: activeIndex === index ? -4 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={`text-xl sm:text-[24px] font-bold transition-colors duration-300 leading-[100%]
                        ${
                          activeIndex === index ? "text-white" : "text-gray-200"
                        }`}
                    >
                      {feature.title}
                    </motion.h3>

                    <AnimatePresence>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="mt-3 text-xs sm:text-base text-gray-300 max-w-md leading-[150%]"
                      >
                        {feature.description}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
