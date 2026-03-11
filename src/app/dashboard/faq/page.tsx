import { redirect } from "next/navigation";

/**
 * FAQ list lives on the main dashboard. Redirect legacy /dashboard/faq here.
 */
export default function DashboardFaqRedirectPage() {
  redirect("/dashboard");
}
