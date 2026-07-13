import { Music } from 'lucide-react';
/**
 * Example usage of the updated Section component
 * 
 * This file demonstrates how to use the generalized Section component
 * with different background variants and custom content.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Section, containerVariants, itemVariants, iconVariants } from './Section';

// Example 1: Basic usage with white background (default)
export function BasicSectionExample() {
  return (
    <Section>
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold">Basic Section</h2>
        <p className="mt-4">This section uses the default white background.</p>
      </div>
    </Section>
  );
}

// Example 2: Section with neutral background
export function NeutralSectionExample() {
  return (
    <Section background="neutral">
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold">Neutral Section</h2>
        <p className="mt-4">This section uses a neutral background.</p>
      </div>
    </Section>
  );
}

// Example 3: Section with dark background
export function DarkSectionExample() {
  return (
    <Section background="dark">
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white">Dark Section</h2>
        <p className="mt-4 text-white/80">This section uses a dark background.</p>
      </div>
    </Section>
  );
}

// Example 4: Section with custom className
export function CustomClassSectionExample() {
  return (
    <Section className="py-10 sm:py-28 font-aeonik">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold">Custom Styled Section</h2>
        <p className="mt-4">This section has custom padding and font.</p>
      </div>
    </Section>
  );
}

// Example 5: Using exported animation variants
export function AnimatedSectionExample() {
  const features = [
    {
      icon: '<Music className="h-4 w-4 inline-block" />',
      title: 'Music & Concerts',
      description: 'Discover live music events and concerts',
    },
    {
      icon: '💻',
      title: 'Tech & Innovation',
      description: 'Explore tech conferences and workshops',
    },
    {
      icon: '💼',
      title: 'Business & Networking',
      description: 'Connect with professionals at networking events',
    },
  ];

  return (
    <Section background="neutral" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Animated Features</h2>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group"
            >
              <motion.div
                variants={iconVariants}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 text-4xl"
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-xl font-medium text-dark mb-3">
                {feature.title}
              </h3>
              <p className="text-dark/80">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

// Example 6: Combining multiple sections
export function MultiSectionExample() {
  return (
    <>
      <Section background="white">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold">First Section</h2>
          <p className="mt-4">White background section</p>
        </div>
      </Section>

      <Section background="neutral">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold">Second Section</h2>
          <p className="mt-4">Neutral background section</p>
        </div>
      </Section>

      <Section background="dark">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-white">Third Section</h2>
          <p className="mt-4 text-white/80">Dark background section</p>
        </div>
      </Section>
    </>
  );
}
