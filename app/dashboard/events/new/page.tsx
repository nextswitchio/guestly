"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Draft = {
  type?: "Physical" | "Virtual" | "Hybrid";
  title?: string;
  description?: string;
  date?: string;
  category?: "Music" | "Tech" | "Art" | "Food";
  city?: "Lagos" | "Abuja" | "Accra" | "Nairobi";
  image?: string;
  ticketSetup?: { generalPrice?: number; vipPrice?: number; generalQty?: number; vipQty?: number };
  virtual?: { url?: string };
  merch?: { enabled?: boolean };
};

const STEPS = [
  { label: "Type", icon: "📋" },
  { label: "Details", icon: "✏️" },
  { label: "Schedule", icon: "📅" },
  { label: "Tickets", icon: "🎟️" },
  { label: "Virtual", icon: "🖥️" },
  { label: "Merch", icon: "🛍️" },
  { label: "Publish", icon: "🚀" },
];

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [draft, setDraft] = React.useState<Draft>({});
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    async function load() {
      const res = await fetch("/api/drafts/event");
      const data = await res.json();
      if (res.ok) setDraft(data.draft as Draft);
    }
    load();
  }, []);

  function validateStep(currentStep: number): boolean {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 0) {
      if (!draft.type) {
        newErrors.type = "Please select an event type";
        isValid = false;
      }
    } else if (currentStep === 1) {
      if (!draft.title?.trim()) {
        newErrors.title = "Event title is required";
        isValid = false;
      }
      if (!draft.category) {
        newErrors.category = "Please select a category";
        isValid = false;
      }
      if (!draft.city) {
        newErrors.city = "Please select a city";
        isValid = false;
      }
      if (!draft.image?.trim()) {
        newErrors.image = "Cover image URL is required";
        isValid = false;
      }
      if (!draft.description?.trim()) {
        newErrors.description = "Description is required";
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (!draft.date) {
        newErrors.date = "Event date is required";
        isValid = false;
      }
    } else if (currentStep === 3) {
      const hasGeneral = (draft.ticketSetup?.generalPrice ?? -1) >= 0 && (draft.ticketSetup?.generalQty ?? 0) > 0;
      const hasVip = (draft.ticketSetup?.vipPrice ?? -1) >= 0 && (draft.ticketSetup?.vipQty ?? 0) > 0;

      if (!hasGeneral && !hasVip) {
        newErrors.ticketSetup = "Please set up at least one ticket type (price & quantity)";
        isValid = false;
      }
    } else if (currentStep === 4) {
      if ((draft.type === "Virtual" || draft.type === "Hybrid") && !draft.virtual?.url?.trim()) {
        newErrors.virtualUrl = "Virtual event URL is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }

  async function save(patch: Partial<Draft>) {
    setSaving(true);
    // Clear errors for fields being updated
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key]);
      if (patch.ticketSetup) delete next.ticketSetup;
      if (patch.virtual) delete next.virtualUrl;
      return next;
    });

    const res = await fetch("/api/drafts/event", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) setDraft(data.draft as Draft);
  }

  async function publish() {
    if (!validateStep(step)) return;
    const res = await fetch("/api/drafts/event/publish", { method: "POST" });
    if (res.ok) router.replace("/dashboard/events");
  }

  const next = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/events"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition hover:bg-neutral-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Create Event</h1>
            <p className="text-sm text-neutral-500">Step {step + 1} of {STEPS.length}</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.label}>
                <button
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${i === step
                    ? "bg-primary-600 text-white shadow-sm"
                    : i < step
                      ? "bg-success-50 text-success-700"
                      : "bg-neutral-100 text-neutral-500"
                    }`}
                >
                  {i < step ? (
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{s.icon}</span>
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-4 shrink-0 ${i < step ? "bg-success-400" : "bg-neutral-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl">
          {/* Step 0: Event Type */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Event Type</h2>
                <p className="mt-1 text-sm text-neutral-500">Choose how your event will be delivered</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {(["Physical", "Virtual", "Hybrid"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => save({ type: t })}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition ${draft.type === t
                      ? "border-primary-600 bg-primary-50"
                      : "border-neutral-200 hover:border-neutral-300"
                      }`}
                  >
                    <span className="text-2xl">
                      {t === "Physical" ? "🏟️" : t === "Virtual" ? "🖥️" : "🔀"}
                    </span>
                    <span className="text-sm font-medium text-neutral-900">{t}</span>
                    <span className="text-xs text-neutral-500">
                      {t === "Physical" ? "In-person venue" : t === "Virtual" ? "Online stream" : "Both options"}
                    </span>
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            </div>
          )}

          {/* Step 1: Event Details */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Event Details</h2>
                <p className="mt-1 text-sm text-neutral-500">Tell attendees about your event</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input label="Event Title" value={draft.title || ""} onChange={(e) => save({ title: e.currentTarget.value })} error={errors.title} />
                </div>
                <Select
                  label="Category"
                  value={draft.category || ""}
                  onChange={(e) => save({ category: e.currentTarget.value as Draft["category"] })}
                  error={errors.category}
                  options={[
                    { value: "", label: "Select category" },
                    { value: "Music", label: "🎵 Music" },
                    { value: "Tech", label: "💻 Tech" },
                    { value: "Art", label: "🎨 Art" },
                    { value: "Food", label: "🍔 Food" },
                  ]}
                />
                <Select
                  label="City"
                  value={draft.city || ""}
                  onChange={(e) => save({ city: e.currentTarget.value as Draft["city"] })}
                  error={errors.city}
                  options={[
                    { value: "", label: "Select city" },
                    { value: "Lagos", label: "Lagos" },
                    { value: "Abuja", label: "Abuja" },
                    { value: "Accra", label: "Accra" },
                    { value: "Nairobi", label: "Nairobi" },
                  ]}
                />
                <div className="sm:col-span-2">
                  <Input label="Cover Image URL" value={draft.image || ""} onChange={(e) => save({ image: e.currentTarget.value })} error={errors.image} />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Description" value={draft.description || ""} onChange={(e) => save({ description: e.currentTarget.value })} error={errors.description} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Schedule</h2>
                <p className="mt-1 text-sm text-neutral-500">When will your event take place?</p>
              </div>
              <Input label="Event Date" value={draft.date || ""} onChange={(e) => save({ date: e.currentTarget.value })} error={errors.date} />
            </div>
          )}

          {/* Step 3: Ticket Setup */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Ticket Setup</h2>
                <p className="mt-1 text-sm text-neutral-500">Configure pricing and availability</p>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">🎫 General Admission</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Price ($)"
                    type="number"
                    value={draft.ticketSetup?.generalPrice?.toString() ?? ""}
                    onChange={(e) =>
                      save({ ticketSetup: { ...(draft.ticketSetup || {}), generalPrice: e.target.value === "" ? undefined : Number(e.target.value) } })
                    }
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    value={draft.ticketSetup?.generalQty?.toString() ?? ""}
                    onChange={(e) =>
                      save({ ticketSetup: { ...(draft.ticketSetup || {}), generalQty: e.target.value === "" ? undefined : Number(e.target.value) } })
                    }
                  />
                </div>
              </div>
              <div className="rounded-xl border border-warning-200 bg-warning-50/30 p-4">
                <h3 className="mb-3 text-sm font-semibold text-warning-700">⭐ VIP</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Price ($)"
                    type="number"
                    value={draft.ticketSetup?.vipPrice?.toString() ?? ""}
                    onChange={(e) =>
                      save({ ticketSetup: { ...(draft.ticketSetup || {}), vipPrice: e.target.value === "" ? undefined : Number(e.target.value) } })
                    }
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    value={draft.ticketSetup?.vipQty?.toString() ?? ""}
                    onChange={(e) =>
                      save({ ticketSetup: { ...(draft.ticketSetup || {}), vipQty: e.target.value === "" ? undefined : Number(e.target.value) } })
                    }
                  />
                </div>
              </div>
              {errors.ticketSetup && <p className="text-sm text-red-500">{errors.ticketSetup}</p>}
            </div>
          )}

          {/* Step 4: Virtual Setup */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Virtual Setup</h2>
                <p className="mt-1 text-sm text-neutral-500">Configure your live stream or video call</p>
              </div>
              <Input
                label="Stream / Meeting URL"
                value={draft.virtual?.url || ""}
                onChange={(e) => save({ virtual: { ...(draft.virtual || {}), url: e.currentTarget.value } })}
                error={errors.virtualUrl}
              />
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-xs text-blue-700">
                  💡 Paste a YouTube Live, Zoom, or any streaming URL. Attendees will see this in the virtual lobby.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Merchandise */}
          {step === 5 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Merchandise</h2>
                <p className="mt-1 text-sm text-neutral-500">Sell merch alongside your event</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: false, label: "Disabled", desc: "No merchandise", icon: "🚫" },
                  { value: true, label: "Enabled", desc: "Sell products", icon: "🛍️" },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => save({ merch: { ...(draft.merch || {}), enabled: opt.value } })}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${draft.merch?.enabled === opt.value
                      ? "border-primary-600 bg-primary-50"
                      : "border-neutral-200 hover:border-neutral-300"
                      }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{opt.label}</p>
                      <p className="text-xs text-neutral-500">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Review & Publish */}
          {step === 6 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Review & Publish</h2>
                <p className="mt-1 text-sm text-neutral-500">Confirm your event details before publishing</p>
              </div>
              <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200">
                {[
                  { label: "Type", value: draft.type || "—" },
                  { label: "Title", value: draft.title || "—" },
                  { label: "Category", value: draft.category || "—" },
                  { label: "City", value: draft.city || "—" },
                  { label: "Date", value: draft.date || "—" },
                  { label: "Stream URL", value: draft.virtual?.url || "—" },
                  { label: "Merchandise", value: draft.merch?.enabled ? "Enabled" : "Disabled" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-neutral-500">{item.label}</span>
                    <span className="text-sm font-medium text-neutral-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4">
            <button
              onClick={prev}
              disabled={step === 0}
              className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                disabled={saving}
                className="flex items-center gap-1 rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60"
              >
                {saving && (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                Next
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={publish}
                className="flex items-center gap-2 rounded-xl bg-success-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-success-700"
              >
                🚀 Publish Event
              </button>
            )}
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
