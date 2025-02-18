import { z } from "zod";

export * as HTTPStatusCodes from "stoker/http-status-codes";
export * as HTTPStatusPhrases from "stoker/http-status-phrases";

export const IdParamsSchema = z.object({ id: z.string() });
