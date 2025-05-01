import { createRouter } from "@/lib/create-app";
import * as handlers from "./properties.handlers";
import * as routes from "./properties.routes";

const router = createRouter()
  .openapi(routes.getPropertiesList, handlers.getPropertiesList)
  .openapi(routes.getProperties, handlers.getProperties)
  .openapi(routes.getProperty, handlers.getProperty)
  .openapi(routes.getPropertyBlocks, handlers.getPropertyBlocks)
  .openapi(routes.getPropertyBlocksList, handlers.getPropertyBlocksList)
  .openapi(routes.createProperty, handlers.createProperty)
  .openapi(routes.updateProperty, handlers.updateProperty);

export default router;
