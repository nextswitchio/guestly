"use client";
import { motion, type Variants } from "framer-motion";
import Button from "@/components/Button";
import Link from "next/link";
import { StarIcon } from "@/utils/icons";

const faqs = [
  {
    question: "How much does it cost to host an event?",
    answer: "Guestly is free to create and manage your event. We charge a small 3-5% commission only when you sell tickets or merchandise. No setup fees, no hidden costs.",
  },
  {
    question: "When do I get paid after ticket sales?",
    answer: "Payments are instant! You'll see funds appear in your chosen account within minutes of ticket sales. Complete transparency with real-time tracking.",
  },
  {
    question: "Can I host virtual or hybrid events?",
    answer: "Absolutely. Create fully virtual events with live streaming, interactive tools like polls and Q&A, or hybrid events combining in-person and online attendance.",
  },
  {
    question: "What support is available?",
    answer: "We offer 24/7 support via email and in-app chat. Our team is here to help you succeed—from event setup to post-event analytics.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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

export function OrganizerCTASection() {
  return (
    <section className="py-20 sm:py-28 bg-white font-aeonik">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-20 sm:space-y-28"
        >
          {/* Final CTA Section */}
          <div>
            <motion.div
              variants={itemVariants}
              className="text-center space-y-6 sm:space-y-8 mb-16 sm:mb-20"
            >
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <StarIcon className="w-5 h-5 text-lime" />
                </motion.div>
                <span className="text-sm sm:text-base font-medium text-[#012E3B] tracking-[-0.16px]">
                  Ready to Go Live?
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-[82.09px] font-medium text-dark tracking-[-1.4px] leading-[1.1] sm:leading-22.5 max-w-172.5 mx-auto">
                Start hosting events today.
              </h2>

              <p className="text-dark/70 text-sm sm:text-base leading-[25.2px] max-w-174.25 mx-auto">
                Join thousands of organizers making it happen. Your first event is
                just a few clicks away.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
            >
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto"
              >
                <Link href="/register">
                  <Button variant="primary" className="w-full sm:w-auto">
                    Create Your Event
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto"
              >
                <Link href="/explore">
                  <Button variant="white" className="w-full sm:w-auto">
                    Explore Events
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-[#E5E5E5] pt-20 sm:pt-28">
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-medium text-dark tracking-[-1.4px] text-center mb-12 sm:mb-16"
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="max-w-170 mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <motion.details
                  key={index}
                  variants={itemVariants}
                  custom={index}
                  className="group p-6 sm:p-8 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#012E3B] hover:border-[#012E3B] transition-all duration-300 cursor-pointer"
                >
                  <motion.summary className="flex items-start justify-between gap-4 font-medium text-[#012E3B] group-hover:text-white text-base sm:text-lg leading-[150%] list-none transition-colors duration-300">
                    <span className="text-left">{faq.question}</span>
                    <motion.span
                      className="text-lime text-xl shrink-0 group-open:rotate-180 transition-transform duration-300"
                      initial={false}
                    >
                      ▼
                    </motion.span>
                  </motion.summary>

                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-[#012E3B]/70 group-hover:text-white/80 text-sm sm:text-base leading-[150%] transition-colors duration-300"
                  >
                    {faq.answer}
                  </motion.p>
                </motion.details>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="border-t border-[#E5E5E5] pt-20 sm:pt-28 text-center">
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-medium text-dark">
                Questions?
              </h3>
              <p className="text-dark/70 text-sm sm:text-base leading-[150%]">
                Our support team is here to help. Reach out anytime.
              </p>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="mailto:support@guestly.com">
                  <Button variant="white">Contact Support</Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
