import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const url = new URL(req.url);
  const searchParams = url.searchParams.toString();

  const backendPath = `/api/v1/payments/webhook${searchParams ? `?${searchParams}` : ""}`;

  const headers: Record<string, string> = {
    "Content-Type": req.headers.get("content-type") || "application/json",
  };

  const paystackSig = req.headers.get("x-paystack-signature");
  if (paystackSig) headers["x-paystack-signature"] = paystackSig;

  const flutterwaveHash = req.headers.get("verif-hash");
  if (flutterwaveHash) headers["verif-hash"] = flutterwaveHash;

  const stripeSig = req.headers.get("stripe-signature");
  if (stripeSig) headers["stripe-signature"] = stripeSig;

  try {
    const res = await fetch(`${BACKEND_URL}${backendPath}`, {
      method: "POST",
      headers,
      body,
    });

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json().catch(() => null);
      return NextResponse.json(data, { status: res.status });
    }

    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (error) {
    console.error("[Webhook] Failed to forward to backend:", error);
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
