"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { CheckIcon, LockIcon, MailIcon } from "@/utils/icons";

export function SigninForm({ onSubmit, signupHref = "/signup", loading = false }: { onSubmit: (data: any) => void; signupHref?: string; loading?: boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.email.includes("@")) newErrors.email = true;
    if (form.password.length < 8) newErrors.password = true;
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
      <h1 className="text-2xl sm:text-4xl font-medium text-dark leading-[100%] mb-2 w-full">
        Welcome Back!
      </h1>
      <p className="text-[#4B5563] text-sm mb-8 leading-[100%]">
        Please sign in to your guestly account
      </p>

      <div className="space-y-4">
        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="w-full block text-sm font-medium text-[#4B5563] mb-1.5">
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

      <p className="mt-4 text-sm font-medium text-[#9CA3AF]">
        Don&apos;t have an account?
        <a href={signupHref} className="text-[#1B4332] hover:underline">
          {" "}
          Create account
        </a>
      </p>
    </motion.div>
  );
}
