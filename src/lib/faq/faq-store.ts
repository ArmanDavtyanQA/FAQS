/**
 * In-memory FAQ store for development / when DB is not connected.
 * Data is lost on server restart (serverless cold start). Swap for Supabase/DB later.
 */
import type { FAQ } from "./types";

const store = new Map<string, FAQ>();

export function getStore(): Map<string, FAQ> {
  return store;
}

export function seedStoreIfEmpty(seed: FAQ[]) {
  if (store.size === 0 && seed.length > 0) {
    for (const faq of seed) store.set(faq.id, faq);
  }
}
