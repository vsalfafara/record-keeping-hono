import type { AppOpenAPI } from "@/lib/types";
import { logger } from "./logger";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

export default function configureMiddlewares(app: AppOpenAPI) {
  app.use(logger());
  app.use(serveEmojiFavicon("🔥"));
  app.notFound(notFound);
  app.onError(onError);
}
