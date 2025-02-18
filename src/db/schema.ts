import { sql } from "drizzle-orm";
import {
  integer,
  text,
  sqliteTable,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

function timestamps() {
  return {
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
      () => new Date()
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  };
}

const id = text("id")
  .primaryKey()
  .$default(() => crypto.randomUUID());

export const users = sqliteTable(
  "users",
  {
    id,
    email: text("email").notNull(),
    password: text("password").notNull(),
    ...timestamps(),
  },
  (table) => [uniqueIndex("emailUniqueIndex").on(sql`lower(${table.email})`)]
);

export const tasks = sqliteTable("tasks", {
  id,
  name: text("name").notNull(),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
  ...timestamps(),
});

export const selectUserSchema = createSelectSchema(users).omit({
  password: true,
});
export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.min(1).email(),
  password: (schema) =>
    schema.regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, {
      message:
        "Minimum 8 characters, at least 1 letter, at least 1 number, and at least 1 special character",
    }),
})
  .required({ email: true, password: true })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const loginSchema = insertUserSchema.extend({ password: z.string() });

export const selectTasksSchema = createSelectSchema(tasks);
export const insertTasksSchema = createInsertSchema(tasks, {
  name: (schema) => schema.min(1).max(50),
})
  .required({ name: true, done: true })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const updateTaskSchema = insertTasksSchema.partial();
