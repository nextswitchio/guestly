import { redirect } from "next/navigation";

// Redirect old /organiser URL to /organizer
export default function Error() {
  redirect("/organizer");
}
