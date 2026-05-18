"use client";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import Heading from "@/components/Heading";
import { getImageSrc } from "@/utils/imageUtils";
import { StarIcon, GlobeIcon, UserIcon, ZapIcon } from "@/utils/icons";

const benefits = [
  {
    id: "1",
    title: "Control Your Revenue",
    description: "Set your own ticket prices, choose commission rates, and watch real-time earnings. No surprises, no hidden fees—just transparent, fast payouts.",
    image: "/placeholder-revenue.jpg",
    icon: StarIcon,
  },
  {
    id: "2",
    title: "Reach More Attendees",
    description: "List your events across a dedicated marketplace, reach thousands of discovery-minded attendees, and sell more tickets with less marketing effort.",
    image: "/placeholder-reach.jpg",
    icon: GlobeIcon,
  },
  {
    id: "3",
    title: "Grow Your Community",
    description: "Built-in community tools let you engage attendees before, during, and after events. Foster discussions, gather feedback, and build lasting relationships.",
    image: "/placeholder-community.jpg",
    icon: UserIcon,
  },
  {
    id: "4",
    title: "Scale With Confidence",
    description: "Host everything from 50-person meetups to 5,000-person hybrid conferences. Our infrastructure scales with you—no technical headaches.",
    image: "/placeholder-scale.jpg",
    icon: ZapIcon,
  },
];

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

export function OrganizerBenefitsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 sm:py-28 bg-white font-dm">
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
            title="Why organizers trust Guestly"
            desc="Join thousands of event creators across Africa who've grown their reach, increased revenue, and built stronger communities with our platform."
          />
        </motion.div>

        {/* Stacked Cards */}
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
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
                className="relative rounded-xl overflow-hidden transition-all duration-500"
              >
                {/* Background Image with Placeholder */}
                <div className="relative h-44.75 md:h-92.5 bg-gradient-to-br from-[#012E3B]/10 to-lime/5 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div className="space-y-4">
                      <benefit.icon className="w-16 h-16 sm:w-20 sm:h-20 text-lime/20 mx-auto" />
                      <p className="text-[#012E3B]/30 text-sm font-medium">
                        Image Placeholder
                      </p>
                    </div>
                  </div>

                  {/* Dark Overlay */}
                  <div
                    className={`absolute inset-0 transition-all duration-500 ${
                      activeIndex === index ? "bg-dark/75" : "bg-dark/80"
                    }`}
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
                      className={`text-xl sm:text-[24px] font-bold transition-colors duration-300 leading-[100%] ${
                        activeIndex === index ? "text-white" : "text-gray-200"
                      }`}
                    >
                      {benefit.title}
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        activeIndex === index
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="mt-3 text-xs sm:text-base text-gray-300 max-w-md leading-[150%]"
                    >
                      {benefit.description}
                    </motion.p>
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
