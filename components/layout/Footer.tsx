"use client";
import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Button from "@/components/Button";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "@/utils/icons";
import { getImageSrc } from "@/utils/imageUtils";

const footerLinks = {
  discover: [
    { label: "Explore Events", href: "/explore" },
    { label: "Search", href: "/search" },
    { label: "Lagos", href: "/city/lagos" },
    { label: "Abuja", href: "/city/abuja" },
    { label: "Accra", href: "/city/accra" },
    { label: "Nairobi", href: "/city/nairobi" },
  ],
  quickLinks: [
    { label: "Organisers", href: "/organisers" },
    { label: "Affiliates", href: "/affiliates" },
    { label: "Vendors", href: "/vendors" },
    { label: "Blog", href: "/blog" },
    { label: "About Guestly", href: "/about" },
  ],
  account: [
    { label: "Log in", href: "/login" },
    { label: "Sign up", href: "/signup" },
    { label: "Wallet", href: "/wallet" },
    { label: "Event Savings", href: "/wallet/savings" },
  ],
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function Footer() {
  const [appLinks, setAppLinks] = useState({
    attendee: { android: "", ios: "" },
    influencer: { android: "", ios: "" },
  });

  useEffect(() => {
    fetch("/api/public/app-links")
      .then((r) => r.json())
      .then(setAppLinks)
      .catch(() => {});
  }, []);

  const hasAppLinks = appLinks.attendee.android || appLinks.attendee.ios || appLinks.influencer.android || appLinks.influencer.ios;

  return (
    <footer className="bg-dark text-white overflow-hidden relative py-20 sm:py-28 font-aeonik">
      <div className="absolute bg-[url(/herobg.jpg)]  inset-0 bg-cover bg-bottom bg-no-repeat" />
      <div className="absolute inset-0 bg-[#001C24E5]" />
      <div className="absolute inset-0 bg-linear-to-b from-[#03141900] to-[#03151A]" />

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center relative pb-20"
      >
        {/* Subtle background glow */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-lime/10 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.15] text-white"
          >
            Ready to host your
            <br />
            next unforgettable event?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-5 text-white text-sm sm:text-base mx-auto"
          >
            Join thousands of organizers hosting incredible events across
            Africa. It&apos;s free to start.
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <motion.div variants={itemVariants} className="w-full sm:w-51.25">
              <Button variant="primary">Create Event</Button>
            </motion.div>
            <motion.div variants={itemVariants} className="w-full sm:w-51.25">
              <Button variant="white">Explore Events</Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Footer Content */}
      <div className="relative">
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Logo & Social */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              <motion.div variants={itemVariants}>
                <Link href="/" className="inline-flex items-center gap-0">
                  <img src={getImageSrc("logo.svg")} alt="" />
                </Link>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="mt-4 text-sm text-white/85 max-w-xs leading-[100%]"
              >
                The event infrastructure platform for Africa and beyond
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-6 flex items-center gap-3"
              >
                {[
                  { icon: InstagramIcon, href: "#", label: "Instagram" },
                  { icon: FacebookIcon, href: "#", label: "Facebook" },
                  { icon: TwitterIcon, href: "#", label: "Twitter" },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full border border-white bg-white flex items-center justify-center hover:border-lime hover:bg-lime/10 transition-colors duration-500 text-[#444444] hover:text-lime"
                    aria-label={social.label}
                  >
                    <social.icon />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Link Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {/* Discover */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.h4
                  variants={itemVariants}
                  className="text-sm sm:text-base font-semibold text-white uppercase tracking-widest mb-4"
                >
                  Discover
                </motion.h4>
                <ul className="space-y-3">
                  {footerLinks.discover.map((link) => (
                    <motion.li key={link.label} variants={linkVariants}>
                      <Link
                        href={link.href}
                        className="text-sm sm:text-base text-white/85 hover:text-lime transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.h4
                  variants={itemVariants}
                  className="text-sm sm:text-base font-semibold text-white uppercase tracking-widest mb-4"
                >
                  Quick Links
                </motion.h4>
                <ul className="space-y-3">
                  {footerLinks.quickLinks.map((link) => (
                    <motion.li key={link.label} variants={linkVariants}>
                      <Link
                        href={link.href}
                        className="text-sm sm:text-base text-white/85 hover:text-lime transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Account */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.h4
                  variants={itemVariants}
                  className="text-sm sm:text-base font-semibold text-white uppercase tracking-widest mb-4"
                >
                  Account
                </motion.h4>
                <ul className="space-y-3">
                  {footerLinks.account.map((link) => (
                    <motion.li key={link.label} variants={linkVariants}>
                      <Link
                        href={link.href}
                        className="text-sm sm:text-base text-white/85 hover:text-lime transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Get the App */}
              {hasAppLinks && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.h4
                    variants={itemVariants}
                    className="text-sm sm:text-base font-semibold text-white uppercase tracking-widest mb-4"
                  >
                    Get the App
                  </motion.h4>
                  <div className="space-y-3">
                    {appLinks.attendee.android && (
                      <motion.a
                        variants={itemVariants}
                        href={appLinks.attendee.android}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg px-3 py-2.5 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor">
                          <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33a1 1 0 0 1 0 1.722l-2.302 1.33-2.535-2.535 2.535-2.847zM5.864 2.658L16.8 9.09l-2.302 2.302L5.864 2.658z" />
                        </svg>
                        <div className="text-left">
                          <p className="text-[10px] text-white/50 leading-none">Attendee on</p>
                          <p className="text-xs font-medium text-white/85">Google Play</p>
                        </div>
                      </motion.a>
                    )}
                    {appLinks.attendee.ios && (
                      <motion.a
                        variants={itemVariants}
                        href={appLinks.attendee.ios}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg px-3 py-2.5 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        <div className="text-left">
                          <p className="text-[10px] text-white/50 leading-none">Attendee on</p>
                          <p className="text-xs font-medium text-white/85">App Store</p>
                        </div>
                      </motion.a>
                    )}
                    {appLinks.influencer.android && (
                      <motion.a
                        variants={itemVariants}
                        href={appLinks.influencer.android}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg px-3 py-2.5 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor">
                          <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33a1 1 0 0 1 0 1.722l-2.302 1.33-2.535-2.535 2.535-2.847zM5.864 2.658L16.8 9.09l-2.302 2.302L5.864 2.658z" />
                        </svg>
                        <div className="text-left">
                          <p className="text-[10px] text-white/50 leading-none">Influencer on</p>
                          <p className="text-xs font-medium text-white/85">Google Play</p>
                        </div>
                      </motion.a>
                    )}
                    {appLinks.influencer.ios && (
                      <motion.a
                        variants={itemVariants}
                        href={appLinks.influencer.ios}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg px-3 py-2.5 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        <div className="text-left">
                          <p className="text-[10px] text-white/50 leading-none">Influencer on</p>
                          <p className="text-xs font-medium text-white/85">App Store</p>
                        </div>
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/17 relative">
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 pt-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white text-sm sm:text-base"
          >
            <div className="flex items-center gap-2 flex-wrap sm:justify-center">
              <span>© 2026 Guestly. All Rights Reserved.</span>
              <span className="hidden sm:inline">|</span>
              <span className="">Built for Africa</span>
            </div>

            <div className="flex items-center gap-4">
              {[{ label: "Terms", href: "/terms" }, { label: "Privacy", href: "/privacy" }, { label: "Support", href: "/support" }].map((item, i) => (
                <React.Fragment key={item.label}>
                  <motion.a
                    href={item.href}
                    whileHover={{ y: -1 }}
                    className="hover:text-lime transition-colors duration-300"
                  >
                    {item.label}
                  </motion.a>
                  {i < 2 && <span className="text-gray-700">|</span>}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
