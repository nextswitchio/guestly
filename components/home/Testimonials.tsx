"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { testimonials } from "@/utils/constant";
import { PlayIcon } from "@/utils/icons";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
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

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const active = testimonials[activeIndex];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsPlaying(false);
  };

  return (
    <section className="pt-20 sm:pt-28 pb-20 sm:pb-28 bg-gray-50 font-dm overflow-hidden">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-4xl md:text-[50px] font-medium text-dark tracking-[-1.4px] max-w-160 text-center mx-auto"
          >
            Trusted by organizers across Africa
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-3 text-dark text-sm sm:text-base leading-[25.2px] tracking-tight max-w-160 text-center mx-auto"
          >
            Join the new generation of creators building unforgettable
            experiences on GUESTLY.
          </motion.p>
        </motion.div>

        {/* Testimonial Content */}
        <div className="flex flex-col md:flex-row gap-16 max-w-310 mx-auto">
          {/* Left: Video Player */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-full max-w-114"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full h-88.5 md:h-125 max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden bg-[#0B1D2E] shadow-2xl"
              >
                {videoError ? (
                  <img
                    src={active.image}
                    alt={active.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      src={active.video}
                      poster={active.image}
                      muted={isMuted}
                      playsInline
                      onEnded={handleVideoEnd}
                      onError={handleVideoError}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-[#0B1D2E]/60 via-transparent to-transparent pointer-events-none" />

                    {/* Play/Pause Button Overlay */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: isPlaying ? 0 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-transparent backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <PlayIcon />
                      </motion.button>
                    </motion.div>

                    {/* Video Controls */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-4 left-4 right-4 flex items-center justify-end"
                    >
                      {/* Mute Toggle */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleMute}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
                      >
                        {isMuted ? (
                          <VolumeX size={18} className="text-white" />
                        ) : (
                          <Volume2 size={18} className="text-white" />
                        )}
                      </motion.button>
                    </motion.div>

                    {/* Loading State */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full opacity-0"
                      />
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right: Quote + Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col justify-between w-full max-w-180"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Main Quote */}
                <h3 className="text-xl sm:text-2xl mlg:text-3xl font-bold text-dark leading-[120%] mb-4">
                  {active.quote}
                </h3>

                {/* Body Text */}
                <p className="text-dark text-sm sm:text-lg mlg:text-xl font-medium leading-[150%] mb-8">
                  &ldquo;{active.body}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Avatar Selector */}
            <div className="mt-10">
              {/* Author */}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-lg font-bold text-[#0B1D2E]">
                    {active.name}
                  </p>
                  <p className="text-sm text-gray-500">{active.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                {testimonials.map((t, i) => (
                  <motion.button
                    key={t.id}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveIndex(i);
                      setIsPlaying(false);
                      setVideoError(false);
                    }}
                    className={`relative rounded-full overflow-hidden transition-all duration-500 cursor-pointer
                    ${i === activeIndex ? "" : "opacity-50 hover:opacity-80"}`}
                    style={{
                      width: i === activeIndex ? 56 : 44,
                      height: i === activeIndex ? 56 : 44,
                    }}
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
