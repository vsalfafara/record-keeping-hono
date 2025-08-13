import { insertExpensesSchema, selectExpensesSchema } from "@/db/schema";
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

const tags = ["Expenses"];

export const getClientLotExpenses = createRoute({
  tags,
  middleware: auth,
  path: "/client-lots/{id}/expenses",
  method: "get",
  request: {
    params: IdParamsSchema,
    headers: bearerToken,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(selectExpensesSchema),
      "Client Lot Expenses"
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

export const createClientLotExpense = createRoute({
  tags,
  middleware: auth,
  path: "/client-lots/{id}/expenses",
  method: "post",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(insertExpensesSchema, "Invoice to create"),
    headers: bearerToken,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Invoice has been created"),
      "Created Invoice"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(insertExpensesSchema),
        createErrorSchema(IdParamsSchema),
      ],
      "Validation Errors"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Client lot does not exist"),
      "Client lot does not exist"
    ),
  },
});

export type GetClientLotExpensesRoute = typeof getClientLotExpenses;
export type CreateClientLotExpenseRoute = typeof createClientLotExpense;
