import type { FAQ, FAQInput, FAQStatus } from "./types";
import { getStore, seedStoreIfEmpty } from "./faq-store";

function nowIso(): string {
  return new Date().toISOString();
}

function validateInput(input: FAQInput): void {
  const title = input.title?.trim();
  if (!title) throw new Error("Question (title) is required");
  const answers = (input.answers ?? []).map((a) => a.trim()).filter(Boolean);
  if (answers.length === 0) throw new Error("At least one answer is required");
}

export function listFaqs(): FAQ[] {
  const store = getStore();
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/** Dashboard: FAQs owned by user (includes drafts). */
export function listFaqsByUserId(userId: string): FAQ[] {
  return listFaqs().filter((f) => f.userId === userId);
}

/** Public view: published only, for shareable FAQ page. */
export function listPublishedFaqsByUserId(userId: string): FAQ[] {
  return listFaqs()
    .filter((f) => f.userId === userId && f.status === "published")
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}

export function getFaqById(id: string): FAQ | null {
  return getStore().get(id) ?? null;
}

export function createFaq(input: FAQInput): FAQ {
  validateInput(input);
  const id = crypto.randomUUID();
  const faq: FAQ = {
    id,
    title: input.title.trim(),
    answers: input.answers.map((a) => a.trim()).filter(Boolean),
    status: input.status ?? "draft",
    createdAt: nowIso(),
    userId: input.userId ?? null,
  };
  getStore().set(id, faq);
  return faq;
}

export function updateFaq(
  id: string,
  patch: Partial<Pick<FAQ, "title" | "answers" | "status">>,
): FAQ {
  const store = getStore();
  const existing = store.get(id);
  if (!existing) throw new Error("FAQ not found");

  const title = patch.title !== undefined ? patch.title.trim() : existing.title;
  const answers =
    patch.answers !== undefined
      ? patch.answers.map((a) => a.trim()).filter(Boolean)
      : existing.answers;
  const status = (patch.status ?? existing.status) as FAQStatus;

  if (!title) throw new Error("Question (title) is required");
  if (answers.length === 0) throw new Error("At least one answer is required");

  const updated: FAQ = {
    ...existing,
    title,
    answers,
    status,
  };
  store.set(id, updated);
  return updated;
}

export function deleteFaq(id: string): boolean {
  return getStore().delete(id);
}

// Optional mock seed for empty dashboard
const MOCK_SEED: FAQ[] = [
  {
    id: "mock-1",
    title: "What is your return policy?",
    answers: [
      "We accept returns within 30 days of purchase in original condition.",
      "Contact support with your order number to start a return.",
    ],
    status: "published",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    userId: null,
  },
];

export function ensureMockData() {
  seedStoreIfEmpty(MOCK_SEED);
}
