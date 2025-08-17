import { createRouter } from "@/lib/create-app";
import * as handlers from "./client-lots.handlers";
import * as routes from "./client-lots.routes";

const router = createRouter()
  .openapi(routes.createClientLot, handlers.createClientLot)
  .openapi(routes.getClientLot, handlers.getClientLot);

export default router;
