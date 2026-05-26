"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

interface StepFourVerifyProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
}

export function VerifyForm({ email, onVerify, onResend }: StepFourVerifyProps) {
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const loading = isVerifying;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      const fullCode = [...newCode.slice(0, 5), value.slice(-1)].join("");
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split("");
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (fullCode: string) => {
    setIsVerifying(true);
    await onVerify(fullCode);
    setIsVerifying(false);
  };

  const isComplete = code.every((c) => c !== "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-dm max-w-112.5 mx-auto"
    >
      <h1 className="text-2xl sm:text-4xl font-medium text-dark leading-[100%] mb-2">
        Verify your account
      </h1>
      <p className="text-[#4B5563] text-sm mb-8 leading-[100%]">
        Enter the code sent to your email/phone
      </p>

      {/* OTP Inputs */}
      <div className="flex gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex-1"
          >
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-full aspect-square text-center text-2xl font-medium rounded-lg border outline-none transition-all duration-200
                ${
                  digit
                    ? "border-dark text-dark"
                    : "border-[#E5E7EB] hover:border-gray-300 text-gray-400"
                }`}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={() => isComplete && handleVerify(code.join(""))}
          disabled={!isComplete || isVerifying}
          variant="teal"
          loading={loading}
          fullWidth
        >
          Verify
        </Button>
      </motion.div>

      <p className="mt-4 text-sm font-medium text-[#9CA3AF]">
        Didn&apos;t get the code?{" "}
        <button onClick={onResend} className="text-[#1B4332] hover:underline bg-transparent border-none cursor-pointer font-inherit text-sm">
          Resend
        </button>
      </p>
    </motion.div>
  );
}
