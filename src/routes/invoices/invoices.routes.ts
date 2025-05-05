import { insertInvoiceSchema } from "@/db/schema";
import { bearerToken } from "@/lib/constants";
import { HTTPStatusCodes } from "@/lib/helpers";
import { auth } from "@/middlewares/auth";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  createErrorSchema,
  createMessageObjectSchema,
} from "stoker/openapi/schemas";

const tags = ["Invoices"];

export const createInvoice = createRoute({
  tags,
  middleware: auth,
  path: "/invoices",
  method: "post",
  request: {
    body: jsonContentRequired(insertInvoiceSchema, "Invoice to create"),
    headers: bearerToken,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Invoice has been created"),
      "Created Invoice"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertInvoiceSchema),
      "Validation Errors"
    ),
  },
});

export type CreateInvoiceRoute = typeof createInvoice;
