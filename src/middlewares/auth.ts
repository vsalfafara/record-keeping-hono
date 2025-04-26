import type { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { HTTPStatusCodes } from "@/lib/helpers";

export const auth = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization");
  if (!token) {
    throw new HTTPException(HTTPStatusCodes.UNAUTHORIZED, {
      message: "Unauthorized",
    });
  }
  try {
    await verify(token.split(" ")[1], c.env.JWT_SECRET);
  } catch (error) {
    throw new HTTPException(HTTPStatusCodes.UNAUTHORIZED, {
      message: "Unauthorized",
    });
  }
  await next();
};
