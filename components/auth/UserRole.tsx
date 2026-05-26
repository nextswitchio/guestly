"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { TicketIcon } from "@/utils/icons";

const roles = [
  {
    id: "attend",
    icon: TicketIcon,
    title: "Attend Events",
    description: "Discover and enjoy events around you.",
  },
  {
    id: "organize",
    icon: TicketIcon,
    title: "Organise Events",
    description: "Create, manage, and grow your events.",
  },
];

export function UserRole({ onNext }: { onNext: (role: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=""
    >
      <h1 className="text-2xl sm:text-4xl font-medium text-dark leading-[100%] mb-2">
        How will you use Guestly?
      </h1>
      <p className="text-[#4B5563] text-sm mb-8 leading-[100%]">
        Choose what fits you best.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {roles.map((role, index) => (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(role.id)}
            className={`flex flex-col items-center py-10 px-4 rounded-xl border text-center transition-all duration-300 cursor-pointer
              ${
                selected === role.id
                  ? "border-dark bg-white shadow-md"
                  : "border-[#E5E7EB] hover:border-gray-300 bg-white"
              }`}
          >
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-4
                ${selected === role.id ? "bg-[#e7e7e7]" : "bg-[#e7e7e7]"}`}
            >
              <role.icon className="text-dark" />
            </div>

            {/* Title */}
            <h3 className=" text-dark text-base font-medium mb-1">
              {role.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-dark max-w-[184.5px] leading-[120%] mb-4">
              {role.description}
            </p>

            {/* Radio Circle */}
            <div
              className={`w-4 h-4 rounded-full border- flex items-center justify-center transition-all duration-300 border
                ${selected === role.id ? "border-dark" : "border-[#CDCDCD]"}`}
            >
              {selected === role.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2.5 h-2.5 rounded-full bg-dark"
                />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="w-full">
          <Button variant="teal-outline" fullWidth>Back</Button>
        </div>
        <div className="w-full">
          <Button
            variant="teal"
            disabled={!selected}
            onClick={() => selected && onNext(selected)}
            fullWidth
          >
            Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
