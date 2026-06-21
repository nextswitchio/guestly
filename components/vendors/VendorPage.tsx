"use client";
import { PageHeader } from "@/components/PageHeader";
import BuiltToHelp from "./BuiltToHelp";
import { WhoWeSupport } from "./WhoWeSupport";

const VendorPage = () => {
  const heroActions = [
    {
      label: "List Your Business",
      variant: "primary" as const,
      href: "/vendor-auth/register",
    },
    {
      label: "Partner Sign in",
      variant: "white" as const,
      href: "/vendor-auth/login",
    },
  ];
  return (
    <>
      <PageHeader
        backgroundImage="/hero1.jpg"
        title="Get booked by top organizers."
        description="Join Africa's most exclusive event service network. Show your portfolio, manage inquiries, and receive secure payments from vetted event creators."
        star="The Premium Event Marketplace"
        actions={heroActions}
        showStatsTicker={true}
        width="max-w-[700px]"
        fontSize="text-base sm:text-[16.45px]"
        flip="sm:scale-x-[-1]"
      />
      <BuiltToHelp />
      <WhoWeSupport />
    </>
  );
};

export default VendorPage;
