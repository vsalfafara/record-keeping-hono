import { createMessageObjectSchema } from "stoker/openapi/schemas";
import { HTTPStatusPhrases } from "./helpers";
import { z } from "zod";
// import env from "../env-runtime";

export const notFoundSchema = (message: string | null = null) => {
  return createMessageObjectSchema(message || HTTPStatusPhrases.NOT_FOUND);
};

export const origin = [
  "http://localhost:5173",
  "https://record-keeping-vue.pages.dev",
  "https://record-keeping-vue-dev.onrender.com",
];

export const headers = z.object({
  Accept: z
    .string()
    .default("application/json")
    .describe("The header for the datatype accepted by the API"),
  "Content-Type": z
    .string()
    .default("application/json")
    .describe("The header for the datatype of the returned resource"),
  Authorization: z
    .string()
    .startsWith("Bearer ")
    .describe("The header to access restricted API endpoints"),
});
