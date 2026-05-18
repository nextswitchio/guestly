"use client";
import { PageHeader } from "@/components/PageHeader";
import { OrganizerFeaturesSection } from "./OrganizerFeaturesSection";
import { OrganizerBenefitsSection } from "./OrganizerBenefitsSection";
import { OrganizerWorkflowSection } from "./OrganizerWorkflowSection";
import { OrganizerSuccessSection } from "./OrganizerSuccessSection";
import { OrganizerCTASection } from "./OrganizerCTASection";

const OrganiserPage = () => {
  const heroActions = [
    {
      label: "Create Your Event",
      variant: "primary" as const,
      href: "/register",
    },
    {
      label: "Sign in",
      variant: "white" as const,
      href: "/login",
    },
  ];
  return (
    <>
      <PageHeader
        backgroundImage="/hero2.png"
        title="Host events that inspire. Earn with confidence."
        description="From underground concerts to global tech summits. Guestly gives you the ticketing, payments, analytics, and community tools to build, scale, and monetize events across Africa—instantly."
        star="The Platform for African Event Creators"
        actions={heroActions}
        showStatsTicker={true}
        width="w-full md:w-[80%] lg:w-[70%]"
        fontSize="text-base sm:text-[16.45px]"
        pWidth="max-w-[600px]"
      />
      <OrganizerFeaturesSection />
      <OrganizerBenefitsSection />
      <OrganizerWorkflowSection />
      <OrganizerSuccessSection />
      <OrganizerCTASection />
    </>
  );
};

export default OrganiserPage;
