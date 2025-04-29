import { createRouter } from "@/lib/create-app";
import * as handlers from "./blocks.handlers";
import * as routes from "./blocks.routes";

const router = createRouter().openapi(routes.createBlock, handlers.createBlock);

export default router;
