import {
  selectBlocksSchema,
  insertPropertySchema,
  selectPropertiesSchema,
  selectPropertySchema,
  updatePropertySchema,
  selectPropertyListSchema,
} from "@/db/schema";
import { headers, notFoundSchema } from "@/lib/constants";
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

const tags = ["Properties"];

export const getProperties = createRoute({
  tags,
  middleware: auth,
  path: "/properties",
  method: "get",
  request: {
    headers,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(selectPropertiesSchema, "Get Properties"),
  },
});

export const getPropertiesList = createRoute({
  tags,
  middleware: auth,
  path: "/properties/list",
  method: "get",
  request: {
    headers,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(selectPropertyListSchema),
      "Get Properties"
    ),
  },
});

export const createProperty = createRoute({
  tags,
  middleware: auth,
  path: "/properties",
  method: "post",
  request: {
    body: jsonContentRequired(insertPropertySchema, "Create Property"),
    headers,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Property has been created"),
      "Created Property"
    ),
  },
});

export const getProperty = createRoute({
  tags,
  middleware: auth,
  path: "/properties/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
    headers,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(selectPropertySchema, "Get Property"),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema("User not found"),
      "User not found"
    ),
  },
});

export const getPropertyBlocks = createRoute({
  tags,
  middleware: auth,
  path: "/properties/{id}/blocks",
  method: "get",
  request: {
    params: IdParamsSchema,
    headers,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(
        selectBlocksSchema.extend({
          numberOfLots: z.number(),
          takenLots: z.number(),
          availableLots: z.number(),
        })
      ),
      "List of Property's Blocks"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Validation error"
    ),
  },
});

export const getPropertyBlocksList = createRoute({
  tags,
  middleware: auth,
  path: "/properties/{id}/blocks/list",
  method: "get",
  request: {
    params: IdParamsSchema,
    headers,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(selectBlocksSchema),
      "List of Property's Blocks"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Validation error"
    ),
  },
});

export const updateProperty = createRoute({
  tags,
  middleware: auth,
  path: "/properties/{id}",
  method: "put",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updatePropertySchema, "Updated Property"),
    headers,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Property has been updated"),
      "Updated Property"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(IdParamsSchema),
        createErrorSchema(updatePropertySchema),
      ],
      "Validation error"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema("Property not found"),
      "Property not found"
    ),
  },
});

export type GetPropertiesRoute = typeof getProperties;
export type GetPropertiesListRoute = typeof getPropertiesList;
export type CreatePropertyRoute = typeof createProperty;
export type GetPropertyRoute = typeof getProperty;
export type GetPropertyBlocksRoute = typeof getPropertyBlocks;
export type GetPropertyBlocksListRoute = typeof getPropertyBlocksList;
export type UpdatePropertyRoute = typeof updateProperty;
