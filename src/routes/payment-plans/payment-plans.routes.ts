import {
  insertPaymentPlansSchema,
  selectPaymentPlansSchema,
} from "@/db/schema";
import { bearerToken } from "@/lib/constants";
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

const tags = ["Payment Plans"];

export const getClientLotPaymentPlan = createRoute({
  tags,
  middleware: auth,
  path: "/client-lots/{id}/payment-plan",
  method: "get",
  request: {
    params: IdParamsSchema,
    headers: bearerToken,
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
    headers: bearerToken,
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

export type GetClientLotPaymentPlan = typeof getClientLotPaymentPlan;
export type CreateClientLotPaymentPlanRoute = typeof createClientLotPaymentPlan;
