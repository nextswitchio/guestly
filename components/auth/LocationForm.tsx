"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LocationIcon } from "@/utils/icons";

export function LocationForm({ onSubmit, loading }: { onSubmit: (data: any) => void; loading?: boolean }) {
  const [form, setForm] = useState({
    location: "",
  });
  const [useLocation, setUseLocation] = useState(false);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.location.trim()) newErrors.location = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  const inputClasses = (field: string) =>
    `w-full p-3 rounded-lg border text-sm transition-all duration-200
     ${errors[field] ? "border-red-400 bg-red-50" : "border-[#E5E7EB] hover:border-gray-300 focus:border-dark "}
     outline-none text-sm placeholder:text-[#9CA3AF] font-medium`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-dm w-112.5 mx-auto"
    >
      <h1 className="text-2xl sm:text-4xl font-medium text-dark leading-[100%] mb-2">
        Where are you?
      </h1>
      <p className="text-[#4B5563] text-sm mb-8 leading-[100%]">
        We&apos;ll show you events happening around you
      </p>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
            City
          </label>
          <div className="relative">
            <LocationIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
            <input
              type="text"
              placeholder="Search city (e.g. Lagos, Ibadan)"
              className={`${inputClasses("location")} pl-10`}
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <motion.div className="w-full" whileHover={{ y: -2 }}>
          <Button variant="teal" onClick={handleSubmit} loading={loading} fullWidth>
            Continue
          </Button>
        </motion.div>
      </div>

      {/* Use Current Location */}
      <motion.label
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 cursor-pointer group mt-4"
      >
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
          ${useLocation ? "border-dark bg-dark" : "border-gray-300 group-hover:border-gray-400"}`}
        >
          {useLocation && <Check size={12} className="text-white" />}
        </div>
        <input
          type="checkbox"
          checked={useLocation}
          onChange={(e) => setUseLocation(e.target.checked)}
          className="hidden"
        />
        <span className="text-sm text-[#9CA3AF] font-medium transition-colors flex items-center gap-2">
          Use my current location
        </span>
      </motion.label>
    </motion.div>
  );
}
