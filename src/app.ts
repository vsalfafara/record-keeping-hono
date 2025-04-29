import createApp from "./lib/create-app";
import configureOpenApi from "./lib/open-api";
import configureMiddlewares from "./middlewares/index.middleware";

// import users from "@/routes/users/users.index";
import auths from "@/routes/auth/auth.index";
import users from "@/routes/users/users.index";
import properties from "@/routes/properties/properties.index";
import blocks from "@/routes/blocks/blocks.index";

const app = createApp();

const routes = [auths, users, properties, blocks];
configureOpenApi(app);
configureMiddlewares(app);

routes.forEach((route) => {
  app.route("/api", route);
});

export default app;
