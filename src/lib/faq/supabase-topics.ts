import type { SupabaseClient } from "@supabase/supabase-js";
import type { Topic } from "./types";

export interface TopicRow {
  id: string;
  user_id: string;
  project_id?: string | null;
  title: string;
  created_at: string;
  updated_at?: string;
  is_active?: boolean | null;
}

export function rowToTopic(row: TopicRow): Topic {
  return {
    id: row.id,
    title: row.title,
    userId: row.user_id,
    projectId: row.project_id ?? null,
    createdAt: row.created_at,
    isActive: row.is_active !== false,
  };
}

function isMissingTopicProjectIdColumn(error: { message?: string } | null): boolean {
  const msg = (error?.message ?? "").toLowerCase();
  return (
    msg.includes("column faq_topics.project_id does not exist") ||
    msg.includes("column \"project_id\" does not exist") ||
    (msg.includes("project_id") &&
      msg.includes("faq_topics") &&
      msg.includes("schema cache"))
  );
}

export async function dbListTopicsByUserId(
  client: SupabaseClient,
  userId: string,
  projectId?: string,
): Promise<Topic[]> {
  let query = client
    .from("faq_topics")
    .select("id,user_id,project_id,title,created_at,is_active")
    .eq("user_id", userId)
    .order("title", { ascending: true });
  if (projectId) query = query.eq("project_id", projectId);
  const { data, error } = await query;

  if (error && isMissingTopicProjectIdColumn(error)) {
    const { data: legacyData, error: legacyError } = await client
      .from("faq_topics")
      .select("id,user_id,title,created_at,is_active")
      .eq("user_id", userId)
      .order("title", { ascending: true });
    if (legacyError) throw new Error(legacyError.message);
    return (legacyData as TopicRow[]).map(rowToTopic);
  }
  if (error) throw new Error(error.message);
  return (data as TopicRow[]).map(rowToTopic);
}

export async function dbInsertTopic(
  client: SupabaseClient,
  input: { userId: string; projectId?: string | null; title: string; isActive?: boolean },
): Promise<Topic> {
  const title = input.title.trim();
  if (!title) throw new Error("Topic title is required");
  /** Default true (e.g. Create FAQ flow); Manage topics uses `isActive: false`. */
  const is_active = input.isActive !== undefined ? input.isActive : true;

  const { data, error } = await client
    .from("faq_topics")
    .insert({
      user_id: input.userId,
      project_id: input.projectId ?? null,
      title,
      is_active,
    })
    .select("id,user_id,project_id,title,created_at,is_active")
    .single();

  if (error && isMissingTopicProjectIdColumn(error)) {
    const { data: legacyData, error: legacyError } = await client
      .from("faq_topics")
      .insert({ user_id: input.userId, title, is_active })
      .select("id,user_id,title,created_at,is_active")
      .single();
    if (legacyError) throw new Error(legacyError.message);
    return rowToTopic(legacyData as TopicRow);
  }
  if (error) throw new Error(error.message);
  return rowToTopic(data as TopicRow);
}

export async function dbUpdateTopic(
  client: SupabaseClient,
  id: string,
  patch: { title?: string; isActive?: boolean },
): Promise<Topic> {
  const updates: Record<string, unknown> = {};
  if (patch.title !== undefined) {
    const title = patch.title.trim();
    if (!title) throw new Error("Topic title is required");
    updates.title = title;
  }
  if (patch.isActive !== undefined) {
    updates.is_active = patch.isActive;
  }
  if (Object.keys(updates).length === 0) {
    const { data, error } = await client
      .from("faq_topics")
      .select("id,user_id,project_id,title,created_at,is_active")
      .eq("id", id)
      .single();
    if (error && isMissingTopicProjectIdColumn(error)) {
      const { data: legacyData, error: legacyError } = await client
        .from("faq_topics")
        .select("id,user_id,title,created_at,is_active")
        .eq("id", id)
        .single();
      if (legacyError) throw new Error(legacyError.message);
      return rowToTopic(legacyData as TopicRow);
    }
    if (error) throw new Error(error.message);
    return rowToTopic(data as TopicRow);
  }

  const { data, error } = await client
    .from("faq_topics")
    .update(updates)
    .eq("id", id)
    .select("id,user_id,project_id,title,created_at,is_active")
    .single();

  if (error && isMissingTopicProjectIdColumn(error)) {
    const { data: legacyData, error: legacyError } = await client
      .from("faq_topics")
      .update(updates)
      .eq("id", id)
      .select("id,user_id,title,created_at,is_active")
      .single();
    if (legacyError) throw new Error(legacyError.message);
    return rowToTopic(legacyData as TopicRow);
  }
  if (error) throw new Error(error.message);
  return rowToTopic(data as TopicRow);
}

export async function dbDeleteTopic(
  client: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await client.from("faq_topics").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Replace all topic links for an FAQ (empty array clears links). */
export async function dbSetFaqTopicLinks(
  client: SupabaseClient,
  faqId: string,
  topicIds: string[],
): Promise<void> {
  const unique = [...new Set(topicIds.filter(Boolean))];

  const { error: delErr } = await client
    .from("faq_topic_links")
    .delete()
    .eq("faq_id", faqId);
  if (delErr) throw new Error(delErr.message);

  if (unique.length === 0) return;

  const rows = unique.map((topic_id) => ({ faq_id: faqId, topic_id }));
  const { error: insErr } = await client.from("faq_topic_links").insert(rows);
  if (insErr) throw new Error(insErr.message);
}
