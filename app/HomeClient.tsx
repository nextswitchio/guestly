"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import EventCard from "@/components/events/EventCard";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import HeroSection from "@/components/homepage/HeroSection";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { filterEvents } from "@/lib/events";
import type { Event } from "@/lib/events";

const cities = [
  { name: "Lagos", icon: "location" as const, color: "from-primary-500 to-primary-700", desc: "Nigeria's cultural capital" },
  { name: "Abuja", icon: "location" as const, color: "from-success-500 to-success-700", desc: "Political & social hub" },
  { name: "Accra", icon: "location" as const, color: "from-warning-500 to-orange-600", desc: "West Africa's creative city" },
  { name: "Nairobi", icon: "location" as const, color: "from-danger-500 to-danger-700", desc: "East Africa's tech hub" },
];

const stats = [
  { value: "50K+", label: "Events Hosted" },
  { value: "2M+", label: "Tickets Sold" },
  { value: "12", label: "Countries" },
  { value: "98%", label: "Satisfaction" },
];

const testimonials = [
  {
    quote: "Guestly transformed how we sell tickets. Our last conference sold out in 48 hours.",
    name: "Amaka Obi",
    role: "TEDx Lagos Organiser",
    avatar: "AO",
  },
  {
    quote: "The analytics are incredible. I know exactly when to promote and who to target.",
    name: "Kofi Mensah",
    role: "Creative Director, Accra",
    avatar: "KM",
  },
  {
    quote: "Virtual events + merch store = doubled revenue without a bigger venue.",
    name: "Fatima Al-Hassan",
    role: "Tech Community Lead",
    avatar: "FA",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
} as const;

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.15 }
} as const;

export default function HomeClient() {
  const [featured, setFeatured] = React.useState<Event[]>([]);
  const [cityCards, setCityCards] = React.useState<Array<{ name: string; icon: any; color: string; desc: string; count: number }>>([]);

  React.useEffect(() => {
    const featuredData = filterEvents({ page: 1, pageSize: 6 }).data;
    const cityCardsData = cities.map((c) => ({
      ...c,
      count: filterEvents({ city: c.name as Event["city"] }).total,
    }));
    
    setFeatured(featuredData);
    setCityCards(cityCardsData);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-bg)] text-[var(--foreground)]">
      <TopNav />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <HeroSection featured={featured} stats={stats} />

      {/* ── Browse by City ─────────────────────────────────────────────────────── */}
      <section className="container py-20">
        <motion.div 
          {...fadeInUp}
          className="mb-12"
        >
          <h2 className="text-4xl font-black tracking-tight text-[var(--foreground)]">Browse by City</h2>
          <p className="mt-2 text-lg text-[var(--foreground-muted)] font-medium">Discover what&apos;s happening in your neighborhood</p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {cityCards.map((c) => (
            <motion.div key={c.name} variants={fadeInUp}>
              <Link
                href={`/city/${c.name}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-6 text-center transition-all hover:-translate-y-2 hover:bg-[var(--surface-hover)] hover:shadow-2xl hover:shadow-primary-500/10 dark:bg-[var(--surface-card)]/50 dark:backdrop-blur-xl"
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${c.color}`} />
                <div className="flex justify-center mb-3">
                  <div className="h-12 w-12 rounded-2xl bg-[var(--surface-bg)] flex items-center justify-center transform transition-transform group-hover:scale-110">
                    <Icon name={c.icon} size={24} className="text-primary-500" />
                  </div>
                </div>
                <span className="text-lg font-black text-[var(--foreground)]">{c.name}</span>
                <span className="text-xs text-[var(--foreground-subtle)] mt-1 font-medium">{c.desc}</span>
                <div className="mt-4 inline-flex items-center justify-center rounded-full bg-primary-500/20 px-3 py-1 text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                  {c.count} event{c.count !== 1 ? "s" : ""}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Featured Events ─────────────────────────────────────────────────── */}
      <section className="container py-20 bg-[var(--surface-card)]/30">
        <motion.div 
          {...fadeInUp}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <h2 className="text-4xl font-black tracking-tight text-[var(--foreground)]">Featured Events</h2>
            <p className="mt-2 text-lg text-[var(--foreground-muted)] font-medium">Handpicked experiences from top creators</p>
          </div>
          <Link href="/explore" className="hidden text-sm font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors sm:inline-flex items-center gap-2">
            View all
            <Icon name="chevron-right" size={16} />
          </Link>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((e) => (
            <motion.div key={e.id} variants={fadeInUp}>
              <EventCard
                id={e.id}
                title={e.title}
                description={e.description}
                date={e.date}
                city={e.city}
                category={e.category}
                image={e.image}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center sm:hidden">
          <Button href="/explore" variant="outline" size="lg" className="w-full">
            View all events
          </Button>
        </div>
      </section>

      {/* ── AI Intelligence Showcase ────────────────────────────────────────────── */}
      <section className="container py-24">
        <motion.div 
          {...fadeInUp}
          className="relative overflow-hidden rounded-[3rem] border border-[var(--surface-border)] bg-[var(--surface-card)] p-10 md:p-16 dark:bg-[var(--surface-card)]/50 dark:backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(223,41,53,0.1),transparent_50%)]" />
          <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto gap-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-danger-500/30 bg-danger-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-danger-600 dark:text-danger-400">
              AI Powered
            </span>
            <h2 className="text-4xl font-black text-[var(--foreground)] leading-tight sm:text-6xl">
              Organize with <span className="text-gradient-red">intelligence</span>, not guesswork.
            </h2>
            <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
              Use our AI-powered planning tools to predict attendance, forecast revenue, and generate perfect event copy. GUESTLY is your co-pilot for successful experiences.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-8">
              {[
                { title: "Attendance Prediction", value: "94% Accuracy", icon: "activity" as const },
                { title: "Revenue Forecasting", value: "Smart Targets", icon: "bar-chart" as const },
                { title: "AI Event Copy", value: "Instant Drafts", icon: "cpu" as const },
              ].map((f) => (
                <div key={f.title} className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-6 dark:bg-[var(--surface-card)]/50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-500/10 text-danger-600 dark:text-danger-400 mb-4">
                    <Icon name={f.icon} size={24} />
                  </span>
                  <p className="text-xs font-black text-[var(--foreground)] uppercase tracking-wider">{f.title}</p>
                  <p className="text-sm font-bold text-danger-600 dark:text-danger-400 mt-1">{f.value}</p>
                </div>
              ))}
            </div>
            
            <Button href="/dashboard/ai-assistant" size="xl" className="bg-danger-600 hover:bg-danger-500 shadow-2xl shadow-danger-900/40">
              Try AI Assistant
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── Virtual Events Section ────────────────────────────────────────────── */}
      <section className="container py-24">
        <motion.div 
          {...fadeInUp}
          className="relative overflow-hidden rounded-[3rem] border border-[var(--surface-border)] bg-[var(--surface-card)] p-10 md:p-16 dark:bg-[var(--surface-card)]/50 dark:backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(67,146,241,0.15),transparent_50%)]" />
          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">
                🌐 Global Infrastructure
              </span>
              <h2 className="text-4xl font-black text-[var(--foreground)] leading-tight sm:text-5xl">
                Host events that reach <span className="text-gradient-blue">the whole world</span>
              </h2>
              <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
                Run live conferences, church programs, and tech workshops with professional streaming, interactive polls, and global ticket sales.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <Button href="/dashboard/events/new" size="xl" glow>
                  Create Virtual Event
                </Button>
                <Button href="/explore" variant="outline" size="xl" className="border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]">
                  Explore Virtual
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { icon: "video" as const, title: "Virtual Hosting", desc: "Private streams for paid ticket holders with Zoom/YouTube integration." },
                { icon: "monitor" as const, title: "Hybrid Access", desc: "Unified analytics for physical venues and virtual attendees." },
                { icon: "activity" as const, title: "Engagement Tools", desc: "Live chat, polls, and Q&A directly inside your event page." },
              ].map((f) => (
                <div key={f.title} className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-bg)] p-8 backdrop-blur-md">
                  <div className="h-12 w-12 rounded-2xl bg-primary-500/20 flex items-center justify-center text-primary-500 mb-6">
                    <Icon name={f.icon} size={24} />
                  </div>
                  <h3 className="text-lg font-black text-[var(--foreground)] uppercase tracking-wider">{f.title}</h3>
                  <p className="text-sm text-[var(--foreground-muted)] mt-3 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Social Proof ──────────────────────────────────────────────────────── */}
      <section className="container py-20">
        <motion.div 
          {...fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black text-[var(--foreground)]">Trusted by organizers across Africa</h2>
          <p className="mt-4 text-lg text-[var(--foreground-muted)] font-medium max-w-2xl mx-auto">Join the new generation of creators building unforgettable experiences on GUESTLY.</p>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div 
              key={t.name}
              variants={fadeInUp}
              className="group flex flex-col gap-6 rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-card)] p-8 shadow-sm transition-all hover:bg-[var(--surface-hover)] hover:-translate-y-2 dark:bg-[var(--surface-card)]/50 dark:backdrop-blur-sm"
            >
              <div className="flex gap-1 text-warning-500">
                {Array(5).fill(null).map((_, i) => (
                  <Icon key={i} name="star" size={16} />
                ))}
              </div>
              <p className="text-lg leading-relaxed text-[var(--foreground)] font-medium italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-4 pt-6 border-t border-[var(--surface-border)]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-sm font-black text-white shadow-lg shadow-primary-900/20">
                  {t.avatar}
                </span>
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-wider">{t.name}</p>
                  <p className="text-xs text-navy-400 font-bold">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────────── */}
      <section className="container py-24">
        <motion.div 
          {...fadeInUp}
          className="relative overflow-hidden flex flex-col items-center gap-8 rounded-[3.5rem] bg-primary-600 px-10 py-20 text-center text-white shadow-3xl shadow-primary-900/40"
        >
          {/* Animated background decoration */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-[100px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-[80px]" 
          />

          <span className="relative inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-2 text-xs font-black uppercase tracking-widest">
            <Icon name="rocket" size={16} />
            Free to start • No hidden fees
          </span>
          <h2 className="relative text-5xl font-black sm:text-6xl max-w-3xl leading-[1.1]">
            Ready to host your next <span className="text-navy-950/40">unforgettable</span> event?
          </h2>
          <p className="relative max-w-xl text-lg text-primary-50 font-medium leading-relaxed">
            Join the GUESTLY ecosystem today. Setup in minutes, sell tickets globally, and build a lasting community.
          </p>
          <div className="relative flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard/events/new"
              className="inline-flex h-16 items-center rounded-2xl bg-white px-10 text-base font-black text-primary-700 shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Start Organizing Free
            </Link>
            <Link
              href="/explore"
              className="inline-flex h-16 items-center rounded-2xl border-2 border-white/30 bg-white/10 px-8 text-base font-black text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105"
            >
              Explore Events
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
      <BottomNav />
    </div>
  );
}
