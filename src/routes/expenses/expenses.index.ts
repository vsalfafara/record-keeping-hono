import { createRouter } from "@/lib/create-app";
import * as routes from "./expenses.routes";
import * as handlers from "./expenses.handlers";

const router = createRouter()
  .openapi(routes.getClientLotExpenses, handlers.getClientLotExpenses)
  .openapi(routes.createClientLotExpense, handlers.createClientLotInvoice);

export default router;
