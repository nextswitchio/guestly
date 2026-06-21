"use client";
import { motion } from "framer-motion";

const stats = [
  { label: "50K+ Events Hosted", value: "50K+" },
  { label: "2M+ Tickets Sold", value: "2M+" },
  { label: "12+ Countries", value: "12+" },
  { label: "98% Satisfaction", value: "98%" },
  { label: "Got an idea?", value: "Got an idea?" },
];

export function StatsTicker() {
  return (
    <div className="relative bg-dark overflow-hidden py-4 mb-0">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-4"
      >
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap px-4">
          {[...stats, ...stats, ...stats].map((stat, index) => (
            <div key={index} className="flex items-center gap-12">
              <span className="text-white font-semibold text-xl sm:text-[36px] leading-[100%] tracking-[-1px]">
                {stat.label}
              </span>
              <span className="w-6 h-6 bg-lime rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
