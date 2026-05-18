import { NextRequest, NextResponse } from "next/server";
import { updateFraudAlert, fraudAlerts } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const alert = fraudAlerts[id];
    
    if (!alert) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Fraud alert not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: alert });
  } catch (error) {
    console.error('Error getting fraud alert:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { status, assignedTo, resolution } = body;

    const updatedAlert = updateFraudAlert(id, {
      status,
      assignedTo,
      resolution,
    });

    if (!updatedAlert) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Fraud alert not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedAlert });
  } catch (error) {
    console.error('Error updating fraud alert:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}