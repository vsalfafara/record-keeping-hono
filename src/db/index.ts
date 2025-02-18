import env from "@/env";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  url: env.DATABASE_URL,
});

const db = drizzle(client, { schema });

export default db;
