import { updateIntermentSchema } from "@/db/schema";
import { headers } from "@/lib/constants";
import { HTTPStatusCodes } from "@/lib/helpers";
import { auth } from "@/middlewares/auth";
import { createRoute } from "@hono/zod-openapi";
import {
  jsonContent,
  jsonContentOneOf,
  jsonContentRequired,
} from "stoker/openapi/helpers";
import {
  createErrorSchema,
  createMessageObjectSchema,
  IdParamsSchema,
} from "stoker/openapi/schemas";
import { json } from "stream/consumers";

const tags = ["Interments"];

export const updateInterment = createRoute({
  tags,
  middleware: auth,
  path: "/interment/{id}",
  method: "put",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateIntermentSchema, "Interment to update"),
    headers,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Interment has been updated"),
      "Interment has been updated"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(IdParamsSchema),
        createErrorSchema(updateIntermentSchema),
      ],
      "Validation Error"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Interment does not exist"),
      "Interment does not exist"
    ),
  },
});

export type UpdateIntermentRoute = typeof updateInterment;
