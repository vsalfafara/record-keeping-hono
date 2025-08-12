import { createRouter } from "@/lib/create-app";
import * as routes from "./invoices.routes";
import * as handlers from "./invoices.handlers";

const router = createRouter()
  .openapi(routes.getClientLotInvoices, handlers.getClientLotInvoices)
  .openapi(routes.createClientLotInvoice, handlers.createClientLotInvoice);

export default router;
