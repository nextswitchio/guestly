"use client";
import { PageHeader } from "@/components/PageHeader";
import AISection from "./AISection";
import { BrowseByCity } from "./BrowseByCity";
import { ExploreByCategory } from "./ExploreByCategory";
import { FeaturedEvents } from "./FeaturedEvent";
import { HowItWorks } from "./HowItWorks";
import { Testimonials } from "./Testimonials";
import { VirtualEvents } from "./VirtualEvents";
import { WhyChooseGuestly } from "./WhyChooseGuestly";

const Homepage = () => {
  const heroActions = [
    {
      label: "Find Event Near You",
      variant: "primary" as const,
      href: "/near",
    },
    {
      label: "Start Hosting",
      variant: "white" as const,
      href: "/organisers",
    },
  ];
  return (
    <>
      <PageHeader
        backgroundImage="/herobg.jpg"
        title="Discover events that move your city, career, and community."
        description="From sold-out concerts and creator meetups to business summits and weekend experiences, Guestly helps you find what matters—or host something people remember."
        actions={heroActions}
        showStatsTicker={true}
      />
      <ExploreByCategory />
      <BrowseByCity />
      <FeaturedEvents />
      <HowItWorks />
      <WhyChooseGuestly />
      <AISection />
      <VirtualEvents />
      <Testimonials />
    </>
  );
};

export default Homepage;
