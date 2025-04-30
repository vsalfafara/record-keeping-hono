import { insertLotSchema, updateLotSchema } from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";
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

const tags = ["Lots"];

export const createLot = createRoute({
  tags,
  middleware: auth,
  path: "/lots",
  method: "post",
  request: {
    body: jsonContentRequired(insertLotSchema, "Lot to update"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Lot has been created"),
      "Created Lot"
    ),
  },
});

export const updateLot = createRoute({
  tags,
  middleware: auth,
  path: "/lots/{id}",
  method: "put",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateLotSchema, "Lot to update"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Lot has been updated"),
      "Updated Lot"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [createErrorSchema(IdParamsSchema), createErrorSchema(updateLotSchema)],
      "Validation error"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema("Lot not found"),
      "Lot not found"
    ),
  },
});

export type CreateLotRoute = typeof createLot;
export type UpdateLotRoute = typeof updateLot;
