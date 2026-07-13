"use client";
import { motion, type Variants } from "framer-motion";
import { StarIcon, AnalyticsIcon, ZapIcon, UserIcon, PayoutIcon, BriefcaseIcon, User1Icon } from "@/utils/icons";
import Button from "@/components/Button";
import Link from "next/link";

const metrics = [
  {
    stat: "50,000+",
    label: "Events Hosted",
    description: "From intimate gatherings to massive conferences",
  },
  {
    stat: "2M+",
    label: "Attendees",
    description: "Active community across 20+ African cities",
  },
  {
    stat: "$45M+",
    label: "Processed",
    description: "In ticket sales and marketplace transactions",
  },
  {
    stat: "99.9%",
    label: "Uptime",
    description: "Reliable infrastructure for your events",
  },
];

const tools = [
  {
    title: "Real-Time Analytics",
    description: "Live dashboards tracking sales, attendance, and engagement metrics",
    icon: AnalyticsIcon,
  },
  {
    title: "AI-Powered Insights",
    description: "Smart recommendations to optimize tickets, pricing, and marketing",
    icon: ZapIcon,
  },
  {
    title: "Community Tools",
    description: "Built-in discussions, Q&A, and engagement features",
    icon: UserIcon,
  },
  {
    title: "Payment Suite",
    description: "Accept payments globally with instant settlements",
    icon: PayoutIcon,
  },
  {
    title: "Merchandise Store",
    description: "Sell branded products directly through your event page",
    icon: BriefcaseIcon,
  },
  {
    title: "Team Management",
    description: "Invite team members, assign roles, and collaborate seamlessly",
    icon: User1Icon,
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

const metricVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: i * 0.1,
    },
  }),
};

export function OrganizerSuccessSection() {
  return (
    <section className="py-20 sm:py-28 bg-white font-aeonik">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Metrics Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 sm:mb-28"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <StarIcon className="w-4.5 h-4.5 text-[#012E3B]" />
              </motion.div>
              <span className="text-sm sm:text-base font-medium text-dark tracking-[-0.16px] leading-5">
                Trusted by Thousands
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-[82.09px] font-medium text-dark tracking-[-1.4px] leading-[1.1] sm:leading-22.5 max-w-172.5 mx-auto"
            >
              Join the fastest growing event platform in Africa.
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-dark text-sm sm:text-base leading-[25.2px] tracking-[0.18px] max-w-174.25 mx-auto mt-6"
            >
              Organizers across Lagos, Abuja, Accra, Nairobi and beyond are hosting
              profitable, memorable events on Guestly. Here's what's possible.
            </motion.p>
          </div>

          {/* Metrics Grid */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.stat}
                custom={index}
                variants={metricVariants}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-center"
              >
                <motion.h3 className="text-3xl sm:text-5xl font-bold text-lime mb-2">
                  {metric.stat}
                </motion.h3>
                <p className="text-[#012E3B] font-semibold text-base sm:text-lg mb-2">
                  {metric.label}
                </p>
                <p className="text-[#012E3B]/60 text-xs sm:text-sm leading-[150%]">
                  {metric.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="border-t border-[#E5E5E5] pt-20 sm:pt-28"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-[50px] font-medium text-dark tracking-[-1.4px]"
            >
              Powerful tools at your fingertips
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-dark/70 text-sm sm:text-base leading-[25.2px] max-w-160 mx-auto"
            >
              Everything you need to create, promote, and manage successful events
              is built into your organizer dashboard.
            </motion.p>
          </div>

          {/* Tools Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {tools.map((tool, index) => (
              <motion.div
                key={tool.title}
                custom={index}
                variants={metricVariants}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group p-6 sm:p-8 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#012E3B] hover:border-[#012E3B] hover:shadow-md transition-all duration-300"
              >
                <tool.icon className="w-9 h-9 sm:w-10 sm:h-10 text-lime mb-4 group-hover:text-lime group-hover:scale-110 transition-all duration-300" />
                <h3 className="text-lg sm:text-xl font-medium text-[#012E3B] group-hover:text-white transition-colors duration-300 mb-2">
                  {tool.title}
                </h3>
                <p className="text-[#012E3B]/70 group-hover:text-white/80 text-sm sm:text-base leading-[150%] transition-colors duration-300">
                  {tool.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
