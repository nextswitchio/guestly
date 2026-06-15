"use client";
import { motion, type Variants } from "framer-motion";
import { StarIcon, TicketIcon, PayoutIcon, AnalyticsIcon, ZapIcon, GlobeIcon, BriefcaseIcon } from "@/utils/icons";

const features = [
  {
    number: "01",
    title: "Ticketing & Sales",
    description: "Create unlimited ticket tiers, set dynamic pricing, and sell with confidence. Track inventory in real-time and watch revenue flow in instantly.",
    icon: TicketIcon,
  },
  {
    number: "02",
    title: "Instant Payouts",
    description: "Get paid immediately as tickets sell. No more waiting weeks for your money. Choose your payout method and watch funds appear within minutes.",
    icon: PayoutIcon,
  },
  {
    number: "03",
    title: "Live Analytics",
    description: "See real-time dashboard showing ticket sales, revenue, attendee demographics, and event momentum. Make decisions backed by live data.",
    icon: AnalyticsIcon,
  },
  {
    number: "04",
    title: "AI Co-Pilot",
    description: "Let AI draft event descriptions, optimize ticket strategy, forecast revenue, and generate marketing copy. You focus on the vision—we handle the content.",
    icon: ZapIcon,
  },
  {
    number: "05",
    title: "Virtual & Hybrid Events",
    description: "Host professional streams with built-in interactive tools—polls, Q&A, chat, and live audience engagement. Scale your reach beyond the venue.",
    icon: GlobeIcon,
  },
  {
    number: "06",
    title: "Merchandise Store",
    description: "Sell branded merchandise directly to attendees. Manage inventory, set pricing, and earn extra revenue with zero upfront cost.",
    icon: BriefcaseIcon,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: i * 0.1,
    },
  }),
};

export function OrganizerFeaturesSection() {
  return (
    <section className="py-20 sm:py-28 pb-20 sm:pb-28 bg-white font-dm">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 sm:mb-20"
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
              Complete Toolkit
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-[82.09px] font-medium text-dark tracking-[-1.4px] leading-[1.1] sm:leading-22.5 max-w-172.5 mx-auto"
          >
            Everything to host, sell & grow.
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-dark text-sm sm:text-base leading-[25.2px] tracking-[0.18px] max-w-174.25 mx-auto mt-6"
          >
            From ticketing to payouts to AI-powered insights—all the tools organizers need to create memorable events and build thriving communities.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              custom={index}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative p-6 sm:p-8 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#012E3B] hover:border-[#012E3B] hover:shadow-lg transition-all duration-300"
            >
              {/* Number */}
              <motion.span
                className="text-5xl sm:text-6xl font-medium text-lime/30 group-hover:text-lime/60 transition-colors duration-300 leading-[100%]"
              >
                {feature.number}
              </motion.span>

              {/* Icon and Title */}
              <div className="mt-6 flex items-start gap-3">
                <feature.icon className="w-9 h-9 sm:w-10 sm:h-10 text-lime group-hover:text-lime transition-colors duration-300" />
                <h3 className="text-lg sm:text-xl font-medium text-[#012E3B] group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>

              {/* Description */}
              <p className="mt-3 text-[#012E3B]/70 group-hover:text-white/80 text-sm sm:text-base leading-[25.2px] tracking-[0.18px] transition-colors duration-300">
                {feature.description}
              </p>

              {/* Accent line */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-lime rounded-t-xl"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
