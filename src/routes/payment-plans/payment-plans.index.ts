import { createRouter } from "@/lib/create-app";
import * as handlers from "./payment-plans.handlers";
import * as routes from "./payment-plans.routes";

const router = createRouter()
  .openapi(routes.getClientLotPaymentPlan, handlers.getClientLotPaymentPlan)
  .openapi(
    routes.createClientLotPaymentPlan,
    handlers.createClientLotPaymentPlan
  )
  .openapi(routes.updatePaymentPlan, handlers.updatePaymentPlan);

export default router;
