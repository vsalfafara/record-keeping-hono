import { AppRouteHandler } from "@/lib/types";
import {
  GetClientLotExpensesRoute,
  CreateClientLotExpensRoute,
} from "./expenses.routes";
import { createDb } from "@/db";
import { clientLots, expenses, invoices } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { eq } from "drizzle-orm";

export const getClientLotExpenses: AppRouteHandler<
  GetClientLotExpensesRoute
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

  const clientLotExpenses = await db.query.expenses.findMany({
    where: eq(expenses.clientLotId, id),
  });

  return json(clientLotExpenses, HTTPStatusCodes.OK);
};

export const createClientLotInvoice: AppRouteHandler<
  CreateClientLotExpensRoute
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

  await db.insert(expenses).values(body);

  return json({ message: "Expense has been created" }, HTTPStatusCodes.OK);
};
