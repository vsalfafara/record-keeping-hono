import {
  insertBlockSchema,
  selectBlocksSchema,
  selectLotsSchema,
  updateBlockSchema,
} from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";
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

const tags = ["Blocks"];

export const getBlock = createRoute({
  tags,
  middleware: auth,
  path: "/blocks/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(selectBlocksSchema, "Get Block"),
  },
});

export const getBlockLots = createRoute({
  tags,
  middleware: auth,
  path: "/blocks/{id}/lots",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(selectLotsSchema),
      "Get Block Lots"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Validation error"
    ),
  },
});

export const createBlock = createRoute({
  tags,
  middleware: auth,
  path: "/blocks",
  method: "post",
  request: {
    body: jsonContent(insertBlockSchema, "Create Block"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Block has been created"),
      "Created Block"
    ),
  },
});

export const updateBlock = createRoute({
  tags,
  middleware: auth,
  path: "/blocks/{id}",
  method: "put",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateBlockSchema, "Block to update"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Block has been updated"),
      "Updated Block"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [createErrorSchema(IdParamsSchema), createErrorSchema(updateBlockSchema)],
      "Validation error"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema("Block not found"),
      "Block not found"
    ),
  },
});

export type CreateBlockRoute = typeof createBlock;
export type GetBlockRoute = typeof getBlock;
export type GetBlockLotsRoute = typeof getBlockLots;
export type UpdateBlockRoute = typeof updateBlock;
