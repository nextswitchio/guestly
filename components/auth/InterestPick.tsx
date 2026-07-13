"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  Briefcase1Icon,
  Music1Icon,
  Tech1Icon,
  TechIcon,
  WineGlassIcon,
} from "@/utils/icons";

const interests = [
  { id: "music", label: "Music", icon: Music1Icon },
  { id: "tech", label: "Tech", icon: TechIcon },
  { id: "faith", label: "Faith", icon: Tech1Icon },
  { id: "business", label: "Business", icon: Briefcase1Icon },
  { id: "parties", label: "Parties", icon: WineGlassIcon },
  { id: "workshop", label: "Workshop", icon: Tech1Icon },
];

interface InterestsProps {
  onNext: (selected: string[]) => void;
  onSkip: () => void;
  loading?: boolean;
}

export function InterestPick({ onNext, onSkip, loading }: InterestsProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-aeonik max-w-112.5 mx-auto"
    >
      <h1 className="text-2xl sm:text-4xl font-medium text-dark leading-[100%] mb-2">
        What are you into?
      </h1>
      <p className="text-[#4B5563] text-sm mb-8 leading-[100%]">
        Pick a few to personalise your experience
      </p>

      {/* Interest Tags */}
      <div className="flex flex-wrap gap-3 mb-8">
        {interests.map((interest, index) => {
          const isSelected = selected.includes(interest.id);
          return (
            <motion.button
              key={interest.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleInterest(interest.id)}
              className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? "border-[#0B1D2E] bg-[#0B1D2E] text-white"
                    : "border-[#EAEDF2] bg-white text-[#1B4332] hover:border-gray-300"
                }`}
            >
              <interest.icon
                className={`${isSelected ? "text-white" : "text-dark"}`}
              />
              {interest.label}
            </motion.button>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-4">
        <div className="w-full">
          <Button variant="teal-outline" fullWidth>Back</Button>
        </div>

        <motion.div
          className="w-full"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => onNext(selected)}
            disabled={selected.length === 0 || loading}
            variant="teal"
            loading={loading}
            fullWidth
          >
            Continue
          </Button>
        </motion.div>
      </div>

      {/* Skip */}
      <motion.button
        whileHover={{ x: 2 }}
        onClick={onSkip}
        className="text-sm text-[#9CA3AF] hover:text-[#0B1D2E] transition-colors"
      >
        Skip for now
      </motion.button>
    </motion.div>
  );
}
