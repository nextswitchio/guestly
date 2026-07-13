"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { UserRole } from "@/components/auth/UserRole";
import { SignupForm } from "@/components/auth/SignupForm";
import { InterestPick } from "@/components/auth/InterestPick";
import { LocationForm } from "@/components/auth/LocationForm";
import { useToast } from "@/components/ui/ToastProvider";

export default function SignupPage() {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("attendee");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleNext = (selectedRole: string) => {
    setRole(selectedRole === "organize" ? "organiser" : "attendee");
    setStep(2);
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    setEmail(data.email);
    setPassword(data.password);
    setFullName(data.fullName);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password, fullName: data.fullName, role: role === "organiser" ? "organiser" : "attendee" }),
      });
      const result = await res.json();
      if (!res.ok) {
        addToast(result.error || 'Signup failed. Please try again.', { type: 'error' });
        setLoading(false);
        return;
      }
      addToast('Account created! Check your email to verify.', { type: 'success' });
      setStep(3);
      setLoading(false);
    } catch {
      addToast('Network error. Please try again.', { type: 'error' });
      setLoading(false);
    }
  };

  const handleLocation = async (locationData: any) => {
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: locationData.location }),
      });
    } catch {
      // Non-blocking - location is optional
    }
    setStep(5);
  };

  const completeSignup = async () => {
    setLoading(true);
    try {
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok || !loginData.ok) {
        addToast(loginData.error || 'Login failed', { type: 'error' });
        setLoading(false);
        return;
      }
      const actualRole = loginData.role || role;
      if (actualRole === "organiser" || actualRole === "organizer") {
        router.replace("/organizer/dashboard");
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
      addToast('Something went wrong. Please try again.', { type: 'error' });
      setLoading(false);
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
          <SignupForm onSubmit={handleFormSubmit} loading={loading} />
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="font-aeonik max-w-112.5 mx-auto text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <Mail className="w-8 h-8 text-[#012E3B]" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-medium text-dark leading-[100%] mb-3">
            Check your email
          </h1>
          <p className="text-[#4B5563] text-sm mb-2 max-w-sm mx-auto">
            We sent a verification link to <strong className="text-dark">{email}</strong>
          </p>
          <p className="text-[#9CA3AF] text-xs mb-8">
            Click the link in the email to verify your account. You can continue setting up your profile while you wait.
          </p>
          <button
            onClick={() => setStep(4)}
            className="w-full px-7 py-3.5 bg-[#012E3B] text-white rounded-lg font-medium hover:bg-[#012E3B]/90 transition-colors"
          >
            Continue
          </button>
          <p className="mt-4 text-sm font-medium text-[#9CA3AF]">
            Didn&apos;t get the email?{" "}
            <button
              onClick={() => {
                fetch("/api/auth/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, password, fullName, role: role === "organiser" ? "organiser" : "attendee" }),
                }).then(() => addToast('Verification email resent!', { type: 'success' }))
                  .catch(() => addToast('Failed to resend. Please try again.', { type: 'error' }));
              }}
              className="text-[#1B4332] hover:underline bg-transparent border-none cursor-pointer font-inherit text-sm"
            >
              Resend
            </button>
          </p>
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
          <LocationForm onSubmit={handleLocation} loading={loading} />
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
          <InterestPick onNext={handleInterests} onSkip={handleSkip} loading={loading} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
