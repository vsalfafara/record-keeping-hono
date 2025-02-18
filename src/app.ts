import createApp from "./lib/create-app";
import configureOpenApi from "./lib/open-api";
import configureMiddlewares from "./middlewares/index.middleware";
import env from "./env";

// import users from "@/routes/users/users.index";
import auths from "@/routes/auth/auth.index";
import tasks from "@/routes/tasks/tasks.index";

const app = createApp();

const routes = [auths, tasks];

configureMiddlewares(app);

if (env.NODE_ENV === "development") configureOpenApi(app);

routes.forEach((route) => {
  app.route("/api", route);
});

export default app;
