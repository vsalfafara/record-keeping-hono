import { AppRouteHandler } from "@/lib/types";
import { CreateLotRoute, UpdateLotRoute } from "./lots.routes";
import { createDb } from "@/db";
import { lots } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HTTPStatusCodes } from "@/lib/helpers";

export const createLot: AppRouteHandler<CreateLotRoute> = async ({
  json,
  req,
  env,
}) => {
  const { db, dbClient } = createDb(env);
  const body = req.valid("json");

  const [lot] = await db.insert(lots).values(body).returning();

  await dbClient.end();

  return json(
    { message: `Lot ${lot.name} has been created` },
    HTTPStatusCodes.OK
  );
};

export const updateLot: AppRouteHandler<UpdateLotRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const { db, dbClient } = createDb(env);
  const body = req.valid("json");

  const [lot] = await db
    .update(lots)
    .set(body)
    .where(eq(lots.id, id))
    .returning();

  await dbClient.end();

  if (!lot) {
    return json(
      {
        message: "Lot not found",
      },
      HTTPStatusCodes.NOT_FOUND
    );
  }
  return json(
    { message: `Lot ${lot.name} has been updated` },
    HTTPStatusCodes.OK
  );
};
