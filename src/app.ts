import createApp from "./lib/create-app";
import configureOpenApi from "./lib/open-api";
import configureMiddlewares from "./middlewares/index.middleware";

// import users from "@/routes/users/users.index";
import auths from "@/routes/auth/auth.index";
import tasks from "@/routes/tasks/tasks.index";

const app = createApp();

const routes = [auths, tasks];
configureOpenApi(app);
configureMiddlewares(app);

routes.forEach((route) => {
  app.route("/api", route);
});

export default app;
