import { createRouter } from "@/lib/create-app";
import * as handlers from "./blocks.handlers";
import * as routes from "./blocks.routes";

const router = createRouter()
  .openapi(routes.getBlock, handlers.getBlock)
  .openapi(routes.getBlockLots, handlers.getBlockLots)
  .openapi(routes.getBlockLotsNotTaken, handlers.getBlockLotsNotTaken)
  .openapi(routes.createBlock, handlers.createBlock)
  .openapi(routes.updateBlock, handlers.updateBlock);

export default router;
