import React from "react";

const testimonials = [
    {
        quote: "Guestly transformed how we sell tickets. Our last conference sold out in 48 hours.",
        name: "Amaka Obi",
        role: "TEDx Lagos Organiser",
        avatar: "AO",
        events: "12 events hosted",
    },
    {
        quote: "The analytics are incredible. I know exactly when to promote and who to target.",
        name: "Kofi Mensah",
        role: "Creative Director, Accra",
        avatar: "KM",
        events: "8 events hosted",
    },
    {
        quote: "Virtual events + merch store = doubled revenue without a bigger venue.",
        name: "Fatima Al-Hassan",
        role: "Tech Community Lead",
        avatar: "FA",
        events: "24 events hosted",
    },
];

const platformStats = [
    { value: "50K+", label: "Events" },
    { value: "2M+", label: "Tickets Sold" },
    { value: "12", label: "Countries" },
    { value: "98%", label: "Satisfaction" },
];

export default function SocialProofSection() {
    return (
        <section className="container mx-auto py-14">
            {/* Stats row */}
            <div className="grid grid-cols-2 gap-0 sm:grid-cols-4 mb-12 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-card)] overflow-hidden shadow-sm divide-x divide-[var(--surface-border)]">
                {platformStats.map((s) => (
                    <div key={s.label} className="flex flex-col items-center py-6 px-4">
                        <p className="text-3xl font-extrabold text-[var(--foreground)] tabular-nums">{s.value}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Heading */}
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-[var(--foreground)]">Trusted by organisers across Africa</h2>
                <p className="mt-2 text-sm text-[var(--foreground-muted)]">Join thousands of creators building unforgettable experiences</p>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {testimonials.map((t) => (
                    <div key={t.name} className="flex flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-6 shadow-sm hover:shadow-md transition-shadow">
                        {/* Stars */}
                        <div className="flex gap-0.5">
                            {Array(5).fill(null).map((_, i) => (
                                <svg key={i} className="h-4 w-4 text-warning-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-sm leading-relaxed text-[var(--foreground)] italic">&ldquo;{t.quote}&rdquo;</p>
                        <div className="flex items-center gap-3 pt-2 border-t border-[var(--surface-border)]">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                                {t.avatar}
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-[var(--foreground)]">{t.name}</p>
                                <p className="text-xs text-[var(--foreground-muted)]">{t.role}</p>
                            </div>
                            <span className="ml-auto text-[10px] text-primary-600 font-medium">{t.events}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
