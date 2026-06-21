import { NextRequest, NextResponse } from "next/server";
import { getPushCampaign, sendPushNotification } from "@/lib/marketing";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    const role = req.cookies.get("role")?.value;

    if (!userId || role !== "organiser") {
      return NextResponse.json(
        { error: "Unauthorized - Organiser access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const campaign = getPushCampaign(id);

    if (!campaign) {
      return NextResponse.json(
        { error: "Push campaign not found" },
        { status: 404 }
      );
    }

    if (campaign.organizerId !== userId) {
      return NextResponse.json(
        { error: "Forbidden - Not your campaign" },
        { status: 403 }
      );
    }

    const result = await sendPushNotification(id, {
      segmentId: campaign.targetAudience?.id
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error sending push notifications:", error);
    return NextResponse.json(
      { error: "Failed to send push notifications" },
      { status: 500 }
    );
  }
}
