"use client";
import React from "react";
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
    { label: "Blogs", href: "#" },
    { label: "About Guestly", href: "#" },
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
  return (
    <footer className="bg-dark text-white overflow-hidden relative py-20 sm:py-28 font-dm">
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
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
