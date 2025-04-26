import type { AppRouteHandler } from "@/lib/types";
import type { CreateUserRoute, GetUserRoute } from "./users.routes";
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

  await db.insert(users).values(body);

  return json(
    {
      message: `User ${body.firstName} ${body.lastName} has been created`,
    },
    HTTPStatusCodes.OK
  );
};
