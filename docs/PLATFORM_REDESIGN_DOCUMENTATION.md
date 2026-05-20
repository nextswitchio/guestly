# Guestly Platform Redesign Documentation

## Overview

Guestly is a premium event commerce platform for African cities, redesigned with 150+ implemented tasks across 6 major phases.

## Architecture

- **Framework:** Next.js 16 (App Router)
- **React:** 19
- **TypeScript:** Strict mode
- **Styling:** Tailwind CSS v4
- **Real-time:** Socket.IO
- **State:** In-memory store (MVP)

## Key Features

### Event Management
- Physical, Virtual, and Hybrid events
- Advanced ticketing with multiple pricing tiers
- Virtual streaming (Zoom, YouTube Live, etc.)
- Live engagement (polls, Q&A, reactions, chat)

### Wallet & Payments
- Multi-currency support (fiat + crypto)
- Savings targets with recurring contributions
- Group wallet payments
- Instant refunds

### Marketing Suite
- Email, SMS, and push notification campaigns
- Social media integration
- Referral and affiliate programs
- A/B testing and analytics

### Admin Controls
- Platform-wide metrics
- User and event management
- Fraud detection and dispute resolution
- Audit logging

## Frontend Structure

```
app/                    # Next.js App Router pages
components/             # React components
  ui/                   # Design system
  layout/               # Layout components
  [feature]/            # Feature components
lib/                    # Utilities and business logic
types/                  # TypeScript type definitions
features/               # Feature-specific modules
```

## Design System

- **Colors:** Lime primary, Slate neutrals
- **Typography:** Plus Jakarta Sans (Aeonik Pro fallback)
- **Components:** 50+ accessible, reusable components
- **Dark Mode:** Full support
- **Motion:** Framer Motion with reduced motion support

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`
