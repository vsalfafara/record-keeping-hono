import { insertUserSchema, selectUserSchema } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const tags = ["Users"];

export const registerUser = createRoute({
  tags,
  path: "/auth/register",
  method: "post",
  request: {
    body: jsonContentRequired(insertUserSchema, "Register user"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.object({ user: selectUserSchema, token: z.string() }),
      "Selected user"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createMessageObjectSchema("Email already exists"),
      "Email already exists"
    ),
  },
});

export type RegisterUserRoute = typeof registerUser;
