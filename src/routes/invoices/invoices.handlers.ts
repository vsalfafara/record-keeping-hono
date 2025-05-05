import { AppRouteHandler } from "@/lib/types";
import { CreateInvoiceRoute } from "./invoices.routes";
import { createDb } from "@/db";
import { invoices } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";

export const createInvoice: AppRouteHandler<CreateInvoiceRoute> = async ({
  json,
  req,
  env,
}) => {
  const body = req.valid("json");
  const { db } = createDb(env);

  await db.insert(invoices).values(body);

  return json({ message: "Invoice has been created" }, HTTPStatusCodes.OK);
};
