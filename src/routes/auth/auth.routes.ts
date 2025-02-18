import { insertUserSchema, loginSchema, selectUserSchema } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const tags = ["Authentication"];

export const register = createRoute({
  tags,
  path: "/auth/register",
  method: "post",
  request: {
    body: jsonContentRequired(insertUserSchema, "Register user"),
  },
  responses: {
    [HTTPStatusCodes.CREATED]: jsonContent(
      z.object({ user: selectUserSchema, token: z.string() }),
      "Selected user"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createMessageObjectSchema("Email already exists"),
      "Email already exists"
    ),
  },
});

export const login = createRoute({
  tags,
  path: "/auth/login",
  method: "post",
  request: {
    body: jsonContentRequired(loginSchema, "Login user"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.object({ user: selectUserSchema, token: z.string() }),
      "Selected user"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createMessageObjectSchema("Invalid credentials"),
      "Invalid credentials"
    ),
  },
});

export type RegisterRoute = typeof register;
export type LoginRoute = typeof login;
