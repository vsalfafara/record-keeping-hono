import { AppRouteHandler } from "@/lib/types";
import { CreateBlockRoute } from "./blocks.routes";
import { createDb } from "@/db";
import { blocks } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";

export const createBlock: AppRouteHandler<CreateBlockRoute> = async ({
  json,
  req,
  env,
}) => {
  const { db } = createDb(env);
  const body = req.valid("json");
  const [block] = await db.insert(blocks).values(body).returning();

  return json(
    { message: `Block ${block.name} has been created` },
    HTTPStatusCodes.OK
  );
};
