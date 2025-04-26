import type { AppRouteHandler } from "@/lib/types";
import type { LoginRoute } from "./auth.routes";
import { HTTPStatusCodes } from "@/lib/helpers";
import { createDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { compare, genSaltSync, hash } from "bcryptjs";
import { sign } from "hono/jwt";

export const login: AppRouteHandler<LoginRoute> = async ({
  json,
  req,
  env,
}) => {
  const { db } = createDb(env);
  const body = req.valid("json");
  const userExists = await db.query.users.findFirst({
    where: eq(users.email, body.email),
  });

  if (!userExists) {
    return json(
      { message: "Email does not exists" },
      HTTPStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const passwordMatched = await compare(body.password, userExists.password);

  if (!passwordMatched) {
    return json(
      { message: "Invalid credentials" },
      HTTPStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const { password, ...user } = userExists;
  const payload = {
    ...user,
    date: new Date(),
  };
  const token = await sign(payload, env.JWT_SECRET);

  return json({ data: user, token }, HTTPStatusCodes.OK);
};
