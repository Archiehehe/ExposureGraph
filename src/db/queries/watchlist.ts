import { getDb } from "../client";
import { watchlistItems } from "../schema";
import { eq } from "drizzle-orm";

export async function getWatchlistItemsForUser(userId: string) {
  const db = getDb();
  if (!db) return [];

  return await db.select().from(watchlistItems).where(eq(watchlistItems.userId, userId));
}

export async function createWatchlistItem(userId: string, companyId: string, notes?: string) {
  const db = getDb();
  if (!db) return null;

  const [item] = await db
    .insert(watchlistItems)
    .values({ userId, companyId, notes })
    .onConflictDoNothing()
    .returning();
  return item || null;
}
