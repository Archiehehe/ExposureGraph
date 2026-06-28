import { getDb } from "../client";
import { themes } from "../schema";
import { eq } from "drizzle-orm";

export async function getAllThemes() {
  const db = getDb();
  if (!db) return [];

  return await db.select().from(themes).orderBy(themes.name);
}

export async function getThemeBySlug(slug: string) {
  const db = getDb();
  if (!db) return null;

  const [theme] = await db.select().from(themes).where(eq(themes.slug, slug)).limit(1);
  return theme || null;
}
