import createApp from "./lib/create-app";
import configureOpenApi from "./lib/open-api";
import configureMiddlewares from "./middlewares/index.middleware";

// import users from "@/routes/users/users.index";
import auths from "@/routes/auth/auth.index";
import users from "@/routes/users/users.index";
import properties from "@/routes/properties/properties.index";
import blocks from "@/routes/blocks/blocks.index";
import lots from "@/routes/lots/lots.index";
import clients from "@/routes/clients/clients.index";
import clientLots from "@/routes/client-lots/client-lots.index";
import invoices from "@/routes/invoices/invoices.index";

const app = createApp();

const routes = [
  auths,
  users,
  properties,
  blocks,
  lots,
  clients,
  clientLots,
  invoices,
];

configureOpenApi(app);
configureMiddlewares(app);

routes.forEach((route) => {
  app.route("/api", route);
});

export default app;
