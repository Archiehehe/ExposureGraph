import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { isDatabaseConfigured } from "../lib/env";

let db: ReturnType<typeof drizzle<Record<string, unknown>>> | null = null;

if (isDatabaseConfigured()) {
  const sql = neon(process.env.DATABASE_URL!);
  db = drizzle(sql);
}

export function getDb() {
  return db;
}
