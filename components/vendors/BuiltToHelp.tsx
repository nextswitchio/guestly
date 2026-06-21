"use client";
import Heading from "@/components/Heading";
import { motion } from "framer-motion";
import { whyfeatures } from "@/utils/constant";
import { Sections } from "@/components/Section";

const BuiltToHelp = () => {
  return (
    <section className="py-10 font-dm">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Heading
            title="Built to Help You Earn, Grow, and Be Trusted"
            desc="Get paid securely, connect with the right clients, and build a reputation that keeps your business growing"
          />
        </motion.div>

        <Sections features={whyfeatures} />
      </div>
    </section>
  );
};

export default BuiltToHelp;
