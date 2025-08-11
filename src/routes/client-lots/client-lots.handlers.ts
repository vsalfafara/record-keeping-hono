import { AppRouteHandler } from "@/lib/types";
import {
  CreateClientLotPaymentPlanRoute,
  CreateDIWIRoute,
  GetClientLotPaymentPlan,
  GetClientLotRoute,
} from "./client-lots.routes";
import { createDb } from "@/db";
import { clientLots, paymentPlans, properties } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { asc, eq } from "drizzle-orm";
import { format } from "date-fns";

export const createDIWI: AppRouteHandler<CreateDIWIRoute> = async ({
  json,
  req,
  env,
}) => {
  const body = req.valid("json");
  const { db } = createDb(env);

  const [clientLot] = await db.insert(clientLots).values(body).returning();

  return json(
    {
      clientLot,
      message: "Client Lot has been created",
    },
    HTTPStatusCodes.OK
  );
};

export const getClientLot: AppRouteHandler<GetClientLotRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const { db } = createDb(env);

  const clientLot = await db.query.clientLots.findFirst({
    where: eq(clientLots.id, id),
    with: {
      property: {
        columns: {
          name: true,
        },
      },
      block: {
        columns: {
          name: true,
        },
      },
      lot: {
        columns: {
          name: true,
          price: true,
        },
      },
    },
  });

  if (!clientLot) {
    return json({ message: "Client lot not found" }, HTTPStatusCodes.NOT_FOUND);
  }

  return json(clientLot, HTTPStatusCodes.OK);
};

export const getClientLotPaymentPlan: AppRouteHandler<
  GetClientLotPaymentPlan
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

  const paymentPlan = await db.query.paymentPlans.findMany({
    where: eq(paymentPlans.clientLotId, id),
    orderBy: [asc(paymentPlans.dueDate)],
  });

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
