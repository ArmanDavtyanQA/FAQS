import { redirect } from "next/navigation";

/**
 * Root dashboard is deprecated.
 * Project-scoped dashboard is now canonical: /project/{projectId}/dashboard
 */
export default function DashboardPage() {
  redirect("/studio");
}
