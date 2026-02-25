"use client";
import React from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

const CATEGORIES = [
  { value: "Security", label: "🛡️ Security" },
  { value: "Sound", label: "🔊 Sound & Audio" },
  { value: "Catering", label: "🍽️ Catering" },
  { value: "Decoration", label: "🎨 Decoration" },
  { value: "Logistics", label: "🚚 Logistics" },
  { value: "Photography", label: "📸 Photography & Video" },
];

export default function VendorOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    category: "",
    portfolio: [""],
    rateCard: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Business name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Please select a service category";
    if (!formData.contactEmail.trim()) newErrors.contactEmail = "Contact email is required";
    if (!formData.rateCard.trim()) newErrors.rateCard = "Rate card URL is required";

    // Validate portfolio URLs
    const validPortfolio = formData.portfolio.filter(url => url.trim() !== "");
    if (validPortfolio.length === 0) newErrors.portfolio = "Add at least one portfolio link";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          portfolio: formData.portfolio.filter(url => url.trim() !== ""),
        }),
      });

      if (res.ok) {
        // Redirect to dashboard or success page
        router.push("/dashboard?role=vendor"); // Simulating vendor redirect
      } else {
        const data = await res.json();
        setErrors({ form: data.error || "Something went wrong" });
      }
    } catch (err) {
      setErrors({ form: "Failed to submit. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const addPortfolioLink = () => {
    setFormData(prev => ({ ...prev, portfolio: [...prev.portfolio, ""] }));
  };

  const updatePortfolioLink = (index: number, value: string) => {
    const newPortfolio = [...formData.portfolio];
    newPortfolio[index] = value;
    setFormData(prev => ({ ...prev, portfolio: newPortfolio }));
  };

  const removePortfolioLink = (index: number) => {
    const newPortfolio = formData.portfolio.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, portfolio: newPortfolio }));
  };

  return (
    <ProtectedRoute allowRoles={["vendor"]}>
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">Become a Vendor</h1>
          <p className="mt-2 text-neutral-600">
            Join Guestly to showcase your services to event organisers across Africa.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Business Info */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-100 pb-2">
                Business Information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Business Name"
                    placeholder="e.g. SafeGuard Security"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Select
                    label="Service Category"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    error={errors.category}
                    options={[
                      { value: "", label: "Select a category" },
                      ...CATEGORIES
                    ]}
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-neutral-700">Description</label>
                    <textarea
                      className={`min-h-[100px] w-full rounded-md border bg-white px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.description ? "border-red-500 focus:ring-red-500" : "border-neutral-300"
                        }`}
                      placeholder="Describe your services, experience, and what makes you unique..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-100 pb-2">
                Contact Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.contactEmail}
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                  error={errors.contactEmail}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                  error={errors.contactPhone}
                />
              </div>
            </div>

            {/* Portfolio & Rates */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-100 pb-2">
                Portfolio & Rates
              </h2>

              <Input
                label="Rate Card / Pricing URL"
                placeholder="https://drive.google.com/..."
                value={formData.rateCard}
                onChange={e => setFormData({ ...formData, rateCard: e.target.value })}
                error={errors.rateCard}
              />
              <p className="text-xs text-neutral-500 -mt-3">Link to a PDF or document detailing your pricing packages.</p>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-neutral-700">Portfolio Links (Images/Videos)</label>
                {formData.portfolio.map((url, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      className="flex-1"
                      placeholder="https://instagram.com/..."
                      value={url}
                      onChange={e => updatePortfolioLink(idx, e.target.value)}
                    />
                    {formData.portfolio.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePortfolioLink(idx)}
                        className="p-2 text-neutral-400 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPortfolioLink}
                  className="mt-1 flex w-fit items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  Add another link
                </button>
                {errors.portfolio && <p className="text-xs text-red-500">{errors.portfolio}</p>}
              </div>
            </div>

            {errors.form && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {errors.form}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" href="/">Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating Profile..." : "Create Vendor Profile"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
}
