import { insertUserSchema, selectUsersSchema } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { auth } from "@/middlewares/auth";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const tags = ["Users"];

export const getUsers = createRoute({
  tags,
  middleware: auth,
  path: "/users",
  method: "get",
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(z.array(selectUsersSchema), "Get Users"),
  },
});

export type GetUserRoute = typeof getUsers;

export const createUser = createRoute({
  tags,
  middleware: auth,
  path: "/users",
  method: "post",
  request: {
    body: jsonContentRequired(insertUserSchema, "Create user"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("User has been created"),
      "Selected user"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createMessageObjectSchema("Email already exists"),
      "Email already exists"
    ),
  },
});

export type CreateUserRoute = typeof createUser;
