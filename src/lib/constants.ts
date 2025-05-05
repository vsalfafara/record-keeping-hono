import { createMessageObjectSchema } from "stoker/openapi/schemas";
import { HTTPStatusPhrases } from "./helpers";
import { z } from "zod";

export const notFoundSchema = (message: string | null = null) => {
  return createMessageObjectSchema(message || HTTPStatusPhrases.NOT_FOUND);
};

export const origin = [
  "http://localhost:5173",
  "https://record-keeping-vue.pages.dev",
  "https://record-keeping-vue-dev.onrender.com",
];

export const bearerToken = z.object({
  Authorization: z
    .string()
    .default(
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImZpcnN0TmFtZSI6IlZvbiIsImxhc3ROYW1lIjoiQWxmYWZhcmEiLCJlbWFpbCI6InZvbkBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImhhc0xvZ2dlZEluT25jZSI6ZmFsc2UsImNyZWF0ZWRCeSI6IlZvbiIsImNyZWF0ZWRPbiI6IjIwMjUtMDQtMjciLCJkYXRlIjoiMjAyNS0wNC0yN1QxNDowNDoxNC45NzdaIn0.7OGjFKh4wJCLFlW0XizgAlYgqHxUTBABqfQdwsJT9V8"
    ),
});
