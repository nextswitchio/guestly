"use client";
import { motion } from "framer-motion";
import { getImageSrc } from "@/utils/imageUtils";

const topRowFaces = ["rt1.png", "rt2.png", "rt3.png", "rt4.png", "rt5.png"];
const bottomRowFaces = ["rb1.png", "rb2.png", "rb3.png", "rb4.png"];

export function InfluencerBanner() {
  // Duplicate for seamless loop
  const topRow = [...topRowFaces, ...topRowFaces];
  const bottomRow = [...bottomRowFaces, ...bottomRowFaces];

  return (
    <section className="relative h-80 sm:h-96 lg:h-143.5 overflow-hidden font-dm">
      {/* Image Grid with sliding rows */}
      <div className="absolute inset-0 flex flex-col">
        {/* Top row - slides LEFT */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex h-full absolute"
            animate={{ x: [0, "-50%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {topRow.map((face, index) => (
              <div
                key={`top-${index}`}
                className="h-full w-1/5 shrink-0 relative overflow-hidden"
              >
                <img
                  src={getImageSrc(face)}
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom row - slides RIGHT */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex h-full absolute right-0"
            style={{ x: "-50%" }}
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {bottomRow.map((face, index) => (
              <div
                key={`bottom-${index}`}
                className="h-full w-1/5 shrink-0 relative overflow-hidden"
              >
                <img
                  src={getImageSrc(face)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#001C24E5]" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white text-center leading-[100%]"
        >
          Join Over 10K+ Influencers
        </motion.h2>
      </div>
    </section>
  );
}
