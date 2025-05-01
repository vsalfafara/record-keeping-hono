import { createRouter } from "@/lib/create-app";
import * as handlers from "./clients.handlers";
import * as routes from "./clients.routes";

const router = createRouter()
  .openapi(routes.getClients, handlers.getClients)
  .openapi(routes.getClient, handlers.getClient)
  .openapi(routes.getClientLots, handlers.getClientLots)
  .openapi(routes.createClient, handlers.createClient)
  .openapi(routes.updateClient, handlers.updateClient);

export default router;
