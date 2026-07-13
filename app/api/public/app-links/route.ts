import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/settings/public`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ attendee: { android: "", ios: "" }, influencer: { android: "", ios: "" } });
    }

    const data = await res.json();
    const settings = data?.data || data || {};

    return NextResponse.json({
      attendee: {
        android: settings.appAttendeeAndroidUrl || "",
        ios: settings.appAttendeeIosUrl || "",
      },
      influencer: {
        android: settings.appInfluencerAndroidUrl || "",
        ios: settings.appInfluencerIosUrl || "",
      },
    });
  } catch {
    return NextResponse.json({ attendee: { android: "", ios: "" }, influencer: { android: "", ios: "" } });
  }
}
