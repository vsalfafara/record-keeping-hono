import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import type { Environment } from "@/env";

export function createDb(env: Environment) {
  const dbClient = postgres(env.DATABASE_URL, { prepare: false });
  const db = drizzle(dbClient, { schema });

  return { db, dbClient };
}
