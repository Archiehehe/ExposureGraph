import { getDb } from "../client";
import { companies, companyIdentifiers, companyExposures, themes } from "../schema";
import { eq, and } from "drizzle-orm";

export async function getCompanyByTicker(ticker: string) {
  const db = getDb();
  if (!db) return null;

  const [identifier] = await db
    .select()
    .from(companyIdentifiers)
    .where(and(eq(companyIdentifiers.type, "ticker"), eq(companyIdentifiers.value, ticker)))
    .limit(1);
  if (!identifier) return null;
  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, identifier.companyId))
    .limit(1);
  return company || null;
}

export async function getCompanyExposures(companyId: string) {
  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      exposureType: companyExposures.exposureType,
      exposureScore: companyExposures.exposureScore,
      description: companyExposures.description,
      themeSlug: themes.slug,
      themeName: themes.name,
    })
    .from(companyExposures)
    .innerJoin(themes, eq(companyExposures.themeId, themes.id))
    .where(eq(companyExposures.companyId, companyId));

  return rows;
}
