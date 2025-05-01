import { AppRouteHandler } from "@/lib/types";
import {
  CreateClientRoute,
  GetClientLotsRoute,
  GetClientRoute,
  GetClientsRoute,
  UpdateClientRoute,
} from "./clients.routes";
import { createDb } from "@/db";
import { HTTPStatusCodes } from "@/lib/helpers";
import { clientLots, clients, properties } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const getClients: AppRouteHandler<GetClientsRoute> = async ({
  json,
  env,
}) => {
  const { db } = createDb(env);

  const clients = await db.query.clients.findMany();

  return json(clients, HTTPStatusCodes.OK);
};

export const getClient: AppRouteHandler<GetClientRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const { db } = createDb(env);

  const client = await db.query.clients.findFirst({
    where: eq(clients.id, id),
  });

  if (!client) {
    return json({ message: "Client not found" }, HTTPStatusCodes.NOT_FOUND);
  }

  return json(client, HTTPStatusCodes.OK);
};

export const getClientLots: AppRouteHandler<GetClientLotsRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const { db } = createDb(env);

  const clientLotsList = await db.query.clientLots.findMany({
    where: eq(clientLots.clientId, id),
    with: {
      property: {
        columns: {
          id: true,
          name: true,
        },
      },
      block: {
        columns: {
          id: true,
          name: true,
        },
      },
      lot: {
        columns: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
  });

  return json(clientLotsList, HTTPStatusCodes.OK);
};

export const createClient: AppRouteHandler<CreateClientRoute> = async ({
  json,
  req,
  env,
}) => {
  const body = req.valid("json");
  const { db } = createDb(env);

  const [client] = await db.insert(clients).values(body).returning();

  return json(
    {
      message: `Client ${client.firstName} ${client.lastName} has been created`,
    },
    HTTPStatusCodes.OK
  );
};

export const updateClient: AppRouteHandler<UpdateClientRoute> = async ({
  json,
  req,
  env,
}) => {
  const { id } = req.valid("param");
  const body = req.valid("json");
  const { db } = createDb(env);

  const [client] = await db
    .update(clients)
    .set(body)
    .where(eq(clients.id, id))
    .returning();

  if (!client) {
    return json({ message: "Client not found" }, HTTPStatusCodes.NOT_FOUND);
  }

  return json(
    {
      message: `Client ${client.firstName} ${client.lastName} has been updated`,
    },
    HTTPStatusCodes.OK
  );
};
