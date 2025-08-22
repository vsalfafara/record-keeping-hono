import { AppRouteHandler } from "@/lib/types";
import {
  CreateClientLotInvoiceRoute,
  GetClientLotInvoicesRoute,
} from "./invoices.routes";
import { createDb } from "@/db";
import { clientLots, interments, invoices, paymentPlans } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { count, eq, gt } from "drizzle-orm";

export const getClientLotInvoices: AppRouteHandler<
  GetClientLotInvoicesRoute
> = async ({ json, req, env }) => {
  const { id } = req.valid("param");
  const { db, dbClient } = createDb(env);

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

  await dbClient.end();

  return json(clientLotInvoices, HTTPStatusCodes.OK);
};

export const createClientLotInvoice: AppRouteHandler<
  CreateClientLotInvoiceRoute
> = async ({ json, req, env }) => {
  const { id } = req.valid("param");
  const body = req.valid("json");
  const { db, dbClient } = createDb(env);

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

  // if (body.purpose === "Interment") {
  //   const rows = await db
  //     .select({ count: count() })
  //     .from(interments)
  //     .where(eq(interments.clientLotId, id));

  //   await db.insert(interments).values({
  //     clientLotId: id,
  //     dig: rows[0].count + 1,
  //     lastModifiedAt,
  //   });
  // }

  await dbClient.end();

  return json({ message: "Invoice has been created" }, HTTPStatusCodes.OK);
};
