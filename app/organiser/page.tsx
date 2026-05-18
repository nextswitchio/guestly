"use client";
import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { motion } from "framer-motion";

export default function OrganiserLandingPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-bg)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-primary-500/10 blur-[120px]" />
          <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-success-500/10 blur-[120px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="flex flex-col items-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-8"
            >
              <Icon name="zap" size={14} />
              Event Management Reimagined
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-black leading-tight sm:text-7xl mb-8 text-[var(--foreground)]"
            >
              Host events that <span className="text-gradient-blue">inspire.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-[var(--foreground-muted)] mb-12 max-w-2xl leading-relaxed"
            >
              From underground concerts to global tech summits. GUESTLY provides the infrastructure to build, scale, and monetize your community events across Africa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              <Button href="/register?role=organiser" size="xl" glow className="min-w-[200px]">
                Create Your Event
              </Button>
              <Button href="/login?role=organiser" variant="outline" size="xl" className="min-w-[200px] border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] dark:bg-white/5 dark:hover:bg-white/10">
                Sign In
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[var(--surface-card)]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-widest">Built for High-Growth Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: "ticket", 
                title: "Smart Ticketing", 
                desc: "Flexible ticket tiers, early bird pricing, and digital check-ins with QR code verification." 
              },
              { 
                icon: "activity", 
                title: "AI Analytics", 
                desc: "Predict attendance, track real-time revenue, and understand attendee behavior with GUESTLY AI." 
              },
              { 
                icon: "users", 
                title: "Partner Ecosystem", 
                desc: "Instantly connect with verified vendors and leverage our affiliate network to drive sales." 
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-8 shadow-sm hover:shadow-md transition-all dark:bg-white/5 dark:backdrop-blur-xl"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary-500/20 flex items-center justify-center text-primary-500 mb-6">
                  <Icon name={item.icon as any} size={24} />
                </div>
                <h3 className="text-xl font-black text-[var(--foreground)] uppercase tracking-wider mb-4">{item.title}</h3>
                <p className="text-[var(--foreground-muted)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizer Tools Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-success-500/30 bg-success-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-success-600 dark:text-success-400">
                Organiser Suite
              </span>
              <h2 className="text-4xl font-black text-[var(--foreground)] leading-tight sm:text-5xl">
                Everything you need to <span className="text-gradient-blue">scale.</span>
              </h2>
              <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
                Stop juggling spreadsheets and manual transfers. Our unified dashboard brings your ticketing, payouts, and marketing into one seamless workflow.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: "credit-card", title: "Instant Payouts", desc: "No more waiting weeks. Access your funds as you sell tickets." },
                  { icon: "monitor", title: "Virtual & Hybrid", desc: "Host professional streams with interactive tools built-in." },
                  { icon: "zap", title: "AI Assistant", desc: "Generate event copy and forecast revenue with our AI co-pilot." },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-bg)] text-primary-500">
                      <Icon name={item.icon as any} size={20} />
                    </span>
                    <div>
                      <p className="text-sm font-black text-[var(--foreground)] uppercase tracking-wider">{item.title}</p>
                      <p className="text-xs text-[var(--foreground-muted)] mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                <Button href="/register?role=organiser" size="xl" glow>
                  Get Started for Free
                </Button>
              </div>
            </div>
            <div className="flex-1 w-full max-w-[600px] relative">
              <div className="absolute inset-0 bg-primary-500/20 blur-[100px] rounded-full" />
              <div className="relative aspect-video rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-card)] p-4 shadow-2xl dark:bg-[var(--surface-card)]/50 dark:backdrop-blur-xl">
                 {/* Mock Dashboard UI */}
                 <div className="h-full w-full rounded-xl bg-[var(--surface-bg)] p-6 space-y-6">
                   <div className="flex justify-between items-center">
                     <div className="h-4 w-32 rounded-full bg-[var(--surface-border)]" />
                     <div className="h-8 w-8 rounded-full bg-primary-500/20" />
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                     <div className="h-20 rounded-2xl border border-[var(--surface-border)] p-4 space-y-2">
                       <div className="h-2 w-12 rounded-full bg-[var(--surface-border)]" />
                       <div className="h-4 w-16 rounded-full bg-primary-500/40" />
                     </div>
                     <div className="h-20 rounded-2xl border border-[var(--surface-border)] p-4 space-y-2">
                       <div className="h-2 w-12 rounded-full bg-[var(--surface-border)]" />
                       <div className="h-4 w-16 rounded-full bg-success-500/40" />
                     </div>
                     <div className="h-20 rounded-2xl border border-[var(--surface-border)] p-4 space-y-2">
                       <div className="h-2 w-12 rounded-full bg-[var(--surface-border)]" />
                       <div className="h-4 w-16 rounded-full bg-warning-500/40" />
                     </div>
                   </div>
                   <div className="h-32 rounded-2xl border border-[var(--surface-border)] bg-gradient-to-t from-primary-500/5 to-transparent" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
