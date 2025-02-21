import type { AppBindings } from "@/lib/types";
import type { Context, MiddlewareHandler } from "hono";
import { pinoLogger, type Env } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

export function logger() {
  return ((c, next) =>
    pinoLogger({
      pino: pino(
        { level: c.env.LOG_LEVEL || "info" },
        c.env.NODE_ENV === "production" ? undefined : pretty()
      ),
      http: {
        reqId: () => crypto.randomUUID(),
      },
    })(
      c as unknown as Context<Env>,
      next
    )) satisfies MiddlewareHandler<AppBindings>;
}
