import { AppRouteHandler } from "@/lib/types";
import {
  CreateClientLotPaymentPlanRoute,
  GetClientLotPaymentPlan,
  UpdatePaymentPlanRoute,
} from "./payment-plans.routes";
import { createDb } from "@/db";
import { clientLots, paymentPlans } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { HTTPStatusCodes } from "@/lib/helpers";
import { format } from "date-fns";

export const getClientLotPaymentPlan: AppRouteHandler<
  GetClientLotPaymentPlan
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

  const paymentPlan = await db.query.paymentPlans.findMany({
    where: eq(paymentPlans.clientLotId, id),
    orderBy: [asc(paymentPlans.dueDate)],
  });

  await dbClient.end();

  return json(paymentPlan, HTTPStatusCodes.OK);
};

export const createClientLotPaymentPlan: AppRouteHandler<
  CreateClientLotPaymentPlanRoute
> = async ({ json, req, env }) => {
  const { id } = req.valid("param");
  const { installmentMonths, dateOfPayment, paymentDue, withInterest } =
    req.valid("json");
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

  const hasPaymentPlans = await db.query.paymentPlans.findFirst({
    where: eq(paymentPlans.clientLotId, id),
  });

  if (hasPaymentPlans) {
    return json(
      { message: "Client lot already has payment plan records" },
      HTTPStatusCodes.BAD_REQUEST
    );
  }

  const date = new Date(dateOfPayment);
  const paymentPlanRecords = [];

  for (let x = 0; x < installmentMonths; x++) {
    const installmentMonthsString = new Date(
      date.getFullYear(),
      date.getMonth() + x + 1,
      0
    );
    let discountedPaymentDue = paymentDue;
    if (!withInterest && x + 1 === installmentMonths) {
      discountedPaymentDue = discountedPaymentDue - discountedPaymentDue * 0.05;
    }
    paymentPlanRecords.push({
      clientLotId: id,
      installmentMonths: `${x + 1}/${installmentMonths}`,
      dueDate: format(installmentMonthsString, "yyyy-MM-dd"),
      paymentDue: discountedPaymentDue,
    });
  }

  await db.insert(paymentPlans).values(paymentPlanRecords);

  return json({ message: "Payment Plan records created" }, HTTPStatusCodes.OK);
};

export const updatePaymentPlan: AppRouteHandler<
  UpdatePaymentPlanRoute
> = async ({ json, req, env }) => {
  const { id } = req.valid("param");
  const body = req.valid("json");
  const { db } = createDb(env);

  const [updatedPaymentPlan] = await db
    .update(paymentPlans)
    .set(body)
    .where(eq(paymentPlans.id, id))
    .returning();

  if (!updatedPaymentPlan) {
    return json(
      { message: "Payment Plan does not exist" },
      HTTPStatusCodes.NOT_FOUND
    );
  }

  return json({ message: "Payment Plan has been updated" }, HTTPStatusCodes.OK);
};
