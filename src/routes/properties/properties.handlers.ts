import { AppRouteHandler } from "@/lib/types";
import {
  CreatePropertyRoute,
  GetPropertiesListRoute,
  GetPropertiesRoute,
  GetPropertyBlocksListRoute,
  GetPropertyBlocksRoute,
  GetPropertyRoute,
  UpdatePropertyRoute,
} from "./properties.routes";
import { createDb } from "@/db";
import { HTTPStatusCodes } from "@/lib/helpers";
import { blocks, properties } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getProperties: AppRouteHandler<GetPropertiesRoute> = async ({
  json,
  env,
}) => {
  const { db, dbClient } = createDb(env);

  const properties = await db.query.properties.findMany({
    with: {
      blocks: {
        with: {
          lots: true,
        },
      },
    },
  });

  await dbClient.end();

  let totalAvailableLots = 0;
  let totalTakenLots = 0;

  const propertiesInfo = properties.map((property) => {
    const { blocks, ...propertyInfo } = property;

    const numberOfBlocks = property.blocks.length;
    const numberOfLots = blocks.reduce((current: number, block) => {
      return (current += block.lots.length);
    }, 0);
    const takenLots = blocks.reduce((current: number, block) => {
      return (current += block.lots.filter((lot) => lot.taken).length);
    }, 0);
    const availableLots = blocks.reduce((current: number, block) => {
      return (current += block.lots.filter((lot) => !lot.taken).length);
    }, 0);

    totalAvailableLots += availableLots;
    totalTakenLots += takenLots;

    return {
      ...propertyInfo,
      numberOfBlocks,
      numberOfLots,
      takenLots,
      availableLots,
    };
  });

  const response = {
    properties: propertiesInfo,
    totalAvailableLots,
    totalTakenLots,
  };

  return json(response, HTTPStatusCodes.OK);
};

export const getPropertiesList: AppRouteHandler<
  GetPropertiesListRoute
> = async ({ json, env }) => {
  const { db, dbClient } = createDb(env);

  const properties = await db.query.properties.findMany();

  await dbClient.end();

  return json(properties, HTTPStatusCodes.OK);
};

export const getProperty: AppRouteHandler<GetPropertyRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const { db, dbClient } = createDb(env);

  let property: any = await db.query.properties.findFirst({
    where: eq(properties.id, id),
  });

  if (!property)
    return json({ message: "Property not found" }, HTTPStatusCodes.NOT_FOUND);

  const blocksCount = await db.query.blocks.findMany({
    where: eq(blocks.propertyId, id),
    with: {
      lots: true,
    },
  });

  await dbClient.end();

  const numberOfBlocks = blocksCount.length;
  let numberOfLots = 0;
  let takenLots = 0;
  let availableLots = 0;

  if (numberOfBlocks) {
    numberOfLots = blocksCount.reduce((current: number, block) => {
      return (current += block.lots.length);
    }, 0);
    takenLots = blocksCount.reduce((current: number, block) => {
      return (current += block.lots.filter((lot) => lot.taken).length);
    }, 0);
    availableLots = blocksCount.reduce((current: number, block) => {
      return (current += block.lots.filter((lot) => !lot.taken).length);
    }, 0);
  }

  property = {
    ...property,
    numberOfBlocks,
    numberOfLots,
    takenLots,
    availableLots,
  };

  return json(property, HTTPStatusCodes.OK);
};

export const getPropertyBlocks: AppRouteHandler<
  GetPropertyBlocksRoute
> = async ({ json, req, env }) => {
  const { id } = req.valid("param");
  const { db, dbClient } = createDb(env);

  const propertyBlocks = await db.query.blocks.findMany({
    where: eq(blocks.propertyId, id),
    with: {
      lots: {
        columns: {
          taken: true,
        },
      },
    },
  });

  await dbClient.end();

  const stats = propertyBlocks.map((block) => {
    const { lots, ...blockInfo } = block;
    let numberOfLots = block.lots.length;
    let takenLots = 0;
    let availableLots = 0;
    lots.forEach((lot) => {
      takenLots += lot.taken ? 1 : 0;
      availableLots += !lot.taken ? 1 : 0;
    });
    return {
      ...blockInfo,
      numberOfLots,
      takenLots,
      availableLots,
    };
  });

  return json(stats, HTTPStatusCodes.OK);
};

export const getPropertyBlocksList: AppRouteHandler<
  GetPropertyBlocksListRoute
> = async ({ json, req, env }) => {
  const { id } = req.valid("param");
  const { db, dbClient } = createDb(env);

  const blocksList = await db.query.blocks.findMany({
    where: eq(blocks.propertyId, id),
  });

  await dbClient.end();

  return json(blocksList, HTTPStatusCodes.OK);
};

export const createProperty: AppRouteHandler<CreatePropertyRoute> = async ({
  json,
  req,
  env,
}) => {
  const { db, dbClient } = createDb(env);
  const body = req.valid("json");

  const [property] = await db.insert(properties).values(body).returning();

  await dbClient.end();

  return json(
    { message: `Property ${property.name} has been created` },
    HTTPStatusCodes.OK
  );
};

export const updateProperty: AppRouteHandler<UpdatePropertyRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const { db, dbClient } = createDb(env);
  const body = req.valid("json");

  const [property] = await db
    .update(properties)
    .set(body)
    .where(eq(properties.id, id))
    .returning();

  await dbClient.end();

  if (!property)
    return json({ message: "Property not found" }, HTTPStatusCodes.NOT_FOUND);

  return json(
    { message: `Property ${property.name} has been updated` },
    HTTPStatusCodes.OK
  );
};
