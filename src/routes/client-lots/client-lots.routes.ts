import { insertClientLotSchema, selectClientLotsSchema } from "@/db/schema";
import { headers } from "@/lib/constants";
import { HTTPStatusCodes } from "@/lib/helpers";
import { auth } from "@/middlewares/auth";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  createErrorSchema,
  createMessageObjectSchema,
  IdParamsSchema,
} from "stoker/openapi/schemas";

const tags = ["Client Lots"];

export const createClientLot = createRoute({
  tags,
  middleware: auth,
  path: "/client-lots",
  method: "post",
  request: {
    body: jsonContentRequired(insertClientLotSchema, "Client Lot to Create"),
    headers,
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
      createErrorSchema(insertClientLotSchema),
      "Validation Error"
    ),
  },
});

export const getClientLot = createRoute({
  tags,
  middleware: auth,
  path: "/client-lots/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
    headers,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      selectClientLotsSchema.extend({
        property: z.object({ name: z.string() }),
        block: z.object({ name: z.string() }),
        lot: z.object({ name: z.string(), price: z.number() }),
      }),
      "Select Client Lot"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Validation Error"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Client lot does not exist"),
      "Client lot does not exist"
    ),
  },
});

export type CreateClientLotRoute = typeof createClientLot;
export type GetClientLotRoute = typeof getClientLot;
