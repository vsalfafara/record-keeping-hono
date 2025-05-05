import {
  insertClientSchema,
  selectClientLotsSchema,
  selectClientsSchema,
  updateClientSchema,
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

const tags = ["Clients"];

export const getClients = createRoute({
  tags,
  middleware: auth,
  path: "/clients",
  method: "get",
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(selectClientsSchema),
      "Get Clients"
    ),
  },
});

export const getClient = createRoute({
  tags,
  middleware: auth,
  path: "/clients/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(selectClientsSchema, "Get Client"),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Client not found"),
      "Client not found"
    ),
  },
});

export const getClientLots = createRoute({
  tags,
  middleware: auth,
  path: "/clients/{id}/lots",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(selectClientLotsSchema),
      "Get Client"
    ),
  },
});

export const createClient = createRoute({
  tags,
  middleware: auth,
  path: "/clients",
  method: "post",
  request: {
    body: jsonContentRequired(insertClientSchema, "Create Client"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Client has been created"),
      "Client has been created"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertClientSchema),
      "Validation error"
    ),
  },
});

export const updateClient = createRoute({
  tags,
  middleware: auth,
  path: "/clients/{id}",
  method: "put",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateClientSchema, "Client to update"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Client has been updated"),
      "Updated Client"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Client not found"),
      "Client not found"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(IdParamsSchema),
        createErrorSchema(updateClientSchema),
      ],
      "Validation error"
    ),
  },
});

export type GetClientsRoute = typeof getClients;
export type GetClientRoute = typeof getClient;
export type GetClientLotsRoute = typeof getClientLots;
export type CreateClientRoute = typeof createClient;
export type UpdateClientRoute = typeof updateClient;
