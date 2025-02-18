import { createMessageObjectSchema } from "stoker/openapi/schemas";
import { HTTPStatusPhrases } from "./helpers";

export const notFoundSchema = (message: string | null = null) => {
  return createMessageObjectSchema(message || HTTPStatusPhrases.NOT_FOUND);
};
