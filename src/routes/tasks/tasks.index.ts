import { createRouter } from "@/lib/create-app";
import * as handlers from "./tasks.handlers";
import * as routes from "./tasks.routes";

const router = createRouter()
  .openapi(routes.listTasks, handlers.listTasks)
  .openapi(routes.getTask, handlers.getTask)
  .openapi(routes.createTask, handlers.createTask)
  .openapi(routes.updateTask, handlers.updateTask)
  .openapi(routes.deleteTask, handlers.deleteTask);

export default router;
