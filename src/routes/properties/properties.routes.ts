import { insertPropertySchema, selectPropertiesSchema } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { auth } from "@/middlewares/auth";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const tags = ["Properties"];

export const getProperties = createRoute({
  tags,
  middleware: auth,
  path: "/properties",
  method: "get",
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(selectPropertiesSchema, "Get Properties"),
  },
});

export const createProperty = createRoute({
  tags,
  middleware: auth,
  path: "/properties",
  method: "post",
  request: {
    body: jsonContentRequired(insertPropertySchema, "Create Property"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Property has been created"),
      "Created Property"
    ),
  },
});

export type GetPropertiesRoute = typeof getProperties;
export type CreatePropertyRoute = typeof createProperty;
