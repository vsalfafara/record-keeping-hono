import { insertDIWISchema, selectClientLotsSchema } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { auth } from "@/middlewares/auth";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  createErrorSchema,
  createMessageObjectSchema,
} from "stoker/openapi/schemas";

const tags = ["Client Lots"];

export const createDIWI = createRoute({
  tags,
  middleware: auth,
  path: "/client-lots/diwi",
  method: "post",
  request: {
    body: jsonContentRequired(insertDIWISchema, "DIWI to Create"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.object({
        clientLot: selectClientLotsSchema,
        message: z.string(),
      }),
      "Created Client Lot"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertDIWISchema),
      "Validation Error"
    ),
  },
});

export type CreateDIWIRoute = typeof createDIWI;
