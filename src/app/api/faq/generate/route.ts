import { NextResponse } from "next/server";
import { isPaidPlan } from "@/lib/faq/plan";
import {
  fetchMerchantText,
  generateFaqsFromContent,
  flattenDefaultTemplates,
} from "@/lib/faq/faq-ai";

export async function POST(req: Request) {
  if (!isPaidPlan()) {
    return NextResponse.json(
      { error: "AI generation is available on the Paid plan only." },
      { status: 403 },
    );
  }

  let body: { merchantUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const merchantUrl = body.merchantUrl?.trim();

  try {
    if (merchantUrl) {
      const text = await fetchMerchantText(merchantUrl);
      const items = await generateFaqsFromContent(text);
      return NextResponse.json({ items });
    }
    // No URL: return default templates as suggestions
    const items = flattenDefaultTemplates();
    return NextResponse.json({ items });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
