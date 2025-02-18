import { createRouter } from "@/lib/create-app";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import { HTTPStatusCodes } from "@/lib/helpers";

const router = createRouter().openapi(
  createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      [HTTPStatusCodes.OK]: jsonContent(
        z.object({
          message: z.string(),
        }),
        "Entry point"
      ),
    },
  }),
  (c) => {
    return c.json({ message: "Hello" }, HTTPStatusCodes.OK);
  }
);

export default router;
