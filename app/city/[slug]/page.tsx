import { redirect } from "next/navigation";

const CITY_MAP: Record<string, string> = {
  lagos: "Lagos",
  abuja: "Abuja",
  accra: "Accra",
  nairobi: "Nairobi",
};

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = CITY_MAP[slug.toLowerCase()];
  if (!city) redirect("/explore");
  redirect(`/explore?city=${encodeURIComponent(city)}`);
}
