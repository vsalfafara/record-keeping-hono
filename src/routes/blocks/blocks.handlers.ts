import { AppRouteHandler } from "@/lib/types";
import {
  CreateBlockRoute,
  GetBlockLotsRoute,
  GetBlockRoute,
  UpdateBlockRoute,
} from "./blocks.routes";
import { createDb } from "@/db";
import { blocks, lots } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { eq } from "drizzle-orm";

export const getBlock: AppRouteHandler<GetBlockRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const { db } = createDb(env);

  const block = await db.query.blocks.findFirst({
    where: eq(blocks.id, id),
  });

  return json(block, HTTPStatusCodes.OK);
};

export const getBlockLots: AppRouteHandler<GetBlockLotsRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const { db } = createDb(env);

  const lotsList = await db.query.lots.findMany({
    where: eq(lots.blockId, id),
  });

  return json(lotsList, HTTPStatusCodes.OK);
};

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

export const updateBlock: AppRouteHandler<UpdateBlockRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const { db } = createDb(env);
  const body = req.valid("json");

  const [block] = await db
    .update(blocks)
    .set(body)
    .where(eq(blocks.id, id))
    .returning();

  if (!block) {
    return json({ message: `Block not found` }, HTTPStatusCodes.NOT_FOUND);
  }

  return json(
    { message: `Block ${block.name} has been created` },
    HTTPStatusCodes.OK
  );
};
