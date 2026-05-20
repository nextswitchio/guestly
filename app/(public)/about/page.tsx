"use client";

import { motion } from "framer-motion";
import {
  GlobeIcon,
  ZapIcon,
  ShieldIcon,
  AnalyticsIcon,
  TicketIcon,
  ChatIcon,
  StarIcon,
  ArrowRightIcon,
  LocationIcon,
  UserIcon,
} from "@/utils/icons";
import dynamic from "next/dynamic";

const MapSection = dynamic(() => import("@/components/about/MapSection"), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stats = [
  { value: "50K+", label: "Events Hosted" },
  { value: "2M+", label: "Tickets Sold" },
  { value: "12+", label: "Countries" },
  { value: "98%", label: "Satisfaction" },
];

const pillars = [
  {
    icon: <GlobeIcon className="h-7 w-7" />,
    title: "Built for Africa",
    description:
      "We designed Guestly from the ground up for African cities — from Lagos to Nairobi, Accra to Cape Town. Multi-currency support, local payment methods, and geo-targeted discovery that actually works here.",
  },
  {
    icon: <ZapIcon className="h-7 w-7" />,
    title: "AI-Powered Intelligence",
    description:
      "Predictive analytics, smart recommendations, and performance benchmarks help organizers price right, market smart, and sell out faster. Our AI learns from millions of events to give you an unfair advantage.",
  },
  {
    icon: <ShieldIcon className="h-7 w-7" />,
    title: "Secure & Transparent",
    description:
      "Every ticket is verified. Every payout is tracked. Our GUESTLY Wallet supports fiat and crypto with instant refunds, group payments, and savings targets. Your money, your control.",
  },
  {
    icon: <ChatIcon className="h-7 w-7" />,
    title: "Community-First",
    description:
      "Events are about people. Discussion boards, user profiles, follow systems, and moderation tools turn one-time attendees into loyal communities that keep coming back.",
  },
  {
    icon: <TicketIcon className="h-7 w-7" />,
    title: "Multi-Format Events",
    description:
      "Physical, virtual, or hybrid — Guestly handles it all. From intimate workshops to stadium concerts, our platform scales with your ambition and your audience.",
  },
  {
    icon: <AnalyticsIcon className="h-7 w-7" />,
    title: "Vendor Ecosystem",
    description:
      "Connect with caterers, decorators, sound engineers, and more. Our vendor directory, invitation system, and performance tracking make building your event team effortless.",
  },
];

const values = [
  {
    icon: <LocationIcon className="h-6 w-6" />,
    title: "Africa First",
    description:
      "Every feature we build starts with one question: does this serve African event creators and attendees better?",
  },
  {
    icon: <ShieldIcon className="h-6 w-6" />,
    title: "Radical Transparency",
    description:
      "No hidden fees, no black-box algorithms. Organizers see exactly where every naira, cedi, or shilling goes.",
  },
  {
    icon: <ZapIcon className="h-6 w-6" />,
    title: "Ship Fast, Iterate Faster",
    description:
      "We move quickly because the African event industry can't wait. But we never sacrifice quality for speed.",
  },
  {
    icon: <UserIcon className="h-6 w-6" />,
    title: "Obsess Over Users",
    description:
      "From the organizer launching their first event to the veteran selling out arenas — we build for all of them.",
  },
];

const team = [
  {
    name: "The Builders",
    role: "Engineering & Product",
    bio: "The minds behind the platform — architects, designers, and engineers who turn complex problems into elegant experiences.",
    avatar: "B",
  },
  {
    name: "The Connectors",
    role: "Partnerships & Growth",
    bio: "The bridge between Guestly and the cities we serve — building relationships with organizers, vendors, and communities.",
    avatar: "C",
  },
  {
    name: "The Guardians",
    role: "Trust & Safety",
    bio: "The team that keeps every transaction secure, every event legitimate, and every user protected.",
    avatar: "G",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white font-dm">
      {/* Hero */}
      <header className="relative bg-[#001c24] -mt-[200px] pt-[200px] font-dm selection:bg-lime selection:text-[#001C24]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
            style={{ backgroundImage: "url(/hero1.jpg)" }}
          />
          <div className="absolute inset-0 bg-[#001C24E5]" />
          <div className="absolute inset-0 bg-linear-to-b from-[#031419]/0 to-[#03151A]" />
        </div>
        <div className="relative max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-20">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:max-w-[55%]"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-lime/25 bg-lime/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-lime">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                  </span>
                  About Us
                </span>
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.06] tracking-tight text-white"
              >
                The event infrastructure platform for Africa{" "}<br/>
                <span className="text-lime">and beyond.</span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="mt-6 text-lg leading-relaxed text-white/70 max-w-xl"
              >
                We're building the tools that power how Africa discovers, attends,
                and hosts events — from neighborhood gatherings to continent-wide
                festivals.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Story Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-lime">
                Our Story
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                We saw a gap. We built the bridge.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                <p>
                  Africa's event industry is vibrant, massive, and growing — but
                  the tools to manage it were built elsewhere. Event organizers
                  in Lagos were using the same platforms as planners in London,
                  despite completely different realities: mobile-first audiences,
                  multi-currency payments, informal vendor networks, and
                  community-driven discovery.
                </p>
                <p>
                  Guestly was born from a simple belief: <strong className="text-slate-800">Africa deserves
                  world-class event infrastructure built for African
                  realities.</strong> Not adapted. Not localized. Built from
                  scratch.
                </p>
                <p>
                  Today, Guestly powers events across Nigeria, Ghana, Kenya,
                  South Africa, and Egypt — helping organizers sell tickets,
                  manage vendors, engage communities, and grow their brands with
                  tools that actually understand the market.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-lime/20 to-lime/5 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime/20">
                    <GlobeIcon className="h-8 w-8 text-lime" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    5 Countries
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    And growing every month
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-dark p-5 shadow-xl">
                <p className="text-3xl font-black text-lime">2M+</p>
                <p className="text-sm text-white/60">Tickets Sold</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-dark py-16">
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-lime">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider text-lime">
              Where We Operate
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Across Africa and growing
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              From Lagos to Cape Town, Guestly powers events in the continent's most vibrant cities.
            </p>
          </div>
          <MapSection />
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-lime">
              What We Offer
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Six pillars of the Guestly platform
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Every feature is designed to help you plan, promote, and profit
              from events — no matter the scale.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-lime/30"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-lime/10 text-lime transition-colors group-hover:bg-lime group-hover:text-dark">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-lime">
              Our Values
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              What drives us every day
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 text-center transition-all hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-lime/10 text-lime">
                  {value.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 sm:py-28 bg-dark">
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-lime">
              Our Team
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white leading-tight">
              The people behind the platform
            </h2>
            <p className="mt-4 text-lg text-white/50">
              We're organized into three core teams, each focused on a
              different part of the Guestly experience.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="group rounded-2xl border border-white/10 bg-[#051f26] p-8 text-center transition-all hover:border-lime/30 hover:-translate-y-1"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-lime/10 text-2xl font-bold text-lime group-hover:bg-lime group-hover:text-dark transition-colors">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-lime">
                  {member.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/50">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-dark relative overflow-hidden py-20 px-10 sm:py-28 sm:px-16 text-center">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 h-96 w-96 bg-lime/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 h-64 w-64 bg-lime/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
            </div>
            <div className="relative max-w-2xl mx-auto">
              <StarIcon className="mx-auto h-8 w-8 text-lime mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Ready to build something
                <br />
                <span className="text-lime">extraordinary?</span>
              </h2>
              <p className="mt-4 text-lg text-white/60">
                Whether you're hosting your first event or your hundredth,
                Guestly has the tools to make it unforgettable.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <a
                  href="/organisers"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime px-8 py-4 font-bold text-dark transition-all hover:bg-lime-hover"
                >
                  Start Hosting
                  <ArrowRightIcon className="h-5 w-5" />
                </a>
                <a
                  href="/explore"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-8 py-4 font-bold text-white transition-all hover:border-lime hover:text-lime"
                >
                  Discover Events
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
