"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/components/auth/UserRole";
import { SignupForm } from "@/components/auth/SignupForm";
import { VerifyForm } from "@/components/auth/VerifyForm";
import { InterestPick } from "@/components/auth/InterestPick";
import { LocationForm } from "@/components/auth/LocationForm";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("attendee");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleNext = (selectedRole: string) => {
    setRole(selectedRole === "organize" ? "organiser" : "attendee");
    setStep(2);
  };

  const handleFormSubmit = (data: any) => {
    setEmail(data.email);
    setStep(3);
  };

  const handleVerify = (code: string) => {
    console.log("Verify OTP:", code);
    setStep(4);
  };

  const handleLocation = () => {
    setStep(5);
  };

  const handleResend = async () => {
    try {
      await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  const completeSignup = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "password", role }),
      });
      const loginData = await loginRes.json();
      const actualRole = loginData.role || role;
      if (actualRole === "organiser" || actualRole === "organizer") {
        router.replace("/dashboard");
      } else if (actualRole === "vendor") {
        router.replace("/vendor/dashboard");
      } else if (actualRole === "affiliate") {
        router.replace("/affiliate/dashboard");
      } else if (actualRole === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/attendee");
      }
    } catch {
      router.replace("/attendee");
    }
  };

  const handleInterests = async (selected: string[]) => {
    await completeSignup();
  };

  const handleSkip = async () => {
    await completeSignup();
  };

  return (
    <AnimatePresence mode="wait">
      {step === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <UserRole onNext={handleRoleNext} />
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <SignupForm onSubmit={handleFormSubmit} />
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <VerifyForm
            email={email}
            onVerify={handleVerify}
            onResend={handleResend}
          />
        </motion.div>
      )}

      {step === 4 && (
        <motion.div
          key="step4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <LocationForm onSubmit={handleLocation} />
        </motion.div>
      )}

      {step === 5 && (
        <motion.div
          key="step5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <InterestPick onNext={handleInterests} onSkip={handleSkip} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
