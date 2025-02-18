import { createRoute, z } from "@hono/zod-openapi";
import { HTTPStatusCodes, IdParamsSchema } from "@/lib/helpers";
import {
  jsonContent,
  jsonContentOneOf,
  jsonContentRequired,
} from "stoker/openapi/helpers";
import {
  insertTasksSchema,
  selectTasksSchema,
  updateTaskSchema,
} from "@/db/schema";
import {
  createErrorSchema,
  createMessageObjectSchema,
} from "stoker/openapi/schemas";
import { notFoundSchema } from "@/lib/constants";
import { auth } from "@/middlewares/auth";

const tags = ["Tasks"];

export const listTasks = createRoute({
  tags,
  path: "/tasks",
  method: "get",
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(selectTasksSchema),
      "List of Tasks"
    ),
  },
});

export const getTask = createRoute({
  tags,
  path: "/tasks/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(selectTasksSchema, "Requested task"),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid Id"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema("Task not found"),
      "Task not found"
    ),
  },
});

export const createTask = createRoute({
  tags,
  middleware: auth,
  path: "/tasks",
  method: "post",
  request: {
    body: jsonContentRequired(insertTasksSchema, "Create task"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(selectTasksSchema, "Created Task"),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTasksSchema),
      "Validation error"
    ),
    [HTTPStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized"
    ),
  },
});

export const updateTask = createRoute({
  tags,
  middleware: auth,
  path: "/tasks/{id}",
  method: "put",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateTaskSchema, "Endpoint to Update task"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(selectTasksSchema, "Updated Task"),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [createErrorSchema(IdParamsSchema), createErrorSchema(updateTaskSchema)],
      "Validation error"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema("Task not found"),
      "Task not found"
    ),
  },
});

export const deleteTask = createRoute({
  tags,
  middleware: auth,
  path: "/tasks/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Task deleted"),
      "Deleted Task"
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid Id"
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema("Task not found"),
      "Task not found"
    ),
  },
});

export type ListTaskRoute = typeof listTasks;
export type GetTaskRoute = typeof getTask;
export type CreateTaskRoute = typeof createTask;
export type UpdateTaskRoute = typeof updateTask;
export type DeleteTaskRoute = typeof deleteTask;
