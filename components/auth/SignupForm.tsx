"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/Button";
import { getImageSrc } from "@/utils/imageUtils";
import {
  CheckIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  User1Icon,
} from "@/utils/icons";

export function SignupForm({ onSubmit, loginHref = "/login" }: { onSubmit: (data: any) => void; loginHref?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.fullName.trim()) newErrors.fullName = true;
    if (!form.email.includes("@")) newErrors.email = true;
    if (form.password.length < 8) newErrors.password = true;
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = true;
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
      className="font-dm max-w-112.5 mx-auto"
    >
      <h1 className="text-2xl sm:text-4xl font-medium text-dark leading-[100%] mb-2">
        Create your account
      </h1>
      <p className="text-[#4B5563] text-sm mb-8 leading-[100%]">
        Start experiencing events the easy way.
      </p>

      <div className="flex gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#EAEDF2] text-sm font-medium text-[#323741] cursor-pointer"
        >
          <img src={getImageSrc("google.svg")} alt="" />
          Google
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#EAEDF2] text-sm font-medium text-[#323741] cursor-pointer"
        >
          <img src={getImageSrc("apple.svg")} alt="" />
          Apple
        </motion.button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-[#EAEDF2]" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User1Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Enter your full name..."
              className={`${inputClasses("fullName")} pl-10`}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
            Email
          </label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="email"
              placeholder="Enter your email..."
              className={`${inputClasses("email")} pl-10`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {!errors.email && form.email.includes("@") && (
              <CheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-[#03B90F]" />
            )}
          </div>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
            Password
          </label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              className={`${inputClasses("password")} pl-10 pr-16`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {form.password.length >= 8 && (
                <CheckIcon className="text-[#03B90F] w-4 h-4" />
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm flex gap-2 text-[#9CA3AF]">
            <InfoIcon className="w-5 h-5 text-[#9CA3AF]" />
            Use at least 8 characters with a mix of uppercase and lowercase
            letters, numbers, and symbols.
          </p>
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password..."
              className={`${inputClasses("confirmPassword")} pl-10 pr-16`}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {form.confirmPassword !== "" &&
                form.confirmPassword === form.password && (
                  <CheckIcon className="text-[#03B90F] w-4 h-4" />
                )}
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <div className="w-full">
          <Button variant="teal-outline">Back</Button>
        </div>
        <motion.div className="w-full" whileHover={{ y: -2 }}>
          <Button variant="teal" onClick={handleSubmit}>
            Continue
          </Button>
        </motion.div>
      </div>

      <p className="mt-4 text-sm font-medium text-[#9CA3AF]">
        Already have an account?{" "}
        <a href={loginHref} className="text-[#1B4332] hover:underline">
          Log in
        </a>
      </p>
    </motion.div>
  );
}
