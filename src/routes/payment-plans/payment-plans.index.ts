import { createRouter } from "@/lib/create-app";
import * as handlers from "./payment-planshandlers";
import * as routes from "./payment-plans.routes";

const router = createRouter()
  .openapi(routes.getClientLotPaymentPlan, handlers.getClientLotPaymentPlan)
  .openapi(
    routes.createClientLotPaymentPlan,
    handlers.createClientLotPaymentPlan
  );

export default router;
