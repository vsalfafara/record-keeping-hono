import type { AppOpenAPI } from "@/lib/types";
import { logger } from "./logger";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { parseEnv } from "@/env";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { cors } from "hono/cors";

expand(config());

export default function configureMiddlewares(app: AppOpenAPI) {
  app.use(async (c, next) => {
    parseEnv(Object.assign(c.env || {}, process.env));
    return await next();
  });
  app.use(
    cors({
      origin: ["http://localhost:5173", "https://record-keeping-vue.pages.dev"],
    })
  );
  app.use(serveEmojiFavicon("🔥"));
  app.use(logger());
  app.notFound(notFound);
  app.onError(onError);
}
