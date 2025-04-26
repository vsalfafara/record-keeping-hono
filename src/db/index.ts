import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import type { Environment } from "@/env";

export function createDb(env: Environment) {
  const client = postgres(env.DATABASE_URL, { prepare: false });
  const db = drizzle(client, { schema });

  return { db, client };
}
