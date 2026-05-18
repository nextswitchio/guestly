"use client";
import { motion, type Variants } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Create Your Event",
    description: "Set up your event in minutes. Add title, date, location, description, and cover image. Create multiple ticket tiers with different pricing.",
  },
  {
    number: "2",
    title: "Customize & Share",
    description: "Configure event details, add your team, set up merchandise, customize your event page. Share directly to your audience via link or QR code.",
  },
  {
    number: "3",
    title: "Sell & Earn",
    description: "Watch tickets sell in real-time on your live dashboard. Track revenue, attendees, and engagement. Get paid instantly—no waiting.",
  },
  {
    number: "4",
    title: "Engage & Scale",
    description: "Use community tools, analytics, and AI insights to refine your strategy. Plan your next event with data from your last one.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="relative flex flex-col p-6 sm:p-7 lg:p-8 bg-white rounded-lg border border-[#E0E0E0] hover:border-lime/50 hover:shadow-lg transition-all duration-300"
    >
      {/* Step Number Badge */}
      <div className="mb-4 inline-flex">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-lime to-lime/80 text-dark font-semibold text-sm">
          {step.number}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-semibold text-[#012E3B] mb-3 leading-tight">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-[#012E3B]/70 text-sm sm:text-base leading-relaxed">
        {step.description}
      </p>

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-lime via-lime/50 to-transparent rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full" />
    </motion.div>
  );
}

export function OrganizerWorkflowSection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 font-dm bg-white">
      <div className="relative z-10 mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-[48px] font-semibold text-[#012E3B] tracking-[-0.96px]">
            Get started in 4 simple steps
          </h2>
          <p className="mt-4 text-[#012E3B]/70 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            From launch to growth—your complete journey to becoming a successful event organizer on Guestly.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step) => (
            <StepCard key={step.number} step={step} index={parseInt(step.number) - 1} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
