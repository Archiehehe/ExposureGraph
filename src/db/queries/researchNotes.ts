import { getDb } from "../client";
import { researchNotes } from "../schema";
import { eq, desc } from "drizzle-orm";

export async function getResearchNotesForUser(userId: string) {
  const db = getDb();
  if (!db) return [];

  return await db
    .select()
    .from(researchNotes)
    .where(eq(researchNotes.userId, userId))
    .orderBy(desc(researchNotes.createdAt));
}

export async function createResearchNote(data: {
  userId: string;
  companyId?: string;
  themeId?: string;
  title: string;
  content?: string;
}) {
  const db = getDb();
  if (!db) return null;

  const [note] = await db.insert(researchNotes).values(data).returning();
  return note;
}
