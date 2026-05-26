import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized", bank_name: null, account_number: null, account_name: null }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/virtual-account`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 403) {
        return NextResponse.json({
          bank_name: null,
          account_number: null,
          account_name: null,
          error: data.detail || "Identity verification required",
          verification_required: true,
        }, { status: 200 });
      }
      return NextResponse.json({
        bank_name: null,
        account_number: null,
        account_name: null,
        error: data.detail || "Failed to fetch virtual account",
      }, { status: 200 });
    }

    return NextResponse.json({
      bank_name: data.bank_name || null,
      bank_code: data.bank_code || null,
      account_number: data.account_number || null,
      account_name: data.account_name || null,
      created_at: data.created_at || null,
    });
  } catch {
    return NextResponse.json({ bank_name: null, account_number: null, account_name: null }, { status: 200 });
  }
}
