'use client';
import { Backpack, Building2, Camera, Clapperboard, Globe, Map, Package, Pencil, Shield, ShoppingBag, Tag, Ticket } from 'lucide-react';
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Icon from "@/components/ui/Icon";
import CloudinaryUploadField from "@/components/ui/CloudinaryUploadField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEFAULT_PLATFORM_CATALOG, PlatformCatalog, normalizeCatalog } from "@/lib/platformCatalog";

type Draft = {
  type?: "Physical" | "Virtual" | "Hybrid";
  title?: string;
  description?: string;
  date?: string;
  category?: string;
  country?: string;
  state?: string;
  city?: string;
  image?: string;
  venue?: string;
  latitude?: number;
  longitude?: number;
  community?: string;
  communityType?: "campus" | "neighborhood" | "professional" | "cultural";
  postEventCommunityAccess?: boolean;
  ticketSetup?: { 
    generalPrice?: number; 
    vipPrice?: number; 
    generalQty?: number; 
    vipQty?: number;
    generalPhysicalPrice?: number;
    generalPhysicalQty?: number;
    generalVirtualPrice?: number;
    generalVirtualQty?: number;
    vipPhysicalPrice?: number;
    vipPhysicalQty?: number;
    vipVirtualPrice?: number;
    vipVirtualQty?: number;
  };
  virtual?: { 
    provider?: "Zoom" | "Google Meet" | "YouTube Live" | "Vimeo" | "RTMP";
    url?: string;
    accessControl?: "ticket-holders" | "public";
    enableReplay?: boolean;
  };
  merch?: { 
    enabled?: boolean;
    postEventSales?: boolean;
    products?: Array<{
      name: string;
      description: string;
      price: number;
      category: "Apparel" | "Accessories" | "Prints" | "Collectibles";
      stock: number;
      sizes?: string[];
      image: string;
      fulfillmentType?: "pickup" | "delivery" | "digital";
      pickupInstructions?: string;
      digitalDownloadUrl?: string;
    }>;
  };
};

const STEPS = [
  { label: "Type", desc: "Event format" },
  { label: "Details", desc: "Basic info" },
  { label: "Schedule", desc: "Date & time" },
  { label: "Tickets", desc: "Pricing" },
  { label: "Virtual", desc: "Streaming" },
  { label: "Merch", desc: "Products" },
  { label: "Review", desc: "Publish" },
];

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [draft, setDraft] = React.useState<Draft>({});
  const [saving, setSaving] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [identityStatus, setIdentityStatus] = React.useState<string | null>(null);
  const [identityLoading, setIdentityLoading] = React.useState(true);
  const [catalog, setCatalog] = React.useState<PlatformCatalog>(DEFAULT_PLATFORM_CATALOG);

  React.useEffect(() => {
    fetch("/api/platform/catalog")
      .then((res) => res.json())
      .then((data) => {
        const nextCatalog = normalizeCatalog(data);
        setCatalog(nextCatalog);
        setDraft((prev) => prev.country ? prev : { ...prev, country: nextCatalog.countries[0]?.name });
      })
      .catch(() => setCatalog(DEFAULT_PLATFORM_CATALOG));
  }, []);

  React.useEffect(() => {
    async function load() {
      const res = await fetch("/api/drafts/event");
      const data = await res.json();
      if (res.ok) {
        setDraft((prev) => ({ ...(data.draft as Draft), country: (data.draft as Draft).country || prev.country || catalog.countries[0]?.name }));
        setLastSaved(new Date());
      }
    }
    load();
  }, []);

  React.useEffect(() => {
    fetch("/api/identity")
      .then((res) => res.json())
      .then((data) => setIdentityStatus(data.verification?.status || null))
      .catch(() => setIdentityStatus(null))
      .finally(() => setIdentityLoading(false));
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
      if (!draft.country) {
        newErrors.country = "Please select a country";
        isValid = false;
      }
      if (!draft.city?.trim()) {
        newErrors.city = "City is required";
        isValid = false;
      }
      if (!draft.image?.trim()) {
        newErrors.image = "Cover image is required";
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
      if (draft.type === "Hybrid") {
        const hasGeneralPhysical = (draft.ticketSetup?.generalPhysicalPrice ?? -1) >= 0 && (draft.ticketSetup?.generalPhysicalQty ?? 0) > 0;
        const hasGeneralVirtual = (draft.ticketSetup?.generalVirtualPrice ?? -1) >= 0 && (draft.ticketSetup?.generalVirtualQty ?? 0) > 0;
        const hasVipPhysical = (draft.ticketSetup?.vipPhysicalPrice ?? -1) >= 0 && (draft.ticketSetup?.vipPhysicalQty ?? 0) > 0;
        const hasVipVirtual = (draft.ticketSetup?.vipVirtualPrice ?? -1) >= 0 && (draft.ticketSetup?.vipVirtualQty ?? 0) > 0;
        const hasGeneral = hasGeneralPhysical || hasGeneralVirtual;
        const hasVip = hasVipPhysical || hasVipVirtual;
        if (!hasGeneral && !hasVip) {
          newErrors.ticketSetup = "Please set up at least one ticket type with pricing and quantity";
          isValid = false;
        }
      } else {
        const hasGeneral = (draft.ticketSetup?.generalPrice ?? -1) >= 0 && (draft.ticketSetup?.generalQty ?? 0) > 0;
        const hasVip = (draft.ticketSetup?.vipPrice ?? -1) >= 0 && (draft.ticketSetup?.vipQty ?? 0) > 0;
        if (!hasGeneral && !hasVip) {
          newErrors.ticketSetup = "Please set up at least one ticket type (price & quantity)";
          isValid = false;
        }
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
    if (res.ok) {
      setDraft(data.draft as Draft);
      setLastSaved(new Date());
    }
  }

  async function publish() {
    if (!validateStep(step)) return;
    if (identityStatus !== "verified") {
      setErrors({ _publish: "Verify your identity before publishing an event." });
      return;
    }
    const res = await fetch("/api/drafts/event/publish", { method: "POST" });
    if (res.ok) {
      router.replace("/dashboard/events");
    } else {
      const data = await res.json().catch(() => ({}));
      setErrors({ _publish: data.error || "Unable to publish event" });
    }
  }

  const next = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const completedSteps = [
    !!draft.type,
    !!draft.title && !!draft.category && !!draft.country && !!draft.city && !!draft.image && !!draft.description,
    !!draft.date,
    (draft.ticketSetup?.generalPrice !== undefined && draft.ticketSetup?.generalQty !== undefined) || 
    (draft.ticketSetup?.vipPrice !== undefined && draft.ticketSetup?.vipQty !== undefined),
    draft.type === "Physical" || !!draft.virtual?.url,
    true,
    true,
  ];
  const isIdentityVerified = identityStatus === "verified";
  const countryCities = catalog.cities.filter((city) => city.countryName === draft.country && city.isActive);
  const stateOptions = Array.from(new Set(countryCities.map((city) => city.state).filter(Boolean))) as string[];
  const cityOptions = countryCities.filter((city) => !draft.state || city.state === draft.state);

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/events"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Create Event</h1>
              <p className="mt-1 text-sm text-neutral-500">
                Step {step + 1} of {STEPS.length} • {STEPS[step].desc}
              </p>
            </div>
          </div>
          {lastSaved && (
            <div className="flex items-center gap-2 rounded-lg bg-lime/10 px-3 py-2 text-xs text-lime-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>

        {!identityLoading && !isIdentityVerified && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <Shield className="h-4 w-4 text-amber-700" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-900">Identity verification required</p>
              <p className="text-xs text-amber-700">You can prepare your draft, but publishing is locked until your identity is verified.</p>
            </div>
            <Link href="/dashboard/settings" className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100">
              Verify now
            </Link>
          </div>
        )}

        {errors._publish && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
            {errors._publish}
          </div>
        )}

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.label}>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setStep(i)}
                    disabled={i > step && !completedSteps[i - 1]}
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition ${
                      i === step
                        ? "bg-lime text-dark shadow-lg"
                        : completedSteps[i]
                        ? "bg-lime-600 text-white"
                        : i < step
                        ? "bg-lime/20 text-lime-700"
                        : "bg-neutral-100 text-neutral-400"
                    } ${i > step && !completedSteps[i - 1] ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"}`}
                  >
                    {completedSteps[i] && i !== step ? (
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </button>
                  <div className="text-center">
                    <p className={`text-xs font-medium ${i === step ? "text-lime-600" : completedSteps[i] ? "text-lime-600" : "text-neutral-500"}`}>
                      {s.label}
                    </p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 transition-all ${completedSteps[i] ? "bg-lime-400" : "bg-neutral-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          {saving && (
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-lime/10 px-3 py-1.5 text-xs font-medium text-lime-700">
              <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Saving...
            </div>
          )}

          {/* Step 0: Event Type */}
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-neutral-900">Choose Your Event Type</h2>
                <p className="mt-2 text-neutral-500">Select how attendees will experience your event</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { 
                    type: "Physical" as const, 
                    label: "Physical", 
                    desc: "In-person venue",
                    icon: (
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                    )
                  },
                  { 
                    type: "Virtual" as const, 
                    label: "Virtual", 
                    desc: "Online streaming",
                    icon: (
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                      </svg>
                    )
                  },
                  { 
                    type: "Hybrid" as const, 
                    label: "Hybrid", 
                    desc: "Both options",
                    icon: (
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                      </svg>
                    )
                  }
                ].map((t) => (
                  <button
                    key={t.type}
                    onClick={() => save({ type: t.type })}
                    className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${
                      draft.type === t.type
                        ? "border-lime bg-lime/5 shadow-lg"
                        : "border-neutral-200 hover:border-lime-300 hover:shadow-md"
                    }`}
                  >
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${
                      draft.type === t.type ? "bg-lime text-dark" : "bg-neutral-100 text-neutral-600"
                    }`}>
                      {t.icon}
                    </div>
                    <div className="text-center">
                      <p className="text-base font-semibold text-neutral-900">{t.label}</p>
                      <p className="mt-1 text-xs text-neutral-500">{t.desc}</p>
                    </div>
                    {draft.type === t.type && (
                      <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-lime text-dark">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {errors.type && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.type}
                </div>
              )}
            </div>
          )}

          {/* Step 1: Event Details */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Event Details</h2>
                <p className="mt-1 text-neutral-500">Tell attendees what makes your event special</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input 
                    label="Event Title" 
                    value={draft.title || ""} 
                    onChange={(e) => save({ title: e.currentTarget.value })} 
                    error={errors.title}
                    placeholder="e.g., Afrobeats Summer Festival 2026"
                  />
                </div>
                
                <Select
                  label="Category"
                  value={draft.category || ""}
                  onChange={(e) => save({ category: e.currentTarget.value })}
                  error={errors.category}
                  options={[
                    { value: "", label: "Select category" },
                    ...catalog.eventCategories.filter((category) => category.isActive).map((category) => ({ value: category.name, label: category.name })),
                  ]}
                />

                <Select
                  label="Country"
                  value={draft.country || ""}
                  onChange={(e) => {
                    const newCountry = e.currentTarget.value;
                    save({ country: newCountry, state: undefined, city: undefined });
                  }}
                  error={errors.country}
                  options={[
                    { value: "", label: "Select country" },
                    ...catalog.countries.filter((country) => country.isActive).map((country) => ({ value: country.name, label: country.name })),
                  ]}
                />

                {draft.country && stateOptions.length > 0 && (
                  <Select
                    label="State / Region"
                    value={draft.state || ""}
                    onChange={(e) => {
                      save({ state: e.currentTarget.value, city: undefined });
                    }}
                    options={[
                      { value: "", label: "Select state" },
                      ...stateOptions.map(state => ({ value: state, label: state }))
                    ]}
                  />
                )}

                {draft.country && (stateOptions.length === 0 || draft.state) && (
                  <>
                    {cityOptions.length > 0 ? (
                      <Select
                        label="City"
                        value={draft.city || ""}
                        onChange={(e) => save({ city: e.currentTarget.value })}
                        error={errors.city}
                        options={[
                          { value: "", label: "Select city" },
                          ...cityOptions.map(city => ({ value: city.name, label: city.name }))
                        ]}
                      />
                    ) : (
                      <Input 
                        label="City" 
                        value={draft.city || ""} 
                        onChange={(e) => save({ city: e.currentTarget.value })} 
                        error={errors.city}
                        placeholder="Enter city name"
                      />
                    )}
                  </>
                )}

                {!draft.country && (
                  <div className="sm:col-span-1" />
                )}

                {(draft.type === "Physical" || draft.type === "Hybrid") && (
                  <>
                    <div className="sm:col-span-2">
                      <Input 
                        label="Venue" 
                        value={draft.venue || ""} 
                        onChange={(e) => save({ venue: e.currentTarget.value })} 
                        placeholder="e.g., Eko Convention Centre, Victoria Island"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input 
                        label="Community / Campus (Optional)" 
                        value={draft.community || ""} 
                        onChange={(e) => save({ community: e.currentTarget.value })} 
                        placeholder="e.g., University of Lagos, Lekki Phase 1, Tech Community"
                      />
                    </div>
                    <Select
                      label="Community Type (Optional)"
                      value={draft.communityType || ""}
                      onChange={(e) => save({ communityType: e.currentTarget.value as Draft["communityType"] })}
                      options={[
                        { value: "", label: "Select type" },
                        { value: "campus", label: "Campus" },
                        { value: "neighborhood", label: "Neighborhood" },
                        { value: "professional", label: "Professional" },
                        { value: "cultural", label: "Cultural" },
                      ]}
                    />
                    <div className="sm:col-span-1">
                      <Input 
                        label="Latitude (Optional)" 
                        type="number"
                        step="any"
                        value={draft.latitude?.toString() || ""} 
                        onChange={(e) => save({ latitude: e.currentTarget.value ? Number(e.currentTarget.value) : undefined })} 
                        placeholder="e.g., 6.4281"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <Input 
                        label="Longitude (Optional)" 
                        type="number"
                        step="any"
                        value={draft.longitude?.toString() || ""} 
                        onChange={(e) => save({ longitude: e.currentTarget.value ? Number(e.currentTarget.value) : undefined })} 
                        placeholder="e.g., 3.4219"
                      />
                    </div>
                  </>
                )}

                <div className="sm:col-span-2">
                  <CloudinaryUploadField
                    label="Cover Image"
                    value={draft.image || ""}
                    onChange={(url) => save({ image: url || undefined })}
                    folder="guestly/events/covers"
                    accept="image/*"
                    placeholder="Upload event cover"
                  />
                  {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Description</label>
                  <textarea
                    value={draft.description || ""}
                    onChange={(e) => save({ description: e.target.value })}
                    placeholder="Describe your event, what attendees can expect, and why they should attend..."
                    className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime/40"
                    rows={4}
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                </div>
                <div className="sm:col-span-2">
                  <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <input
                      type="checkbox"
                      id="postEventCommunityAccess"
                      checked={draft.postEventCommunityAccess ?? true}
                      onChange={(e) => save({ postEventCommunityAccess: e.target.checked })}
                      className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-lime-600 focus:ring-lime"
                    />
                    <label htmlFor="postEventCommunityAccess" className="flex-1 cursor-pointer">
                      <span className="font-medium text-neutral-900">Keep Community Active After Event</span>
                      <p className="mt-1 text-xs text-neutral-500">Allow attendees to continue discussions and share memories after the event ends</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-neutral-900">When is Your Event?</h2>
                <p className="mt-2 text-neutral-500">Choose the perfect date and time</p>
              </div>
              <div className="mx-auto w-full max-w-md">
                <Input 
                  label="Event Date & Time" 
                  type="datetime-local"
                  value={draft.date || ""} 
                  onChange={(e) => save({ date: e.currentTarget.value })} 
                  error={errors.date}
                />
                {draft.date && (
                  <div className="mt-4 rounded-xl border border-lime-200 bg-lime/5 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(draft.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-lime-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(draft.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Ticket Setup */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Ticket Pricing</h2>
                <p className="mt-1 text-neutral-500">Set up your ticket types and pricing</p>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime/20">
                      <svg className="h-5 w-5 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">General Admission</h3>
                      <p className="text-xs text-neutral-500">Standard entry ticket</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Price ($)"
                      type="number"
                      value={draft.ticketSetup?.generalPrice?.toString() ?? ""}
                      onChange={(e) =>
                        save({ ticketSetup: { ...(draft.ticketSetup || {}), generalPrice: e.target.value === "" ? undefined : Number(e.target.value) } })
                      }
                      placeholder="0"
                    />
                    <Input
                      label="Quantity"
                      type="number"
                      value={draft.ticketSetup?.generalQty?.toString() ?? ""}
                      onChange={(e) =>
                        save({ ticketSetup: { ...(draft.ticketSetup || {}), generalQty: e.target.value === "" ? undefined : Number(e.target.value) } })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime/20">
                      <svg className="h-5 w-5 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">VIP</h3>
                      <p className="text-xs text-neutral-500">Premium experience</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Price ($)"
                      type="number"
                      value={draft.ticketSetup?.vipPrice?.toString() ?? ""}
                      onChange={(e) =>
                        save({ ticketSetup: { ...(draft.ticketSetup || {}), vipPrice: e.target.value === "" ? undefined : Number(e.target.value) } })
                      }
                      placeholder="0"
                    />
                    <Input
                      label="Quantity"
                      type="number"
                      value={draft.ticketSetup?.vipQty?.toString() ?? ""}
                      onChange={(e) =>
                        save({ ticketSetup: { ...(draft.ticketSetup || {}), vipQty: e.target.value === "" ? undefined : Number(e.target.value) } })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              {errors.ticketSetup && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.ticketSetup}
                </div>
              )}
              {(draft.ticketSetup?.generalPrice !== undefined || draft.ticketSetup?.vipPrice !== undefined) && (
                <div className="rounded-xl border border-lime-200 bg-lime/5 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-neutral-900">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Projected Revenue
                  </p>
                  <p className="mt-2 text-2xl font-bold text-neutral-900 tabular-nums">
                    ${((draft.ticketSetup?.generalPrice || 0) * (draft.ticketSetup?.generalQty || 0) + 
                       (draft.ticketSetup?.vipPrice || 0) * (draft.ticketSetup?.vipQty || 0)).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-lime-700">
                    {(draft.ticketSetup?.generalQty || 0) + (draft.ticketSetup?.vipQty || 0)} total tickets
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Virtual Setup */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Virtual Setup</h2>
                <p className="mt-1 text-neutral-500">
                  {draft.type === "Virtual" 
                    ? "Configure your live stream" 
                    : draft.type === "Hybrid"
                    ? "Add virtual access for remote attendees"
                    : "Virtual setup not needed"}
                </p>
              </div>

              {(draft.type === "Virtual" || draft.type === "Hybrid") ? (
                <div className="space-y-5">
                  <Select
                    label="Streaming Provider"
                    value={draft.virtual?.provider || ""}
                    onChange={(e) => save({ virtual: { ...(draft.virtual || {}), provider: e.currentTarget.value as "Zoom" | "Google Meet" | "YouTube Live" | "Vimeo" | "RTMP" } })}
                    options={[
                      { value: "", label: "Select provider" },
                      { value: "Zoom", label: "Zoom" },
                      { value: "Google Meet", label: "Google Meet" },
                      { value: "YouTube Live", label: "YouTube Live" },
                      { value: "Vimeo", label: "Vimeo" },
                      { value: "RTMP", label: "Custom RTMP" },
                    ]}
                  />
                  
                  <Input
                    label="Stream / Meeting URL"
                    value={draft.virtual?.url || ""}
                    onChange={(e) => save({ virtual: { ...(draft.virtual || {}), url: e.currentTarget.value } })}
                    error={errors.virtualUrl}
                    placeholder="https://zoom.us/j/... or https://youtube.com/live/..."
                  />

                  <Select
                    label="Access Control"
                    value={draft.virtual?.accessControl || "ticket-holders"}
                    onChange={(e) => save({ virtual: { ...(draft.virtual || {}), accessControl: e.currentTarget.value as "ticket-holders" | "public" } })}
                    options={[
                      { value: "ticket-holders", label: "Ticket Holders Only" },
                      { value: "public", label: "Public Access" },
                    ]}
                  />

                  <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <input
                      type="checkbox"
                      id="enableReplay"
                      checked={draft.virtual?.enableReplay || false}
                      onChange={(e) => save({ virtual: { ...(draft.virtual || {}), enableReplay: e.target.checked } })}
                      className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-lime-600 focus:ring-lime"
                    />
                    <label htmlFor="enableReplay" className="flex-1 cursor-pointer">
                      <span className="font-medium text-neutral-900">Enable Replay Access</span>
                      <p className="mt-1 text-xs text-neutral-500">Allow ticket holders to watch the recording after the event ends</p>
                    </label>
                  </div>

                  {draft.virtual?.provider && (
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime/20">
                          <svg className="h-4 w-4 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-neutral-900">Setup Instructions</p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {draft.virtual?.provider === "Zoom" && "Paste your Zoom meeting link. Attendees will join directly from the event page."}
                            {draft.virtual?.provider === "Google Meet" && "Share your Google Meet link. Attendees will access it from the virtual lobby."}
                            {draft.virtual?.provider === "YouTube Live" && "Paste your YouTube Live stream URL. The video will be embedded on the event page."}
                            {draft.virtual?.provider === "Vimeo" && "Share your Vimeo live stream URL for embedded playback."}
                            {draft.virtual?.provider === "RTMP" && "Provide your RTMP stream URL for custom streaming setup."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-12 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100"><Building2 className="h-8 w-8 text-neutral-400" /></div>
                  <div>
                    <p className="font-semibold text-neutral-900">Physical Event</p>
                    <p className="mt-1 text-sm text-neutral-500">No virtual setup needed for in-person events</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Merchandise */}
          {step === 5 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Merchandise Store</h2>
                <p className="mt-1 text-neutral-500">Sell products alongside your event (optional)</p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { value: false, label: "Skip Merchandise", desc: "No products" },
                  { value: true, label: "Enable Store", desc: "Sell products" },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => save({ merch: { ...(draft.merch || {}), enabled: opt.value } })}
                    className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                      draft.merch?.enabled === opt.value
                        ? "border-lime bg-lime/5 shadow-lg"
                        : "border-neutral-200 hover:border-lime-300 hover:shadow-md"
                    }`}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-semibold ${
                      draft.merch?.enabled === opt.value ? "bg-lime text-dark" : "bg-neutral-100 text-neutral-500"
                    }`}>
                      {opt.value ? "🛍️" : "🚫"}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">{opt.label}</p>
                      <p className="text-xs text-neutral-500">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {draft.merch?.enabled && (
                <div className="space-y-5">
                  <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <input
                      type="checkbox"
                      id="postEventMerchSales"
                      checked={draft.merch?.postEventSales || false}
                      onChange={(e) => save({ merch: { ...(draft.merch || {}), postEventSales: e.target.checked } })}
                      className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-lime-600 focus:ring-lime"
                    />
                    <label htmlFor="postEventMerchSales" className="flex-1 cursor-pointer">
                      <span className="font-medium text-neutral-900">Keep Store Open After Event</span>
                      <p className="mt-1 text-xs text-neutral-500">Continue selling merchandise after the event date</p>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-neutral-900">Products</h3>
                    <button
                      onClick={() => {
                        const products = draft.merch?.products || [];
                        save({
                          merch: {
                            ...draft.merch,
                            products: [
                              ...products,
                              {
                                name: "",
                                description: "",
                                price: 0,
                                category: "Apparel" as const,
                                stock: 0,
                                image: "👕",
                                fulfillmentType: "pickup" as const,
                              },
                            ],
                          },
                        });
                      }}
                      className="flex items-center gap-2 rounded-xl bg-lime px-4 py-2 text-sm font-semibold text-dark transition hover:bg-lime-hover"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Product
                    </button>
                  </div>

                  {(!draft.merch?.products || draft.merch.products.length === 0) ? (
                    <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-12 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100"><Package className="h-8 w-8 text-neutral-400" /></div>
                      <div>
                        <p className="font-semibold text-neutral-900">No products yet</p>
                        <p className="mt-1 text-sm text-neutral-500">Click "Add Product" to create your first item</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {draft.merch?.products?.map((product, index) => (
                        <div key={index} className="rounded-xl border border-neutral-200 bg-white p-5">
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-semibold text-neutral-900">Product {index + 1}</h4>
                            <button
                              onClick={() => {
                                const products = [...(draft.merch?.products || [])];
                                products.splice(index, 1);
                                save({ merch: { ...draft.merch, products } });
                              }}
                              className="text-sm text-red-600 transition hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                              label="Product Name"
                              value={product.name}
                              onChange={(e) => {
                                const products = [...(draft.merch?.products || [])];
                                products[index] = { ...products[index], name: e.currentTarget.value };
                                save({ merch: { ...draft.merch, products } });
                              }}
                              placeholder="e.g., Event T-Shirt"
                            />

                            <Select
                              label="Category"
                              value={product.category}
                              onChange={(e) => {
                                const products = [...(draft.merch?.products || [])];
                                products[index] = { ...products[index], category: e.currentTarget.value as typeof product.category };
                                save({ merch: { ...draft.merch, products } });
                              }}
                              options={[
                                { value: "Apparel", label: "Apparel" },
                                { value: "Accessories", label: "Accessories" },
                                { value: "Prints", label: "Prints" },
                                { value: "Collectibles", label: "Collectibles" },
                              ]}
                            />

                            <Input
                              label="Price ($)"
                              type="number"
                              value={product.price.toString()}
                              onChange={(e) => {
                                const products = [...(draft.merch?.products || [])];
                                products[index] = { ...products[index], price: Number(e.currentTarget.value) };
                                save({ merch: { ...draft.merch, products } });
                              }}
                            />

                            <Input
                              label="Stock Quantity"
                              type="number"
                              value={product.stock.toString()}
                              onChange={(e) => {
                                const products = [...(draft.merch?.products || [])];
                                products[index] = { ...products[index], stock: Number(e.currentTarget.value) };
                                save({ merch: { ...draft.merch, products } });
                              }}
                            />

                            <div className="sm:col-span-2">
                              <Input
                                label="Description"
                                value={product.description}
                                onChange={(e) => {
                                  const products = [...(draft.merch?.products || [])];
                                  products[index] = { ...products[index], description: e.currentTarget.value };
                                  save({ merch: { ...draft.merch, products } });
                                }}
                                placeholder="Brief description"
                              />
                            </div>

                            <CloudinaryUploadField
                              label="Product Image"
                              value={product.image}
                              onChange={(image) => {
                                const products = [...(draft.merch?.products || [])];
                                products[index] = { ...products[index], image };
                                save({ merch: { ...draft.merch, products } });
                              }}
                              folder="guestly/events/merch"
                              accept="image/*"
                              placeholder="Upload product image"
                            />

                            <Input
                              label="Sizes (optional)"
                              value={product.sizes?.join(", ") || ""}
                              onChange={(e) => {
                                const products = [...(draft.merch?.products || [])];
                                const sizes = e.currentTarget.value.split(",").map((s) => s.trim()).filter(Boolean);
                                products[index] = { ...products[index], sizes: sizes.length > 0 ? sizes : undefined };
                                save({ merch: { ...draft.merch, products } });
                              }}
                              placeholder="S, M, L, XL"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 6: Review & Publish */}
          {step === 6 && (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-neutral-900">Review Your Event</h2>
                <p className="mt-2 text-neutral-500">Everything looks good? Let's publish!</p>
              </div>
              
              <div className="space-y-4">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                  <h3 className="mb-4 font-semibold text-neutral-900">Event Summary</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Type", value: draft.type || "—" },
                      { label: "Title", value: draft.title || "—" },
                      { label: "Category", value: draft.category || "—" },
                      { label: "City", value: draft.city || "—" },
                      { label: "Date", value: draft.date ? new Date(draft.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "—" },
                      ...(draft.venue ? [{ label: "Venue", value: draft.venue }] : []),
                      ...(draft.community ? [{ label: "Community", value: draft.community }] : []),
                      ...(draft.communityType ? [{ label: "Community Type", value: draft.communityType.charAt(0).toUpperCase() + draft.communityType.slice(1) }] : []),
                      ...(draft.latitude && draft.longitude ? [{ label: "Coordinates", value: `${draft.latitude.toFixed(4)}, ${draft.longitude.toFixed(4)}` }] : []),
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                        <span className="text-sm text-neutral-500">{item.label}</span>
                        <span className="text-sm font-medium text-neutral-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-lime-200 bg-lime/5 p-6">
                  <h3 className="mb-4 font-semibold text-neutral-900">Tickets & Revenue</h3>
                  <div className="space-y-3">
                    {draft.ticketSetup?.generalPrice !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-500">General Admission</span>
                        <span className="text-sm font-medium text-neutral-900">
                          ${draft.ticketSetup.generalPrice} × {draft.ticketSetup.generalQty || 0} = ${(draft.ticketSetup.generalPrice * (draft.ticketSetup.generalQty || 0)).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {draft.ticketSetup?.vipPrice !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-500">VIP</span>
                        <span className="text-sm font-medium text-neutral-900">
                          ${draft.ticketSetup.vipPrice} × {draft.ticketSetup.vipQty || 0} = ${(draft.ticketSetup.vipPrice * (draft.ticketSetup.vipQty || 0)).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-lime-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900">Projected Revenue</span>
                        <span className="text-xl font-bold text-neutral-900 tabular-nums">
                          ${((draft.ticketSetup?.generalPrice || 0) * (draft.ticketSetup?.generalQty || 0) + 
                             (draft.ticketSetup?.vipPrice || 0) * (draft.ticketSetup?.vipQty || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {(draft.type === "Virtual" || draft.type === "Hybrid") && draft.virtual?.url && (
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                    <h3 className="mb-4 font-semibold text-neutral-900">Virtual Access</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Provider</span>
                        <span className="font-medium text-neutral-900">{draft.virtual.provider || "—"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Access</span>
                        <span className="font-medium text-neutral-900">{draft.virtual.accessControl === "public" ? "Public" : "Ticket Holders Only"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Replay</span>
                        <span className="font-medium text-neutral-900">{draft.virtual.enableReplay ? "Enabled" : "Disabled"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {draft.merch?.enabled && draft.merch.products && draft.merch.products.length > 0 && (
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                    <h3 className="mb-4 font-semibold text-neutral-900">Merchandise</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Products</span>
                        <span className="font-medium text-neutral-900">{draft.merch.products.length} items</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Post-Event Sales</span>
                        <span className="font-medium text-neutral-900">{draft.merch.postEventSales ? "Enabled" : "Disabled"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime/20">
                    <svg className="h-4 w-4 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">Ready to publish?</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Once published, your event will be visible to attendees. You can still edit details later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-6">
            <button
              onClick={prev}
              disabled={step === 0}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-lime px-6 py-2.5 font-semibold text-dark shadow-sm transition hover:bg-lime-hover disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    Continue
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={publish}
                disabled={identityLoading || !isIdentityVerified}
                className="flex items-center gap-2 rounded-xl bg-lime px-8 py-2.5 font-semibold text-dark shadow-sm transition hover:bg-lime-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="rocket" size={20} />
                Publish Event
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
