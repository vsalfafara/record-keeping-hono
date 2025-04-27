import type { AppRouteHandler } from "@/lib/types";
import type {
  CreateUserRoute,
  DeleteUserRoute,
  GetUserRoute,
  UpdateUserRoute,
} from "./users.routes";
import { HTTPStatusCodes } from "@/lib/helpers";
import { createDb } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { genSaltSync, hash } from "bcryptjs";

export const getUsers: AppRouteHandler<GetUserRoute> = async ({
  json,
  env,
}) => {
  const { db } = createDb(env);
  const users = await db.query.users.findMany({
    columns: {
      password: false,
    },
  });
  return json(users, HTTPStatusCodes.OK);
};

export const createUser: AppRouteHandler<CreateUserRoute> = async ({
  json,
  req,
  env,
}) => {
  const { db } = createDb(env);
  const body = req.valid("json");
  const userExists = await db.query.users.findFirst({
    where: eq(users.email, body.email),
  });

  if (userExists)
    return json(
      { message: "Email already exists" },
      HTTPStatusCodes.UNPROCESSABLE_ENTITY
    );

  const salt = genSaltSync(10);
  body.password = await hash(body.password, salt);

  const [user] = await db.insert(users).values(body).returning();

  return json(
    {
      message: `User ${user.firstName} ${user.lastName} has been created`,
    },
    HTTPStatusCodes.OK
  );
};

export const updateUser: AppRouteHandler<UpdateUserRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const { db } = createDb(env);
  const userToUpdated = req.valid("json");

  if (userToUpdated.password) {
    const salt = genSaltSync(10);
    userToUpdated.password = await hash(userToUpdated.password, salt);
  }

  const [user] = await db
    .update(users)
    .set(userToUpdated)
    .where(eq(users.id, id))
    .returning();

  if (!user) {
    return json({ message: "User not found" }, HTTPStatusCodes.NOT_FOUND);
  }
  return json(
    { message: `User ${user.firstName} ${user.lastName} has been updated` },
    HTTPStatusCodes.OK
  );
};

export const deleteUser: AppRouteHandler<DeleteUserRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const { db } = createDb(env);

  const [user] = await db.delete(users).where(eq(users.id, id)).returning();

  if (!user) {
    return json({ message: "User not found" }, HTTPStatusCodes.NOT_FOUND);
  }
  return json(
    { message: `User ${user.firstName} ${user.lastName} has been deleted` },
    HTTPStatusCodes.OK
  );
};
