import { NextRequest } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function hasVerifiedIdentity(req: NextRequest, role: "organiser" | "vendor" | "affiliate") {
  const me = await fetchBackendJson(req, "/api/v1/users/me");
  if (me.ok && me.data?.role === role && me.data?.is_verified === true) {
    return true;
  }

  const verification = await fetchBackendJson(
    req,
    `/api/v1/community/identity?role=${encodeURIComponent(role)}`,
  );

  return verification.ok && verification.data?.status === "verified";
}
