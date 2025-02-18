import type { AppOpenAPI } from "./types";
import packageJSON from "../../package.json";
import { apiReference } from "@scalar/hono-api-reference";

export default function configureOpenApi(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Tasks API",
    },
  });

  app.get(
    "/reference",
    apiReference({
      pageTitle: "Tasks API Documentation",
      layout: "classic",
      spec: {
        url: "/doc",
      },
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "axios",
      },
    })
  );
}
