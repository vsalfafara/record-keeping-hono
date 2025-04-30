import { createRouter } from "@/lib/create-app";
import * as handlers from "./lots.handlers";
import * as routes from "./lots.routes";

const router = createRouter()
  .openapi(routes.createLot, handlers.createLot)
  .openapi(routes.updateLot, handlers.updateLot);

export default router;
