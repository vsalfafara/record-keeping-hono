import { AppRouteHandler } from "@/lib/types";
import { UpdateIntermentRoute } from "./interments.routes";
import { createDb } from "@/db";
import { eq } from "drizzle-orm";
import { interments } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";

export const updateInterment: AppRouteHandler<UpdateIntermentRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const body = req.valid("json");
  const { db, dbClient } = createDb(env);

  const interment = await db.query.interments.findFirst({
    where: eq(interments.id, id),
  });

  if (!interment)
    return json(
      { message: "Interment does not exist" },
      HTTPStatusCodes.NOT_FOUND
    );

  await db.update(interments).set(body).where(eq(interments.id, id));

  await dbClient.end();

  return json({ message: "Interment has been updated" }, HTTPStatusCodes.OK);
};
