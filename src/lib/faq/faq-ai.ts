import type { FAQGenerateItem } from "./types";

/** Default FAQ templates by category (Paid plan suggestions when no URL). */
export const DEFAULT_FAQ_TEMPLATES: { category: string; items: FAQGenerateItem[] }[] =
  [
    {
      category: "Account",
      items: [
        {
          question: "How can I reset my password?",
          answers: [
            "Use the Forgot password link on the sign-in page and follow the email instructions.",
          ],
        },
        {
          question: "How do I edit my account information?",
          answers: [
            "Go to Account settings and update your profile; changes save automatically.",
          ],
        },
        {
          question: "Can I reset my security questions?",
          answers: [
            "Yes—contact support or use the security section in account settings.",
          ],
        },
      ],
    },
    {
      category: "General",
      items: [
        {
          question: "Do you have a warranty?",
          answers: [
            "Yes—see our warranty page for coverage length and exclusions.",
          ],
        },
        {
          question: "Do I need to sign a contract?",
          answers: [
            "No long-term contract is required for standard plans.",
          ],
        },
        {
          question: "Do you have any physical locations?",
          answers: [
            "We list all locations on our Contact page with hours and directions.",
          ],
        },
      ],
    },
    {
      category: "Orders",
      items: [
        {
          question: "What is your return policy?",
          answers: [
            "Returns are accepted within 30 days; items must be unused with tags.",
          ],
        },
        {
          question:
            "What should I do if my order is lost, stolen, or damaged?",
          answers: [
            "Contact us within 48 hours with your order number so we can file a claim.",
          ],
        },
        {
          question: "How can I track my order?",
          answers: [
            "Use the tracking link in your confirmation email or log in to view order status.",
          ],
        },
        {
          question: "When can I expect my preorder to arrive?",
          answers: [
            "Preorder ship dates are shown on the product page and in your confirmation email.",
          ],
        },
      ],
    },
    {
      category: "Payment",
      items: [
        {
          question: "What payment methods do you accept?",
          answers: [
            "We accept major cards, PayPal, and other methods shown at checkout.",
          ],
        },
        {
          question: "Do you sell gift cards?",
          answers: ["Yes—gift cards are available in fixed amounts online."],
        },
        {
          question: "How can I check my gift card balance?",
          answers: [
            "Enter your card number on the Gift card balance page or at checkout.",
          ],
        },
        {
          question: "Can I use Klarna or Afterpay?",
          answers: [
            "Where available, buy-now-pay-later options appear at checkout.",
          ],
        },
        {
          question: "Do you offer Apple Pay?",
          answers: ["Apple Pay is supported on supported devices at checkout."],
        },
      ],
    },
    {
      category: "Product / Service",
      items: [
        {
          question: "What products do you offer?",
          answers: [
            "Browse our catalog by category or use search to find specific items.",
          ],
        },
        {
          question: "What services do you offer?",
          answers: [
            "See our Services page for packages, pricing, and how to book.",
          ],
        },
      ],
    },
    {
      category: "Shipping",
      items: [
        {
          question: "How long does shipping take?",
          answers: [
            "Standard shipping is 3–5 business days; expedited options at checkout.",
          ],
        },
        {
          question: "Do you ship internationally?",
          answers: [
            "We ship to select countries; enter your address at checkout to confirm.",
          ],
        },
        {
          question: "Do you offer free shipping?",
          answers: [
            "Free shipping applies on orders over the threshold shown in the banner.",
          ],
        },
      ],
    },
  ];

export function flattenDefaultTemplates(): FAQGenerateItem[] {
  return DEFAULT_FAQ_TEMPLATES.flatMap((g) => g.items);
}

/**
 * Fetch URL text (basic SSRF mitigation: only http/https, timeout, size cap).
 */
export async function fetchMerchantText(url: string): Promise<string> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid URL");
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http/https URLs are allowed");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(parsed.toString(), {
      signal: controller.signal,
      headers: { "User-Agent": "FAQStudioBot/1.0" },
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const text = await res.text();
    return text.slice(0, 50000);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Call OpenAI to generate FAQs from page content. Falls back to defaults if no API key.
 */
export async function generateFaqsFromContent(
  pageText: string,
): Promise<FAQGenerateItem[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return flattenDefaultTemplates().slice(0, 8);
  }

  const prompt = `Analyze the following merchant website content and generate the most relevant FAQ questions and answers.
Focus on: shipping, returns, payments, products, services, support, policies.

Return ONLY a JSON array of objects with shape: [{"question":"...","answers":["..."]}]
Each item must have at least one answer string. No markdown, no code fence.

Website content (truncated):
${pageText.slice(0, 12000)}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You output only valid JSON arrays. No prose. Questions and answers must be concise.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim() ?? "";
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return flattenDefaultTemplates().slice(0, 8);
  }
  try {
    const parsed = JSON.parse(jsonMatch[0]) as unknown;
    if (!Array.isArray(parsed)) return flattenDefaultTemplates().slice(0, 8);
    return parsed
      .filter(
        (x): x is FAQGenerateItem =>
          typeof x === "object" &&
          x !== null &&
          typeof (x as FAQGenerateItem).question === "string" &&
          Array.isArray((x as FAQGenerateItem).answers),
      )
      .map((x) => ({
        question: String(x.question).trim(),
        answers: (x.answers as string[]).map((a) => String(a).trim()).filter(Boolean),
      }))
      .filter((x) => x.question && x.answers.length > 0);
  } catch {
    return flattenDefaultTemplates().slice(0, 8);
  }
}
