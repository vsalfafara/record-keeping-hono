import {
  insertDIWISchema,
  insertPaymentPlansSchema,
  selectClientLotsSchema,
  selectPaymentPlansSchema,
} from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { auth } from "@/middlewares/auth";
import { createRoute, z } from "@hono/zod-openapi";
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

export const getClientLot = createRoute({
  tags,
  middleware: auth,
  path: "/client-lots/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
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
      createErrorSchema(insertDIWISchema),
      "Validation Error"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Client lot not found"),
      "Client lot not found"
    ),
  },
});

export const getClientLotPaymentPlan = createRoute({
  tags,
  middleware: auth,
  path: "/client-lots/{id}/payment-plan",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(selectPaymentPlansSchema),
      "Client Lot Payment Plan"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Validation Error"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Client lot not found"),
      "Client lot not found"
    ),
  },
});

export const createClientLotPaymentPlan = createRoute({
  tags,
  middleware: auth,
  path: "/client-lots/{id}/payment-plan",
  method: "post",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      insertPaymentPlansSchema,
      "Payment Plans to Create"
    ),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Payment Plan created"),
      "Payment Plan Created"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(IdParamsSchema),
        createErrorSchema(insertPaymentPlansSchema),
      ],
      "Validation error"
    ),
    [HTTPStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Client lot already has payment plan records"),
      "Client lot already has payment plan records"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Client lot not found"),
      "Client lot not found"
    ),
  },
});

export type CreateDIWIRoute = typeof createDIWI;
export type GetClientLotRoute = typeof getClientLot;
export type GetClientLotPaymentPlan = typeof getClientLotPaymentPlan;
export type CreateClientLotPaymentPlanRoute = typeof createClientLotPaymentPlan;
