import { createRouter } from "@/lib/create-app";
import * as routes from "./invoices.routes";
import * as handlers from "./invoices.handlers";

const router = createRouter().openapi(
  routes.createInvoice,
  handlers.createInvoice
);

export default router;
