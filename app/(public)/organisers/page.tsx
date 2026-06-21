import { redirect } from "next/navigation";

// Redirect old /organisers URL to /organizer
export default function OrganisersPage() {
  redirect("/organizer");
}
