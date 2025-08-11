import { createRouter } from "@/lib/create-app";
import * as handlers from "./client-lots.handlers";
import * as routes from "./client-lots.routes";

const router = createRouter()
  .openapi(routes.createDIWI, handlers.createDIWI)
  .openapi(routes.getClientLot, handlers.getClientLot)
  .openapi(routes.getClientLotPaymentPlan, handlers.getClientLotPaymentPlan)
  .openapi(
    routes.createClientLotPaymentPlan,
    handlers.createClientLotPaymentPlan
  );

export default router;
