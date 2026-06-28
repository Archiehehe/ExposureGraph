import { getDb } from "../client";
import { nodes, edges, themes } from "../schema";
import { eq, and, inArray } from "drizzle-orm";

export async function getThemeGraphBySlug(slug: string) {
  const db = getDb();
  if (!db) return null;

  const [theme] = await db.select().from(themes).where(eq(themes.slug, slug)).limit(1);
  if (!theme) return null;

  const themeNodes = await db.select().from(nodes).where(eq(nodes.themeId, theme.id));
  const nodeIds = themeNodes.map((n) => n.id);

  const themeEdges = nodeIds.length > 0
    ? await db
        .select()
        .from(edges)
        .where(and(eq(edges.published, true), inArray(edges.sourceNodeId, nodeIds), inArray(edges.targetNodeId, nodeIds)))
    : [];

  return {
    theme,
    nodes: themeNodes,
    edges: themeEdges,
  };
}
