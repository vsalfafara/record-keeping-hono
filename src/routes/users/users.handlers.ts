import type { AppRouteHandler } from "@/lib/types";
import type { RegisterUserRoute } from "./users.routes";
import { HTTPStatusCodes } from "@/lib/helpers";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { genSaltSync, hash } from "bcryptjs";
import { decode, sign, verify } from "hono/jwt";
import env from "@/env";

export const registerUser: AppRouteHandler<RegisterUserRoute> = async ({
  json,
  req,
}) => {
  const body = req.valid("json");
  const [userExists] = await db
    .select()
    .from(users)
    .where(eq(users.email, body.email));

  if (userExists) {
    return json(
      { message: "Email already exists" },
      HTTPStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
  const salt = genSaltSync(10);
  body.password = await hash(body.password, salt);
  const [newUser] = await db.insert(users).values(body).returning();
  const { password, ...user } = newUser;
  const token = await sign(newUser, env.JWT_SECRET);
  return json({ user, token }, HTTPStatusCodes.OK);
};
