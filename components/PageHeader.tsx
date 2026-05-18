"use client";
import { motion, type Variants } from "framer-motion";
import Button from "@/components/ui/Button";
import { StatsTicker } from "@/components/home/StatsTicker";
import { StarIcon } from "@/utils/icons";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export interface HeaderAction {
  label: string;
  variant?: "primary" | "white" | "outline";
  onClick?: () => void;
  href?: string;
}

export interface PageHeaderProps {
  backgroundImage: string;
  title: string;
  description: string;
  actions?: HeaderAction[];
  showStatsTicker?: boolean;
  width?: string;
  fontSize?: string;
  star?: string;
  flip?: string;
  pWidth?: string;
}

export function PageHeader({
  backgroundImage,
  title,
  description,
  actions = [],
  showStatsTicker = false,
  width = "lg:w-[65%]",
  fontSize = "text-base sm:text-lg",
  star,
  flip,
  pWidth,
}: PageHeaderProps) {
  return (
    <header className="min-h-screen text-white font-dm selection:bg-[#D4FF00] selection:text-dark">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 bg-cover bg-bottom bg-no-repeat ${flip}`}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-[#001C24E5]" />
        <div className="absolute inset-0 bg-linear-to-b from-[#031419]/0 to-[#03151A]" />
      </div>

      {/* Content */}
      <div className="relative max-w-360 mx-auto flex items-start overflow-hidden font-dm px-4 mb-0 sm:px-6 lg:px-8">
        {/* Content */}
        <div className={`relative z-10 w-full ${width} pt-28 sm:pt-32 pb-12 sm:pb-10`}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
            {star && (
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 text-white text-sm sm:text-base leading-5 tracking-[-0.16px] py-5"
              >
                <StarIcon className="text-lime" />
                <p>{star}</p>
              </motion.div>
            )}
            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-[82.09px] text-white lg:leading-22.5 tracking-[-1.4px] font-medium"
            >
              {title}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className={`mt-6 ${fontSize} text-[#EEEEEE] leading-[150%] sm:tracking-[0.18px] ${pWidth}`}
            >
              {description}
            </motion.p>

            {actions.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-wrap gap-4"
              >
                {actions.map((action, index) => (
                  <motion.div
                    key={index}
                    className="w-full sm:w-51.25"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      variant={action.variant || "primary"}
                      onClick={action.onClick}
                      href={action.href}
                    >
                      {action.label}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {showStatsTicker && <StatsTicker />}
    </header>
  );
}
