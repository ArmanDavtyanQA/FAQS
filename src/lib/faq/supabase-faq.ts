import type { SupabaseClient } from "@supabase/supabase-js";
import type { FAQ, FAQStatus } from "./types";

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

export function rowToFaq(row: FaqRow): FAQ {
  const answers = Array.isArray(row.answers)
    ? row.answers.map(String)
    : [];
  return {
    id: row.id,
    title: row.title,
    answers,
    status: row.status === "published" ? "published" : "draft",
    createdAt: row.created_at,
    userId: row.user_id,
  };
}

/** List row without answers — use for dashboard table to avoid large payloads. */
export async function dbListFaqsByUserIdLight(
  client: SupabaseClient,
  userId: string,
): Promise<FAQ[]> {
  const { data, error } = await client
    .from("faqs")
    .select("id,user_id,title,status,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Omit<FaqRow, "answers">[]).map((row) =>
    rowToFaq({ ...row, answers: [] } as FaqRow),
  );
}

export async function dbListFaqsByUserId(
  client: SupabaseClient,
  userId: string,
): Promise<FAQ[]> {
  const { data, error } = await client
    .from("faqs")
    .select("id,user_id,title,answers,status,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as FaqRow[]).map(rowToFaq);
}

export async function dbListPublishedByUserId(
  client: SupabaseClient,
  userId: string,
): Promise<FAQ[]> {
  const { data, error } = await client
    .from("faqs")
    .select("id,user_id,title,answers,status,created_at")
    .eq("user_id", userId)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as FaqRow[]).map(rowToFaq);
}

export async function dbGetFaqById(
  client: SupabaseClient,
  id: string,
): Promise<FAQ | null> {
  const { data, error } = await client
    .from("faqs")
    .select("id,user_id,title,answers,status,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return rowToFaq(data as FaqRow);
}

export async function dbInsertFaq(
  client: SupabaseClient,
  input: {
    userId: string;
    title: string;
    answers: string[];
    status?: FAQStatus;
  },
): Promise<FAQ> {
  const title = input.title.trim();
  const answers = input.answers.map((a) => a.trim()).filter(Boolean);
  if (!title) throw new Error("Question (title) is required");
  if (answers.length === 0) throw new Error("At least one answer is required");

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
  return rowToFaq(data as FaqRow);
}

export async function dbUpdateFaq(
  client: SupabaseClient,
  id: string,
  patch: Partial<{ title: string; answers: string[]; status: FAQStatus }>,
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
  if (Object.keys(updates).length === 0) {
    const existing = await dbGetFaqById(client, id);
    if (!existing) throw new Error("FAQ not found");
    return existing;
  }

  const { data, error } = await client
    .from("faqs")
    .update(updates)
    .eq("id", id)
    .select("id,user_id,title,answers,status,created_at")
    .single();

  if (error) throw new Error(error.message);
  return rowToFaq(data as FaqRow);
}

export async function dbDeleteFaq(
  client: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await client.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
