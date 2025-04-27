import { createRouter } from "@/lib/create-app";
import * as handlers from "./users.handlers";
import * as routes from "./users.routes";

const router = createRouter()
  .openapi(routes.getUsers, handlers.getUsers)
  .openapi(routes.createUser, handlers.createUser)
  .openapi(routes.updateUser, handlers.updateUser)
  .openapi(routes.deleteUser, handlers.deleteUser);

export default router;
