import { insertInvoiceSchema, selectInvoicesSchema } from "@/db/schema";
import { headers } from "@/lib/constants";
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

const tags = ["Invoices"];

export const getClientLotInvoices = createRoute({
  tags,
  middleware: auth,
  path: "/client-lots/{id}/invoices",
  method: "get",
  request: {
    params: IdParamsSchema,
    headers,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(selectInvoicesSchema),
      "Client lot invoices"
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

export const createClientLotInvoice = createRoute({
  tags,
  middleware: auth,
  path: "/client-lots/{id}/invoices",
  method: "post",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(insertInvoiceSchema, "Invoice to create"),
    headers,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Invoice has been created"),
      "Created Invoice"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(insertInvoiceSchema),
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

export type GetClientLotInvoicesRoute = typeof getClientLotInvoices;
export type CreateClientLotInvoiceRoute = typeof createClientLotInvoice;
