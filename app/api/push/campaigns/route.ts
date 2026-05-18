import { NextRequest, NextResponse } from "next/server";
import { createPushCampaign } from "@/lib/marketing";

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    const role = req.cookies.get("role")?.value;

    if (!userId || role !== "organiser") {
      return NextResponse.json(
        { error: "Unauthorized - Organiser access required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { eventId, name, title, message, imageUrl, actionUrl, segmentId, scheduledAt } = body;

    if (!eventId || !name || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields: eventId, name, title, message" },
        { status: 400 }
      );
    }

    const campaign = createPushCampaign(userId, {
      organizerId: userId,
      eventId,
      name,
      description: message,
      type: 'push',
      channels: [{ type: 'push', enabled: true, config: {} }],
      status: scheduledAt ? 'scheduled' : 'draft',
      scheduledAt,
      budget: 0,
      spent: 0,
      content: {
        push: {
          title,
          body: message,
          imageUrl,
        },
      },
      metrics: {
        reach: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        cost: 0,
        roi: 0,
        ctr: 0,
        conversionRate: 0,
        cac: 0,
      },
      targetAudience: segmentId ? { id: segmentId } as any : undefined,
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Error creating push campaign:", error);
    return NextResponse.json(
      { error: "Failed to create push campaign" },
      { status: 500 }
    );
  }
}
