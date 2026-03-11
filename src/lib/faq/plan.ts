/**
 * Plan detection: Free = manual only; Paid = AI + default templates.
 * Replace with Supabase user metadata or billing provider when connected.
 */
export function isPaidPlan(): boolean {
  return process.env.NEXT_PUBLIC_FAQ_PLAN === "paid";
}

export function getPlanLabel(): "free" | "paid" {
  return isPaidPlan() ? "paid" : "free";
}
