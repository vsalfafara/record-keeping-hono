import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import type { Environment } from "@/env";

export function createDb(env: Environment) {
  const client = createClient({
    url: env.DB_URL,
    authToken: env.DB_AUTH_TOKEN,
  });

  const db = drizzle(client, { schema });

  return { db, client };
}
