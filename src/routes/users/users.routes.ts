import {
  insertUserSchema,
  selectUsersSchema,
  updateUserSchema,
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
      "Created user"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createMessageObjectSchema("Email already exists"),
      "Email already exists"
    ),
  },
});

export const updateUser = createRoute({
  tags,
  middleware: auth,
  path: "/users/{id}",
  method: "put",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateUserSchema, "Update user"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("User has been updated"),
      "Updated user"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [createErrorSchema(IdParamsSchema), createErrorSchema(updateUserSchema)],
      "Validation error"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema("User not found"),
      "User not found"
    ),
  },
});

export const deleteUser = createRoute({
  tags,
  middleware: auth,
  path: "/users/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("User has been deleted"),
      "Deleted user"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Validation error"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema("User not found"),
      "User not found"
    ),
  },
});

export type GetUserRoute = typeof getUsers;
export type CreateUserRoute = typeof createUser;
export type UpdateUserRoute = typeof updateUser;
export type DeleteUserRoute = typeof deleteUser;
