"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Zap } from "lucide-react";

type AppLinks = {
  attendee: { android: string; ios: string };
  influencer: { android: string; ios: string };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AppDownloadSection() {
  const [links, setLinks] = useState<AppLinks>({
    attendee: { android: "", ios: "" },
    influencer: { android: "", ios: "" },
  });

  useEffect(() => {
    fetch("/api/public/app-links")
      .then((r) => r.json())
      .then(setLinks)
      .catch(() => {});
  }, []);

  const hasAttendee = links.attendee.android || links.attendee.ios;
  const hasInfluencer = links.influencer.android || links.influencer.ios;

  if (!hasAttendee && !hasInfluencer) return null;

  return (
    <section className="py-20 sm:py-28 bg-dark text-white overflow-hidden relative">
      {/* Background glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-lime/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative z-10 mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-14"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-lime/10 border border-lime/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Smartphone size={16} className="text-lime" />
            <span className="text-sm font-medium text-lime">Download the App</span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.15]"
          >
            Take Guestly
            <br />
            <span className="text-lime">Everywhere</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-5 text-white/70 text-sm sm:text-base max-w-lg mx-auto"
          >
            Discover events, manage tickets, and connect with your community — all from your phone.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {/* Attendee App */}
          {hasAttendee && (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-lime/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-lime flex items-center justify-center">
                  <Zap size={22} className="text-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Attendee App</h3>
                  <p className="text-sm text-white/50">Events, tickets & community</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {links.attendee.android && (
                  <a
                    href={links.attendee.android}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <div className="flex items-center justify-center gap-2 bg-white text-dark font-medium py-3 px-4 rounded-xl hover:bg-white/90 transition-colors text-sm">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33a1 1 0 0 1 0 1.722l-2.302 1.33-2.535-2.535 2.535-2.847zM5.864 2.658L16.8 9.09l-2.302 2.302L5.864 2.658z" />
                      </svg>
                      Google Play
                    </div>
                  </a>
                )}
                {links.attendee.ios && (
                  <a
                    href={links.attendee.ios}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <div className="flex items-center justify-center gap-2 bg-white text-dark font-medium py-3 px-4 rounded-xl hover:bg-white/90 transition-colors text-sm">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      App Store
                    </div>
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {/* Influencer App */}
          {hasInfluencer && (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-lime/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4FF00] flex items-center justify-center">
                  <Smartphone size={22} className="text-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Influencer App</h3>
                  <p className="text-sm text-white/50">Create, collaborate & earn</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {links.influencer.android && (
                  <a
                    href={links.influencer.android}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <div className="flex items-center justify-center gap-2 bg-white text-dark font-medium py-3 px-4 rounded-xl hover:bg-white/90 transition-colors text-sm">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33a1 1 0 0 1 0 1.722l-2.302 1.33-2.535-2.535 2.535-2.847zM5.864 2.658L16.8 9.09l-2.302 2.302L5.864 2.658z" />
                      </svg>
                      Google Play
                    </div>
                  </a>
                )}
                {links.influencer.ios && (
                  <a
                    href={links.influencer.ios}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <div className="flex items-center justify-center gap-2 bg-white text-dark font-medium py-3 px-4 rounded-xl hover:bg-white/90 transition-colors text-sm">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      App Store
                    </div>
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
