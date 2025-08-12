import { AppRouteHandler } from "@/lib/types";
import {
  CreateClientLotInvoiceRoute,
  GetClientLotInvoicesRoute,
} from "./invoices.routes";
import { createDb } from "@/db";
import { clientLots, invoices } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { eq } from "drizzle-orm";

export const getClientLotInvoices: AppRouteHandler<
  GetClientLotInvoicesRoute
> = async ({ json, req, env }) => {
  const { id } = req.valid("param");
  const { db } = createDb(env);

  const clientLotExists = await db.query.clientLots.findFirst({
    where: eq(clientLots.id, id),
  });

  if (!clientLotExists) {
    return json(
      { message: "Client lot does not exist" },
      HTTPStatusCodes.NOT_FOUND
    );
  }

  const clientLotInvoices = await db.query.invoices.findMany({
    where: eq(invoices.clientLotId, id),
  });

  return json(clientLotInvoices, HTTPStatusCodes.OK);
};

export const createClientLotInvoice: AppRouteHandler<
  CreateClientLotInvoiceRoute
> = async ({ json, req, env }) => {
  const { id } = req.valid("param");
  const body = req.valid("json");
  const { db } = createDb(env);

  const clientLotExists = await db.query.clientLots.findFirst({
    where: eq(clientLots.id, id),
  });

  if (!clientLotExists) {
    return json(
      { message: "Client lot does not exist" },
      HTTPStatusCodes.NOT_FOUND
    );
  }

  await db.insert(invoices).values(body);

  return json({ message: "Invoice has been created" }, HTTPStatusCodes.OK);
};
