import { z, type ZodError } from "zod";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(9999),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
  DB_URL: z.string().url(),
  DB_AUTH_TOKEN: z.string(),
  JWT_SECRET: z.string(),
});
// .superRefine((input, ctx) => {
//   if (input.NODE_ENV === "production" && !input.DB_AUTH_TOKEN) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.invalid_type,
//       expected: "string",
//       received: "undefined",
//       path: ["DB_AUTH_TOKEN"],
//       message: "Must be set when NODE_ENV is 'production'",
//     });
//   }
// });

export type Environment = z.infer<typeof EnvSchema>;

export function parseEnv(data: Environment) {
  const { data: env, error } = EnvSchema.safeParse(data);

  if (error) {
    const errorMessage = `Invalid env: ${Object.entries(
      error.flatten().fieldErrors
    )
      .map(([key, errors]) => `${key}: ${errors.join(",")}`)
      .join(" | ")}`;
    throw new Error(errorMessage);
    console.log(errorMessage);
  }

  return env;
}
