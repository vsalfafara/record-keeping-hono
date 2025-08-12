import { createMessageObjectSchema } from "stoker/openapi/schemas";
import { HTTPStatusPhrases } from "./helpers";
import { z } from "zod";
import env from "../env-runtime";

export const notFoundSchema = (message: string | null = null) => {
  return createMessageObjectSchema(message || HTTPStatusPhrases.NOT_FOUND);
};

export const origin = [
  "http://localhost:5173",
  "https://record-keeping-vue.pages.dev",
  "https://record-keeping-vue-dev.onrender.com",
];

export const bearerToken = z.object({
  Accept: z.string().default("application/json"),
  Authorization: z.string().default(`Bearer ${env.TEST_BEARER_TOKEN}`),
});
