"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import Button from "@/components/Button";
import { CheckIcon, InfoIcon, LockIcon, MailIcon, User1Icon } from "@/utils/icons";
import { useToast } from "@/components/ui/ToastProvider";
import { Eye, EyeOff } from "lucide-react";
import { getImageSrc } from "@/utils/imageUtils";
import CloudinaryUploadField from "@/components/ui/CloudinaryUploadField";
import { DEFAULT_PLATFORM_CATALOG, PlatformCategory, normalizeCatalog } from "@/lib/platformCatalog";

export default function VendorOnboarding() {
  const router = useRouter();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [vendorCategories, setVendorCategories] = useState<PlatformCategory[]>(DEFAULT_PLATFORM_CATALOG.vendorCategories);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    category: "",
    description: "",
    phone: "",
    portfolio: [""],
    rateCard: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/platform/catalog")
      .then(res => res.json())
      .then(data => setVendorCategories(normalizeCatalog(data).vendorCategories))
      .catch(() => setVendorCategories(DEFAULT_PLATFORM_CATALOG.vendorCategories));
  }, []);

  const inputClasses = (field: string) =>
    `w-full p-3 rounded-lg border text-sm transition-all duration-200
     ${errors[field] ? "border-red-400 bg-red-50" : "border-[#E5E7EB] hover:border-gray-300 focus:border-dark"}
     outline-none text-sm placeholder:text-[#9CA3AF] font-medium`;

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    if (!formData.email.includes("@")) e.email = "Valid email is required";
    if (formData.password.length < 8) e.password = "At least 8 characters required";
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: Record<string, string> = {};
    if (!formData.businessName.trim()) e.businessName = "Business name is required";
    if (!formData.description.trim()) e.description = "Description is required";
    if (!formData.category) e.category = "Please select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3() {
    const e: Record<string, string> = {};
    const validPortfolio = formData.portfolio.filter(url => url.trim() !== "");
    if (validPortfolio.length === 0) e.portfolio = "Add at least one portfolio link";
    if (!formData.rateCard.trim()) e.rateCard = "Rate card file is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    setLoading(true);
    setErrors({});
    try {
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: "vendor",
        }),
      });
      if (!regRes.ok) {
        const err = await regRes.json();
        setErrors({ form: err.error || "Registration failed" });
        setLoading(false);
        return;
      }
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password, role: "vendor" }),
      });
      const profRes = await fetch("/api/vendor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.businessName,
          businessName: formData.businessName,
          description: formData.description,
          category: formData.category,
          contactEmail: formData.email,
          contactPhone: formData.phone,
          rateCard: formData.rateCard,
          portfolio: formData.portfolio.filter(url => url.trim() !== ""),
        }),
      });
      if (profRes.ok) {
        addToast('Vendor account created successfully!', { type: 'success' });
        router.push("/vendor/dashboard");
      } else {
        const err = await profRes.json();
        const msg = err.error || "Failed to create profile";
        setErrors({ form: msg });
        addToast(msg, { type: 'error' });
      }
    } catch {
      const msg = "Something went wrong. Please try again.";
      setErrors({ form: msg });
      addToast(msg, { type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const addPortfolioLink = () => setFormData(prev => ({ ...prev, portfolio: [...prev.portfolio, ""] }));
  const updatePortfolioLink = (index: number, value: string) => {
    const newPortfolio = [...formData.portfolio];
    newPortfolio[index] = value;
    setFormData(prev => ({ ...prev, portfolio: newPortfolio }));
  };
  const removePortfolioLink = (index: number) => {
    setFormData(prev => ({ ...prev, portfolio: prev.portfolio.filter((_, i) => i !== index) }));
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-dm max-w-112.5 mx-auto"
      >
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-dark text-white' : 'bg-gray-100 text-gray-400'}`}>
                {s}
              </div>
              <div className={`h-0.5 flex-1 transition-colors ${step > s ? 'bg-dark' : 'bg-gray-100'}`} />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl sm:text-4xl font-medium text-dark leading-[100%] mb-2">
                Create your vendor account
              </h1>
              <p className="text-[#4B5563] text-sm mb-8 leading-[100%]">
                Start receiving event invitations and growing your business.
              </p>

              <div className="flex gap-3 mb-6">
                <motion.button whileHover={{ scale: 1.02 }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#EAEDF2] text-sm font-medium text-[#323741] cursor-pointer"
                >
                  <img src={getImageSrc("google.svg")} alt="" />
                  Google
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }}
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
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1.5">Full Name</label>
                  <div className="relative">
                    <User1Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input type="text" placeholder="Enter your full name..."
                      className={`${inputClasses("fullName")} pl-10`}
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1.5">Email</label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input type="email" placeholder="Enter your email..."
                      className={`${inputClasses("email")} pl-10`}
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1.5">Password</label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input type={showPassword ? "text" : "password"} placeholder="Create Password"
                      className={`${inputClasses("password")} pl-10 pr-16`}
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {formData.password.length >= 8 && <CheckIcon className="text-[#03B90F] w-4 h-4" />}
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm flex gap-2 text-[#9CA3AF]">
                    <InfoIcon className="w-5 h-5 text-[#9CA3AF]" />Use at least 8 characters with a mix of uppercase and lowercase letters, numbers, and symbols.
                  </p>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input type={showConfirm ? "text" : "password"} placeholder="Confirm your password..."
                      className={`${inputClasses("confirmPassword")} pl-10 pr-16`}
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {formData.confirmPassword !== "" && formData.confirmPassword === formData.password && <CheckIcon className="text-[#03B90F] w-4 h-4" />}
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </motion.div>
              </div>

              <div className="flex gap-4 mt-8">
                <div className="w-full">
                  <Button variant="teal-outline" onClick={() => router.push("/vendor-auth/login")}>Back</Button>
                </div>
                <motion.div className="w-full" whileHover={{ y: -2 }}>
                  <Button variant="teal" onClick={() => { if (validateStep1()) setStep(2); }}>Continue</Button>
                </motion.div>
              </div>

              <p className="mt-4 text-sm font-medium text-[#9CA3AF]">
                Already have an account?{" "}
                <a href="/vendor-auth/login" className="text-[#1B4332] hover:underline">Log in</a>
              </p>
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
              <h1 className="text-2xl sm:text-4xl font-medium text-dark leading-[100%] mb-2">
                Tell us about your business
              </h1>
              <p className="text-[#4B5563] text-sm mb-8 leading-[100%]">
                Set up your vendor profile so organisers can find you.
              </p>

              <div className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1.5">Business Name</label>
                  <input type="text" placeholder="e.g. SafeGuard Security"
                    className={inputClasses("businessName")}
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })} />
                  {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1.5">Service Category</label>
                  <select className={inputClasses("category")}
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Select a category</option>
                    {vendorCategories.filter(cat => cat.isActive).map(cat => (
                      <option key={cat.slug} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1.5">Description</label>
                  <textarea placeholder="Describe your services, experience, and what makes you unique..."
                    className={`${inputClasses("description")} min-h-[100px]`}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })} />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </motion.div>
              </div>

              <div className="flex gap-4 mt-8">
                <div className="w-full">
                  <Button variant="teal-outline" onClick={() => setStep(1)}>Back</Button>
                </div>
                <motion.div className="w-full" whileHover={{ y: -2 }}>
                  <Button variant="teal" onClick={() => { if (validateStep2()) setStep(3); }}>Continue</Button>
                </motion.div>
              </div>
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
              <h1 className="text-2xl sm:text-4xl font-medium text-dark leading-[100%] mb-2">
                Contact & Portfolio
              </h1>
              <p className="text-[#4B5563] text-sm mb-8 leading-[100%]">
                Help organisers reach you and see your work.
              </p>

              <div className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1.5">Phone Number</label>
                  <input type="tel" placeholder="+234 800 000 0000"
                    className={inputClasses("phone")}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <CloudinaryUploadField
                    label="Rate Card / Pricing File"
                    value={formData.rateCard}
                    onChange={(rateCard) => setFormData({ ...formData, rateCard })}
                    folder="guestly/vendors/rate-cards"
                    accept=".pdf,image/*"
                    preview="file"
                    placeholder="Upload PDF or image"
                  />
                  <p className="text-xs text-[#9CA3AF] mt-1">Upload a PDF or image detailing your pricing packages.</p>
                  {errors.rateCard && <p className="text-xs text-red-500 mt-1">{errors.rateCard}</p>}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1.5">Portfolio Links (Images/Videos)</label>
                  <div className="space-y-2">
                    {formData.portfolio.map((url, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input type="url" placeholder="https://instagram.com/..."
                          className={`${inputClasses("portfolio")} flex-1`}
                          value={url}
                          onChange={e => updatePortfolioLink(idx, e.target.value)} />
                        {formData.portfolio.length > 1 && (
                          <button type="button" onClick={() => removePortfolioLink(idx)}
                            className="p-2 text-[#9CA3AF] hover:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addPortfolioLink}
                      className="flex items-center gap-1 text-sm font-medium text-[#012E3B] hover:text-[#012E3B]/80 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add another link
                    </button>
                  </div>
                  {errors.portfolio && <p className="text-xs text-red-500 mt-1">{errors.portfolio}</p>}
                </motion.div>
              </div>

              {errors.form && (
                <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {errors.form}
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <div className="w-full">
                  <Button variant="teal-outline" onClick={() => setStep(2)}>Back</Button>
                </div>
                <motion.div className="w-full" whileHover={{ y: -2 }}>
                  <Button variant="teal" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Creating Account..." : "Create Vendor Account"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AuthLayout>
  );
}
