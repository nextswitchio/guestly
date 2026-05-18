import {
  AnalyticsIcon,
  CamIcon,
  ChatIcon,
  FilterIcon,
  GlobeIcon,
  PayoutIcon,
  ShieldIcon,
  StarOutlineIcon,
  UserIcon,
  ZapIcon,
} from "./icons";

export const cities = [
  {
    name: "Lagos",
    tagline: "Nigeria's cultural capital",
    image: "lagos.jpg",
  },
  {
    name: "Abuja",
    tagline: "Political and Social Hub",
    image: "abuja.jpg",
  },
  {
    name: "Accra",
    tagline: "West Africa's creative city",
    image: "accra.jpg",
  },
  {
    name: "Nairobi",
    tagline: "East Africa's tech hub",
    image: "nairobi.jpg",
  },
];

export const events = [
  {
    id: 1,
    title: "Lagos Marathon",
    description: "Annual city-wide marathon event",
    date: "28 Feb 2026",
    location: "Lekki, Lagos State, Nigeria",
    image: "marathon.jpg",
  },
  {
    id: 2,
    title: "Tech Summit",
    description: "A gathering of innovation and startups",
    date: "28 Feb 2026",
    location: "Lekki, Lagos State, Nigeria",
    image: "summit.jpg",
  },
  {
    id: 3,
    title: "Jazz Night",
    description: "An evening of soulful jazz",
    date: "28 Feb 2026",
    location: "Lekki, Lagos State, Nigeria",
    image: "jazz.jpg",
  },
  {
    id: 4,
    title: "Jazz Night",
    description: "An evening of soulful jazz",
    date: "28 Feb 2026",
    location: "Lekki, Lagos State, Nigeria",
    image: "jazz.jpg",
  },
  {
    id: 5,
    title: "DevConf",
    description: "Annual city-wide marathon event",
    date: "28 Feb 2026",
    location: "Lekki, Lagos State, Nigeria",
    image: "devcon.jpg",
  },
  {
    id: 6,
    title: "Music Fiesta",
    description: "A gathering of innovation and startups",
    date: "28 Feb 2026",
    location: "Lekki, Lagos State, Nigeria",
    image: "fiesta.jpg",
  },
  {
    id: 7,
    title: "African Heritage Festival",
    description: "An evening of soulful jazz",
    date: "28 Feb 2026",
    location: "Lekki, Lagos State, Nigeria",
    image: "festival.jpg",
  },
  {
    id: 8,
    title: "African Heritage Festival",
    description: "An evening of soulful jazz",
    date: "28 Feb 2026",
    location: "Lekki, Lagos State, Nigeria",
    image: "festival.jpg",
  },
];

export const steps = [
  {
    number: "01",
    title: "Launch in Minutes",
    description:
      "Create your event page, ticket tiers, and schedule with a guided setup built for speed.",
    align: "left" as const,
  },
  {
    number: "02",
    title: "Promote Smarter",
    description:
      "Share one high-converting event link everywhere and use AI prompts to polish your campaign copy.",
    align: "center" as const,
  },
  {
    number: "03",
    title: "Track & Grow",
    description:
      "Monitor sales in real time, engage attendees, and get paid securely to your wallet or bank.",
    align: "right" as const,
  },
];

export const features = [
  {
    id: 1,
    title: "Secure Payments",
    description:
      "Multiple checkout methods with reliable payment confirmation and fraud-aware flows.",
    image: "pay.jpg",
  },
  {
    id: 2,
    title: "Community Tools",
    description:
      "Keep attendees engaged before, during, and after events with chat, polls, and updates.",
    image: "tool.jpg",
  },
  {
    id: 3,
    title: "Actionable Insights",
    description:
      "See performance trends by city, campaign, and ticket type to make better decisions faster.",
    image: "action.jpg",
  },
];

export const testimonials = [
  {
    id: 1,
    quote:
      "Guestly transformed how we sell tickets. Our last conference sold in 48 hours",
    body: "Guestly creates spaces where people feel heard, supported, and connected. I've seen how their programs bring communities together and open up real opportunities for growth.",
    name: "Emeka Obi",
    role: "TedX Lagos Organiser",
    image: "/thumb.png", // Poster image for video
    video: "/testimonial.mp4", // Actual video file
  },
  {
    id: 2,
    quote: "The best platform for African event creators",
    body: "From ticketing to attendee engagement, everything just works. We've scaled our events 3x since switching to Guestly.",
    name: "Amara Okafor",
    role: "Afrochella Founder",
    image: "/thumb1.png",
    video: "/testimonial1.mp4",
  },
  {
    id: 3,
    quote: "Finally, a tool that understands our market",
    body: "Local payment methods, multi-currency support, and an interface that actually makes sense for African organizers.",
    name: "Kofi Mensah",
    role: "Accra Tech Summit",
    image: "/thumb2.png",
    video: "/testimonial2.mp4",
  },
];

export const virtualfeatures = [
  {
    icon: CamIcon,
    title: "HD Streaming",
    description: "Crystal clear broadcasts",
  },
  {
    icon: ChatIcon,
    title: "Live Chat",
    description: "Engage your audience",
  },
  {
    icon: FilterIcon,
    title: "Analytics",
    description: "Track engagement",
  },
  {
    icon: GlobeIcon,
    title: "Global Reach",
    description: "Sell worldwide",
  },
];

export const whyfeatures = [
  {
    icon: ShieldIcon,
    title: "Guaranteed Payments",
    description:
      "Never chase a client again. Our escrow system ensures you get paid instantly upon service completion.",
  },
  {
    icon: StarOutlineIcon,
    title: "Verified Reviews",
    description:
      "Build a premium reputation with verified feedback from professional event organizers.",
  },
  {
    icon: UserIcon,
    title: "Smart Leads",
    description:
      "Our AI matches your services with organizers actively planning events in your category and city.",
  },
];

export const setupfeatures = [
  {
    icon: ZapIcon,
    title: "Instant Setup",
    description:
      "Get approved and start sharing links in under 5 minutes. No technical knowledge required",
  },
  {
    icon: AnalyticsIcon,
    title: "Live Analytics",
    description:
      "Track clicks, conversions, and commissions in real-time with our transparent dashboard.",
  },
  {
    icon: PayoutIcon,
    title: "Weekly Payouts",
    description:
      "Receive your earnings directly to your GUESTLY wallet or bank account every Friday.",
  },
];

export const services = [
  {
    name: "Catering",
    image: "/s1.png",
  },
  {
    name: "Photography",
    image: "/s2.png",
  },
  {
    name: "Venue",
    image: "/s3.png",
  },
  {
    name: "Security",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Decor",
    image:
      "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Sound",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600",
  },
];
