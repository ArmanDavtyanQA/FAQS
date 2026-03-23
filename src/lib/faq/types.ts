export type FAQStatus = "draft" | "published";

export interface Topic {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  /** When false, hidden from published FAQ (dashboard still shows it). */
  isActive: boolean;
}

export interface FAQ {
  id: string;
  title: string;
  answers: string[];
  status: FAQStatus;
  createdAt: string; // ISO string for JSON serialization
  /** Owner user id (e.g. Supabase auth); public page lists published FAQs per user */
  userId: string | null;
  /** Linked topic ids (many-to-many); at least one required when creating/updating questions */
  topicIds: string[];
  /** Topic id + title when loaded with join (dashboard / public) */
  topicLabels?: { id: string; title: string }[];
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
