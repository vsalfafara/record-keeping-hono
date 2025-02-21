import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppBindings } from "./types";
import { defaultHook } from "stoker/openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { logger } from "@/middlewares/logger";
import { parseEnv } from "@/env";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  return createRouter();
}
