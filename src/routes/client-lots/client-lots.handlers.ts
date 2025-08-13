import { AppRouteHandler } from "@/lib/types";
import { CreateDIWIRoute, GetClientLotRoute } from "./client-lots.routes";
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
  const { db, dbClient } = createDb(env);

  const [clientLot] = await db.insert(clientLots).values(body).returning();

  await dbClient.end();

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
  const { db, dbClient } = createDb(env);

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

  await dbClient.end();

  if (!clientLot) {
    return json({ message: "Client lot not found" }, HTTPStatusCodes.NOT_FOUND);
  }

  return json(clientLot, HTTPStatusCodes.OK);
};
