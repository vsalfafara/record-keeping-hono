import { AppRouteHandler } from "@/lib/types";
import { CreateDIWIRoute } from "./client-lots.routes";
import { createDb } from "@/db";
import { clientLots } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";

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
