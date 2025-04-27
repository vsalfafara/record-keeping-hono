import { AppRouteHandler } from "@/lib/types";
import { CreatePropertyRoute, GetPropertiesRoute } from "./properties.routes";
import { createDb } from "@/db";
import { HTTPStatusCodes } from "@/lib/helpers";
import { properties } from "@/db/schema";

export const getProperties: AppRouteHandler<GetPropertiesRoute> = async ({
  json,
  env,
}) => {
  const { db } = createDb(env);
  const properties = await db.query.properties.findMany({
    with: {
      blocks: {
        with: {
          lots: true,
        },
      },
    },
  });

  let totalAvailableLots = 0;
  let totalTakenLots = 0;

  const propertiesInfo = properties.map((property) => {
    const { blocks, ...otherPropertyInfo } = property;

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
      numberOfBlocks,
      numberOfLots,
      takenLots,
      availableLots,
      ...otherPropertyInfo,
    };
  });

  const response = {
    properties: propertiesInfo,
    totalAvailableLots,
    totalTakenLots,
  };

  return json(response, HTTPStatusCodes.OK);
};

export const createProperty: AppRouteHandler<CreatePropertyRoute> = async ({
  json,
  req,
  env,
}) => {
  const { db } = createDb(env);
  const body = req.valid("json");

  const [property] = await db.insert(properties).values(body).returning();

  return json(
    { message: `Property ${property.name} has been created` },
    HTTPStatusCodes.OK
  );
};
