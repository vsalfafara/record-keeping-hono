import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppBindings } from "./types";
import { defaultHook } from "stoker/openapi";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();
  return app;
}
