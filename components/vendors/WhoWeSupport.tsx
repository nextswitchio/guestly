"use client";
import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationControls,
} from "framer-motion";
import Heading from "@/components/Heading";
import { getImageSrc } from "@/utils/imageUtils";
import { services } from "@/utils/constant";

function ServiceCard({ service }: { service: (typeof services)[0] }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);
  const imageScale = useTransform(mouseYSpring, [-0.5, 0.5], [1.06, 1.02]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative shrink-0 w-40 md:w-100 cursor-pointer"
    >
      <div className="relative h-46 md:h-115 rounded-xl overflow-hidden bg-[#0B1D2E]">
        {/* Image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{
            scale: imageScale,
            translateZ: "30px",
          }}
        >
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-500" />

        {/* Lime tint on hover */}
        <div className="absolute inset-0 bg-lime/0 group-hover:bg-lime/5 transition-colors duration-500" />
      </div>
      {/* Bottom name */}
      <motion.div className="" style={{ translateZ: "50px" }}>
        <h3 className="text-xl sm:text-[24px] font-medium text-dark group-hover:text-lime transition-colors duration-300 leading-[100%] mt-4 tracking-[-1px]">
          {service.name}
        </h3>
      </motion.div>
    </motion.div>
  );
}

export function WhoWeSupport() {
  const controls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [width, setWidth] = useState(0);

  // Calculate scroll width
  useEffect(() => {
    if (containerRef.current) {
      setWidth(
        containerRef.current.scrollWidth - containerRef.current.offsetWidth,
      );
    }
  }, []);

  // Auto-slide animation
  useEffect(() => {
    if (isDragging || width === 0) return;

    const slide = async () => {
      await controls.start({
        x: -width,
        transition: {
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        },
      });
    };

    slide();
  }, [controls, width, isDragging]);

  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden font-aeonik">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12"
        >
          <Heading title="Who we Support" />
        </motion.div>
      </div>

      {/* Slider container */}
      <div className="relative">
        {/* Draggable / auto-sliding track */}
        <motion.div
          ref={containerRef}
          drag="x"
          dragConstraints={{ left: -width, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          animate={controls}
          className="flex gap-6 px-4 sm:px-6 lg:px-8 cursor-grab active:cursor-grabbing"
        >
          {/* Duplicate items for seamless loop */}
          {[...services, ...services].map((service, index) => (
            <motion.div
              key={`${service.name}-${index}`}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: (index % services.length) * 0.1,
              }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
