import { redirect } from "next/navigation";

/**
 * Root dashboard is deprecated. Send legacy FAQ index to Studio.
 */
export default function DashboardFaqRedirectPage() {
  redirect("/studio");
}
