import { insertUserSchema, loginSchema, selectUsersSchema } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const tags = ["Authentication"];

export const login = createRoute({
  tags,
  path: "/auth/login",
  method: "post",
  request: {
    body: jsonContentRequired(loginSchema, "Login user"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.object({ data: selectUsersSchema, token: z.string() }),
      "Authenticated user"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createMessageObjectSchema("Invalid credentials"),
      "Invalid credentials"
    ),
  },
});

export type LoginRoute = typeof login;
