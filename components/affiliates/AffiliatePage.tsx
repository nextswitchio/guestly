"use client";
import { PageHeader } from "@/components/PageHeader";
import BuiltForHigh from "@/components/affiliate/BuiltForHigh";
import { InfluencerBanner } from "@/components/affiliate/InfluencerBanner";
import { MediaKits } from "@/components/affiliate/MediaKits";

const AffiliatePage = () => {
  const heroActions = [
    {
      label: "Become an Affiliate",
      variant: "primary" as const,
      href: "/affiliate-auth/register",
    },
    {
      label: "Partner Sign in",
      variant: "white" as const,
      href: "/affiliate-auth/login",
    },
  ];
  return (
    <>
      <PageHeader
        backgroundImage="/hero2.png"
        title="Monetize your influence."
        description="Partner with the biggest events in Africa. Share unique referral links, track your performance in real-time, and earn industry-leading commissions on every ticket sold."
        star="The Influencer & Promoter Program"
        actions={heroActions}
        showStatsTicker={true}
        width="max-w-[646px]"
        fontSize="text-base sm:text-[16.45px]"
        pWidth="max-w-[450px]"
      />
      <BuiltForHigh />
      <MediaKits />
      <InfluencerBanner />
    </>
  );
};

export default AffiliatePage;
