export type FAQStatus = "draft" | "published";

export interface FAQ {
  id: string;
  title: string;
  answers: string[];
  status: FAQStatus;
  createdAt: string; // ISO string for JSON serialization
  /** Owner user id (e.g. Supabase auth); public page lists published FAQs per user */
  userId: string | null;
}

export interface FAQInput {
  title: string;
  answers: string[];
  status?: FAQStatus;
  userId?: string | null;
}

export interface FAQGenerateItem {
  question: string;
  answers: string[];
}
