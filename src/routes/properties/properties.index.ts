import { createRouter } from "@/lib/create-app";
import * as handlers from "./properties.handlers";
import * as routes from "./properties.routes";

const router = createRouter()
  .openapi(routes.getProperties, handlers.getProperties)
  .openapi(routes.createProperty, handlers.createProperty);

export default router;
