import { insertBlockSchema } from "@/db/schema";
import { HTTPStatusCodes } from "@/lib/helpers";
import { auth } from "@/middlewares/auth";
import { createRoute } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const tags = ["Blocks"];

export const createBlock = createRoute({
  tags,
  middleware: auth,
  path: "/blocks",
  method: "post",
  request: {
    body: jsonContent(insertBlockSchema, "Create Block"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Block has been created"),
      "Created Block"
    ),
  },
});

export type CreateBlockRoute = typeof createBlock;
