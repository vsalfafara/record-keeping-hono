import type {
  CreateTaskRoute,
  DeleteTaskRoute,
  GetTaskRoute,
  ListTaskRoute,
  UpdateTaskRoute,
} from "./tasks.routes";
import type { AppRouteHandler } from "@/lib/types";
import { HTTPStatusCodes } from "@/lib/helpers";
import db from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

export const listTasks: AppRouteHandler<ListTaskRoute> = async ({ json }) => {
  const tasks = await db.query.tasks.findMany();
  return json(tasks, HTTPStatusCodes.OK);
};

export const getTask: AppRouteHandler<GetTaskRoute> = async ({ json, req }) => {
  const { id } = req.valid("param");
  const task = await db.query.tasks.findFirst({ where: eq(tasks.id, id) });
  if (!task) {
    return json({ message: "Task not found" }, HTTPStatusCodes.NOT_FOUND);
  }
  return json(task, HTTPStatusCodes.OK);
};

export const createTask: AppRouteHandler<CreateTaskRoute> = async ({
  json,
  req,
}) => {
  const newTask = req.valid("json");
  const [task] = await db.insert(tasks).values(newTask).returning();
  return json(task, HTTPStatusCodes.OK);
};

export const updateTask: AppRouteHandler<UpdateTaskRoute> = async ({
  json,
  req,
}) => {
  const { id } = req.valid("param");
  const updatedTask = req.valid("json");
  const [task] = await db
    .update(tasks)
    .set(updatedTask)
    .where(eq(tasks.id, id))
    .returning();
  if (!task) {
    return json({ message: "Task not found" }, HTTPStatusCodes.NOT_FOUND);
  }
  return json(task, HTTPStatusCodes.OK);
};

export const deleteTask: AppRouteHandler<DeleteTaskRoute> = async ({
  json,
  req,
}) => {
  const { id } = req.valid("param");
  const result = await db.delete(tasks).where(eq(tasks.id, id));
  if (!result.rowsAffected) {
    return json({ message: "Task not found" }, HTTPStatusCodes.NOT_FOUND);
  }
  return json({ message: "Task deleted" }, HTTPStatusCodes.OK);
};
