import { NextRequest, NextResponse } from "next/server";
import { createWhatsAppCampaign } from "@/lib/marketing";

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
    const { eventId, name, message, recipients, mediaUrl, buttons, scheduledAt } = body;

    if (!eventId || !name || !message || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json(
        { error: "Missing required fields: eventId, name, message, recipients" },
        { status: 400 }
      );
    }

    const campaign = createWhatsAppCampaign(userId, {
      organizerId: userId,
      messageType: 'text',
      content: {
        text: message,
        mediaUrl,
        buttons,
      },
      recipients,
      scheduledAt,
      status: scheduledAt ? 'scheduled' : 'draft',
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Error creating WhatsApp campaign:", error);
    return NextResponse.json(
      { error: "Failed to create WhatsApp campaign" },
      { status: 500 }
    );
  }
}
