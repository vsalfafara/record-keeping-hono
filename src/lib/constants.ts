import { createMessageObjectSchema } from "stoker/openapi/schemas";
import { HTTPStatusPhrases } from "./helpers";

export const notFoundSchema = (message: string | null = null) => {
  return createMessageObjectSchema(message || HTTPStatusPhrases.NOT_FOUND);
};

export const origin = [
  "http://localhost:5173",
  "https://record-keeping-vue.pages.dev",
  "https://record-keeping-vue-dev.onrender.com",
];
