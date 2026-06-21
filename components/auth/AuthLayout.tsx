"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getImageSrc } from "@/utils/imageUtils";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex w-full font-dm p-4 auth-light">
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex h-auto items-center justify-center "
      >
        <div className="max-w-112.5 mx-auto w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="flex items-center gap-1">
                <img src={getImageSrc("logo-dark.svg")} alt="" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Content */}
          <div className="w-full">{children}</div>
        </div>
      </motion.div>

      {/* Right Image */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="hidden lg:block w-full relative bg-[#0B1D2E] overflow-hidden rounded-2xl"
      >
        <img
          src={getImageSrc("hero1.jpg")}
          alt="Concert"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-x-[-1]"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-dark/70" />

        {/* Scrolling tags at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-28 left-0 right-0 overflow-hidden bg-dark py-6 -rotate-4"
        >
          <motion.div
            animate={{ x: [0, -200] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-6 whitespace-nowrap px-8"
          >
            {[
              "Concerts",
              "Conferences",
              "Tech Events",
              "Carnivals",
              "Parties",
              "Weddings",
              "Festivals",
            ].map((tag, i) => (
              <React.Fragment key={tag}>
                <span className="text-white text-lg sm:text-2xl font-medium">
                  {tag}
                </span>
                <span className="w-4 h-4 bg-lime rounded-full shrink-0" />
              </React.Fragment>
            ))}
            {/* Duplicate for seamless loop */}
            {[
              "Concerts",
              "Conferences",
              "Tech Events",
              "Carnivals",
              "Parties",
              "Weddings",
              "Festivals",
            ].map((tag, i) => (
              <React.Fragment key={`dup-${tag}`}>
                <span className="text-white text-sm font-medium">{tag}</span>
                <span className="w-2 h-2 bg-lime rounded-full shrink-0" />
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
