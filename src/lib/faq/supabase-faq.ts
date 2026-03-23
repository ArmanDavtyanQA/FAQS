import type { SupabaseClient } from "@supabase/supabase-js";
import type { FAQ, FAQStatus } from "./types";
import { dbSetFaqTopicLinks } from "./supabase-topics";

/** DB row shape (snake_case as returned by Supabase) */
export interface FaqRow {
  id: string;
  user_id: string;
  title: string;
  answers: string[];
  status: FAQStatus;
  created_at: string;
  updated_at?: string;
}

type EmbeddedTopic = { id: string; title: string; is_active?: boolean | null };

type FaqLinkRow = {
  topic_id: string;
  /** PostgREST may return one object or an array for the embedded resource */
  faq_topics?: EmbeddedTopic | EmbeddedTopic[] | null;
};

export type FaqRowWithLinks = FaqRow & {
  faq_topic_links?: FaqLinkRow[] | null;
};

function embeddedTopic(t: FaqLinkRow["faq_topics"]): EmbeddedTopic | null {
  if (!t) return null;
  if (Array.isArray(t)) return t[0] ?? null;
  return t;
}

function topicIsActive(t: EmbeddedTopic | null): boolean {
  if (!t) return true;
  return t.is_active !== false;
}

function parseTopicLinks(
  links: FaqLinkRow[] | null | undefined,
  opts?: { excludeInactiveTopics?: boolean },
): { topicIds: string[]; topicLabels: { id: string; title: string }[] } {
  if (!links?.length) return { topicIds: [], topicLabels: [] };
  const excludeInactive = opts?.excludeInactiveTopics === true;
  const topicIds: string[] = [];
  const topicLabels: { id: string; title: string }[] = [];
  for (const l of links) {
    if (!l?.topic_id) continue;
    const t = embeddedTopic(l.faq_topics);
    if (excludeInactive && !topicIsActive(t)) continue;
    topicIds.push(l.topic_id);
    if (t?.id && t.title) {
      topicLabels.push({ id: t.id, title: t.title });
    } else {
      topicLabels.push({ id: l.topic_id, title: "Topic" });
    }
  }
  return { topicIds, topicLabels };
}

const SELECT_LIGHT = `
  id,user_id,title,status,created_at,
  faq_topic_links(topic_id, faq_topics(id, title, is_active))
`;

const SELECT_FULL = `
  id,user_id,title,answers,status,created_at,
  faq_topic_links(topic_id, faq_topics(id, title, is_active))
`;

export function rowToFaq(
  row: FaqRowWithLinks,
  opts?: { excludeInactiveTopics?: boolean },
): FAQ {
  const answers = Array.isArray(row.answers)
    ? row.answers.map(String)
    : [];
  const { topicIds, topicLabels } = parseTopicLinks(row.faq_topic_links, opts);
  return {
    id: row.id,
    title: row.title,
    answers,
    status: row.status === "published" ? "published" : "draft",
    createdAt: row.created_at,
    userId: row.user_id,
    topicIds,
    topicLabels: topicLabels.length ? topicLabels : undefined,
  };
}

/** List row without answers — use for dashboard table to avoid large payloads. */
export async function dbListFaqsByUserIdLight(
  client: SupabaseClient,
  userId: string,
): Promise<FAQ[]> {
  const { data, error } = await client
    .from("faqs")
    .select(SELECT_LIGHT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as unknown as FaqRowWithLinks[]).map((r) =>
    rowToFaq({ ...r, answers: [] } as FaqRowWithLinks),
  );
}

export async function dbListFaqsByUserId(
  client: SupabaseClient,
  userId: string,
): Promise<FAQ[]> {
  const { data, error } = await client
    .from("faqs")
    .select(SELECT_FULL)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as unknown as FaqRowWithLinks[]).map((row) => rowToFaq(row));
}

export async function dbListPublishedByUserId(
  client: SupabaseClient,
  userId: string,
): Promise<FAQ[]> {
  const { data, error } = await client
    .from("faqs")
    .select(SELECT_FULL)
    .eq("user_id", userId)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as unknown as FaqRowWithLinks[])
    .map((row) => rowToFaq(row, { excludeInactiveTopics: true }))
    .filter((faq) => faq.topicIds.length > 0);
}

export async function dbGetFaqById(
  client: SupabaseClient,
  id: string,
): Promise<FAQ | null> {
  const { data, error } = await client
    .from("faqs")
    .select(SELECT_FULL)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return rowToFaq(data as unknown as FaqRowWithLinks);
}

export async function dbInsertFaq(
  client: SupabaseClient,
  input: {
    userId: string;
    title: string;
    answers: string[];
    status?: FAQStatus;
    topicIds: string[];
  },
): Promise<FAQ> {
  const title = input.title.trim();
  const answers = input.answers.map((a) => a.trim()).filter(Boolean);
  const topicIds = [...new Set((input.topicIds ?? []).filter(Boolean))];
  if (!title) throw new Error("Question (title) is required");
  if (answers.length === 0) throw new Error("At least one answer is required");
  if (topicIds.length === 0)
    throw new Error("Select at least one topic for each question");

  const { data, error } = await client
    .from("faqs")
    .insert({
      user_id: input.userId,
      title,
      answers,
      status: input.status ?? "draft",
    })
    .select("id,user_id,title,answers,status,created_at")
    .single();

  if (error) throw new Error(error.message);
  const faqId = (data as FaqRow).id;
  await dbSetFaqTopicLinks(client, faqId, topicIds);

  const full = await dbGetFaqById(client, faqId);
  if (!full) throw new Error("FAQ not found after insert");
  return full;
}

export async function dbUpdateFaq(
  client: SupabaseClient,
  id: string,
  patch: Partial<{
    title: string;
    answers: string[];
    status: FAQStatus;
    topicIds: string[];
  }>,
): Promise<FAQ> {
  const updates: Record<string, unknown> = {};
  if (patch.title !== undefined) {
    const t = patch.title.trim();
    if (!t) throw new Error("Question (title) is required");
    updates.title = t;
  }
  if (patch.answers !== undefined) {
    const a = patch.answers.map((x) => x.trim()).filter(Boolean);
    if (a.length === 0) throw new Error("At least one answer is required");
    updates.answers = a;
  }
  if (patch.status !== undefined) updates.status = patch.status;

  if (Object.keys(updates).length > 0) {
    const { data, error } = await client
      .from("faqs")
      .update(updates)
      .eq("id", id)
      .select("id,user_id,title,answers,status,created_at")
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("FAQ not found");
  }

  if (patch.topicIds !== undefined) {
    const topicIds = [...new Set(patch.topicIds.filter(Boolean))];
    if (topicIds.length === 0)
      throw new Error("Select at least one topic for this question");
    await dbSetFaqTopicLinks(client, id, topicIds);
  }

  if (
    Object.keys(updates).length === 0 &&
    patch.topicIds === undefined
  ) {
    const existing = await dbGetFaqById(client, id);
    if (!existing) throw new Error("FAQ not found");
    return existing;
  }

  const refreshed = await dbGetFaqById(client, id);
  if (!refreshed) throw new Error("FAQ not found");
  return refreshed;
}

export async function dbDeleteFaq(
  client: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await client.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
